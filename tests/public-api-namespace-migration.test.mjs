import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), "utf8");

const TAGS = [
  "icon",
  "button",
  "button-group",
  "input",
  "checkbox",
  "radio",
  "switch",
  "badge",
  "divider",
  "textarea",
  "avatar",
  "accordion",
  "accordion-item",
  "tab-list",
  "tab",
  "tab-panel",
  "tooltip",
  "modal",
  "select",
  "link",
  "field-label",
  "form",
  "form-group",
  "form-field",
  "form-helper",
  "form-actions",
];

function filesUnder(relativeDirectory, extensions) {
  const directory = path.join(ROOT, relativeDirectory);
  return fs.readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && extensions.some((extension) => entry.name.endsWith(extension)))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

test("element registrations and TypeScript tag names use the canonical namespace", () => {
  const source = filesUnder("src/elements", [".js"]).map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const declarations = read("src/elements/index.d.ts");

  for (const tag of TAGS) {
    assert.match(source, new RegExp(`define\\(\\"uif-${tag}\\"`));
    assert.match(declarations, new RegExp(`\\"uif-${tag}\\":`));
  }

  assert.doesNotMatch(source, /define\("ui-/);
  assert.doesNotMatch(declarations, /"ui-(?:icon|button|input|checkbox|radio|switch|badge|divider|textarea|avatar|accordion|tab|tooltip|modal|select|link|field-label|form)/);
});

test("owned public examples and emitters produce only canonical namespace usage", () => {
  const files = [
    ...filesUnder("site", [".md", ".njk", ".js"]),
    ...filesUnder("src/elements", [".js", ".d.ts"]),
    path.join(ROOT, "README.md"),
    path.join(ROOT, "IMPLEMENTATION.md"),
    path.join(ROOT, "CODEX.md"),
    path.join(ROOT, "packages/mcp-server/src/prompts/implement-component.ts"),
  ];

  for (const file of files) {
    const contents = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(contents, /<ui-/, file);
    assert.doesNotMatch(contents, /\bas ui\b/, file);
    assert.doesNotMatch(contents, /\bui\.[A-Za-z][A-Za-z0-9]*\s*\(/, file);
  }

  assert.match(read("site/assets/playground/code-generators.js"), /<uif-/);
  assert.match(read("site/getting-started.md"), /as uif/);
  assert.match(read("site/getting-started.md"), /uif\.[A-Za-z][A-Za-z0-9]*\s*\(/);
});

test("module filenames and package entry points remain stable", () => {
  const packageJson = JSON.parse(read("package.json"));
  assert.ok(packageJson.exports["./macros/ui.njk"]);
  assert.ok(packageJson.exports["./elements"]);

  const elementEntries = Object.keys(packageJson.exports).filter((entry) => entry.startsWith("./elements/"));
  assert.ok(elementEntries.length > 0);
  assert.ok(elementEntries.every((entry) => entry.startsWith("./elements/ui-")));
  assert.ok(elementEntries.every((entry) => !entry.startsWith("./elements/uif-")));

  for (const entry of elementEntries) {
    const filename = `${entry.slice("./elements/".length)}.js`;
    assert.ok(fs.existsSync(path.join(ROOT, "src/elements", filename)), filename);
  }
});

test("consumer migration guide documents every breaking tag rename", () => {
  const guide = read("docs/migrations/public-api-namespace-v1.md");
  for (const tag of TAGS) {
    assert.match(guide, new RegExp(`<ui-${tag}>`));
    assert.match(guide, new RegExp(`<uif-${tag}>`));
  }
  assert.match(guide, /not registered in v1/);
  assert.match(guide, /does not provide\s+compatibility aliases or dual registration/);
});
