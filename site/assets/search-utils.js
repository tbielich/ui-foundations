/**
 * Docs search utility functions.
 * Extracted for testability — the browser-side docs-search.js uses the same
 * logic inline, but these are the canonical implementations for testing.
 */

/**
 * Filter a search index by a query string.
 * Returns entries whose title or description contain the query as a
 * case-insensitive substring. Returns empty array for empty/whitespace queries.
 *
 * @param {string} query - User input string
 * @param {Array<{title: string, description: string, url: string, type: string}>} index
 * @returns {Array<{title: string, description: string, url: string, type: string}>}
 */
function filterIndex(query, index) {
  var normalized = String(query || "").trim().toLowerCase();
  if (!normalized) return [];
  return index.filter(function (entry) {
    return (
      entry.title.toLowerCase().includes(normalized) ||
      entry.description.toLowerCase().includes(normalized)
    );
  });
}

/**
 * Clamp a keyboard navigation index within [0, length-1].
 * Simulates ArrowDown (+1) and ArrowUp (-1) navigation through a list.
 *
 * @param {number} current - Current active index (-1 means none selected)
 * @param {"ArrowDown"|"ArrowUp"} direction
 * @param {number} length - Total number of items (must be >= 1)
 * @returns {number} New active index, clamped within [0, length-1]
 */
function navigateIndex(current, direction, length) {
  if (length <= 0) return -1;
  if (direction === "ArrowDown") {
    return Math.min(current + 1, length - 1);
  }
  if (direction === "ArrowUp") {
    return Math.max(current - 1, 0);
  }
  return current;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { filterIndex, navigateIndex };
}
