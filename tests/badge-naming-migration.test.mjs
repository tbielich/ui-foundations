import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Badge CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/badge.css");
  assert.match(css, /:is\(\.uif-badge, \.badge\)/);
  assert.match(css, /var\(--uif-badge-/);
  assert.doesNotMatch(css, /var\(--badge-/);
  assert.doesNotMatch(css, /\.uif-badge(?:__|--)/);
});

test("Badge Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-badge-/g) ?? []).length, 28);
  assert.doesNotMatch(tokenExport, /var\(--badge-/);
});

test("Badge-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-badge.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-badge.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-badge/);
  assert.doesNotMatch(sources[0], /class="badge(?:[-\s"])/);
});

test("Badge docs explain migration while registration stays stable", async () => {
  const [documentation, element] = await Promise.all([
    read("site/patterns/badge.md"),
    read("src/elements/ui-badge.js"),
  ]);
  assert.match(documentation, /legacy `--badge-\*` token aliases are not provided/);
  assert.match(element, /define\("ui-badge", UIBadge\)/);
});
