#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const {
  VAULT_NAMING_CONTRACT,
  classifyPatternTokenName,
  classifyPublicClassName,
} = require("./vault-naming-classifier.js");

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const CONTRACT_PATH = ".uif/packs/governance/contracts/naming-contract.json";

function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

function fail(errors) {
  console.error("Vault naming contract check failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

function requireEqual(left, right, label, errors) {
  if (left !== right) errors.push(`${label} mismatch: ${left} !== ${right}`);
}

const errors = [];
const warnings = [];

if (!fs.existsSync(path.join(REPO_ROOT, CONTRACT_PATH))) {
  fail([`Missing consumed Vault naming contract artifact: ${CONTRACT_PATH}`]);
}

const sourceContract = JSON.parse(read(CONTRACT_PATH));
requireEqual(
  VAULT_NAMING_CONTRACT.source.packId,
  sourceContract.source?.packId || "governance-pack",
  "source.packId",
  errors,
);
requireEqual(
  VAULT_NAMING_CONTRACT.source.packVersion,
  sourceContract.source?.packVersion || sourceContract.governance_pack_version,
  "source.packVersion",
  errors,
);
if (sourceContract.source?.versionRef?.value) {
  requireEqual(
    VAULT_NAMING_CONTRACT.source.versionRef?.value,
    sourceContract.source.versionRef.value,
    "source.versionRef.value",
    errors,
  );
}

for (const relativePath of VAULT_NAMING_CONTRACT.source.sourceArtifacts || []) {
  if (!fs.existsSync(path.join(REPO_ROOT, relativePath))) {
    errors.push(`Missing consumed Vault source artifact: ${relativePath}`);
  }
}

try {
  execFileSync(process.execPath, ["scripts/generate-vault-naming-contract.mjs", "--check"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
} catch (error) {
  errors.push(String(error.stdout || error.stderr || error.message).trim());
}

const scanFiles = [
  ...fs.readdirSync(path.join(REPO_ROOT, "src", "ui", "patterns")).map((file) => `src/ui/patterns/${file}`),
  "site/getting-started.md",
  "site/foundations/class-naming.md",
  "site/foundations/design-tokens.md",
  "docs/foundations/foundation-013-class-naming.md",
  "docs/agentic/assistant-behavior-rules.md",
  "IMPLEMENTATION.md",
];

for (const relativePath of scanFiles) {
  if (!relativePath.endsWith(".css") && !relativePath.endsWith(".md")) continue;
  const content = read(relativePath);
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    for (const match of line.matchAll(/var\((--[a-z0-9-]+)/g)) {
      const result = classifyPatternTokenName(match[1]);
      if (result.status === "deprecated") warnings.push(`${relativePath}:${index + 1} ${result.message}`);
    }
    for (const match of line.matchAll(/`(--[a-z][a-z0-9-]+-\*)`|`(--[a-z][a-z0-9-]+-[a-z0-9-]+)`/g)) {
      const token = match[1] || match[2];
      const result = classifyPatternTokenName(token.replace(/\*$/, "example"));
      if (result.status === "deprecated") warnings.push(`${relativePath}:${index + 1} ${result.message}`);
    }
    for (const match of line.matchAll(/class="([^"]+)"/g)) {
      for (const className of match[1].split(/\s+/)) {
        if (!className || className.startsWith("docs-") || className.startsWith("playground-")) continue;
        const result = classifyPublicClassName(className);
        if (result.status === "deprecated") warnings.push(`${relativePath}:${index + 1} ${result.message}`);
      }
    }
  });
}

if (errors.length > 0) fail(errors);

const uniqueWarnings = [...new Set(warnings)];
for (const warning of uniqueWarnings) console.warn(`Naming deprecation warning: ${warning}`);
console.log(`Vault naming contract check passed (${uniqueWarnings.length} legacy usage warnings).`);
