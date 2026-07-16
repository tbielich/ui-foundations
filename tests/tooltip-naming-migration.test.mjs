import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Tooltip CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const [css, layout] = await Promise.all([
    read("src/ui/patterns/tooltip.css"),
    read("src/core/recipes/layout.css"),
  ]);

  for (const className of ["tooltip", "tooltip-trigger"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }
  assert.match(layout, /:is\(\.uif-tooltip, \.tooltip\)/);
  assert.match(css, /var\(--uif-tooltip-/);
  assert.doesNotMatch(css, /var\(--tooltip-/);
  assert.doesNotMatch(css, /\.uif-tooltip(?:__|--)/);
});

test("Tooltip Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-tooltip-/g) ?? [];

  assert.equal(canonical.length, 5);
  assert.doesNotMatch(tokenExport, /var\(--tooltip-/);
});

test("Tooltip-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-tooltip.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-tooltip.figma.ts"),
  ]);

  for (const source of sources) assert.match(source, /uif-tooltip/);
  assert.doesNotMatch(sources[0], /class="tooltip(?:[\s"])/);
  assert.doesNotMatch(sources[3], /class="tooltip(?:[\s"])/);
});

test("Tooltip documentation explains migration and uses the canonical registration", async () => {
  const [documentation, element] = await Promise.all([
    read("site/patterns/tooltip.md"),
    read("src/elements/ui-tooltip.js"),
  ]);

  assert.match(documentation, /legacy `--tooltip-\*` token aliases are not provided/);
  assert.match(element, /define\("uif-tooltip", UITooltip\)/);
});
