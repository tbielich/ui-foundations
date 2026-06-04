/**
 * get_token tool handler.
 *
 * Performs case-insensitive substring matching on token names across all layers.
 * Returns up to 50 matching tokens with name, value, layer, type, and CSS custom property.
 *
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { TokenData, TokenLayer, ToolResponse } from '../types.js';

/** Valid token layers for the layer filter parameter. */
const VALID_LAYERS: TokenLayer[] = ['core', 'semantic', 'component', 'mode', 'brand'];

/** Maximum number of results to return. */
const MAX_RESULTS = 50;

/** Minimum query length when no layer filter is provided. */
const MIN_QUERY_LENGTH = 2;

/** Token file mapping: relative path from root → layer. */
const TOKEN_FILES: Array<{ path: string; layer: TokenLayer }> = [
  { path: 'dist/tokens/json/core-primitives.tokens.json', layer: 'core' },
  { path: 'dist/tokens/json/semantics-roles.tokens.json', layer: 'semantic' },
  { path: 'dist/tokens/json/components-ui.tokens.json', layer: 'component' },
];

/**
 * Converts a dot-notation token name to a CSS custom property.
 *
 * Example: "Size.Spacing.100" → "--size-spacing-100"
 */
function toCssProperty(name: string): string {
  return `--${name.replace(/\./g, '-').toLowerCase()}`;
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
        cssProperty: toCssProperty(currentPath),
        value: node['$value'],
        type: (node['$type'] as string) ?? 'unknown',
        layer,
      });
    } else if (node && typeof node === 'object') {
      // This is a group node — recurse
      results.push(...flattenTokens(node as Record<string, unknown>, layer, currentPath));
    }
  }

  return results;
}

/**
 * Loads and flattens all token files from the specified root path.
 */
async function loadAllTokens(rootPath: string): Promise<TokenData[]> {
  const allTokens: TokenData[] = [];

  for (const { path: filePath, layer } of TOKEN_FILES) {
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
 * Handler for the get_token tool.
 *
 * @param args - Tool arguments containing `query` (string) and optional `layer` (TokenLayer).
 * @param rootPath - Repository root path for file resolution.
 * @returns Tool response with matching tokens or error.
 */
export async function getTokenHandler(args: unknown, rootPath: string): Promise<ToolResponse> {
  const { query, layer } = args as { query: string; layer?: string };

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

  // Filter by case-insensitive substring match on name
  const queryLower = query.toLowerCase();
  let matches = allTokens.filter((token) => token.name.toLowerCase().includes(queryLower));

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
          })),
          total: matches.length,
          returned: limited.length,
          query,
          layer: layer ?? null,
        }),
      },
    ],
  };
}
