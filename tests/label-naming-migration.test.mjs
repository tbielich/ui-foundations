import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Label CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/label.css");

  for (const className of [
    "label-content",
    "label-content-text",
    "field-label",
    "field-label-required",
    "field-label-required-text",
  ]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }

  assert.match(css, /var\(--uif-field-label-gap, 0\.25em\)/);
  assert.match(css, /var\(--uif-field-label-line-height, inherit\)/);
  assert.match(css, /var\(--uif-field-label-required-color, currentColor\)/);
  assert.doesNotMatch(css, /var\(--field-label-/);
  assert.doesNotMatch(css, /\.uif-label-content(?:__|--)/);
});

test("Label-owned emitters produce canonical classes and runtime inputs", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-label.js"),
    read("src/elements/ui-button.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-label.figma.ts"),
    read("schemas/web-form.figma.ts"),
    read("schemas/web-button.figma.ts"),
    read("packages/mcp-server/src/resources/components.ts"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-label-content/);
    assert.doesNotMatch(source, /class="label-content(?:\s|")/);
    assert.doesNotMatch(source, /class="field-label(?:\s|")/);
    assert.doesNotMatch(source, /--field-label-/);
  }
});

test("shared Button and Form selectors retain Label-family compatibility", async () => {
  const [button, form] = await Promise.all([
    read("src/ui/patterns/button.css"),
    read("src/ui/patterns/form.css"),
  ]);

  assert.match(button, /:is\(\.uif-label-content, \.label-content\)/);
  assert.match(button, /:is\(\.uif-label-content-text, \.label-content-text\)/);
  assert.match(form, /:is\(\.uif-field-label, \.field-label\)/);
});

test("Typography Label tokens keep their separately governed namespace", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");

  assert.match(tokenExport, /var\(--typography-label-font-family\)/);
  assert.match(tokenExport, /var\(--typography-label-gap\)/);
  assert.doesNotMatch(tokenExport, /--uif-field-label-/);
});

test("Label migration guide uses the canonical Custom Element tag", async () => {
  const [documentation, element, declarations] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-label.js"),
    read("src/elements/index.d.ts"),
  ]);

  assert.match(documentation, /\| Label composition \|.*`--uif-field-label-\*`/);
  assert.match(element, /define\("uif-field-label", UIFieldLabel\)/);
  assert.match(declarations, /"uif-field-label": UIFieldLabel/);
  assert.doesNotMatch(element, /ui-uif-field-label/);
});
