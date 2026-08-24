import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Menu CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/menu.css");

  for (const className of ["menu", "menu-item", "menu-section", "menu-section-label", "menu-divider"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }
  assert.match(css, /var\(--uif-menu-/);
  assert.doesNotMatch(css, /var\(--menu-/);
  assert.doesNotMatch(css, /\.uif-menu(?:__|--)/);
});

test("Menu Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-menu-/g) ?? [];

  assert.ok(canonical.length >= 8, `Expected at least 8 menu tokens, got ${canonical.length}`);
  assert.doesNotMatch(tokenExport, /var\(--menu-/);
});

test("Menu-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-menu.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-menu.figma.ts"),
  ]);

  for (const source of sources) assert.match(source, /uif-menu/);
  assert.doesNotMatch(sources[0], /class="menu(?:[\s"])/);
  assert.doesNotMatch(sources[3], /class="menu(?:[\s"])/);
});

test("Menu migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-menu.js"),
  ]);

  assert.match(documentation, /\| Menu \|.*`--uif-menu-\*`/);
  assert.match(element, /define\("uif-menu", UIMenu\)/);
});
