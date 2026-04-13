import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import fg from "fast-glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const PATTERNS = [
  ".eleventy.js",
  "scripts/**/*.{js,mjs,cjs}",
  "site/**/*.js",
  "src/**/*.js",
  "figma/connections/**/*.{js,mjs,cjs}",
];

function getFiles() {
  return fg.sync(PATTERNS, {
    cwd: REPO_ROOT,
    onlyFiles: true,
    unique: true,
    ignore: ["node_modules/**", "dist/**", "_site/**"],
  });
}

function isLikelyEsm(source) {
  return /^\s*(import\s|export\s)/m.test(source);
}

function runNodeCheck(filePath) {
  const source = fs.readFileSync(filePath, "utf8");

  if (isLikelyEsm(source)) {
    return spawnSync(process.execPath, ["--input-type=module", "--check"], {
      cwd: REPO_ROOT,
      stdio: "pipe",
      encoding: "utf8",
      input: source,
    });
  }

  return spawnSync(process.execPath, ["--check", filePath], {
    cwd: REPO_ROOT,
    stdio: "pipe",
    encoding: "utf8",
  });
}

function lint() {
  const files = getFiles();
  if (files.length === 0) {
    console.log("✅ No JS files matched lint patterns.");
    return;
  }

  const failures = [];

  for (const relativePath of files) {
    const absolutePath = path.join(REPO_ROOT, relativePath);
    if (!fs.existsSync(absolutePath)) continue;

    const result = runNodeCheck(absolutePath);
    if (result.status !== 0) {
      failures.push({
        file: relativePath,
        output: (result.stderr || result.stdout || "").trim(),
      });
    }
  }

  if (failures.length > 0) {
    console.error(`❌ JS syntax lint failed (${failures.length} files):`);
    for (const failure of failures) {
      console.error(`\n- ${failure.file}`);
      if (failure.output) {
        console.error(failure.output);
      }
    }
    process.exit(1);
  }

  console.log(`✅ JS syntax lint passed (${files.length} files)`);
}

lint();
