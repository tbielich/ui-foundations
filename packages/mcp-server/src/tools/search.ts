/**
 * search_foundations tool implementation.
 *
 * Searches across all design system knowledge (tokens, components, patterns,
 * rules, foundations) using the SearchIndex for TF-IDF relevance scoring.
 *
 * Requirements: 10.1 (ranked results up to 20), 10.2 (URI, excerpt ≤200 chars, score 0.0–1.0),
 * 10.3 (reject queries <2 chars), 10.4 (results within 500ms), 10.5 (empty result message).
 *
 * @module tools/search
 */

import type { ToolResponse } from '../types.js';
import { SearchIndex } from '../util/search-index.js';

// ---------------------------------------------------------------------------
// Module-level SearchIndex reference
// ---------------------------------------------------------------------------

/** Module-level SearchIndex instance, set during server startup. */
let searchIndex: SearchIndex | null = null;

/**
 * Sets the SearchIndex instance for the search tool handler.
 * Called during server startup after the index is built.
 */
export function setSearchIndex(index: SearchIndex): void {
  searchIndex = index;
}

/**
 * Gets the current SearchIndex instance (mainly for testing).
 */
export function getSearchIndex(): SearchIndex | null {
  return searchIndex;
}

// ---------------------------------------------------------------------------
// Handler factory
// ---------------------------------------------------------------------------

/**
 * Creates a search_foundations handler bound to a specific SearchIndex.
 * Use this when you want explicit dependency injection (e.g., in tests).
 */
export function createSearchHandler(
  index: SearchIndex,
): (args: unknown, rootPath: string) => Promise<ToolResponse> {
  return async (args: unknown, _rootPath: string): Promise<ToolResponse> => {
    return executeSearch(args, index);
  };
}

// ---------------------------------------------------------------------------
// Main handler (uses module-level index)
// ---------------------------------------------------------------------------

/**
 * search_foundations tool handler.
 *
 * Validates query length (≥2 chars), searches the index, and returns
 * up to 20 results sorted by descending relevance score.
 *
 * @param args - Tool arguments (validated by Zod in registry: { query: string })
 * @param _rootPath - Repository root path (unused; index is pre-built)
 * @returns ToolResponse with search results as JSON or error
 */
export async function searchFoundationsHandler(
  args: unknown,
  _rootPath: string,
): Promise<ToolResponse> {
  if (!searchIndex) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'Search index not available. Server may still be initializing.',
          }),
        },
      ],
      isError: true,
    };
  }

  return executeSearch(args, searchIndex);
}

// ---------------------------------------------------------------------------
// Core search logic
// ---------------------------------------------------------------------------

/**
 * Executes the search against a given SearchIndex instance.
 */
function executeSearch(args: unknown, index: SearchIndex): ToolResponse {
  const { query } = args as { query: string };

  // Validate query length (Zod handles min(2) but we double-check for safety)
  if (!query || query.length < 2) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'Query must be at least 2 characters',
            code: -32602,
          }),
        },
      ],
      isError: true,
    };
  }

  // Search with limit of 20 results
  const results = index.search(query, 20);

  // Return empty result set with message if no matches
  if (results.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query,
            results: [],
            message: `No matches found for query: ${query}`,
          }),
        },
      ],
    };
  }

  // Return results (already sorted by descending score from SearchIndex)
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          query,
          results: results.map((r) => ({
            uri: r.uri,
            excerpt: r.excerpt,
            score: r.score,
          })),
          count: results.length,
        }),
      },
    ],
  };
}
