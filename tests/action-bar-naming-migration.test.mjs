import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("ActionBar CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/action-bar.css");
  assert.match(css, /:is\(\.uif-action-bar, \.action-bar\)/);
  assert.match(css, /var\(--uif-action-bar-/);
  assert.doesNotMatch(css, /var\(--action-bar-/);
  assert.doesNotMatch(css, /\.uif-action-bar(?:__|--)/);
});

test("ActionBar Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.ok((tokenExport.match(/var\(--uif-action-bar-/g) ?? []).length >= 5);
  assert.doesNotMatch(tokenExport, /var\(--action-bar-/);
});

test("ActionBar-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-action-bar.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-action-bar.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-action-bar/);
  assert.doesNotMatch(sources[0], /class="action-bar(?:[-\s"])/);
});

test("ActionBar migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-action-bar.js"),
  ]);
  assert.match(documentation, /\| ActionBar \|.*`--uif-action-bar-\*`/);
  assert.match(element, /define\("uif-action-bar", UIActionBar\)/);
});
