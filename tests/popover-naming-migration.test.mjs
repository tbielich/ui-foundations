import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Popover CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const [css, layout] = await Promise.all([
    read("src/ui/patterns/popover.css"),
    read("src/core/recipes/layout.css"),
  ]);

  for (const className of ["popover", "popover-container"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }
  assert.match(layout, /:is\(\.uif-popover, \.popover\)/);
  assert.match(css, /var\(--uif-popover-/);
  assert.doesNotMatch(css, /var\(--popover-/);
  assert.doesNotMatch(css, /\.uif-popover(?:__|--)/);
});

test("Popover Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-popover-/g) ?? [];

  assert.ok(canonical.length >= 6, `Expected at least 6 popover tokens, got ${canonical.length}`);
  assert.doesNotMatch(tokenExport, /var\(--popover-[^u]/);
});

test("Popover-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-popover.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-popover.figma.ts"),
  ]);

  for (const source of sources) assert.match(source, /uif-popover/);
  assert.doesNotMatch(sources[0], /class="popover(?:[\s"])/);
  assert.doesNotMatch(sources[3], /class="popover(?:[\s"])/);
});

test("Popover migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-popover.js"),
  ]);

  assert.match(documentation, /\| Popover \|.*`--uif-popover-\*`/);
  assert.match(element, /define\("uif-popover", UIPopover\)/);
});
