import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Avatar CSS exposes canonical UIF naming with v1 class aliases", async () => {
  const css = await read("src/ui/patterns/avatar.css");

  for (const className of ["avatar", "avatar-initials"]) {
    assert.match(css, new RegExp(`:is\\(\\.uif-${className}, \\.${className}\\)`));
  }
  assert.match(css, /var\(--uif-avatar-/);
  assert.doesNotMatch(css, /var\(--avatar-/);
  assert.doesNotMatch(css, /\.uif-avatar(?:__|--)/);
});

test("Avatar Figma export contains canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-avatar-/g) ?? [];

  assert.equal(canonical.length, 3);
  assert.doesNotMatch(tokenExport, /var\(--avatar-/);
});

test("Avatar-owned emitters produce canonical classes", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-avatar.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
    read("schemas/web-avatar.figma.ts"),
  ]);

  for (const source of sources) assert.match(source, /uif-avatar/);
  assert.doesNotMatch(sources[0], /class="avatar(?:[\s"])/);
  assert.doesNotMatch(sources[3], /["']avatar["']/);
});

test("Avatar migration guide and registration use the canonical public namespace", async () => {
  const [documentation, element] = await Promise.all([
    read("MIGRATION.md"),
    read("src/elements/ui-avatar.js"),
  ]);

  assert.match(documentation, /\| Avatar \|.*`--uif-avatar-\*`/);
  assert.match(element, /define\("uif-avatar", UIAvatar\)/);
});
