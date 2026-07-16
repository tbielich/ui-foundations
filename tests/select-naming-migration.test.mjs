import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Select CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const [css, calendarCss] = await Promise.all([
    read("src/ui/patterns/select.css"),
    read("src/ui/patterns/calendar.css"),
  ]);
  assert.match(css, /:is\(\.uif-select, \.select\)/);
  assert.match(calendarCss, /:is\(\.uif-select, \.select\)/);
  assert.match(css, /var\(--uif-select-/);
  assert.doesNotMatch(css, /var\(--select-/);
  assert.doesNotMatch(css, /\.uif-select(?:__|--)/);
});

test("Select Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-select-/g) ?? []).length, 31);
  assert.doesNotMatch(tokenExport, /var\(--select-/);
});

test("Select-owned emitters and Calendar composition use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-select.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/_includes/macros/calendar.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-select.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-select/);
  assert.doesNotMatch(sources[0], /class="select(?:[-\s"])/);
});

test("Select migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-select.js"),
  ]);
  assert.match(documentation, /\| Select \|.*`--uif-select-\*`/);
  assert.match(element, /define\("uif-select", UISelect\)/);
});
