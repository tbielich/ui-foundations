import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(REPO_ROOT, "dist");
const DIST_TOKENS_DIR = path.join(DIST_DIR, "tokens", "css");

function copyDir(source, destination) {
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(destination, { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function inlineImports(filePath, seen = new Set()) {
  if (seen.has(filePath)) return "";
  seen.add(filePath);

  const baseDir = path.dirname(filePath);
  const css = fs.readFileSync(filePath, "utf8");

  return css.replace(
    /@import\s+url\(["']([^"']+)["']\)\s*layer\([^)]+\);\s*/g,
    (match, importPath) => {
      if (importPath.startsWith("http")) return match;
      const resolved = path.resolve(baseDir, importPath);
      if (!fs.existsSync(resolved)) return match;
      return inlineImports(resolved, seen);
    },
  );
}

function hoistRemoteImports(css) {
  const importPattern =
    /@import\s+url\(["']https?:\/\/[^"']+["']\)\s*(?:layer\([^)]+\))?\s*;/g;
  const found = css.match(importPattern) || [];
  if (found.length === 0) return css;

  const uniqueImports = [...new Set(found)];
  const withoutImports = css.replace(importPattern, "").trimStart();

  return `${uniqueImports.join("\n")}\n${withoutImports}`;
}

function scopePriority(scope) {
  if (scope.bucket === "other" && scope.id === "core") return 0;
  if (scope.bucket === "other" && scope.id === "core-primitives") return 0;
  if (scope.bucket === "other" && scope.id === "primitives") return 0;
  if (scope.bucket === "brand") return 1;
  if (scope.bucket === "other" && scope.id.includes("semantic")) return 2;
  if (scope.bucket === "other" && scope.id.includes("component")) return 3;
  if (scope.bucket === "mode" && scope.id === "light") return 4;
  if (scope.bucket === "mode" && scope.id === "dark") return 5;
  return 9;
}

function parseScopeFromTokenCss(fileName) {
  const lower = String(fileName || "").toLowerCase();

  const brandMatch = lower.match(/^brand[.-]([a-z0-9-]+)\.tokens\.css$/);
  if (brandMatch) {
    return { bucket: "brand", id: brandMatch[1] };
  }

  const modeColorMatch = lower.match(/^color\.([a-z0-9-]+)\.tokens\.css$/);
  if (modeColorMatch) {
    return { bucket: "mode", id: modeColorMatch[1] };
  }

  const modeMatch = lower.match(/^mode\.([a-z0-9-]+)\.tokens\.css$/);
  if (modeMatch) {
    return { bucket: "mode", id: modeMatch[1] };
  }

  if (lower === "core.tokens.css") return { bucket: "other", id: "core" };
  if (lower === "semantic.tokens.css") {
    return { bucket: "other", id: "semantic" };
  }
  if (lower === "component.tokens.css") {
    return { bucket: "other", id: "component" };
  }

  const generic = lower.match(/^(.*)\.tokens\.css$/);
  return { bucket: "other", id: generic ? generic[1] : "misc" };
}

function getTokenCssFilesFromDist() {
  if (!fs.existsSync(DIST_TOKENS_DIR)) {
    throw new Error(
      'Missing generated token directory: dist/tokens/css. Run "npm run tokens:generate" first.',
    );
  }

  const tokenFiles = fs
    .readdirSync(DIST_TOKENS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.tokens(\.[a-z0-9-]+)?\.css$/i.test(entry.name))
    .map((entry) => ({
      fileName: entry.name,
      scope: parseScopeFromTokenCss(entry.name),
    }));

  if (tokenFiles.length === 0) {
    throw new Error(
      'No generated token CSS files found in dist/tokens/css. Run "npm run tokens:generate" first.',
    );
  }

  tokenFiles.sort((a, b) => {
    const priorityDiff = scopePriority(a.scope) - scopePriority(b.scope);
    if (priorityDiff !== 0) return priorityDiff;
    return a.fileName.localeCompare(b.fileName);
  });

  return tokenFiles;
}

function writeModeCssBaseline() {
  const modePath = path.join(DIST_DIR, "core", "themes", "mode.css");
  if (!fs.existsSync(modePath)) return;

  writeFile(
    modePath,
    [
      "@layer themes {",
      "  :root {",
      "    color-scheme: light dark;",
      "  }",
      "}",
      "",
    ].join("\n"),
  );
}

function buildCoreBundle(tokenFiles) {
  copyDir(path.join(REPO_ROOT, "src", "core"), path.join(DIST_DIR, "core"));

  const tokenImports = tokenFiles.map(
    (entry) => `@import url("../tokens/css/${entry.fileName}") layer(tokens);`,
  );

  writeFile(
    path.join(DIST_DIR, "core", "index.css"),
    [
      '@import url("./base/reset.css") layer(reset);',
      '@import url("./base/fonts.css") layer(base);',
      '@import url("./base/base.css") layer(base);',
      '@import url("./base/typography.css") layer(base);',
      ...tokenImports,
      '@import url("./themes/mode.css") layer(themes);',
      "",
    ].join("\n"),
  );

  writeModeCssBaseline();
}

function buildUiBundle() {
  copyDir(path.join(REPO_ROOT, "src", "ui"), path.join(DIST_DIR, "ui"));
}

function buildReactBundle() {
  copyDir(path.join(REPO_ROOT, "src", "react"), path.join(DIST_DIR, "react"));
}

function buildAssetsBundle() {
  copyDir(path.join(REPO_ROOT, "src", "assets"), path.join(DIST_DIR, "assets"));
}

function buildDocs() {
  const tokenFiles = getTokenCssFilesFromDist();
  console.log("♻️  Using pre-generated token CSS from dist/tokens/css");
  console.log(`   • ${tokenFiles.length} files`);

  buildCoreBundle(tokenFiles);
  buildUiBundle();
  buildReactBundle();
  buildAssetsBundle();

  const coreCss = inlineImports(path.join(DIST_DIR, "core", "index.css"));
  const uiCss = inlineImports(path.join(DIST_DIR, "ui", "index.css"));
  const bundledCss = hoistRemoteImports(`${coreCss}\n${uiCss}`);
  writeFile(path.join(DIST_DIR, "main.css"), bundledCss);

  console.log("✅ Dist bundles generated in dist/");
}

try {
  buildDocs();
} catch (error) {
  console.error("❌ Error building CSS bundles:", error.message);
  process.exit(1);
}
