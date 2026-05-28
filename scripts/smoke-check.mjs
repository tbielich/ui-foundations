import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function ensureFile(relativePath, options = {}) {
  const fullPath = path.join(REPO_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    fail(`Missing required file: ${relativePath}`);
  }

  const content = fs.readFileSync(fullPath, "utf8");
  if (options.nonEmpty && content.trim().length === 0) {
    fail(`File is empty: ${relativePath}`);
  }
  if (options.mustInclude && !content.includes(options.mustInclude)) {
    fail(
      `Unexpected content in ${relativePath}: missing "${options.mustInclude}"`,
    );
  }
}

function ensureTokenCssFiles(minCount = 5) {
  const tokenCssDir = path.join(REPO_ROOT, "dist", "tokens", "css");
  if (!fs.existsSync(tokenCssDir)) {
    fail("Missing dist/tokens/css");
  }

  const files = fs
    .readdirSync(tokenCssDir)
    .filter((name) => name.endsWith(".css") && name.includes(".tokens"));

  if (files.length < minCount) {
    fail(
      `Expected at least ${minCount} token CSS files in dist/tokens/css, found ${files.length}`,
    );
  }
}

function run() {
  ensureFile("dist/main.css", { nonEmpty: true, mustInclude: ".button" });
  ensureFile("dist/tokens/tokens.yaml", {
    nonEmpty: true,
    mustInclude: "tokens:",
  });
  ensureFile("dist/tokens/json/components-ui.tokens.json", {
    nonEmpty: true,
  });
  ensureFile("dist/react/index.js", { nonEmpty: true });
  ensureTokenCssFiles();

  console.log("✅ Smoke checks passed");
}

run();
