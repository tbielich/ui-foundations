#!/usr/bin/env node

/**
 * Sync design tokens from Figma variables to local export files.
 *
 * This script uses the Figma Plugin API (via the MCP figma tool) output
 * dumped to a temp file to rebuild figma/exports/*.tokens.json files.
 *
 * Usage (two-step workflow):
 *   1. Agent runs the Figma dump code via MCP use_figma → saves to .figma-token-dump.json
 *   2. node scripts/sync-figma-tokens.mjs
 *
 * Or combined:
 *   npm run tokens:sync  (reads existing dump and regenerates exports + pipeline)
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..");
const EXPORTS_DIR = join(REPO_ROOT, "figma", "exports");

// Collection name → export filename mapping
const COLLECTION_FILES = {
  "Components (UI)": "Components (UI).tokens.json",
  "Core (Primitives)": "Core (Primitives).tokens.json",
  "Semantics (Roles)": "Semantics (Roles).tokens.json",
  "Appearance (Modes)": "Appearance (Modes).tokens.json",
  "Themes (Brands)": "Themes (Brands).tokens.json",
};

/**
 * Parse the raw variable dump from Figma into DTCG-formatted JSON.
 * Each variable becomes a nested token following its path segments.
 */
function buildDTCGFromVariables(variables) {
  const result = {};

  for (const v of variables) {
    const segments = v.name.split("/");
    const entry = buildTokenEntry(v);

    // Navigate/create nested structure
    let current = result;
    for (let i = 0; i < segments.length - 1; i++) {
      if (!current[segments[i]]) current[segments[i]] = {};
      current = current[segments[i]];
    }
    current[segments[segments.length - 1]] = entry;
  }

  return result;
}

/**
 * Build a single DTCG token entry from a Figma variable dump.
 */
function buildTokenEntry(v) {
  // Determine $type
  let type;
  if (v.resolvedType === "COLOR") type = "color";
  else if (v.resolvedType === "FLOAT") type = "number";
  else if (v.resolvedType === "STRING") type = "string";
  else type = "unknown";

  // Determine $value
  let tokenValue;
  let aliasData = null;

  if (v.alias) {
    tokenValue = { $ref: v.alias.targetName };
    aliasData = {
      targetVariableId: v.alias.targetId,
      targetVariableName: v.alias.targetName,
      targetVariableSetId: v.alias.targetCollectionId,
      targetVariableSetName: v.alias.targetCollectionName,
    };
  } else if (typeof v.value === "number") {
    // Check if it should be a dimension (height/width tokens)
    const leaf = v.name.split("/").pop().toLowerCase();
    if (leaf.includes("height") || leaf.includes("width")) {
      tokenValue = { value: v.value, unit: "px" };
      type = "dimension";
    } else {
      tokenValue = v.value;
    }
  } else if (typeof v.value === "string") {
    tokenValue = v.value;
  } else if (v.value && typeof v.value === "object" && "r" in v.value) {
    // Raw color object → hex
    const r = Math.round(v.value.r * 255);
    const g = Math.round(v.value.g * 255);
    const b = Math.round(v.value.b * 255);
    tokenValue = "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
  } else {
    tokenValue = v.value;
  }

  // Build $extensions
  const extensions = {
    "com.figma.variableId": v.id,
    "com.figma.scopes": v.scopes || ["ALL_SCOPES"],
    "com.figma.codeSyntax": { WEB: v.webSyntax || "" },
  };

  if (aliasData) {
    extensions["com.figma.aliasData"] = aliasData;
    extensions["com.figma.isOverride"] = true;
  }

  // Handle mode values if present
  if (v.modeValues) {
    extensions["com.figma.modeValues"] = v.modeValues;
  }

  return { $type: type, $value: tokenValue, $extensions: extensions };
}

/**
 * Main entry point.
 * Reads from a pre-generated dump file (created by the Figma plugin via MCP).
 * Supports partial syncs: if only some collections are in the dump, only those are updated.
 */
function main() {
  const dumpPath = join(REPO_ROOT, ".figma-token-dump.json");

  if (!existsSync(dumpPath)) {
    console.error("❌ No Figma token dump found at .figma-token-dump.json");
    console.error("");
    console.error("To generate the dump, ask the agent to run the Figma export code");
    console.error("from scripts/dump-figma-variables.mjs via MCP use_figma,");
    console.error("then save the output to .figma-token-dump.json");
    process.exit(1);
  }

  const dump = JSON.parse(readFileSync(dumpPath, "utf8"));

  let filesWritten = 0;

  for (const [collectionName, fileName] of Object.entries(COLLECTION_FILES)) {
    const variables = dump[collectionName];
    if (!variables || variables.length === 0) {
      // Skip silently — partial sync is fine
      continue;
    }

    const dtcg = buildDTCGFromVariables(variables);
    const outPath = join(EXPORTS_DIR, fileName);
    writeFileSync(outPath, JSON.stringify(dtcg, null, 2) + "\n");
    console.log(`✅ ${fileName} (${variables.length} variables)`);
    filesWritten++;
  }

  if (filesWritten === 0) {
    console.error("❌ No files written. Check dump format.");
    process.exit(1);
  }

  console.log(`\n📁 ${filesWritten} export files written to figma/exports/`);
  console.log("🔄 Running token pipeline...\n");

  try {
    execSync("npm run tokens:generate", { cwd: REPO_ROOT, stdio: "inherit" });
    console.log("\n✅ Token sync complete!");
  } catch (e) {
    console.error("\n❌ Token generation failed. Check errors above.");
    process.exit(1);
  }
}

main();
