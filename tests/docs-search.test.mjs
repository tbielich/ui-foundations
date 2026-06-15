import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fc from "fast-check";

const require = createRequire(import.meta.url);
const { filterIndex, navigateIndex } = require("../site/assets/search-utils.js");

// ---------------------------------------------------------------------------
// Unit Tests (Task 7)
// ---------------------------------------------------------------------------

test("filterIndex: empty query returns empty array", () => {
  const index = [
    { title: "Button", description: "Primary action", url: "/button/", type: "pattern" },
  ];
  assert.deepEqual(filterIndex("", index), []);
});

test("filterIndex: whitespace-only query returns empty array", () => {
  const index = [
    { title: "Color", description: "Color tokens", url: "/color/", type: "token" },
  ];
  assert.deepEqual(filterIndex("   ", index), []);
  assert.deepEqual(filterIndex("\t\n", index), []);
});

test("filterIndex: no-match query returns empty array", () => {
  const index = [
    { title: "Button", description: "Primary action", url: "/button/", type: "pattern" },
    { title: "Input", description: "Text field", url: "/input/", type: "pattern" },
  ];
  assert.deepEqual(filterIndex("zzzzz", index), []);
});

test("filterIndex: matches on title (case-insensitive)", () => {
  const index = [
    { title: "Button", description: "Primary action", url: "/button/", type: "pattern" },
    { title: "Input", description: "Text field", url: "/input/", type: "pattern" },
    { title: "Badge", description: "Status pill", url: "/badge/", type: "pattern" },
  ];
  const results = filterIndex("but", index);
  assert.equal(results.length, 1);
  assert.equal(results[0].title, "Button");
});

test("filterIndex: matches on description (case-insensitive)", () => {
  const index = [
    { title: "Button", description: "Primary action", url: "/button/", type: "pattern" },
    { title: "Input", description: "Text field", url: "/input/", type: "pattern" },
  ];
  const results = filterIndex("TEXT", index);
  assert.equal(results.length, 1);
  assert.equal(results[0].title, "Input");
});

test("filterIndex: returns multiple matches", () => {
  const index = [
    { title: "Color tokens", description: "All colors", url: "/color/", type: "token" },
    { title: "Button", description: "Colorful action", url: "/button/", type: "pattern" },
    { title: "Icon", description: "SVG icons", url: "/icon/", type: "pattern" },
  ];
  const results = filterIndex("color", index);
  assert.equal(results.length, 2);
});

test("filterIndex: preserves entry structure", () => {
  const entry = { title: "Tabs", description: "Tab navigation", url: "/tabs/", type: "pattern" };
  const results = filterIndex("tab", [entry]);
  assert.equal(results.length, 1);
  assert.equal(results[0].title, "Tabs");
  assert.equal(results[0].description, "Tab navigation");
  assert.equal(results[0].url, "/tabs/");
  assert.equal(results[0].type, "pattern");
});

test("navigateIndex: ArrowDown increments (clamped at end)", () => {
  assert.equal(navigateIndex(-1, "ArrowDown", 3), 0);
  assert.equal(navigateIndex(0, "ArrowDown", 3), 1);
  assert.equal(navigateIndex(1, "ArrowDown", 3), 2);
  assert.equal(navigateIndex(2, "ArrowDown", 3), 2); // clamped
});

test("navigateIndex: ArrowUp decrements (clamped at 0)", () => {
  assert.equal(navigateIndex(2, "ArrowUp", 3), 1);
  assert.equal(navigateIndex(1, "ArrowUp", 3), 0);
  assert.equal(navigateIndex(0, "ArrowUp", 3), 0); // clamped
});

test("navigateIndex: empty list returns -1", () => {
  assert.equal(navigateIndex(0, "ArrowDown", 0), -1);
  assert.equal(navigateIndex(0, "ArrowUp", 0), -1);
});

// ---------------------------------------------------------------------------
// Search Index Collection Tests (Task 7.1)
// ---------------------------------------------------------------------------

test("search index collection: includes foundation pages with title", () => {
  // Simulate what the Eleventy collection builder does
  const pages = [
    { data: { title: "Color", description: "Color tokens" }, url: "/foundations/color/" },
    { data: { title: "Typography", description: "" }, url: "/foundations/typography/" },
    { data: { title: null }, url: "/foundations/empty/" }, // no title — should be excluded
  ];

  const entries = pages
    .filter((p) => p.data.title)
    .map((p) => ({
      title: p.data.title,
      description: p.data.description || "",
      url: p.url,
      type: "token",
    }));

  assert.equal(entries.length, 2);
  assert.equal(entries[0].type, "token");
  assert.equal(entries[1].type, "token");
});

test("search index collection: excludes playground pages", () => {
  const pages = [
    { data: { title: "Button", isPlayground: false }, url: "/patterns/button/" },
    { data: { title: "Button Playground", isPlayground: true }, url: "/patterns/button-playground/" },
    { data: { title: "Checkbox", isPlayground: undefined }, url: "/patterns/checkbox/" },
  ];

  const entries = pages
    .filter((p) => !p.data.isPlayground && p.data.title)
    .map((p) => ({
      title: p.data.title,
      description: p.data.description || "",
      url: p.url,
      type: "pattern",
    }));

  assert.equal(entries.length, 2);
  assert.equal(entries[0].title, "Button");
  assert.equal(entries[1].title, "Checkbox");
});

// ---------------------------------------------------------------------------
// Property-Based Tests (Task 6)
// ---------------------------------------------------------------------------

const searchEntryArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.string({ maxLength: 100 }),
  url: fc.webUrl(),
  type: fc.constantFrom("token", "pattern"),
});

test("PBT Property 3: filterIndex returns only case-insensitive substring matches", () => {
  fc.assert(
    fc.property(
      fc.array(searchEntryArb, { minLength: 0, maxLength: 20 }),
      fc.string({ minLength: 0, maxLength: 30 }),
      (index, query) => {
        const results = filterIndex(query, index);
        const normalized = query.trim().toLowerCase();

        if (!normalized) {
          // Empty/whitespace query → must return empty
          assert.equal(results.length, 0);
          return;
        }

        // Every result must contain the query in title or description
        for (const entry of results) {
          const titleMatch = entry.title.toLowerCase().includes(normalized);
          const descMatch = entry.description.toLowerCase().includes(normalized);
          assert.ok(
            titleMatch || descMatch,
            `Result "${entry.title}" does not contain query "${normalized}"`,
          );
        }

        // Every index entry that matches must be in results
        const expected = index.filter(
          (e) =>
            e.title.toLowerCase().includes(normalized) ||
            e.description.toLowerCase().includes(normalized),
        );
        assert.equal(results.length, expected.length);
      },
    ),
    { numRuns: 200 },
  );
});

test("PBT Property 5: navigateIndex stays within [0, N-1] for any key sequence", () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 50 }),
      fc.array(fc.constantFrom("ArrowDown", "ArrowUp"), { minLength: 1, maxLength: 100 }),
      (length, keySequence) => {
        let current = -1;
        for (const key of keySequence) {
          current = navigateIndex(current, key, length);
          assert.ok(current >= 0, `Index ${current} went below 0`);
          assert.ok(current < length, `Index ${current} exceeded length ${length}`);
        }
      },
    ),
    { numRuns: 200 },
  );
});
