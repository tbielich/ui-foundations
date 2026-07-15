import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
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
  const resolved = path.resolve(filePath);
  if (seen.has(resolved)) return "";
  seen.add(resolved);

  const baseDir = path.dirname(filePath);
  const css = fs.readFileSync(filePath, "utf8");

  return css.replace(
    /@import\s+url\(["']([^"']+)["']\)\s*layer\([^)]+\);\s*/g,
    (match, importPath) => {
      if (importPath.startsWith("http")) return match;
      const resolved = path.resolve(baseDir, importPath);
      if (!fs.existsSync(resolved)) {
        console.warn(`⚠️  Missing CSS import: ${importPath} (resolved: ${resolved})`);
        return match;
      }
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
  if (scope.bucket === "mode" && scope.id === "light") return 1;
  if (scope.bucket === "mode" && scope.id === "dark") return 2;
  if (scope.bucket === "mode") return 2;
  if (scope.bucket === "brand") return 3;
  if (scope.bucket === "other" && scope.id.includes("semantic")) return 3;
  if (scope.bucket === "other" && scope.id.includes("component")) return 4;
  if (scope.bucket === "other" && scope.id.includes("pattern")) return 4;
  return 9;
}

function parseScopeFromTokenCss(fileName) {
  const lower = String(fileName || "").toLowerCase();

  const brandMatch = lower.match(/^brand[.-]([a-z0-9-]+)\.tokens\.css$/);
  if (brandMatch) {
    return { bucket: "brand", id: brandMatch[1] };
  }

  const brandSemanticsMatch = lower.match(/^semantics-brands\.tokens\.brand-([a-z0-9-]+)\.css$/);
  if (brandSemanticsMatch) {
    return { bucket: "brand", id: brandSemanticsMatch[1] };
  }

  const modeColorMatch = lower.match(/^color\.([a-z0-9-]+)\.tokens\.css$/);
  if (modeColorMatch) {
    return { bucket: "mode", id: modeColorMatch[1] };
  }

  const appearanceModeMatch = lower.match(/^appearance-modes\.tokens\.mode-([a-z0-9-]+)\.css$/);
  if (appearanceModeMatch) {
    return { bucket: "mode", id: appearanceModeMatch[1] };
  }

  const typographyModeMatch = lower.match(/^typography-fluid\.tokens\.mode-([a-z0-9-]+)\.css$/);
  if (typographyModeMatch) {
    return { bucket: "mode", id: typographyModeMatch[1] };
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
  const modePath = path.join(DIST_DIR, "core", "context", "mode.css");
  if (!fs.existsSync(modePath)) return;

  writeFile(
    modePath,
    [
      "@layer context {",
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
      '@import url("./context/mode.css") layer(context);',
      "",
    ].join("\n"),
  );

  writeModeCssBaseline();
}

function buildUiBundle() {
  copyDir(path.join(REPO_ROOT, "src", "ui"), path.join(DIST_DIR, "ui"));
}

function removeRetiredBundleArtifacts() {
  fs.rmSync(path.join(DIST_DIR, "react"), { recursive: true, force: true });
}

function buildElementsBundle() {
  copyDir(path.join(REPO_ROOT, "src", "elements"), path.join(DIST_DIR, "elements"));
}

function buildAssetsBundle() {
  copyDir(path.join(REPO_ROOT, "src", "assets"), path.join(DIST_DIR, "assets"));
}

function buildMacrosBundle() {
  const src = path.join(REPO_ROOT, "site", "_includes", "macros", "ui.njk");
  const dest = path.join(DIST_DIR, "macros");
  if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(src, path.join(dest, "ui.njk"));
    console.log("✅ Macros copied to dist/macros/");
  }
}

function buildDocs() {
  const tokenFiles = getTokenCssFilesFromDist();
  console.log("♻️  Using pre-generated token CSS from dist/tokens/css");
  console.log(`   • ${tokenFiles.length} files`);

  removeRetiredBundleArtifacts();
  buildCoreBundle(tokenFiles);
  buildUiBundle();
  buildElementsBundle();
  buildAssetsBundle();
  buildMacrosBundle();

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
