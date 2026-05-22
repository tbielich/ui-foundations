import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST_PATH = path.join(
  REPO_ROOT,
  "docs",
  "validation",
  "rule-pipeline.manifest.json",
);

const REQUIRED_PATTERN_SECTIONS = [
  "Rule type",
  "Scope",
  "Applies to",
  "Purpose",
  "Structure",
  "Rules",
  "Interaction rules",
  "Accessibility considerations",
  "Applied principles",
  "Applied heuristics",
  "Failure signals",
  "Agent check",
];

const failures = [];

function relative(filePath) {
  return path.relative(REPO_ROOT, filePath);
}

function fail(message) {
  failures.push(message);
}

function readText(relativePath) {
  const fullPath = path.join(REPO_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    fail(`Missing required file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function readJson(relativePath) {
  const fullPath = path.join(REPO_ROOT, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    fail(`Invalid JSON in ${relative(fullPath)}: ${error.message}`);
    return null;
  }
}

function extractIds(markdown, prefix) {
  const pattern = new RegExp("`(" + prefix + "\\.[a-z0-9-]+)`", "g");
  return new Set([...markdown.matchAll(pattern)].map((match) => match[1]));
}

function extractSectionIds(markdown, sectionName, prefix) {
  const sectionPattern = new RegExp(
    `## ${sectionName}\\n([\\s\\S]*?)(?=\\n## |$)`,
  );
  const section = markdown.match(sectionPattern)?.[1] || "";
  return extractIds(section, prefix);
}

function ensureIncludes(fileLabel, content, expected) {
  if (!content.includes(expected)) {
    fail(`${fileLabel} must include "${expected}"`);
  }
}

function validatePattern(pattern, knownPrinciples, knownHeuristics) {
  const content = readText(pattern.file);
  if (!content) return;

  ensureIncludes(pattern.file, content, `# Pattern: ${pattern.id}`);

  for (const section of REQUIRED_PATTERN_SECTIONS) {
    ensureIncludes(pattern.file, content, `## ${section}`);
  }

  const appliedPrinciples = extractSectionIds(content, "Applied principles", "principle");
  const appliedHeuristics = extractSectionIds(content, "Applied heuristics", "heuristic");

  for (const id of pattern.principles || []) {
    if (!knownPrinciples.has(id)) {
      fail(`${pattern.file} references unknown principle id: ${id}`);
    }
    if (!appliedPrinciples.has(id)) {
      fail(`${pattern.file} must list manifest principle id: ${id}`);
    }
  }

  for (const id of appliedPrinciples) {
    if (!knownPrinciples.has(id)) {
      fail(`${pattern.file} lists unknown principle id: ${id}`);
    }
  }

  for (const id of pattern.heuristics || []) {
    if (!knownHeuristics.has(id)) {
      fail(`${pattern.file} references unknown heuristic id: ${id}`);
    }
    if (!appliedHeuristics.has(id)) {
      fail(`${pattern.file} must list manifest heuristic id: ${id}`);
    }
  }

  for (const id of appliedHeuristics) {
    if (!knownHeuristics.has(id)) {
      fail(`${pattern.file} lists unknown heuristic id: ${id}`);
    }
  }

  if (appliedPrinciples.size === 0) {
    fail(`${pattern.file} must cite at least one design principle`);
  }
  if (appliedHeuristics.size === 0) {
    fail(`${pattern.file} must cite at least one usability heuristic`);
  }
}

function validatePackageScripts(manifest) {
  const packageJson = readJson("package.json");
  if (!packageJson) return;
  const scripts = packageJson.scripts || {};
  const npmScript = manifest.validation?.npmScript;
  const ciScript = manifest.validation?.ciScript;

  if (!scripts[npmScript]) {
    fail(`package.json is missing script "${npmScript}"`);
    return;
  }

  if (!String(scripts[npmScript]).includes(manifest.validation?.script)) {
    fail(`package.json script "${npmScript}" must run ${manifest.validation?.script}`);
  }

  if (!String(scripts[ciScript] || "").includes(`npm run ${npmScript}`)) {
    fail(`package.json script "${ciScript}" must include "npm run ${npmScript}"`);
  }
}

function validateRuleGeneration(manifest) {
  const source = readText(manifest.sourceOfTruth.ruleGeneration);
  if (!source) return;

  ensureIncludes(
    manifest.sourceOfTruth.ruleGeneration,
    source,
    manifest.sourceOfTruth.principles,
  );
  ensureIncludes(
    manifest.sourceOfTruth.ruleGeneration,
    source,
    manifest.sourceOfTruth.heuristics,
  );
  ensureIncludes(manifest.sourceOfTruth.ruleGeneration, source, manifest.patternDirectory);
}

function main() {
  const manifest = readJson("docs/validation/rule-pipeline.manifest.json");
  if (!manifest) {
    process.exit(1);
  }

  const principles = readText(manifest.sourceOfTruth.principles);
  const heuristics = readText(manifest.sourceOfTruth.heuristics);
  const knownPrinciples = extractIds(principles, "principle");
  const knownHeuristics = extractIds(heuristics, "heuristic");

  if (knownPrinciples.size === 0) {
    fail(`${manifest.sourceOfTruth.principles} must define principle ids`);
  }
  if (knownHeuristics.size === 0) {
    fail(`${manifest.sourceOfTruth.heuristics} must define heuristic ids`);
  }

  validateRuleGeneration(manifest);

  for (const pattern of manifest.patterns || []) {
    validatePattern(pattern, knownPrinciples, knownHeuristics);
  }

  for (const rule of manifest.componentRules || []) {
    readText(rule.file);
  }

  readText("docs/agentic/rule-pipeline.md");
  validatePackageScripts(manifest);

  if (failures.length > 0) {
    console.error("Rule pipeline validation failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(
    `Rule pipeline validation passed (${(manifest.patterns || []).length} patterns, ${knownPrinciples.size} principles, ${knownHeuristics.size} heuristics)`,
  );
}

main();
