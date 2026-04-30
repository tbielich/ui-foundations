# Tasks: Docs Navbar Search

## Task 1: Add searchIndex collection to Eleventy config

- [x] 1.1 Add a new `searchIndex` collection in `.eleventy.js` that combines `foundationsDocs` and `componentsDocs` entries into `{ title, description, url, type }` objects, filtering out playground pages and pages without titles
- [x] 1.2 Verify the collection produces the expected entries by running `npx @11ty/eleventy --dryrun` or building the site and inspecting the output

## Task 2: Add search HTML to the docs layout

- [x] 2.1 In `site/_includes/layouts/docs.njk`, add the search input container (`div.docs-search` with combobox ARIA attributes) inside `.docs-sidebar` between `.docs-logo` and `.docs-nav`
- [x] 2.2 Add an inline `<script id="docs-search-index" type="application/json">` tag that serializes `collections.searchIndex` as JSON, placed before the closing `</body>` tag
- [x] 2.3 Add a `<script src="/assets/docs-search.js"></script>` tag after the search index script

## Task 3: Implement search CSS styles

- [x] 3.1 Append search-related CSS to `site/assets/docs.css`: `.docs-search` container, `.docs-search-input` with `--docs-*` custom properties, focus styles using `--docs-accent`
- [x] 3.2 Add `.docs-search-results` dropdown styles: absolute positioning, border-radius, shadow, max-height with overflow scroll, z-index
- [x] 3.3 Add `.docs-search-result` item styles with hover and `aria-selected` active states, and `.docs-search-type` badge styles
- [x] 3.4 Add `.docs-search-empty` empty state message styles
- [x] 3.5 Add mobile breakpoint adjustments for the search UI within the existing `@media (max-width: 980px)` block

## Task 4: Implement search behavior JS

- [x] 4.1 Create `site/assets/docs-search.js` as a self-contained IIFE that reads the inline JSON index from `#docs-search-index` and initializes the search behavior
- [x] 4.2 Implement the `filterIndex(query, index)` pure function: trim, lowercase, return entries where title or description includes the normalized query; return empty array for empty/whitespace queries
- [x] 4.3 Implement `renderResults(results, container)` that creates `<li role="option">` elements with anchor links containing the title and a type badge span
- [x] 4.4 Implement `renderEmptyState(query, container)` that shows a "No results for ..." message
- [x] 4.5 Implement show/hide functions that toggle the `hidden` attribute and `aria-expanded` on the combobox container
- [x] 4.6 Implement keyboard navigation: ArrowDown/ArrowUp to move `aria-selected` through results (clamped at boundaries), Enter to navigate, Escape to hide and refocus input
- [x] 4.7 Implement dismiss behavior: click-outside listener on `document` that hides results when clicking outside `.docs-search`, preserving query text in the input
- [x] 4.8 Implement focusin handler on the search input that re-shows results if query is non-empty

## Task 5: Add passthrough copy for the search JS file

- [x] 5.1 Verify `site/assets/docs-search.js` is covered by the existing `{ "site/assets": "assets" }` passthrough rule in `.eleventy.js`; if not, add an explicit entry

## Task 6: Write property-based tests

- [ ] 6.1 Install `fast-check` as a dev dependency
- [ ] 6.2 Create a test file for the `filterIndex` function: extract it as a standalone exportable module (e.g., `site/assets/search-utils.js` or a test helper that re-implements the same logic) and write Property 3 (filter correctness) — for any index and query, verify the function returns exactly the case-insensitive substring matches
- [ ] 6.3 Write Property 5 (keyboard navigation bounds) — for any list length N and any sequence of ArrowUp/ArrowDown, verify the active index stays within [0, N-1]

## Task 7: Write unit tests

- [ ] 7.1 Write unit tests for the search index collection builder: verify it produces correct entries for sample foundation and component pages, and excludes playground pages
- [ ] 7.2 Write unit tests for edge cases: empty query returns empty array, whitespace-only query returns empty array, no-match query returns empty array
- [ ] 7.3 Write unit tests for result rendering: verify each result item has correct href, title text, and type badge

## Task 8: Build verification and smoke test

- [x] 8.1 Run `npm run docs:site` (or equivalent Eleventy build) and verify the built HTML contains the inline search index with valid JSON
- [x] 8.2 Verify the search CSS contains only `--docs-*` custom properties (no `--button-*`, `--input-*`, or other component tokens)
- [ ] 8.3 Manually verify the search works end-to-end: type a query, see results, click a result, use keyboard navigation, dismiss with Escape and click-outside
