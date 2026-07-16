import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Tabs CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/tabs.css");
  for (const name of ["tabs", "tab-list", "tab", "tab-panels", "tab-panel"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${name}, \\.${name}\\)`));
  }
  assert.match(css, /var\(--uif-tabs-/);
  assert.doesNotMatch(css, /var\(--tabs-/);
  assert.doesNotMatch(css, /\.uif-tabs?(?:__|--)/);
});

test("Tabs Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-tabs-/g) ?? []).length, 9);
  assert.doesNotMatch(tokenExport, /var\(--tabs-/);
});

test("Tabs-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-tabs.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-tab.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-tab/);
  assert.doesNotMatch(sources[0], /class="tab(?:[-\s"])/);
  assert.doesNotMatch(sources[3], /figma\.className\(\["tab"\]\)/);
});

test("Tabs migration guide and registrations use the canonical public namespace", async () => {
  const [documentation, elements] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-tabs.js"),
  ]);
  assert.match(documentation, /\| Tabs \|.*`--uif-tabs-\*`/);
  for (const tag of ["uif-tab-list", "uif-tab", "uif-tab-panel"]) {
    assert.match(elements, new RegExp(`define\\("${tag}"`));
  }
});
