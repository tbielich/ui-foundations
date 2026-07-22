import fs from "fs";
import path from "path";
import fg from "fast-glob";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const TERMINOLOGY_PATH = "docs/terminology.md";
const MATRIX_PATH = "docs/canonical-reference-matrix.md";
const REQUIRED_MATRIX_TOPICS = [
  "Runtime/Vault documentation boundary",
  "Public API naming and usage",
  "Public API migration mappings",
  "Token layer model",
  "Token generation mechanics",
  "Pattern/component hierarchy and status",
  "Runtime accessibility principles",
  "Validation pipeline",
  "Governance consumption lifecycle",
  "Canonical link ownership strategy",
];

function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

function extractGlossaryTerms(source) {
  const terms = new Set();
  for (const line of source.split("\n")) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|/);
    if (!match) continue;
    const term = match[1].trim();
    if (term && term !== "Term" && !/^[-:]+$/.test(term)) terms.add(term);
  }
  return terms;
}

function extractMatrixTopics(source) {
  const topics = new Set();
  for (const line of source.split("\n")) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|/);
    if (!match) continue;
    const topic = match[1].trim();
    if (topic && topic !== "Topic" && !/^[-:]+$/.test(topic)) topics.add(topic);
  }
  return topics;
}

function collectMarkdownFiles() {
  return fg.sync(["README.md", "MIGRATION.md", "docs/**/*.md"], {
    cwd: REPO_ROOT,
    onlyFiles: true,
    unique: true,
    ignore: [TERMINOLOGY_PATH, MATRIX_PATH, "docs/audits/**"],
  });
}

function checkBaselineLinks(files) {
  const failures = [];
  const requiredLinks = [TERMINOLOGY_PATH, MATRIX_PATH];
  for (const file of files) {
    const source = read(file);
    for (const target of requiredLinks) {
      const markdownLink = new RegExp(`\\[[^\\]]+\\]\\([^)]*${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^)]*\\)`);
      const codeReference = source.includes(`\`${target}\``);
      if (source.includes(path.basename(target)) && !markdownLink.test(source) && !codeReference) {
        failures.push(`${file}: stale or ambiguous reference to ${path.basename(target)}; use the full canonical path ${target}`);
      }
    }
  }
  return failures;
}

function checkTerminologyUsage(files, glossaryTerms) {
  const failures = [];
  const governed = ["Canonical", "Compatibility", "Deprecated", "Placeholder"];
  for (const term of governed) {
    if (!glossaryTerms.has(term)) failures.push(`${TERMINOLOGY_PATH}: missing governed glossary term ${term}`);
  }

  const disallowed = [
    { pattern: /\blegacy canonical\b/gi, replacement: "compatibility or deprecated" },
    { pattern: /\btemporary canonical\b/gi, replacement: "placeholder or planned/forward" },
    { pattern: /\bcompatibility canonical\b/gi, replacement: "canonical or compatibility" },
  ];

  for (const file of files) {
    const source = read(file);
    for (const rule of disallowed) {
      if (rule.pattern.test(source)) {
        failures.push(`${file}: inconsistent terminology; replace matched wording with ${rule.replacement}`);
      }
      rule.pattern.lastIndex = 0;
    }
  }
  return failures;
}

function checkMatrixCoverage(matrixTopics) {
  return REQUIRED_MATRIX_TOPICS
    .filter((topic) => !matrixTopics.has(topic))
    .map((topic) => `${MATRIX_PATH}: missing required topic mapping: ${topic}`);
}

export function runDocsDriftCheck() {
  const terminology = read(TERMINOLOGY_PATH);
  const matrix = read(MATRIX_PATH);
  const files = collectMarkdownFiles();
  const glossaryTerms = extractGlossaryTerms(terminology);
  const matrixTopics = extractMatrixTopics(matrix);

  const failures = [
    ...checkTerminologyUsage(files, glossaryTerms),
    ...checkMatrixCoverage(matrixTopics),
    ...checkBaselineLinks(files),
  ];

  if (failures.length > 0) {
    console.error(`❌ Documentation drift detected (${failures.length} issue${failures.length === 1 ? "" : "s"}):`);
    for (const failure of failures) console.error(`- ${failure}`);
    return 1;
  }

  console.log(`✅ Documentation drift check passed (${files.length} documentation files scanned)`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runDocsDriftCheck());
}
