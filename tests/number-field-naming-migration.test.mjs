import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Number Field CSS uses canonical UIF class naming and component tokens", async () => {
  const css = await read("src/ui/patterns/number-field.css");

  assert.match(css, /\.uif-number-field-prefix/);
  assert.match(css, /\.uif-number-field-suffix/);
  assert.match(css, /\.uif-number-field\b/);
  assert.doesNotMatch(css, /(?<!uif-)(?<!\w)number-field(?!-)/);
  assert.match(css, /var\(--uif-number-field-/);
  assert.doesNotMatch(css, /var\(--number-field-/);
});

test("Number Field-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-number-field.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-number-field.figma.ts"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-number-field|number-field/);
  }
});

test("Number Field web component registers with canonical tag name", async () => {
  const element = await read("src/elements/ui-number-field.js");
  assert.match(element, /define\("uif-number-field", UINumberField\)/);
});

test("Number Field migration guide entry uses canonical namespace", async () => {
  const documentation = await read("MIGRATION.md");
  assert.match(documentation, /\| Number Field \|.*`--uif-number-field-\*`/);
  assert.match(documentation, /uif-number-field/);
});
