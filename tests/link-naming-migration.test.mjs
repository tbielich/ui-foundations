import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Link CSS exposes canonical UIF naming with the v1 class alias", async () => {
  const css = await read("src/ui/patterns/link.css");

  assert.match(css, /:is\(\.uif-link, \.link\)/);
  assert.match(css, /var\(--uif-link-/);
  assert.doesNotMatch(css, /var\(--link-/);
  assert.doesNotMatch(css, /\.uif-link(?:__|--)/);
});

test("Link Figma export contains all canonical tokens without legacy aliases", async () => {
  const tokenExport = await read("figma/exports/Patterns (UI).tokens.json");
  const canonical = tokenExport.match(/var\(--uif-link-/g) ?? [];

  assert.equal(canonical.length, 12);
  assert.doesNotMatch(tokenExport, /var\(--link-/);
});

test("Link-owned emitters produce the canonical class and shared Icon class", async () => {
  const sources = await Promise.all([
    read("src/elements/ui-link.js"),
    read("site/_includes/macros/ui.njk"),
    read("site/assets/playground/renderers.js"),
  ]);

  for (const source of sources) {
    assert.match(source, /uif-link/);
    assert.match(source, /uif-icon/);
  }

  assert.match(sources[0], /const classes = \["uif-link"\]/);
  assert.match(sources[1], /set classes = "uif-link"/);
  assert.match(sources[2], /const classes = \["uif-link"\]/);
});

test("Link retains Icon and legacy class compatibility without token aliases", async () => {
  const css = await read("src/ui/patterns/link.css");

  assert.match(css, /:is\(\.uif-link, \.link\) > :is\(\.uif-icon, \.icon\)/);
  assert.doesNotMatch(css, /--link-[\w-]+\s*:/);
});

test("Link documentation explains the v1 boundary while element registration stays stable", async () => {
  const [documentation, element] = await Promise.all([
    read("site/patterns/link.md"),
    read("src/elements/ui-link.js"),
  ]);

  assert.match(documentation, /legacy\s+`--link-\*` token aliases are not provided/);
  assert.match(documentation, /class="uif-link/);
  assert.doesNotMatch(documentation, /class="link(?:[\s"])/);
  assert.match(element, /define\("ui-link", UILink\)/);
});
