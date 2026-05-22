import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const PACKAGE_JSON_PATH = path.join(REPO_ROOT, "package.json");
const PLUGIN_DIR = path.join(REPO_ROOT, "figma", "plugin");
const OUTPUT_JSON_PATH = path.join(PLUGIN_DIR, "plugin-meta.json");
const OUTPUT_JS_PATH = path.join(PLUGIN_DIR, "plugin-meta.js");
const PLUGIN_SOURCE_PATH = path.join(PLUGIN_DIR, "code.js");
const GENERATED_MAIN_PATH = path.join(PLUGIN_DIR, "code.generated.js");

function readPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
  return pkg.version || "0.0.0";
}

function safeGit(args) {
  try {
    return execFileSync("git", args, {
      cwd: REPO_ROOT,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
  } catch {
    // Git may not be available (CI, shallow clone, etc.) — fall back to empty string
    return "";
  }
}

function buildHistory(version, buildDate, commit) {
  return [
    {
      version,
      date: buildDate,
      changes: [
        "Build metadata generated from the repository state.",
        commit ? `Git commit: ${commit}` : "Git commit unavailable.",
        "Use this panel in Figma to verify the loaded plugin build.",
      ],
    },
  ];
}

function main() {
  const version = readPackageVersion();
  const buildDate = new Date().toISOString();
  const commit = safeGit(["rev-parse", "--short", "HEAD"]);
  const branch = safeGit(["rev-parse", "--abbrev-ref", "HEAD"]);

  const meta = {
    name: "Token Foundry",
    version,
    buildDate,
    commit,
    branch,
    history: buildHistory(version, buildDate.slice(0, 10), commit),
  };

  const pluginSource = fs.readFileSync(PLUGIN_SOURCE_PATH, "utf8");

  fs.writeFileSync(OUTPUT_JSON_PATH, `${JSON.stringify(meta, null, 2)}\n`);
  fs.writeFileSync(
    OUTPUT_JS_PATH,
    `const PLUGIN_META = ${JSON.stringify(meta, null, 2)};\n`,
  );
  fs.writeFileSync(
    GENERATED_MAIN_PATH,
    `${fs.readFileSync(OUTPUT_JS_PATH, "utf8")}\n${pluginSource}`,
  );
  console.log(`✅ Plugin metadata written to ${path.relative(REPO_ROOT, OUTPUT_JSON_PATH)}`);
  console.log(`✅ Plugin metadata module written to ${path.relative(REPO_ROOT, OUTPUT_JS_PATH)}`);
  console.log(`✅ Generated plugin entry written to ${path.relative(REPO_ROOT, GENERATED_MAIN_PATH)}`);
}

main();
