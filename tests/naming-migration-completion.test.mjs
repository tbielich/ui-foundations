import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function filesUnder(relativePath, extensions) {
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(entryPath);
      else if (extensions.has(path.extname(entryPath))) files.push(entryPath);
    }
  };
  visit(path.join(root, relativePath));
  return files;
}

test("the consumed naming contract reports no repository-owned legacy usage", () => {
  const result = spawnSync(process.execPath, ["scripts/check-vault-naming-contract.mjs"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /Naming deprecation warning/);
  assert.match(result.stdout, /passed \(0 legacy usage warnings\)/);
});

test("owned templates, previews, schemas, elements, and MCP fixtures do not emit legacy classes", () => {
  const extensionSet = new Set([".js", ".mjs", ".njk", ".ts"]);
  const files = [
    ...filesUnder("src/elements", extensionSet),
    ...filesUnder("site/_includes", extensionSet),
    ...filesUnder("site/assets/playground", extensionSet),
    ...filesUnder("schemas", extensionSet),
    ...filesUnder("packages/mcp-server/src", extensionSet),
  ];
  const legacyNames =
    "accordion|avatar|badge|button-group|button|calendar|checkbox|divider|form|icon|input|label-content|label|link|progress-circle|progress-circle-svg|progress-circle-track|progress-circle-indicator|radio|select|switch|tab-list|tab-panel|tab|tabs|textarea|tooltip";
  const literalClass = new RegExp(
    `(?:class=["']|className\\s*=\\s*["'])(?:${legacyNames})(?:\\s|["'])`,
  );
  const legacyClassSeed = new RegExp(
    `set\\s+[A-Za-z]*[Cc]lasses\\s*=\\s*["'](?:${legacyNames})(?:\\s|["'])`,
  );

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(source, literalClass, path.relative(root, file));
    assert.doesNotMatch(source, legacyClassSeed, path.relative(root, file));
  }
});

test("completion guidance defines canonical owned output and v1 CSS-only compatibility", () => {
  for (const relativePath of [
    "site/foundations/class-naming.md",
    "docs/foundations/foundation-013-class-naming.md",
  ]) {
    const documentation = read(relativePath);
    assert.match(documentation, /All repository-owned emitters use canonical `\.uif-\*` classes/);
    assert.match(documentation, /deprecated CSS-only\s+compatibility selectors through v1\.x/);
    assert.match(documentation, /Wave 4 work for v2\.0 or\s+later/);
  }
});

test("migration history lives in the repository guide, not public pattern pages", () => {
  const migration = read("MIGRATION.md");
  assert.match(migration, /Legacy selectors remain CSS-only aliases through v1\.x/);
  assert.match(migration, /No library-owned legacy token aliases or fallbacks/);
  assert.match(migration, /no alias or dual registration/);
  assert.match(migration, /Wave 4\s+work for v2\.0 or later/);

  for (const file of filesUnder("site/patterns", new Set([".md"]))) {
    const documentation = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(documentation, /v1 naming migration|v1-naming-migration/i, path.relative(root, file));
  }
});
