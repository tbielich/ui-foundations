import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Button CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/button.css");

  assert.match(css, /:is\(\.uif-button, \.button\)/);
  assert.match(css, /:is\(\.uif-button, \.button\)\.solid/);
  assert.match(css, /\.uif-button/);
  assert.doesNotMatch(css, /--button-(?!group-)/);
  assert.doesNotMatch(css, /\.button(?:__|--)/);
});

test("Button token export uses UIF names without legacy token aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");

  assert.match(tokenExport, /var\(--uif-button-/);
  assert.doesNotMatch(tokenExport, /var\(--button-(?!group-)/);
});

test("Button-owned emitters use the canonical root and explicit solid variant", async () => {
  const [react, element, macro, renderer, schema] = await Promise.all([
    read("src/react/button.js"),
    read("src/elements/ui-button.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-button.figma.ts"),
  ]);

  for (const source of [react, element, macro, renderer, schema]) {
    assert.match(source, /uif-button/);
    assert.match(source, /solid/);
  }

  assert.doesNotMatch(react, /const classes = \["button"\]/);
  assert.doesNotMatch(element, /const classes = \["button"\]/);
});

test("Input no longer depends on the removed legacy Button token", async () => {
  const inputCss = await read("src/ui/patterns/input.css");

  assert.doesNotMatch(inputCss, /--button-line-height/);
  assert.match(inputCss, /--typography-body-line-height/);
});
