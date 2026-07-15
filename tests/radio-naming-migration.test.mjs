import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Radio CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/radio.css");
  for (const name of ["radio", "radio-field"]) assert.match(css, new RegExp(`:is\\(\\.uif-${name}, \\.${name}\\)`));
  assert.match(css, /var\(--uif-radio-/);
  assert.doesNotMatch(css, /var\(--radio-/);
  assert.doesNotMatch(css, /\.uif-radio(?:__|--)/);
});

test("Radio Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-radio-/g) ?? []).length, 13);
  assert.doesNotMatch(tokenExport, /var\(--radio-/);
});

test("Radio-owned emitters and behavior use canonical classes", async () => {
  const [element, macros, renderer, schema, behavior] = await Promise.all([
    read("src/elements/ui-radio.js"), read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"), read("schemas/web-radio.figma.ts"),
    read("site/_includes/layouts/docs.njk"),
  ]);
  for (const source of [element, macros, renderer, schema]) assert.match(source, /uif-radio/);
  assert.match(behavior, /\.uif-radio, \.radio/);
  assert.doesNotMatch(element, /class="radio(?:[-\s"])/);
});

test("Radio docs explain migration while registration stays stable", async () => {
  const [documentation, element] = await Promise.all([read("site/patterns/radio.md"), read("src/elements/ui-radio.js")]);
  assert.match(documentation, /legacy `--radio-\*` token aliases are not provided/);
  assert.match(element, /define\("ui-radio", UIRadio\)/);
});
