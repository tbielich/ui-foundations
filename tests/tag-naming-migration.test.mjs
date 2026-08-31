import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Tag CSS exposes canonical UIF naming with a v1 class alias", async () => {
  const css = await read("src/ui/patterns/tag.css");
  assert.match(css, /:is\(\.uif-tag, \.tag\)/);
  assert.match(css, /var\(--uif-tag-/);
  assert.doesNotMatch(css, /var\(--tag-/);
  assert.doesNotMatch(css, /\.uif-tag(?:__|--)/);
});

test("Tag Figma export contains canonical tokens", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  assert.match(tokenExport, /var\(--uif-tag-/);
  assert.doesNotMatch(tokenExport, /var\(--tag-/);
});

test("Tag-owned emitters use canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-tag.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-tag.figma.ts"),
  ]);
  for (const source of sources) assert.match(source, /uif-tag/);
  assert.doesNotMatch(sources[0], /class="tag(?:[-\s"])/);
});

test("Tag migration guide and registration use the canonical namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-tag.js"),
  ]);
  assert.match(documentation, /\| Tag \|.*`--uif-tag-\*`/);
  assert.match(element, /define\("uif-tag", UITag\)/);
  assert.match(element, /define\("uif-tag-group", UITagGroup\)/);
});
