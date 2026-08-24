import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Search Field CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/search-field.css");
  assert.match(css, /:is\(\.uif-search-field, \.search-field\)/);
  assert.match(css, /:is\(\.uif-search-field-input, \.search-field-input\)/);
  assert.match(css, /var\(--uif-search-field-/);
  assert.doesNotMatch(css, /var\(--search-field-/);
});

test("Search Field Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-search-field-/g) ?? [];
  assert.ok(canonical.length > 0);
  assert.doesNotMatch(tokenExport, /var\(--search-field-/);
});

test("Search Field-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-search-field.js"),
    read("src/ui/components/search-field.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-search-field.figma.ts"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-search-field/);
  }
});

test("Search Field registration and exports use canonical namespace", async () => {
  const [element, index, declarations, packageJson] = await Promise.all([
    read("src/elements/ui-search-field.js"),
    read("src/elements/index.js"),
    read("src/elements/index.d.ts"),
    read("package.json"),
  ]);

  assert.match(element, /define\("uif-search-field", UISearchField\)/);
  assert.match(index, /UISEARCHFIELD|UISearchField/);
  assert.match(declarations, /"uif-search-field": UISearchField/);
  assert.match(packageJson, /"\.\/elements\/ui-search-field"/);
});
