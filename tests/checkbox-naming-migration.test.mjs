import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Checkbox CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/checkbox.css");
  for (const name of ["checkbox", "checkbox-field"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${name}, \\.${name}\\)`));
  }
  assert.match(css, /var\(--uif-checkbox-/);
  assert.doesNotMatch(css, /var\(--checkbox-/);
  assert.doesNotMatch(css, /\.uif-checkbox(?:__|--)/);
});

test("Checkbox Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-checkbox-/g) ?? []).length, 19);
  assert.doesNotMatch(tokenExport, /var\(--checkbox-/);
});

test("Checkbox-owned emitters and behavior use canonical classes", async () => {
  const [element, macros, renderer, schema, behavior] = await Promise.all([
    read("src/elements/ui-checkbox.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-checkbox.figma.ts"),
    read("site/_includes/layouts/docs.njk"),
  ]);
  for (const source of [element, macros, renderer, schema]) assert.match(source, /uif-checkbox/);
  assert.match(behavior, /\.uif-checkbox, \.checkbox/);
  assert.doesNotMatch(element, /class="checkbox(?:[-\s"])/);
});

test("Checkbox docs explain migration and use the canonical registration", async () => {
  const [documentation, element] = await Promise.all([
    read("site/patterns/checkbox.md"),
    read("src/elements/ui-checkbox.js"),
  ]);
  assert.match(documentation, /legacy `--checkbox-\*` token aliases are not provided/);
  assert.match(element, /define\("uif-checkbox", UICheckbox\)/);
});
