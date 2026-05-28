import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const DIST_JSON_DIR = path.join(REPO_ROOT, "dist", "tokens", "json");
const REQUIRED_SCHEMA = "https://www.designtokens.org/schemas/2025.10/format.json";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

if (!fs.existsSync(DIST_JSON_DIR)) {
  fail(`Missing directory: ${path.relative(REPO_ROOT, DIST_JSON_DIR)}`);
}

const files = fs
  .readdirSync(DIST_JSON_DIR)
  .filter((name) => name.endsWith(".json") && !name.endsWith(".figma.json"))
  .sort();

if (files.length === 0) {
  fail(`No token JSON files found in ${path.relative(REPO_ROOT, DIST_JSON_DIR)}`);
}

for (const fileName of files) {
  const filePath = path.join(DIST_JSON_DIR, fileName);
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${fileName} is not valid JSON (${error.message})`);
  }

  if (!isObject(parsed)) {
    fail(`${fileName} root must be an object`);
  }

  if (parsed.$schema !== REQUIRED_SCHEMA) {
    fail(
      `${fileName} has invalid $schema. Expected "${REQUIRED_SCHEMA}", got "${parsed.$schema}"`,
    );
  }
}

console.log(`✅ Token validation passed (${files.length} files)`);
