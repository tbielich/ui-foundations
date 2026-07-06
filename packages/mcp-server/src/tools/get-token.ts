/**
 * get_token tool handler.
 *
 * Performs case-insensitive substring matching on token names across all layers.
 * Returns up to 50 matching tokens with name, value, layer, type, and CSS custom property.
 *
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { TokenData, TokenLayer, ToolResponse } from '../types.js';

/** Valid token layers for the layer filter parameter. */
const VALID_LAYERS: TokenLayer[] = ['core', 'semantic', 'component', 'mode', 'brand'];

/** Maximum number of results to return. */
const MAX_RESULTS = 50;

/** Minimum query length when no layer filter is provided. */
const MIN_QUERY_LENGTH = 2;

/**
 * Figma export filename markers mapped to architecture layers.
 *
 * Figma exports are the source of truth and contain the authoritative
 * `com.figma.codeSyntax.WEB` values used by generated CSS.
 */
const FIGMA_EXPORT_LAYER_MARKERS: Array<{ marker: string; layer: TokenLayer }> = [
  { marker: 'Core (Primitives)', layer: 'core' },
  { marker: 'Appearance (Modes)', layer: 'mode' },
  { marker: 'Themes (Brands)', layer: 'brand' },
  { marker: 'Patterns (UI)', layer: 'component' },
];

/** Fallback token file mapping: relative path from root → layer. */
const LEGACY_TOKEN_FILES: Array<{ path: string; layer: TokenLayer }> = [
  { path: 'dist/tokens/json/core-primitives.tokens.json', layer: 'core' },
  { path: 'dist/tokens/json/appearance-modes.tokens.mode-light.json', layer: 'mode' },
  { path: 'dist/tokens/json/appearance-modes.tokens.mode-dark.json', layer: 'mode' },
  { path: 'dist/tokens/json/themes-brands.tokens.brand-a.json', layer: 'brand' },
  { path: 'dist/tokens/json/themes-brands.tokens.brand-b.json', layer: 'brand' },
  { path: 'dist/tokens/json/themes-brands.tokens.brand-c.json', layer: 'brand' },
  { path: 'dist/tokens/json/semantics-roles.tokens.json', layer: 'semantic' },
  { path: 'dist/tokens/json/patterns-ui.tokens.json', layer: 'component' },
  { path: 'dist/tokens/json/components-ui.tokens.json', layer: 'component' },
];

/**
 * Converts a dot-notation token name to a CSS custom property.
 *
 * Example: "Size.Spacing.100" → "--size-spacing-100"
 */
function toCssProperty(name: string): string {
  return `--${name
    .replace(/\./g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase()}`;
}

/**
 * Extracts `--token-name` from Figma code syntax values such as
 * `var(--typography-heading-font-family)`.
 */
function cssPropertyFromCodeSyntax(node: Record<string, unknown>, fallbackName: string): string {
  const extensions = node['$extensions'] as Record<string, unknown> | undefined;
  const codeSyntax = extensions?.['com.figma.codeSyntax'] as Record<string, unknown> | undefined;
  const webSyntax = codeSyntax?.WEB;

  if (typeof webSyntax === 'string') {
    const match = webSyntax.match(/var\((--[^),\s]+)\)/);
    if (match) return match[1];
    if (webSyntax.startsWith('--')) return webSyntax;
  }

  return toCssProperty(fallbackName);
}

/**
 * Figma marks unpublished variables as hidden from publishing.
 * Older exports do not contain this flag, so absence is treated as published.
 */
function isHiddenFromPublishing(node: Record<string, unknown>): boolean {
  const extensions = node['$extensions'] as Record<string, unknown> | undefined;
  return extensions?.['com.figma.hiddenFromPublishing'] === true;
}

/**
 * Recursively flattens a DTCG-structured token object into TokenData entries.
 *
 * A token leaf node is identified by having a `$value` property.
 * Group nodes are recursively traversed, building up the dot-notation path.
 */
function flattenTokens(obj: Record<string, unknown>, layer: TokenLayer, prefix = ''): TokenData[] {
  const results: TokenData[] = [];

  for (const [key, value] of Object.entries(obj)) {
    // Skip DTCG metadata keys
    if (key.startsWith('$')) continue;

    const currentPath = prefix ? `${prefix}.${key}` : key;
    const node = value as Record<string, unknown>;

    if (node && typeof node === 'object' && '$value' in node) {
      // This is a token leaf node
      results.push({
        name: currentPath,
        cssProperty: cssPropertyFromCodeSyntax(node, currentPath),
        value: node['$value'],
        type: (node['$type'] as string) ?? 'unknown',
        layer,
        hiddenFromPublishing: isHiddenFromPublishing(node),
      });
    } else if (node && typeof node === 'object') {
      // This is a group node — recurse
      results.push(...flattenTokens(node as Record<string, unknown>, layer, currentPath));
    }
  }

  return results;
}

/**
 * Infers a token layer from a Figma export filename.
 */
function layerForFigmaExport(fileName: string): TokenLayer {
  const match = FIGMA_EXPORT_LAYER_MARKERS.find(({ marker }) => fileName.includes(marker));
  return match?.layer ?? 'component';
}

/**
 * Loads tokens from `figma/exports/*.tokens.json`.
 */
async function loadFigmaExportTokens(rootPath: string): Promise<TokenData[]> {
  const exportDir = join(rootPath, 'figma/exports');
  let files: string[];

  try {
    files = await readdir(exportDir);
  } catch {
    return [];
  }

  const allTokens: TokenData[] = [];
  const tokenFiles = files.filter((file) => file.endsWith('.tokens.json')).sort();

  for (const file of tokenFiles) {
    try {
      const content = await readFile(join(exportDir, file), 'utf8');
      const parsed = JSON.parse(content) as Record<string, unknown>;
      allTokens.push(...flattenTokens(parsed, layerForFigmaExport(file)));
    } catch {
      continue;
    }
  }

  return allTokens;
}

/**
 * Loads and flattens legacy generated token files from the specified root path.
 */
async function loadLegacyTokens(rootPath: string): Promise<TokenData[]> {
  const allTokens: TokenData[] = [];

  for (const { path: filePath, layer } of LEGACY_TOKEN_FILES) {
    try {
      const absolutePath = join(rootPath, filePath);
      const content = await readFile(absolutePath, 'utf8');
      const parsed = JSON.parse(content) as Record<string, unknown>;
      allTokens.push(...flattenTokens(parsed, layer));
    } catch {
      // If a token file is missing or unreadable, skip it gracefully
      continue;
    }
  }

  return allTokens;
}

/**
 * Loads tokens from Figma exports first, falling back to generated JSON for
 * older fixtures or repositories that do not expose `figma/exports`.
 */
async function loadAllTokens(rootPath: string): Promise<TokenData[]> {
  const figmaTokens = await loadFigmaExportTokens(rootPath);
  if (figmaTokens.length > 0) return figmaTokens;

  return loadLegacyTokens(rootPath);
}

/**
 * Handler for the get_token tool.
 *
 * @param args - Tool arguments containing `query` (string) and optional `layer` (TokenLayer).
 * @param rootPath - Repository root path for file resolution.
 * @returns Tool response with matching tokens or error.
 */
export async function getTokenHandler(args: unknown, rootPath: string): Promise<ToolResponse> {
  const { query, layer, includeUnpublished } = args as {
    query: string;
    layer?: string;
    includeUnpublished?: boolean;
  };

  // Validate layer filter if provided
  if (layer !== undefined) {
    if (!VALID_LAYERS.includes(layer as TokenLayer)) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Invalid layer value: "${layer}". Valid options are: ${VALID_LAYERS.join(', ')}`,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  // Validate query length (only enforced when no layer filter is provided)
  if (query.length < MIN_QUERY_LENGTH && !layer) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: `Query must be at least ${MIN_QUERY_LENGTH} characters when no layer filter is provided.`,
          }),
        },
      ],
      isError: true,
    };
  }

  // Load and flatten all tokens
  const allTokens = await loadAllTokens(rootPath);

  // Filter by case-insensitive substring match on name or CSS custom property
  const queryLower = query.toLowerCase();
  let matches = allTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(queryLower) ||
      token.cssProperty.toLowerCase().includes(queryLower),
  );

  if (!includeUnpublished) {
    matches = matches.filter((token) => token.hiddenFromPublishing !== true);
  }

  // Apply layer filter if provided
  if (layer) {
    matches = matches.filter((token) => token.layer === layer);
  }

  // Return empty result with message if no matches
  if (matches.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            results: [],
            message: `No tokens found matching "${query}"${layer ? ` in layer "${layer}"` : ''}.`,
            query,
            layer: layer ?? null,
            includeUnpublished: includeUnpublished === true,
          }),
        },
      ],
    };
  }

  // Limit to MAX_RESULTS
  const limited = matches.slice(0, MAX_RESULTS);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          results: limited.map((token) => ({
            name: token.name,
            value: token.value,
            layer: token.layer,
            type: token.type,
            cssProperty: token.cssProperty,
            hiddenFromPublishing: token.hiddenFromPublishing,
          })),
          total: matches.length,
          returned: limited.length,
          query,
          layer: layer ?? null,
          includeUnpublished: includeUnpublished === true,
        }),
      },
    ],
  };
}
