import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Form CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/form.css");
  for (const name of ["form", "form-group", "form-group-title", "form-field", "form-field-body", "form-field-helper", "form-field-link", "form-actions"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${name}, \\.${name}\\)`));
  }
  assert.match(css, /var\(--uif-form-/);
  assert.doesNotMatch(css, /var\(--form-/);
  assert.doesNotMatch(css, /\.uif-form(?:__|--)/);
});

test("Form Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-form-/g) ?? []).length, 12);
  assert.doesNotMatch(tokenExport, /var\(--form-/);
});

test("Form-owned emitters and integrations use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-form.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-form.figma.ts"),
    read("site/components/date-picker.md"),
    read("site/examples/login-form.md"),
  ]);
  for (const source of sources) assert.match(source, /uif-form/);
  assert.match(sources[2], /uif-button solid/);
  assert.doesNotMatch(sources[0], /class="form(?:[-\s"])/);
});

test("Form docs and registrations use the canonical public namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("site/patterns/form.md"),
    read("src/elements/ui-form.js"),
  ]);
  assert.match(documentation, /legacy `--form-\*` token aliases are not provided/);
  for (const tag of ["uif-form", "uif-form-group", "uif-form-field", "uif-form-helper", "uif-form-actions"]) {
    assert.match(element, new RegExp(`define\\("${tag}"`));
  }
});
