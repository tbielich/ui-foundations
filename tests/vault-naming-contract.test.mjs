import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const {
  VAULT_NAMING_CONTRACT,
  classifyPatternId,
  classifyPatternTokenName,
  classifyPublicClassName,
} = require("../scripts/vault-naming-classifier.js");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const GENERATED_PATH = resolve(ROOT, "scripts/vault-naming-contract.generated.js");

test("generated contract loads from consumed Vault artifact", () => {
  assert.equal(VAULT_NAMING_CONTRACT.kind, "UIFNamingContract");
  assert.equal(VAULT_NAMING_CONTRACT.source.packId, "governance-pack");
  assert.ok(VAULT_NAMING_CONTRACT.source.packVersion);
  assert.ok("versionRef" in VAULT_NAMING_CONTRACT.source);
});

test("class prefix validation uses generated contract examples", () => {
  const canonical = VAULT_NAMING_CONTRACT.examples.canonicalClasses[0];
  assert.equal(classifyPublicClassName(canonical).status, "canonical");

  const invalid = VAULT_NAMING_CONTRACT.examples.invalidClasses[0];
  assert.equal(classifyPublicClassName(invalid).status, "invalid");
});

test("CSS custom property prefix validation uses generated contract examples", () => {
  const canonical = VAULT_NAMING_CONTRACT.examples.canonicalCustomProperties[0];
  assert.equal(classifyPatternTokenName(canonical).status, "canonical");

  const invalid = VAULT_NAMING_CONTRACT.examples.invalidCustomProperties[0];
  assert.equal(classifyPatternTokenName(invalid).status, "invalid");
});

test("proof and assumption prefixes classify as canonical", () => {
  assert.equal(
    classifyPatternTokenName(VAULT_NAMING_CONTRACT.examples.proofCustomProperties[0]).status,
    "canonical",
  );
  assert.equal(
    classifyPatternTokenName(VAULT_NAMING_CONTRACT.examples.assumptionCustomProperties[0]).status,
    "canonical",
  );
});

test("pattern ID prefix classification uses generated contract examples", () => {
  for (const id of VAULT_NAMING_CONTRACT.examples.canonicalPatternIds) {
    assert.equal(classifyPatternId(id).status, "canonical");
  }
  assert.equal(classifyPatternId(VAULT_NAMING_CONTRACT.examples.invalidPatternIds[0]).status, "invalid");
});

test("deprecated bare class warnings use generated compatibility policy", () => {
  const result = classifyPublicClassName(VAULT_NAMING_CONTRACT.examples.deprecatedBareClasses[0]);
  assert.equal(result.status, VAULT_NAMING_CONTRACT.classPrefix.compatibility.bareClasses.status);
  assert.match(result.message, /Deprecated legacy class/);
});

test("deprecated legacy token warnings use generated compatibility policy", () => {
  const result = classifyPatternTokenName(VAULT_NAMING_CONTRACT.examples.deprecatedLegacyComponentTokens[0]);
  assert.equal(
    result.status,
    VAULT_NAMING_CONTRACT.customPropertyPrefix.compatibility.legacyComponentTokens.status,
  );
  assert.match(result.message, /Deprecated legacy token/);
});

test("runtime naming contract validation passes against generated data", () => {
  const output = execFileSync("node", ["scripts/check-vault-naming-contract.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  assert.match(output, /Vault naming contract check passed/);
});

test("stale generated contract detection fails when generated file differs", () => {
  const original = fs.readFileSync(GENERATED_PATH, "utf8");
  try {
    fs.writeFileSync(GENERATED_PATH, `${original}\n// stale test mutation\n`);
    assert.throws(
      () =>
        execFileSync("node", ["scripts/generate-vault-naming-contract.mjs", "--check"], {
          cwd: ROOT,
          encoding: "utf8",
          stdio: "pipe",
        }),
      /Generated naming contract is stale/,
    );
  } finally {
    fs.writeFileSync(GENERATED_PATH, original);
  }
});
