import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Input CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/input.css");

  for (const className of ["input", "input-field", "input-field-control"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }

  assert.match(css, /var\(--uif-input-/);
  assert.doesNotMatch(css, /var\(--input-/);
  assert.doesNotMatch(css, /\.uif-input(?:__|--)/);
});

test("Input Figma export contains all canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-input-/g) ?? [];

  assert.equal(canonical.length, 33);
  assert.doesNotMatch(tokenExport, /var\(--input-/);
});

test("Input-owned emitters produce canonical Input, Icon, and Label classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-input.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-input.figma.ts"),
    read("schemas/web-form.figma.ts"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-input/);
  }

  assert.match(sources[0], /uif-icon/);
  assert.match(sources[1], /uif-icon/);
  assert.match(sources[2], /uif-field-label/);
  assert.doesNotMatch(sources[3], /class="input(?:[\s"])/);
  assert.doesNotMatch(sources[4], /class="input(?:[\s"])/);
});

test("Input behavior and Date Input accept canonical and legacy Input markup", async () => {
  const [behavior, dateBehavior, dateCss] = await Promise.all([
    read("src/ui/components/input-field.js"),
    read("src/ui/components/date-input.js"),
    read("src/ui/patterns/date-input.css"),
  ]);

  assert.match(behavior, /:is\(\.uif-input-field, \.input-field\)/);
  assert.match(behavior, /input:is\(\.uif-input, \.input\)/);
  assert.match(behavior, /:is\(\.uif-input-field-control, \.input-field-control\)/);
  assert.match(dateBehavior, /:is\(\.uif-input-field, \.input-field\)\.date/);
  assert.match(dateCss, /:is\(\.uif-input-field, \.input-field\)\.date/);
});

test("Input documentation explains the v1 boundary and uses the canonical registration", async () => {
  const [documentation, element] = await Promise.all([
    read("site/patterns/input.md"),
    read("src/elements/ui-input.js"),
  ]);

  assert.match(documentation, /legacy `--input-\*` token\s+aliases are not provided/);
  assert.match(documentation, /\.uif-input-field-control/);
  assert.match(element, /define\("uif-input", UIInput\)/);
});
