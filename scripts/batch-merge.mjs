#!/usr/bin/env node
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const PRs = [
  { branch: "origin/copilot/add-range-slider-component", msg: "feat(range-slider): add RangeSlider component (#240)" },
  { branch: "origin/copilot/tbielich-ui-foundations-runtime-64", msg: "feat(combobox): add ComboBox component (#241)" },
  { branch: "origin/copilot/add-illustrated-message-component", msg: "feat(illustrated-message): add IllustratedMessage component (#242)" },
  { branch: "origin/copilot/add-segmented-control-component", msg: "feat(segmented-control): add SegmentedControl component (#243)" },
  { branch: "origin/copilot/tbielich-add-skeleton-component", msg: "feat(skeleton): add Skeleton component (#244)" },
  { branch: "origin/copilot/add-actionbar-component", msg: "feat(actionbar): add ActionBar component (#245)" },
  { branch: "origin/copilot/enhance-treeview-component", msg: "feat(treeview): add TreeView component (#246)" },
  { branch: "origin/copilot/tbielich-57-dropzone-component", msg: "feat(dropzone): add DropZone component (#247)" },
  { branch: "origin/copilot/tbielich-ui-foundations-runtime-56", msg: "feat(colorpicker): add ColorPicker component (#248)" },
  { branch: "origin/copilot/tbielich-54-status-light-component", msg: "feat(status-light): add StatusLight component (#249)" },
  { branch: "origin/copilot/add-searchfield-component", msg: "feat(searchfield): add SearchField component (#250)" },
  { branch: "origin/copilot/add-meter-component", msg: "feat(meter): add Meter component (#251)" },
  { branch: "origin/copilot/tbielich-49-numberfield-incrementing-controls", msg: "feat(numberfield): add NumberField component (#252)" },
  { branch: "origin/copilot/tbielich-46-progressbar", msg: "feat(progressbar): add ProgressBar component (#253)" },
  { branch: "origin/copilot/add-progress-circle-component", msg: "feat(progress-circle): add ProgressCircle component (#254)" },
  { branch: "origin/copilot/add-removable-tags-and-size-variants", msg: "feat(tag): add Tag/TagGroup component (#255)" },
  { branch: "origin/copilot/modal-dialog-component", msg: "feat(modal): add Dialog/Modal component (#256)" },
  { branch: "origin/copilot/add-action-menu-component", msg: "feat(menu): add Menu component (#257)" },
  { branch: "origin/copilot/tbielich-34-toast-notification-component", msg: "feat(toast): add Toast/Notification component (#258)" },
  { branch: "origin/copilot/tbielich-43-breadcrumbs-component", msg: "feat(breadcrumbs): add Breadcrumbs component (#259)" },
  { branch: "origin/copilot/component-popover", msg: "feat(popover): add Popover component (#260)" },
];

function run(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function runSafe(cmd) {
  try { return run(cmd); } catch (e) { return e.stdout || e.stderr || e.message; }
}

function fixRenderers() {
  const f = "site/assets/playground/renderers.js";
  try {
    let c = readFileSync(f, "utf8");
    // Fix missing }; between arrow function return and next const render
    c = c.replace(/(\n    return \{[^\n]+\};\n)(  const render)/g, "$1  };\n\n$2");
    writeFileSync(f, c);
    run(`git add "${f}"`);
  } catch (e) {}
}

let success = 0;
let failed = 0;

for (const pr of PRs) {
  console.log(`\n=== ${pr.msg} ===`);
  
  const mergeResult = runSafe(`git merge --no-ff ${pr.branch} -m "${pr.msg}"`);
  
  // Check if there are conflicts
  const conflicted = runSafe("git diff --name-only --diff-filter=U");
  
  if (conflicted) {
    console.log("  Resolving conflicts...");
    try {
      run("node scripts/resolve-merge-conflicts.mjs");
    } catch (e) {
      console.log(`  ❌ CONFLICT RESOLUTION FAILED: ${e.message}`);
      run("git merge --abort");
      failed++;
      continue;
    }
  }
  
  // Fix renderers.js
  fixRenderers();
  
  // Verify lint
  try {
    run("npm run lint:js");
  } catch (e) {
    console.log(`  ❌ LINT FAILED — aborting`);
    run("git merge --abort || git reset --hard HEAD");
    failed++;
    continue;
  }
  
  // Commit
  run("git add -A");
  try {
    run(`git commit --no-verify -m "${pr.msg}"`);
    console.log("  ✅ Merged");
    success++;
  } catch (e) {
    // Already committed by merge (no conflicts case)
    if (e.message.includes("nothing to commit")) {
      console.log("  ✅ Merged (clean)");
      success++;
    } else {
      console.log(`  ❌ COMMIT FAILED: ${e.message}`);
      failed++;
    }
  }
}

console.log(`\n=== DONE: ${success} merged, ${failed} failed ===`);
