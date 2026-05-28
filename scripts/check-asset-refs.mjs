#!/usr/bin/env node
/**
 * Checks that all asset references in site/ files resolve to existing files.
 * Scans .md, .njk, .html, .css files for url('/assets/...') patterns
 * and verifies the referenced files exist in src/assets/.
 */

import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const SITE_DIR = path.join(REPO_ROOT, "site");
const ASSETS_DIR = path.join(REPO_ROOT, "src", "assets");

const EXTENSIONS = [".md", ".njk", ".html", ".css"];
const REF_PATTERN = /url\(['"]?\/?assets\/([^'")\s]+)['"]?\)/g;

let errors = 0;
let checked = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const relative = path.relative(REPO_ROOT, filePath);
  let match;

  REF_PATTERN.lastIndex = 0;
  while ((match = REF_PATTERN.exec(content)) !== null) {
    checked++;
    const assetPath = match[1];
    const resolved = path.join(ASSETS_DIR, assetPath);
    if (!fs.existsSync(resolved)) {
      console.error(`❌ ${relative}: missing asset "${assetPath}"`);
      errors++;
    }
  }
}

const files = walk(SITE_DIR);
for (const file of files) {
  checkFile(file);
}

if (errors > 0) {
  console.error(`\n${errors} broken asset reference(s) found in ${checked} checked.`);
  process.exit(1);
} else {
  console.log(`✅ All ${checked} asset references valid.`);
}
