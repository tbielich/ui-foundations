import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("ButtonGroup CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/button.css");

  assert.match(css, /:is\(\.uif-button-group, \.button-group\)/);
  assert.match(css, /--uif-button-group-gap/);
  assert.match(css, /--uif-button-group-border-radius/);
  assert.doesNotMatch(css, /--button-group-/);
  assert.doesNotMatch(css, /\.button-group(?:__|--)/);
});

test("ButtonGroup Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");

  assert.match(tokenExport, /var\(--uif-button-group-gap\)/);
  assert.match(tokenExport, /var\(--uif-button-group-border-radius\)/);
  assert.match(tokenExport, /"targetVariableName": "Button\/Border\/Radius"/);
  assert.doesNotMatch(tokenExport, /var\(--button-group-/);
});

test("ButtonGroup-owned emitters produce the canonical root class", async () => {
  const [element, macro, renderer, schema, documentation] = await Promise.all([
    read("src/elements/ui-button.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-button-group.figma.ts"),
    read("site/patterns/button.md"),
  ]);

  for (const source of [element, macro, renderer, schema, documentation]) {
    assert.match(source, /uif-button-group/);
  }

  assert.doesNotMatch(element, /class="button-group"/);
  assert.doesNotMatch(macro, /set classes = "button-group"/);
  assert.doesNotMatch(renderer, /class(?:Name)? = "button-group"/);
  assert.doesNotMatch(schema, /class="button-group"/);
});

test("ButtonGroup migration leaves deprecated React wrappers unchanged", async () => {
  const react = await read("src/react/button.js");

  assert.match(react, /const classes = \["button-group"\]/);
  assert.doesNotMatch(react, /const classes = \["uif-button-group"\]/);
});
