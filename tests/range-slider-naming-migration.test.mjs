import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Range Slider CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/range-slider.css");

  for (const className of [
    "range-slider-field",
    "range-slider-header",
    "range-slider-label",
    "range-slider-value",
    "range-slider",
    "range-slider-input",
  ]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }

  assert.match(css, /var\(--uif-range-slider-/);
  assert.doesNotMatch(css, /var\(--range-slider-/);
});

test("Range Slider Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-range-slider-/g) ?? []).length, 16);
  assert.doesNotMatch(tokenExport, /var\(--range-slider-/);
});

test("Range Slider-owned emitters and behavior use canonical classes", async () => {
  const [element, macros, renderer, schema, behavior, documentation] =
    await Promise.all([
      read("src/elements/ui-range-slider.js"),
      read("site/_includes/macros/ui.njk"),
      read("site/assets/playground/renderers.js"),
      read("schemas/web-range-slider.figma.ts"),
      read("src/ui/components/range-slider.js"),
      read("site/patterns/range-slider.md"),
    ]);

  for (const source of [element, macros, renderer, schema, behavior]) {
    assert.match(source, /uif-range-slider/);
  }

  assert.match(documentation, /uif\.rangeSlider/);
  assert.doesNotMatch(element, /class="range-slider(?:[-\s"])/);
});

test("Range Slider migration guide, exports, and registration use the canonical namespace", async () => {
  const [migration, namespaceGuide, packageJson, elementIndex, declarations, element] =
    await Promise.all([
      read("MIGRATION.md"),
      read("docs/migrations/public-api-namespace-v1.md"),
      read("package.json"),
      read("src/elements/index.js"),
      read("src/elements/index.d.ts"),
      read("src/elements/ui-range-slider.js"),
    ]);

  assert.match(migration, /\| RangeSlider \|.*`--uif-range-slider-\*`/);
  assert.match(namespaceGuide, /<uif-range-slider>/);
  assert.match(packageJson, /\.\/elements\/ui-range-slider/);
  assert.match(elementIndex, /UIRangeSlider/);
  assert.match(declarations, /"uif-range-slider": UIRangeSlider;/);
  assert.match(element, /define\("uif-range-slider", UIRangeSlider\)/);
});
