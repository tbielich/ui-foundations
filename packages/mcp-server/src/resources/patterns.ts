/**
 * Pattern resource handlers for the UI Foundations MCP Server.
 *
 * Handles `uif://patterns` (listing) and `uif://patterns/{name}` (detail) requests.
 * Discovers patterns from `docs/patterns/` directory and exposes forms, navigation,
 * cards, layout, and feedback patterns.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import { FileReader } from '../util/file-reader.js';
import type { PatternData, ResourceResponse } from '../types.js';

/** Known pattern identifiers sourced from docs/patterns/. */
const KNOWN_PATTERNS: Record<string, { file: string; description: string }> = {
  forms: {
    file: 'docs/patterns/forms.md',
    description:
      'Form-pattern guidance connecting field grouping, labels, help text, errors, and action ordering.',
  },
  navigation: {
    file: 'docs/patterns/navigation.md',
    description:
      'Navigation-pattern expectations for landmarks, active state, hierarchy, and destination structure.',
  },
  cards: {
    file: 'docs/patterns/cards.md',
    description:
      'Card-pattern guidance for single-object grouping, subject clarity, and scoped actions.',
  },
  layout: {
    file: 'docs/patterns/layout.md',
    description:
      'Layout-related guidance from foundations and component rules covering responsive breakpoints and composition.',
  },
  feedback: {
    file: 'docs/patterns/feedback.md',
    description:
      'Guidance around interactive feedback, visible state, error recovery, and assistive feedback.',
  },
};

/** All valid pattern names (lowercase). */
const VALID_PATTERN_NAMES = Object.keys(KNOWN_PATTERNS);

/**
 * Extracts related components from pattern markdown content.
 *
 * Looks for references to component docs (e.g., `docs/components/button.md`)
 * and returns the component names found.
 */
function extractRelatedComponents(content: string): string[] {
  const components: string[] = [];
  const regex = /docs\/components\/([a-z][a-z0-9-]*)\.md/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    if (!components.includes(name)) {
      components.push(name);
    }
  }

  return components;
}

/**
 * Extracts related tokens from pattern markdown content.
 *
 * Looks for CSS custom property references (e.g., `--button-solid-container-background`)
 * and token dot-notation references (e.g., `Button.solid.container`).
 */
function extractRelatedTokens(content: string): string[] {
  const tokens: string[] = [];

  // Match CSS custom property references
  const cssVarRegex = /--[a-z][a-z0-9-]+/g;
  let match: RegExpExecArray | null;

  while ((match = cssVarRegex.exec(content)) !== null) {
    const token = match[0];
    if (!tokens.includes(token)) {
      tokens.push(token);
    }
  }

  // Match dot-notation token references (e.g., Color.Text.Default)
  const dotRegex = /\b[A-Z][a-zA-Z]+(?:\.[a-zA-Z][a-zA-Z0-9-]*){2,}/g;

  while ((match = dotRegex.exec(content)) !== null) {
    const token = match[0];
    if (!tokens.includes(token)) {
      tokens.push(token);
    }
  }

  return tokens;
}

/**
 * Handles `uif://patterns` and `uif://patterns/{name}` resource read requests.
 *
 * - `uif://patterns` → Returns a JSON array of all patterns with name, description, and URI.
 * - `uif://patterns/{name}` → Returns full PatternData with documentation content,
 *   related components, and related tokens extracted from the markdown.
 *
 * @param uri - The full resource URI.
 * @param rootPath - Absolute path to the repository root.
 * @returns A ResourceResponse containing the pattern data.
 * @throws If the pattern name is not recognized or the file cannot be read.
 */
export async function handlePatterns(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  // Listing: uif://patterns
  if (uri === 'uif://patterns') {
    const listing = VALID_PATTERN_NAMES.map((name) => ({
      name,
      description: KNOWN_PATTERNS[name].description,
      uri: `uif://patterns/${name}`,
    }));

    return {
      uri,
      name: 'Pattern Listing',
      mimeType: 'application/json',
      content: listing,
      metadata: {
        contentHash: '',
        category: 'patterns',
      },
    };
  }

  // Individual pattern: uif://patterns/{name}
  const identifier = uri.replace('uif://patterns/', '').toLowerCase();

  const patternEntry = KNOWN_PATTERNS[identifier];

  if (!patternEntry) {
    throw new Error(
      `Resource not found: ${uri}. Valid pattern names: ${VALID_PATTERN_NAMES.join(', ')}`,
    );
  }

  const reader = new FileReader(rootPath);
  const result = await reader.read(patternEntry.file);

  const relatedComponents = extractRelatedComponents(result.content);
  const relatedTokens = extractRelatedTokens(result.content);

  const patternData: PatternData = {
    name: identifier,
    description: patternEntry.description,
    documentation: result.content,
    relatedComponents,
    relatedTokens,
    uri,
  };

  return {
    uri,
    name: `Pattern: ${identifier}`,
    mimeType: 'application/json',
    content: patternData,
    metadata: {
      contentHash: result.contentHash,
      category: 'patterns',
    },
  };
}

/**
 * Lists all available patterns for resource template enumeration.
 * Returns an array of { uri, name } objects for each pattern.
 */
export async function listPatterns(
  _rootPath: string,
): Promise<Array<{ uri: string; name: string }>> {
  return VALID_PATTERN_NAMES.map((name) => ({
    uri: `uif://patterns/${name}`,
    name: `Pattern: ${name}`,
  }));
}
