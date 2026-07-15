/**
 * Component resource handlers for the UI Foundations MCP Server.
 *
 * Discovers components from the file system and serves:
 * - `uif://components` → JSON array of all components (name, description, URI)
 * - `uif://components/{name}` → structured ComponentData with all fields
 *
 * Case-insensitive resolution to canonical kebab-case.
 * Returns not-found error with valid component names for unrecognized identifiers.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { FileReader } from '../util/file-reader.js';
import { contentHash } from '../util/content-hash.js';
import { levenshtein } from '../util/levenshtein.js';
import type { ResourceResponse, ComponentData } from '../types.js';

/** Directory containing component documentation markdown files (relative to root). */
const COMPONENT_DOCS_DIR = 'site/components';

/** Directory containing CSS pattern files (relative to root). */
const CSS_PATTERNS_DIR = 'src/ui/patterns';

/** Directory containing Code Connect schema files (relative to root). */
const SCHEMAS_DIR = 'schemas';

/** Path to the component tokens JSON file (relative to root). */
const COMPONENT_TOKENS_FILE = 'dist/tokens/json/components-ui.tokens.json';

/**
 * Discovers component names by scanning the docs directory for .md files,
 * excluding playground files and the index page.
 */
export async function discoverComponentNames(rootPath: string): Promise<string[]> {
  const docsDir = join(rootPath, COMPONENT_DOCS_DIR);
  let files: string[];

  try {
    files = await readdir(docsDir);
  } catch {
    return [];
  }

  return files
    .filter((f) => f.endsWith('.md') && !f.endsWith('-playground.md') && f !== 'index.md')
    .map((f) => f.replace('.md', ''))
    .sort();
}

/**
 * Extracts frontmatter fields from a markdown file's YAML front matter.
 * Returns an object with key-value pairs from the `---` delimited block.
 */
function parseFrontmatter(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return result;

  const lines = match[1].split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    result[key] = value;
  }

  return result;
}

/**
 * Extracts variant class names from a CSS pattern file.
 * Looks for canonical or legacy component variant selectors (for example,
 * `.uif-button.outline` or `.button.outline`).
 */
function extractVariants(cssContent: string, componentName: string): string[] {
  const variants = new Set<string>();
  // Match canonical and legacy class chains, including compatibility :is() groups.
  const baseClass = componentName.replace(/-/g, '[-]?');
  const classSelector = `\\.(?:uif-)?${baseClass}`;
  const regexes = [
    new RegExp(`${classSelector}\\.([a-z][a-z0-9-]*)`, 'g'),
    new RegExp(`:is\\([^)]*${classSelector}[^)]*\\)\\.([a-z][a-z0-9-]*)`, 'g'),
  ];

  for (const regex of regexes) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(cssContent)) !== null) {
      const variant = match[1];
      // Skip state classes (is-hover, is-active, etc.)
      if (!variant.startsWith('is-')) {
        variants.add(variant);
      }
    }
  }

  return [...variants].sort();
}

/**
 * Extracts state names from a CSS pattern file.
 * Looks for pseudo-classes and `.is-*` state classes.
 */
function extractStates(cssContent: string): string[] {
  const states = new Set<string>();

  // Extract pseudo-class states (:hover, :active, :focus-visible, :disabled, :checked)
  const pseudoRegex = /:(hover|active|focus-visible|disabled|checked)/g;
  let match: RegExpExecArray | null;
  while ((match = pseudoRegex.exec(cssContent)) !== null) {
    states.add(match[1]);
  }

  // Extract .is-* state classes
  const isRegex = /\.is-(hover|active|focus-visible|disabled|checked)/g;
  while ((match = isRegex.exec(cssContent)) !== null) {
    states.add(match[1]);
  }

  // Always include 'default' as the base state
  if (states.size > 0) {
    states.add('default');
  }

  return [...states].sort();
}

/**
 * Extracts an HTML pattern example from the CSS file or generates a basic one
 * based on the component's class name.
 */
function extractPrimaryClassName(componentName: string, cssContent: string): string {
  const canonicalClassName = `uif-${componentName}`;
  if (cssContent.includes(`.${canonicalClassName}`)) return canonicalClassName;

  const classMatch = cssContent.match(/^\s*\.([a-z][a-z0-9-]*)\s*\{/m);
  return classMatch ? classMatch[1] : componentName;
}

function generateHtmlPattern(componentName: string, cssContent: string): string {
  const className = extractPrimaryClassName(componentName, cssContent);

  // Generate a basic HTML pattern based on component type
  if (componentName === 'button') {
    return `<button class="${className} solid" type="button">Label</button>`;
  }
  if (componentName === 'input') {
    return `<input class="${className}" type="text" />`;
  }
  if (componentName === 'checkbox') {
    return `<input class="checkbox" type="checkbox" />`;
  }
  if (componentName === 'radio') {
    return `<input class="radio" type="radio" />`;
  }
  if (componentName === 'switch') {
    return `<button class="${className}" role="switch" aria-checked="false">Label</button>`;
  }
  if (componentName === 'link') {
    return `<a class="${className}" href="#">Link text</a>`;
  }
  if (componentName === 'icon') {
    return `<span class="${className}" style="--uif-icon-src: url('/assets/icons/name.svg');" aria-hidden="true"></span>`;
  }
  if (componentName === 'label') {
    return `<span class="label-content"><span class="label-content__text">Label</span></span>`;
  }

  return `<div class="${className}">Content</div>`;
}

/**
 * Extracts token names associated with a component from the component tokens JSON.
 * Flattens the nested DTCG structure into dot-notation token names.
 */
function extractComponentTokens(
  tokensData: Record<string, unknown>,
  componentName: string,
): string[] {
  // The tokens file uses PascalCase keys for component names
  const pascalName = componentName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const componentSection = tokensData[pascalName];
  if (!componentSection || typeof componentSection !== 'object') {
    return [];
  }

  const tokens: string[] = [];

  function flatten(obj: Record<string, unknown>, prefix: string): void {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if (
        value &&
        typeof value === 'object' &&
        '$value' in (value as Record<string, unknown>)
      ) {
        tokens.push(`${pascalName}.${path}`);
      } else if (value && typeof value === 'object') {
        flatten(value as Record<string, unknown>, path);
      }
    }
  }

  flatten(componentSection as Record<string, unknown>, '');
  return tokens.sort();
}

/**
 * Builds the full ComponentData for a given component name.
 */
async function buildComponentData(
  componentName: string,
  rootPath: string,
  reader: FileReader,
): Promise<ComponentData> {
  // Read component documentation
  let documentation = '';
  let description = '';
  try {
    const docResult = await reader.read(`${COMPONENT_DOCS_DIR}/${componentName}.md`);
    documentation = docResult.content;
    const frontmatter = parseFrontmatter(documentation);
    description = frontmatter['description'] || `The ${componentName} component.`;
  } catch {
    description = `The ${componentName} component.`;
  }

  // Read CSS pattern file
  let cssContent = '';
  let cssClassName = componentName;
  try {
    const cssResult = await reader.read(`${CSS_PATTERNS_DIR}/${componentName}.css`);
    cssContent = cssResult.content;
    cssClassName = extractPrimaryClassName(componentName, cssContent);
  } catch {
    // CSS file may not exist for all components
  }

  // Extract variants and states from CSS
  const variants = extractVariants(cssContent, componentName);
  const states = extractStates(cssContent);

  // Generate HTML pattern
  const htmlPattern = generateHtmlPattern(componentName, cssContent);

  // Find Code Connect schema path
  let codeConnectSchemaPath: string | null = null;
  const schemaFile = `web-${componentName}.figma.ts`;
  try {
    const schemasDir = join(rootPath, SCHEMAS_DIR);
    const schemaFiles = await readdir(schemasDir);
    if (schemaFiles.includes(schemaFile)) {
      codeConnectSchemaPath = `${SCHEMAS_DIR}/${schemaFile}`;
    }
  } catch {
    // Schemas directory may not exist
  }

  // Extract component tokens
  let tokens: string[] = [];
  try {
    const tokensResult = await reader.read(COMPONENT_TOKENS_FILE);
    const tokensData = JSON.parse(tokensResult.content);
    tokens = extractComponentTokens(tokensData, componentName);
  } catch {
    // Tokens file may not exist
  }

  return {
    name: componentName,
    description,
    documentation,
    cssClassName,
    htmlPattern,
    variants,
    states,
    tokens,
    codeConnectSchemaPath,
    uri: `uif://components/${componentName}`,
  };
}

/**
 * Main handler for component resource URIs.
 *
 * Routes:
 * - `uif://components` → JSON array listing all components
 * - `uif://components/{name}` → full ComponentData for the specified component
 *
 * @param uri - The component resource URI.
 * @param rootPath - Absolute path to the repository root.
 * @returns The resource response with content and metadata.
 */
export async function handleComponents(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  const reader = new FileReader(rootPath);
  const componentNames = await discoverComponentNames(rootPath);

  // Handle listing: uif://components
  if (uri === 'uif://components') {
    return handleComponentListing(componentNames, rootPath, reader);
  }

  // Handle individual component: uif://components/{name}
  const identifier = uri.replace('uif://components/', '');
  return handleComponentDetail(identifier, componentNames, rootPath, reader);
}

/**
 * Handles the `uif://components` listing resource.
 */
async function handleComponentListing(
  componentNames: string[],
  rootPath: string,
  reader: FileReader,
): Promise<ResourceResponse> {
  const listing = [];

  for (const name of componentNames) {
    let description = `The ${name} component.`;
    try {
      const docResult = await reader.read(`${COMPONENT_DOCS_DIR}/${name}.md`);
      const frontmatter = parseFrontmatter(docResult.content);
      description = frontmatter['description'] || description;
    } catch {
      // Use default description
    }

    listing.push({
      name,
      description,
      uri: `uif://components/${name}`,
    });
  }

  const content = JSON.stringify(listing);
  const hash = contentHash(content);

  return {
    uri: 'uif://components',
    name: 'Component Listing',
    mimeType: 'application/json',
    content,
    metadata: {
      contentHash: hash,
      category: 'components',
    },
  };
}

/**
 * Handles `uif://components/{name}` detail resource.
 * Resolves the name case-insensitively and returns full ComponentData.
 */
async function handleComponentDetail(
  identifier: string,
  componentNames: string[],
  rootPath: string,
  reader: FileReader,
): Promise<ResourceResponse> {
  // Case-insensitive resolution: normalize to lowercase for comparison
  const normalizedInput = identifier.toLowerCase();
  const resolvedName = componentNames.find(
    (name) => name.toLowerCase() === normalizedInput,
  );

  if (!resolvedName) {
    // Build error message with valid component names
    let message = `Component not found: "${identifier}". Valid component names: ${componentNames.join(', ')}`;

    // Check for fuzzy matches (Levenshtein distance ≤ 3)
    const suggestions = componentNames.filter(
      (name) => levenshtein(normalizedInput, name) <= 3,
    );
    if (suggestions.length > 0) {
      message += `. Did you mean: ${suggestions.join(', ')}?`;
    }

    const error = new Error(message);
    (error as Error & { code: number }).code = -32002;
    throw error;
  }

  const componentData = await buildComponentData(resolvedName, rootPath, reader);
  const content = JSON.stringify(componentData);
  const hash = contentHash(content);

  return {
    uri: `uif://components/${resolvedName}`,
    name: `Component: ${resolvedName}`,
    mimeType: 'application/json',
    content,
    metadata: {
      contentHash: hash,
      category: 'components',
    },
  };
}

/**
 * Lists all available components for resource template enumeration.
 * Returns an array of { uri, name } objects for each component.
 */
export async function listComponents(
  rootPath: string,
): Promise<Array<{ uri: string; name: string }>> {
  const names = await discoverComponentNames(rootPath);
  return names.map((name) => ({
    uri: `uif://components/${name}`,
    name: `Component: ${name}`,
  }));
}
