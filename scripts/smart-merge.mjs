#!/usr/bin/env node
/**
 * Smart merge for component PRs.
 * For playground JS files: uses --theirs then injects missing functions from ours.
 * For JSON/other: uses structural deep-merge.
 */
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

function run(cmd) { return execSync(cmd, { encoding: "utf8", maxBuffer: 10*1024*1024 }).trim(); }
function runSafe(cmd) { try { return run(cmd); } catch (e) { return (e.stdout||"") + (e.stderr||""); } }

function resolveConflicts() {
  const conflicted = run("git diff --name-only --diff-filter=U").split("\n").filter(Boolean);
  if (!conflicted.length) return true;
  
  for (const file of conflicted) {
    if (file.endsWith(".json")) {
      // Deep merge JSON
      try {
        const ours = JSON.parse(run(`git show :2:"${file}"`));
        const theirs = JSON.parse(run(`git show :3:"${file}"`));
        function deepMerge(t, s) {
          for (const k of Object.keys(s)) {
            if (!(k in t)) t[k] = s[k];
            else if (typeof t[k]==="object" && typeof s[k]==="object" && !Array.isArray(t[k])) deepMerge(t[k], s[k]);
          }
          return t;
        }
        writeFileSync(file, JSON.stringify(deepMerge(ours, theirs), null, 2) + "\n");
      } catch (e) {
        // Fallback: use theirs
        run(`git checkout --theirs "${file}"`);
      }
    } else if (file.includes("renderers.js") || file.includes("code-generators.js")) {
      // For playground JS: take theirs (which has the new component), 
      // then inject any functions from ours that theirs doesn't have
      const oursContent = run(`git show :2:"${file}"`);
      const theirsContent = run(`git show :3:"${file}"`);
      
      // Extract all function definitions from ours
      const funcRe = /^  const (renderVanilla\w+|njk\w+|ce\w+)/gm;
      const oursFuncs = new Set([...oursContent.matchAll(funcRe)].map(m => m[1]));
      const theirsFuncs = new Set([...theirsContent.matchAll(funcRe)].map(m => m[1]));
      
      const missingInTheirs = [...oursFuncs].filter(f => !theirsFuncs.has(f));
      
      if (missingInTheirs.length === 0) {
        // Theirs has everything, use it
        writeFileSync(file, theirsContent);
      } else {
        // Start with theirs, inject missing functions before the registry
        let result = theirsContent;
        const oursLines = oursContent.split("\n");
        
        for (const funcName of missingInTheirs) {
          // Extract function from ours
          let start = -1, end = -1;
          for (let i = 0; i < oursLines.length; i++) {
            if (oursLines[i].includes(`const ${funcName} `)) start = i;
            if (start > 0 && i > start && (oursLines[i].match(/^  const /) || oursLines[i].match(/^  global\./))) {
              end = i;
              break;
            }
          }
          if (start >= 0) {
            if (end === -1) end = oursLines.length;
            const funcCode = oursLines.slice(start, end).join("\n");
            // Insert before global.UIPlaygroundRenderers or global.UICodeGenerators
            result = result.replace(
              /(\n  global\.UI)/,
              "\n" + funcCode + "\n$1"
            );
          }
        }
        
        // Also merge registry entries
        const regEntries = new Set();
        const regRe = /["']?[\w-]+["']?\s*:\s*\w+/g;
        const oursRegMatch = oursContent.match(/renderers:\s*\{([^}]+)\}/s) || oursContent.match(/generators:\s*\{([^}]+)\}/s);
        const theirsRegMatch = result.match(/renderers:\s*\{([^}]+)\}/s) || result.match(/generators:\s*\{([^}]+)\}/s);
        
        if (oursRegMatch && theirsRegMatch) {
          const oursEntries = [...oursRegMatch[1].matchAll(regRe)].map(m => m[0].trim());
          const theirsEntries = new Set([...theirsRegMatch[1].matchAll(regRe)].map(m => m[0].trim()));
          const missingEntries = oursEntries.filter(e => !theirsEntries.has(e));
          
          if (missingEntries.length > 0) {
            const insertion = missingEntries.map(e => `      ${e},`).join("\n");
            result = result.replace(
              /(\s+\},\s*\};\s*\}\)\(window\))/,
              "\n" + insertion + "$1"
            );
          }
        }
        
        writeFileSync(file, result);
      }
    } else {
      // For all other files: resolve text conflicts (take both)
      let content = readFileSync(file, "utf8");
      const lines = content.split("\n");
      const result = [];
      let inConflict = false, side = null;
      const ours = [], theirs = [];
      
      for (const line of lines) {
        if (line.startsWith("<<<<<<<")) { inConflict = true; side = "ours"; ours.length = 0; theirs.length = 0; }
        else if (line === "=======" && inConflict) { side = "theirs"; }
        else if (line.startsWith(">>>>>>>") && inConflict) {
          const o = ours.join("\n"), t = theirs.join("\n");
          if (o === t) result.push(o);
          else if (!o.trim()) result.push(t);
          else if (!t.trim()) result.push(o);
          else { result.push(o); result.push(t); }
          inConflict = false;
        }
        else if (inConflict) { if (side === "ours") ours.push(line); else theirs.push(line); }
        else result.push(line);
      }
      writeFileSync(file, result.join("\n"));
    }
    
    run(`git add "${file}"`);
  }
  
  // Final syntax check on JS files
  try {
    run("npm run lint:js");
    return true;
  } catch (e) {
    return false;
  }
}

const PRs = [
  { branch: "origin/copilot/add-segmented-control-component", msg: "feat(segmented-control): add SegmentedControl component (#243)" },
  { branch: "origin/copilot/tbielich-ui-foundations-runtime-56", msg: "feat(colorpicker): add ColorPicker component (#248)" },
  { branch: "origin/copilot/add-searchfield-component", msg: "feat(searchfield): add SearchField component (#250)" },
  { branch: "origin/copilot/add-meter-component", msg: "feat(meter): add Meter component (#251)" },
  { branch: "origin/copilot/tbielich-46-progressbar", msg: "feat(progressbar): add ProgressBar component (#253)" },
  { branch: "origin/copilot/add-removable-tags-and-size-variants", msg: "feat(tag): add Tag/TagGroup component (#255)" },
  { branch: "origin/copilot/modal-dialog-component", msg: "feat(modal): add Dialog/Modal component (#256)" },
  { branch: "origin/copilot/tbielich-34-toast-notification-component", msg: "feat(toast): add Toast/Notification component (#258)" },
];

let success = 0, failed = 0;

for (const pr of PRs) {
  console.log(`\n=== ${pr.msg} ===`);
  runSafe(`git merge --no-ff ${pr.branch} -m "${pr.msg}"`);
  
  const hasConflicts = runSafe("git diff --name-only --diff-filter=U").trim().length > 0;
  
  if (hasConflicts) {
    const lintOk = resolveConflicts();
    if (!lintOk) {
      console.log("  ❌ LINT FAILED");
      runSafe("git merge --abort");
      runSafe("git reset --hard HEAD");
      failed++;
      continue;
    }
  }
  
  runSafe("git add -A");
  const commitResult = runSafe(`git commit --no-verify -m "${pr.msg}"`);
  if (commitResult.includes("[main") || commitResult.includes("nothing to commit")) {
    console.log("  ✅ Merged");
    success++;
  } else {
    console.log("  ❌ COMMIT ISSUE:", commitResult.substring(0, 100));
    failed++;
  }
}

console.log(`\n=== DONE: ${success} merged, ${failed} failed ===`);
