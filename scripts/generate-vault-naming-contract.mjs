#!/usr/bin/env node

import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const CONTRACT_PATH = path.join(REPO_ROOT, ".uif/packs/governance/contracts/naming-contract.json");
const OUTPUT_PATH = path.join(REPO_ROOT, "scripts/vault-naming-contract.generated.js");
const PATTERNS_DIR = path.join(REPO_ROOT, "src/ui/patterns");

function readContract() {
  const raw = fs.readFileSync(CONTRACT_PATH, "utf8");
  return JSON.parse(raw);
}

function assertField(value, fieldPath, errors) {
  if (value === undefined || value === null || value === "") {
    errors.push(`Missing required naming contract field: ${fieldPath}`);
  }
}

function localLegacyComponentNames() {
  return fs
    .readdirSync(PATTERNS_DIR)
    .filter((file) => file.endsWith(".css"))
    .map((file) => file.replace(/\.css$/, ""))
    .sort();
}

function sourceArtifacts(contract) {
  const artifacts = new Set([".uif/packs/governance/contracts/naming-contract.json"]);
  for (const artifact of contract.source?.sourceArtifacts || []) {
    artifacts.add(artifact);
  }
  for (const source of contract.source_metadata?.canonical_sources || []) {
    if (!source.path) continue;
    artifacts.add(`.uif/packs/governance/${source.path}`);
  }
  artifacts.add(".uif/packs/governance/registry/governance-packs.yml");
  artifacts.add(".uif/packs/governance/exports/governance-pack/pack.yml");
  return [...artifacts].sort();
}

function examplesByKind(contract) {
  const examples = {};
  for (const example of contract.non_normative_examples || []) {
    if (!example.kind || !example.value) continue;
    if (!examples[example.kind]) examples[example.kind] = [];
    examples[example.kind].push(example.value);
  }
  return examples;
}

function normalizeContract(contract) {
  if (contract.kind === "UIFNamingContract") return contract;

  const examples = examplesByKind(contract);
  const classPrefix = contract.rules?.css_class_prefix?.prefix;
  const customPropertyPrefix = contract.rules?.css_custom_property_prefix?.prefix;
  const proofPrefix = contract.rules?.proof_token_prefix?.prefix;
  const assumptionPrefix = contract.rules?.assumption_token_prefix?.prefix;
  const patternPrefixes = contract.rules?.pattern_id_prefixes || {};
  const deprecatedPolicy = contract.rules?.compatibility_and_deprecation_policy || {};

  return {
    kind: "UIFNamingContract",
    source: {
      packId: "governance-pack",
      packVersion: contract.governance_pack_version,
      versionRef: null,
      sourceArtifacts: sourceArtifacts(contract),
    },
    classPrefix: {
      canonical: classPrefix,
      invalidPrefixes: [],
      compatibility: {
        bareClasses: {
          status: "deprecated",
          mode: "warning",
          sourcePolicy: deprecatedPolicy.deprecated_names,
          message:
            'Deprecated legacy class "{value}" uses an unscoped component class. Migrate to "{canonicalClass}" and chained variant/state classes.',
        },
      },
    },
    customPropertyPrefix: {
      canonical: customPropertyPrefix,
      proof: proofPrefix,
      assumption: assumptionPrefix,
      compatibility: {
        legacyComponentTokens: {
          status: "deprecated",
          mode: "warning",
          sourcePolicy: deprecatedPolicy.deprecated_names,
          message:
            'Deprecated legacy token "{value}" uses an unscoped component prefix. Migrate to "{canonicalTokenWildcard}" from the Vault Naming Contract.',
        },
      },
    },
    patternIdPrefixes: [
      patternPrefixes.base_pattern,
      patternPrefixes.composition_pattern,
      patternPrefixes.product_pattern,
    ].filter(Boolean),
    runtimeCompatibilityInputs: {
      legacyComponentNames: localLegacyComponentNames(),
    },
    examples: {
      note: contract.normativity?.examples_are_normative === false
        ? "Examples illustrate the contract for runtime validation and documentation. They are not source rules."
        : "Examples are provided by the consumed naming contract.",
      canonicalClasses: examples.public_component_class || [],
      deprecatedBareClasses: ["button", "calendar-cell"],
      invalidClasses: ["ui-button"],
      canonicalCustomProperties: examples.component_token_slot || [],
      proofCustomProperties: examples.proof_token || [],
      assumptionCustomProperties: examples.assumption_token || [],
      deprecatedLegacyComponentTokens: ["--button-container-background-default"],
      invalidCustomProperties: ["--foundation-button-background"],
      canonicalPatternIds: [
        ...(examples.base_pattern_id || []),
        ...(examples.composition_pattern_id || []),
      ],
      invalidPatternIds: ["base.button"],
    },
  };
}

function validateContract(contract) {
  const errors = [];
  assertField(contract.kind, "kind", errors);
  assertField(contract.source?.packId, "source.packId", errors);
  assertField(contract.source?.packVersion, "source.packVersion", errors);
  assertField(contract.classPrefix?.canonical, "classPrefix.canonical", errors);
  assertField(contract.customPropertyPrefix?.canonical, "customPropertyPrefix.canonical", errors);
  assertField(contract.customPropertyPrefix?.proof, "customPropertyPrefix.proof", errors);
  assertField(contract.customPropertyPrefix?.assumption, "customPropertyPrefix.assumption", errors);

  if (!Array.isArray(contract.patternIdPrefixes) || contract.patternIdPrefixes.length === 0) {
    errors.push("patternIdPrefixes must be a non-empty array.");
  }
  if (!Array.isArray(contract.runtimeCompatibilityInputs?.legacyComponentNames)) {
    errors.push("runtimeCompatibilityInputs.legacyComponentNames must be an array.");
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}

function generatedContent(contract) {
  return `// Generated by scripts/generate-vault-naming-contract.mjs from .uif/packs/governance/contracts/naming-contract.json.
// Do not edit by hand.

const VAULT_NAMING_CONTRACT = Object.freeze(${JSON.stringify(stable(contract), null, 2)});

module.exports = {
  VAULT_NAMING_CONTRACT,
};
`;
}

function main() {
  const contract = normalizeContract(readContract());
  validateContract(contract);
  const next = generatedContent(contract);
  const check = process.argv.includes("--check");

  if (check) {
    const current = fs.existsSync(OUTPUT_PATH) ? fs.readFileSync(OUTPUT_PATH, "utf8") : "";
    if (current !== next) {
      console.error("Generated naming contract is stale. Run `npm run naming:generate`.");
      process.exit(1);
    }
    console.log("Generated naming contract is up to date.");
    return;
  }

  fs.writeFileSync(OUTPUT_PATH, next);
  console.log(`Generated ${path.relative(REPO_ROOT, OUTPUT_PATH)}`);
}

main();
