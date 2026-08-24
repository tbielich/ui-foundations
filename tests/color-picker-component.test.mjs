import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Color Picker integration surfaces are wired with canonical UIF naming", async () => {
  const [
    css,
    indexCss,
    element,
    elementsIndex,
    macros,
    renderer,
    generators,
    docs,
    playground,
    schema,
    tokens,
    packageJsonRaw,
  ] = await Promise.all([
    read("src/ui/patterns/color-picker.css"),
    read("src/ui/index.css"),
    read("src/elements/ui-color-picker.js"),
    read("src/elements/index.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("site/assets/playground/code-generators.js"),
    read("site/patterns/color-picker.md"),
    read("site/patterns/color-picker-playground.md"),
    read("schemas/web-color-picker.figma.ts"),
    read("figma/exports/Patterns (UI).tokens.json"),
    read("package.json"),
  ]);

  assert.match(css, /\.uif-color-picker-area/);
  assert.match(css, /var\(--uif-color-picker-/);
  assert.match(indexCss, /patterns\/color-picker\.css/);

  assert.match(element, /define\("uif-color-picker", UIColorPicker\)/);
  assert.match(elementsIndex, /UIColorPicker/);
  assert.match(macros, /macro colorPicker/);

  assert.match(renderer, /colorPicker:\s*renderVanillaColorPicker/);
  assert.match(generators, /colorPicker:\s*njkColorPicker/);
  assert.match(generators, /colorPicker:\s*wcColorPicker/);

  assert.match(docs, /Color Picker/);
  assert.match(playground, /renderer:\s*colorPicker/);
  assert.match(schema, /uif-color-picker/);
  assert.match(tokens, /var\(--uif-color-picker-/);

  const packageJson = JSON.parse(packageJsonRaw);
  assert.equal(packageJson.exports["./elements/ui-color-picker"], "./dist/elements/ui-color-picker.js");
});
