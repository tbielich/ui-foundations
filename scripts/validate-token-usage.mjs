#!/usr/bin/env node
/**
 * Validate that all var(--*) references in CSS patterns resolve to tokens
 * defined in the generated token CSS, or are explicitly allowlisted as
 * code-only extension points.
 *
 * Fails CI if a pattern references a token that doesn't exist in dist/tokens/css.
 */

import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { classifyPatternTokenName } = require("./vault-naming-contract.js");

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const PATTERNS_DIR = path.join(REPO_ROOT, "src", "ui", "patterns");
const TOKENS_CSS_DIR = path.join(REPO_ROOT, "dist", "tokens", "css");

// Tokens that are intentionally code-only (set dynamically or use CSS fallbacks)
const ALLOWLIST = new Set([
  "--uif-divider-color",
  "--uif-field-label-gap",
  "--uif-field-label-line-height",
  "--uif-field-label-required-color",
  "--uif-icon-src",
  "--uif-range-slider-text-color-default",
  "--uif-range-slider-text-color-disabled",
  "--uif-range-slider-font-family",
  "--uif-range-slider-font-weight",
  "--uif-range-slider-font-size",
  "--uif-range-slider-line-height",
  "--uif-range-slider-gap",
  "--uif-range-slider-track-background-default",
  "--uif-range-slider-track-background-disabled",
  "--uif-range-slider-track-border-radius",
  "--uif-range-slider-track-height",
  "--uif-range-slider-range-background-default",
  "--uif-range-slider-range-background-disabled",
  "--uif-range-slider-thumb-size",
  "--uif-range-slider-thumb-background-default",
  "--uif-range-slider-thumb-background-hover",
  "--uif-range-slider-thumb-background-active",
  "--uif-range-slider-thumb-background-disabled",
  "--uif-range-slider-thumb-border-size-default",
  "--uif-range-slider-thumb-border-color-default",
  "--uif-range-slider-thumb-border-color-hover",
  "--uif-range-slider-thumb-border-color-active",
  "--uif-range-slider-thumb-border-color-focus",
  "--uif-range-slider-thumb-border-color-disabled",
]);

function getDefinedTokens() {
  if (!fs.existsSync(TOKENS_CSS_DIR)) {
    console.error(`❌ Missing ${path.relative(REPO_ROOT, TOKENS_CSS_DIR)}. Run "npm run tokens:generate" first.`);
    process.exit(1);
  }

  const tokens = new Set();
  const files = fs.readdirSync(TOKENS_CSS_DIR).filter((f) => f.endsWith(".css"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(TOKENS_CSS_DIR, file), "utf8");
    const matches = content.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm);
    for (const match of matches) {
      tokens.add(match[1]);
    }
  }

  return tokens;
}

function getUsedTokens() {
  const usage = [];
  const files = fs.readdirSync(PATTERNS_DIR).filter((f) => f.endsWith(".css"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(PATTERNS_DIR, file), "utf8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const matches = lines[i].matchAll(/var\((--[a-z0-9-]+)/g);
      for (const match of matches) {
        usage.push({ token: match[1], file, line: i + 1 });
      }
    }
  }

  return usage;
}

function run() {
  const defined = getDefinedTokens();
  const usage = getUsedTokens();
  const errors = [];
  const warnings = [];

  for (const ref of usage) {
    if (defined.has(ref.token)) continue;
    if (ALLOWLIST.has(ref.token)) continue;
    errors.push(ref);
  }

  for (const ref of usage) {
    const classification = classifyPatternTokenName(ref.token);
    if (classification.status === "deprecated") {
      warnings.push({ ...ref, message: classification.message });
    }
  }

  if (errors.length > 0) {
    console.error(`❌ ${errors.length} token reference(s) not found in generated CSS:\n`);
    for (const err of errors) {
      console.error(`   ${err.file}:${err.line} → ${err.token}`);
    }
    console.error(`\nFix options:`);
    console.error(`  1. Add the token to Figma and re-export`);
    console.error(`  2. Rename the var() reference to match an existing token`);
    console.error(`  3. Add to ALLOWLIST in this script if intentionally code-only`);
    process.exit(1);
  }

  const uniqueWarnings = [
    ...new Map(warnings.map((warning) => [`${warning.file}:${warning.line}:${warning.token}`, warning])).values(),
  ];
  for (const warning of uniqueWarnings) {
    console.warn(`⚠️  ${warning.file}:${warning.line} → ${warning.message}`);
  }

  console.log(`✅ Token usage validated (${usage.length} references, ${defined.size} defined tokens)`);
}

run();
