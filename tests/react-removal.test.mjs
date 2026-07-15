import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("deprecated React package exports and source wrappers are removed", () => {
  const pkg = JSON.parse(read("package.json"));
  const reactExports = Object.keys(pkg.exports).filter(
    (entry) => entry === "./react" || entry.startsWith("./react/"),
  );

  assert.deepEqual(reactExports, []);
  assert.equal(fs.existsSync(path.join(root, "src/react")), false);
});

test("build and smoke checks do not produce or require a React bundle", () => {
  const build = read("scripts/build-css.mjs");
  const smoke = read("scripts/smoke-check.mjs");

  assert.doesNotMatch(build, /src["', )]+react|buildReactBundle/);
  assert.match(build, /rmSync\(path\.join\(DIST_DIR, "react"\)/);
  assert.doesNotMatch(smoke, /dist\/react/);
});

test("consumer migration guide covers every removed public entry point", () => {
  const guide = read("docs/migrations/react-to-web-components.md");
  const removedEntries = [
    "ui-foundations/react",
    "ui-foundations/react/accordion",
    "ui-foundations/react/avatar",
    "ui-foundations/react/badge",
    "ui-foundations/react/button",
    "ui-foundations/react/checkbox",
    "ui-foundations/react/divider",
    "ui-foundations/react/icon",
    "ui-foundations/react/input",
    "ui-foundations/react/label",
    "ui-foundations/react/radio",
    "ui-foundations/react/switch",
    "ui-foundations/react/tabs",
    "ui-foundations/react/textarea",
    "ui-foundations/react/tooltip",
    "ui-foundations/react/form",
    "ui-foundations/react/link",
    "ui-foundations/react/select",
  ];

  for (const entry of removedEntries) {
    assert.match(guide, new RegExp(`\\\`${entry}\\\``));
  }

  assert.match(guide, /`Calendar` was available only from the removed aggregate React entry/);
  assert.match(guide, /`LabelContent` is likewise a composition helper/);
});
