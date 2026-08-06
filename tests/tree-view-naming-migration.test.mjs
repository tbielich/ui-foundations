import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("TreeView CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/tree-view.css");
  for (const className of ["tree-view", "tree-node", "tree-node-row", "tree-label", "tree-children", "tree-toggle"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }
  assert.match(css, /var\(--uif-tree-view-/);
  assert.doesNotMatch(css, /var\(--tree-view-/);
});

test("TreeView Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-tree-view-/g) ?? [];
  assert.equal(canonical.length, 14);
  assert.doesNotMatch(tokenExport, /var\(--tree-view-/);
});

test("TreeView-owned emitters produce canonical classes and interactions", async () => {
  const [element, macros, renderer, schema] = await Promise.all([
    read("src/elements/ui-tree-view.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-tree-view.figma.ts"),
  ]);

  for (const source of [element, macros, renderer, schema]) assert.match(source, /uif-tree-view/);
  assert.match(element, /ArrowDown/);
  assert.match(element, /dragstart/);
  assert.match(element, /data-lazy-url/);
});

test("TreeView migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-tree-view.js"),
  ]);
  assert.match(documentation, /\| TreeView \|.*`--uif-tree-view-\*`/);
  assert.match(element, /define\("uif-tree-view", UITreeView\)/);
});
