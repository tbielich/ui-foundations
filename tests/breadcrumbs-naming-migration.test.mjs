import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Breadcrumbs CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/breadcrumbs.css");

  for (const name of ["breadcrumbs", "breadcrumbs-list", "breadcrumb-item", "breadcrumb-link", "breadcrumb-current"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${name}, \\.${name}\\)`));
  }
  assert.match(css, /var\(--uif-breadcrumbs-/);
  assert.doesNotMatch(css, /var\(--breadcrumbs-/);
  assert.doesNotMatch(css, /\.uif-breadcrumbs(?:__|--)/);
});

test("Breadcrumbs Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.equal((tokenExport.match(/var\(--uif-breadcrumbs-/g) ?? []).length, 12);
  assert.doesNotMatch(tokenExport, /var\(--breadcrumbs-/);
});

test("Breadcrumbs-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-breadcrumbs.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-breadcrumbs.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-breadcrumb/);
  assert.match(sources[0], /define\("uif-breadcrumbs", UIBreadcrumbs\)/);
});

test("Breadcrumbs migration guide and registration use canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-breadcrumbs.js"),
  ]);
  assert.match(documentation, /\| Breadcrumbs \|.*`--uif-breadcrumbs-\*`/);
  assert.match(element, /define\("uif-breadcrumbs", UIBreadcrumbs\)/);
});
