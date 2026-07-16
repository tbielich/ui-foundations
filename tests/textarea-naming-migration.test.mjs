import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Textarea CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/textarea.css");
  assert.match(css, /:is\(\.uif-textarea, \.textarea\)/);
  assert.match(css, /var\(--uif-textarea-/);
  assert.doesNotMatch(css, /var\(--textarea-/);
  assert.doesNotMatch(css, /\.uif-textarea(?:__|--)/);
});

test("Textarea Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-textarea-/g) ?? []).length, 16);
  assert.doesNotMatch(tokenExport, /var\(--textarea-/);
});

test("Textarea-owned emitters use the canonical class", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-textarea.js"), read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"), read("schemas/web-textarea.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-textarea/);
  assert.doesNotMatch(sources[0], /class="textarea(?:[-\s"])/);
});

test("Textarea docs explain migration while registration stays stable", async () => {
  const [documentation, element] = await Promise.all([read("site/patterns/textarea.md"), read("src/elements/ui-textarea.js")]);
  assert.match(documentation, /legacy `--textarea-\*` token aliases are not provided/);
  assert.match(element, /define\("ui-textarea", UITextarea\)/);
});
