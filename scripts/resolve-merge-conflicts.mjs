#!/usr/bin/env node
/**
 * Resolves merge conflicts in ui-foundations-runtime.
 * Strategy: for every conflict hunk, take BOTH sides (ours then theirs).
 * For JSON files, do a structural deep-merge using parsed JSON instead.
 */
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const conflictedFiles = execSync("git diff --name-only --diff-filter=U", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);

console.log(`Resolving ${conflictedFiles.length} conflicted files...`);

function resolveTextConflicts(content) {
  const lines = content.split("\n");
  const result = [];
  let inConflict = false;
  let side = null; // 'ours' | 'theirs'
  const ours = [];
  const theirs = [];

  for (const line of lines) {
    if (line.startsWith("<<<<<<<")) {
      inConflict = true;
      side = "ours";
      ours.length = 0;
      theirs.length = 0;
    } else if (line.startsWith("=======") && inConflict) {
      side = "theirs";
    } else if (line.startsWith(">>>>>>>") && inConflict) {
      // Emit both sides
      // Deduplicate if identical
      const oursStr = ours.join("\n");
      const theirsStr = theirs.join("\n");
      if (oursStr === theirsStr) {
        result.push(oursStr);
      } else if (oursStr.trim() === "") {
        result.push(theirsStr);
      } else if (theirsStr.trim() === "") {
        result.push(oursStr);
      } else {
        result.push(oursStr);
        result.push(theirsStr);
      }
      inConflict = false;
      side = null;
    } else if (inConflict) {
      if (side === "ours") ours.push(line);
      else theirs.push(line);
    } else {
      result.push(line);
    }
  }
  return result.join("\n");
}

function resolveJsonStructural(file) {
  // Get ours and theirs versions using git
  const ours = execSync(`git show :2:"${file}"`, { encoding: "utf8" });
  const theirs = execSync(`git show :3:"${file}"`, { encoding: "utf8" });
  
  const oursObj = JSON.parse(ours);
  const theirsObj = JSON.parse(theirs);
  
  // Deep merge: theirs additions go into ours
  function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (!(key in target)) {
        target[key] = source[key];
      } else if (typeof target[key] === "object" && typeof source[key] === "object" && !Array.isArray(target[key])) {
        deepMerge(target[key], source[key]);
      }
      // If both have same key with different primitives, keep ours (target)
    }
    return target;
  }
  
  const merged = deepMerge(oursObj, theirsObj);
  return JSON.stringify(merged, null, 2) + "\n";
}

for (const file of conflictedFiles) {
  let resolved;
  
  if (file.endsWith(".json")) {
    try {
      resolved = resolveJsonStructural(file);
    } catch (e) {
      console.log(`  ⚠ ${file}: JSON merge failed (${e.message}), using text merge`);
      resolved = resolveTextConflicts(readFileSync(file, "utf8"));
    }
  } else {
    resolved = resolveTextConflicts(readFileSync(file, "utf8"));
  }
  
  writeFileSync(file, resolved);
  execSync(`git add "${file}"`);
  console.log(`  ✓ ${file}`);
}

console.log("Done.");
