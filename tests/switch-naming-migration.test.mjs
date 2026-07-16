import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Switch CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/switch.css");
  for (const name of ["switch", "switch-field"]) assert.match(css, new RegExp(`:is\\(\\.uif-${name}, \\.${name}\\)`));
  assert.match(css, /var\(--uif-switch-/);
  assert.doesNotMatch(css, /var\(--switch-/);
  assert.doesNotMatch(css, /\.uif-switch(?:__|--)/);
});

test("Switch Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-switch-/g) ?? []).length, 14);
  assert.doesNotMatch(tokenExport, /var\(--switch-/);
});

test("Switch-owned emitters and behavior use canonical classes", async () => {
  const [element, macros, renderer, schema, behavior] = await Promise.all([
    read("src/elements/ui-switch.js"), read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"), read("schemas/web-switch.figma.ts"),
    read("site/_includes/layouts/docs.njk"),
  ]);
  for (const source of [element, macros, renderer, schema]) assert.match(source, /uif-switch/);
  assert.match(behavior, /\.uif-switch, \.switch/);
  assert.doesNotMatch(element, /class="switch(?:[-\s"])/);
});

test("Switch docs explain migration while registration stays stable", async () => {
  const [documentation, element] = await Promise.all([read("site/patterns/switch.md"), read("src/elements/ui-switch.js")]);
  assert.match(documentation, /legacy `--switch-\*` token aliases are not provided/);
  assert.match(element, /define\("ui-switch", UISwitch\)/);
});
