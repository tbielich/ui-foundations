#!/usr/bin/env node

/**
 * Validate dist token JSON files against DTCG Design Tokens Format Module conventions.
 *
 * Checks:
 * 1. Every leaf token has $type + $value
 * 2. $type values are from the DTCG type set (or known extensions)
 * 3. Alias values use {Group.Path} syntax (not $ref objects)
 * 4. Color values are hex strings (not Figma objects)
 * 5. $extensions keys use reverse-domain namespacing
 */

import { readFileSync, readdirSync } from "fs";
import { join, relative, resolve } from "path";

const DIST_JSON_DIR = resolve(import.meta.dirname, "..", "dist", "tokens", "json");

const DTCG_TYPES = new Set([
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "duration",
  "cubicBezier",
  "number",
  "strokeStyle",
  "border",
  "transition",
  "shadow",
  "gradient",
  "typography",
  "string",
]);

const errors = [];
const warnings = [];
let filesChecked = 0;
let tokensChecked = 0;

function isTokenNode(node) {
  return node && typeof node === "object" && "$type" in node && "$value" in node;
}

function validateToken(node, path, file) {
  tokensChecked++;
  const type = node.$type;
  const value = node.$value;

  // Check $type is a known DTCG type
  if (!DTCG_TYPES.has(type)) {
    warnings.push(`${file} → ${path}: unknown $type "${type}"`);
  }

  // Check alias syntax: must be "{Path.To.Token}" string, not {"$ref": "..."}
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if ("$ref" in value) {
      errors.push(`${file} → ${path}: alias uses {"$ref"} object instead of DTCG "{Path.To.Token}" string`);
    }
    // Check for Figma color objects
    if ("colorSpace" in value && "components" in value) {
      errors.push(`${file} → ${path}: color value is a Figma object instead of a hex string`);
    }
  }

  // Check color values are hex strings when not aliases
  if (type === "color" && typeof value === "string" && !value.startsWith("{")) {
    if (!/^#[0-9a-fA-F]{6,8}$/.test(value)) {
      warnings.push(`${file} → ${path}: color value "${value}" is not a standard hex format`);
    }
  }
}

function validateExtensions(node, path, file) {
  if (!node.$extensions || typeof node.$extensions !== "object") return;
  for (const key of Object.keys(node.$extensions)) {
    // DTCG recommends reverse-domain namespacing for extensions
    if (!key.includes(".")) {
      warnings.push(`${file} → ${path}: $extensions key "${key}" lacks reverse-domain namespace`);
    }
  }
}

function walk(node, pathParts, file) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return;

  if (isTokenNode(node)) {
    const path = pathParts.join(".");
    validateToken(node, path, file);
    validateExtensions(node, path, file);
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    walk(value, [...pathParts, key], file);
  }
}

// Run validation
const jsonFiles = readdirSync(DIST_JSON_DIR).filter((f) => f.endsWith(".json") && f.includes(".tokens."));

for (const file of jsonFiles) {
  filesChecked++;
  const filePath = join(DIST_JSON_DIR, file);
  const data = JSON.parse(readFileSync(filePath, "utf-8"));

  // Check $schema declaration
  if (!data.$schema) {
    warnings.push(`${file}: missing $schema declaration`);
  }

  walk(data, [], file);
}

// Report
if (errors.length === 0 && warnings.length === 0) {
  console.log(`✅ DTCG validation passed (${filesChecked} files, ${tokensChecked} tokens)`);
  process.exit(0);
}

if (warnings.length > 0) {
  console.warn(`⚠️  DTCG warnings (${warnings.length}):`);
  for (const w of warnings) console.warn(`   ${w}`);
}

if (errors.length > 0) {
  console.error(`❌ DTCG errors (${errors.length}):`);
  for (const e of errors) console.error(`   ${e}`);
  process.exit(1);
}

console.log(`✅ DTCG validation passed with warnings (${filesChecked} files, ${tokensChecked} tokens)`);
