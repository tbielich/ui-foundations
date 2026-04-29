#!/usr/bin/env node

/**
 * Extract design tokens from local Figma exports
 * Usage: node scripts/extract-tokens.js
 */

const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const {
  readJsonLike,
  slugifyName,
  parseWebSyntax,
  normalizeVariableId,
  normalizeTokenPath,
} = require("./extract-tokens.utils.js");
const { createTokenLookup } = require("./extract-tokens.lookup.js");
const {
  buildTokenKey,
  classifyTokenGroup,
  isFontWeightPath,
  resolveTokenOutputValue,
  toNumericFontWeight,
} = require("./extract-tokens.value.js");
const {
  normalizeOutputBase,
  normalizePerFileBase,
  parseScopeKey,
  selectorForScope,
} = require("./extract-tokens.scope.js");

const REPO_ROOT = path.resolve(__dirname, "..");
const EXPORTS_DIR = path.join(REPO_ROOT, "figma", "exports");
const OUTPUT_DIR = path.join(REPO_ROOT, "dist", "tokens");
const DTCG_SCHEMA_URL =
  "https://www.designtokens.org/schemas/2025.10/format.json";

const EXPORT_PATTERNS = [
  "figma/exports/**/*.token.json",
  "figma/exports/**/*.tokens.json",
  "figma/exports/**/*.token.jsonc",
  "figma/exports/**/*.tokens.jsonc",
];

function isTokenNode(node) {
  return (
    node && typeof node === "object" && "$type" in node && "$value" in node
  );
}

function inferBucketFromFilename(fileName) {
  // Legacy fallback — only used if content-based detection is bypassed
  const baseName = path.basename(fileName);
  const stem = baseName
    .replace(/\.(token|tokens)\.jsonc?$/i, "")
    .replace(/\.jsonc?$/i, "")
    .trim();
  return { bucket: "global", id: slugifyName(stem), stem };
}

// Derive scope from mode name (e.g. "Light Mode" → mode:light, "Brand A" → brand:a)
function inferScopeFromModeName(modeName) {
  const slug = slugifyName(modeName);
  // "brand-a" / "brand-b" / "brand-c" → brand scope
  const brandMatch = slug.match(/^brand[-\s]?([a-z]+)$/i);
  if (brandMatch) return { bucket: "brand", id: brandMatch[1].toLowerCase() };
  // "light-mode" / "dark-mode" → mode scope
  const modeMatch = slug.match(/^(.+)-mode$/) || slug.match(/^mode-(.+)$/);
  if (modeMatch) return { bucket: "mode", id: modeMatch[1] };
  // fallback: treat as mode
  return { bucket: "mode", id: slug };
}

// Derive scope from file content by inspecting token paths and types
function inferScopeFromContent(data, filePath) {
  const topKeys = Object.keys(data).filter(k => !k.startsWith("$"));
  const slug = slugifyName(path.basename(filePath).replace(/\.(token|tokens)\.jsonc?$/i, "").replace(/\.jsonc?$/i, ""));

  // Check if all top-level keys look like component names (Button, Input, etc.)
  // by looking for codeSyntax with component-level prefixes
  const sampleTokens = collectSampleTokens(data, 5);

  // If tokens have codeSyntax starting with --color- or --font- → primitives
  // If tokens have codeSyntax starting with --brand- → brand tokens
  // If tokens have codeSyntax starting with --button-, --input- → components
  const prefixes = sampleTokens
    .map(t => t.web)
    .filter(Boolean)
    .map(w => w.replace(/^var\(--/, "").replace(/\)$/, "").split("-")[0]);

  const uniquePrefixes = [...new Set(prefixes)];

  // Heuristic: if most tokens are color/font/size primitives → global:primitives
  // This is intentionally loose — the content tells us what it is
  return { bucket: "global", id: slug };
}

// Collect a few sample tokens from a data tree for content inspection
function collectSampleTokens(node, max, found) {
  if (!found) found = [];
  if (found.length >= max || !node || typeof node !== "object") return found;
  if (node.$type && (node.$value !== undefined || node.$value === null)) {
    const web = node.$extensions && node.$extensions["com.figma.codeSyntax"]
      ? node.$extensions["com.figma.codeSyntax"].WEB
      : null;
    found.push({ type: node.$type, web });
    return found;
  }
  for (const [key, val] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    collectSampleTokens(val, max, found);
    if (found.length >= max) break;
  }
  return found;
}

// Collect all unique mode names from modeValues in a token file
function collectModeNames(node, found, depth) {
  if (!found) found = new Set();
  if (!depth) depth = 0;
  if (depth > 50 || !node || typeof node !== "object") return [...found];
  if (node.$extensions && node.$extensions["com.figma.modeValues"]) {
    for (const key of Object.keys(node.$extensions["com.figma.modeValues"])) {
      found.add(key);
    }
  }
  for (const [key, val] of Object.entries(node)) {
    if (!key.startsWith("$")) collectModeNames(val, found, depth + 1);
  }
  return [...found];
}

// Get the mode-specific value for a token from its stored _modeValues
function getModeValue(token, modeName) {
  if (token._modeValues && token._modeValues[modeName] !== undefined) {
    return token._modeValues[modeName];
  }
  return undefined;
}


function flattenTokens(node, pathSegments, list, sourceMeta) {
  if (!node || typeof node !== "object") return;

  if (isTokenNode(node)) {
    const aliasData =
      node.$extensions &&
      node.$extensions["com.figma.aliasData"] &&
      typeof node.$extensions["com.figma.aliasData"] === "object"
        ? node.$extensions["com.figma.aliasData"]
        : null;
    const webSyntax =
      node.$extensions &&
      node.$extensions["com.figma.codeSyntax"] &&
      node.$extensions["com.figma.codeSyntax"].WEB
        ? String(node.$extensions["com.figma.codeSyntax"].WEB)
        : null;
    const valueRef =
      node.$value && typeof node.$value === "object" && node.$value.$ref
        ? normalizeTokenPath(node.$value.$ref)
        : null;
    const stringAliasMatch =
      typeof node.$value === "string" ? node.$value.match(/^\{(.+)\}$/) : null;
    const variableId =
      node.$extensions && node.$extensions["com.figma.variableId"]
        ? normalizeVariableId(node.$extensions["com.figma.variableId"])
        : null;

    list.push({
      pathSegments,
      type: node.$type,
      value: node.$value,
      variableId,
      path: pathSegments.join("/"),
      pathKey: pathSegments.join("."),
      aliasTargetId: aliasData
        ? normalizeVariableId(aliasData.targetVariableId)
        : null,
      aliasTargetName: aliasData
        ? normalizeTokenPath(aliasData.targetVariableName)
        : null,
      aliasRefPath:
        valueRef ||
        (stringAliasMatch ? normalizeTokenPath(stringAliasMatch[1]) : null),
      webSyntax,
      cssVar: null,
      cssVarRef: null,
      sourceScope: sourceMeta.scope,
      sourceFile: sourceMeta.filePath,
      sourceFileName: sourceMeta.fileName,
      _modeValues: node.$extensions && node.$extensions["com.figma.modeValues"]
        ? node.$extensions["com.figma.modeValues"]
        : null,
    });
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    flattenTokens(value, [...pathSegments, key], list, sourceMeta);
  }
}


function addToken(tokens, token, lookup, report) {
  const group = classifyTokenGroup(token);
  const formattedValue = resolveTokenOutputValue(token, lookup, report);
  tokens[group][token.cssVar] = formattedValue;
}

function buildTokensFromList(tokenList, report, lookupOverride) {
  const lookup = lookupOverride || createTokenLookup(tokenList);
  const tokens = {
    colors: {},
    typography: {},
    spacing: {},
    radii: {},
    shadows: {},
    components: {},
    breakpoints: {},
    containers: {},
  };

  for (const token of tokenList) {
    addToken(tokens, token, lookup, report);
  }

  return tokens;
}

function buildFlatTokenIndex(tokenList, report, lookupOverride) {
  const lookup = lookupOverride || createTokenLookup(tokenList);
  const entries = tokenList.map((token) => {
    const group = classifyTokenGroup(token);
    const value = resolveTokenOutputValue(token, lookup, report);
    const scope = parseScopeKey(token.sourceScope);

    return {
      cssVar: token.cssVar,
      name: String(token.cssVar || "").replace(/^--/, ""),
      value,
      type: token.type,
      group,
      path: token.path,
      pathKey: token.pathKey,
      scope: token.sourceScope || `${scope.bucket}:${scope.id}`,
      scopeBucket: scope.bucket,
      scopeId: scope.id,
      selector: selectorForScope(scope),
      sourceFile: token.sourceFileName || path.basename(token.sourceFile || ""),
    };
  });

  entries.sort((a, b) => {
    const groupCmp = String(a.group).localeCompare(String(b.group));
    if (groupCmp !== 0) return groupCmp;
    const nameCmp = String(a.name).localeCompare(String(b.name), undefined, {
      numeric: true,
    });
    if (nameCmp !== 0) return nameCmp;
    return String(a.scope).localeCompare(String(b.scope));
  });

  return entries;
}

function assignCssVars(tokenList, report) {
  if (!report.scopeSeen) {
    report.scopeSeen = new Map();
  }

  for (const token of tokenList) {
    const fallback = `--${buildTokenKey(token.pathSegments)}`;
    const tokenPath = token.pathSegments.join("/");
    if (!token.webSyntax) {
      report.missingWeb.push(tokenPath);
      token.cssVar = fallback;
      token.cssVarRef = `var(${fallback})`;
    } else {
      const parsed = parseWebSyntax(token.webSyntax);
      if (parsed.error || !parsed.name) {
        report.invalidWeb.push(`${tokenPath}: ${parsed.error}`);
        token.cssVar = fallback;
        token.cssVarRef = `var(${fallback})`;
      } else {
        token.cssVar = parsed.name;
        token.cssVarRef = parsed.ref;
      }
    }

    const scopeKey = token.sourceScope || "global:global";
    if (!report.scopeSeen.has(scopeKey)) {
      report.scopeSeen.set(scopeKey, new Map());
    }
    const scopeMap = report.scopeSeen.get(scopeKey);
    const existing = scopeMap.get(token.cssVar);
    if (existing && existing !== tokenPath) {
      report.duplicates.push({
        scope: scopeKey,
        name: token.cssVar,
        winner: tokenPath,
        dropped: existing,
      });
    }
    scopeMap.set(token.cssVar, tokenPath);
  }
}

/**
 * Suggest a reasonable mock/fallback value for a missing alias target based on its path.
 * These are temporary placeholders — the real values should come from Figma.
 */
function suggestMockValue(refPath) {
  const lower = refPath.toLowerCase().replace(/[/. ]+/g, "/");

  // Color tokens
  if (lower.includes("color/fill/muted")) return { type: "color", value: "#e5e5e5", note: "Semantic: muted fill — add to Appearance (Modes)" };
  if (lower.includes("color/border/focus")) return { type: "color", value: "#3b82f6", note: "Semantic: focus border — add to Appearance (Modes)" };
  if (lower.includes("color/fill")) return { type: "color", value: "#f5f5f5", note: "Semantic fill token — add to Appearance (Modes)" };
  if (lower.includes("color/border")) return { type: "color", value: "#d4d4d4", note: "Semantic border token — add to Appearance (Modes)" };
  if (lower.includes("color/text")) return { type: "color", value: "#333333", note: "Semantic text token — add to Appearance (Modes)" };
  if (lower.includes("color")) return { type: "color", value: "#808080", note: "Color token — determine correct layer" };

  // Size tokens
  if (lower.includes("size/spacing/50")) return { type: "number", value: 2, unit: "px", note: "Core: spacing 50 — add to Core (Primitives)" };
  if (lower.includes("size/radius/100")) return { type: "number", value: 4, unit: "px", note: "Core: radius 100 — add to Core (Primitives)" };
  if (lower.includes("size/spacing")) return { type: "number", value: 8, unit: "px", note: "Core spacing token — add to Core (Primitives)" };
  if (lower.includes("size/border")) return { type: "number", value: 1, unit: "px", note: "Core border token — add to Core (Primitives)" };
  if (lower.includes("size/radius")) return { type: "number", value: 4, unit: "px", note: "Core radius token — add to Core (Primitives)" };

  return { type: "unknown", value: "TODO", note: "Could not infer type — review manually" };
}

function clearGeneratedFiles(dirPath, extensions) {
  if (!fs.existsSync(dirPath)) return;
  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    if (!fs.statSync(fullPath).isFile()) continue;
    if (extensions.some((ext) => entry.endsWith(ext))) {
      fs.unlinkSync(fullPath);
    }
  }
}

function isFontFamilyPath(segments) {
  const joined = segments.join(".").toLowerCase();
  return (
    joined.startsWith("font.family") ||
    joined.endsWith(".font family") ||
    joined.includes(".font.family") ||
    joined === "typography.code"
  );
}

function isUnitlessNumberPath(segments) {
  const joined = segments.join(".").toLowerCase();
  if (joined === "layout.columns") return true;
  if (joined.startsWith("zindex.") || joined.startsWith("z-index."))
    return true;
  return false;
}

function parseDimensionValue(value) {
  if (typeof value === "number") return { value, unit: "px" };
  if (typeof value === "string") {
    const trimmed = value.trim();
    const unitMatch = trimmed.match(/^(-?\d*\.?\d+)\s*(px|rem)$/i);
    if (unitMatch) {
      return {
        value: Number(unitMatch[1]),
        unit: unitMatch[2].toLowerCase(),
      };
    }
  }
  return null;
}

function transformTokenNodeToW3C(tokenNode, segments, report) {
  const token = { ...tokenNode };
  const type = String(token.$type || "").toLowerCase();

  if (type === "string" && isFontFamilyPath(segments)) {
    token.$type = "fontFamily";
    if (token.$extensions && token.$extensions["com.figma.type"] === "string") {
      token.$extensions = {
        ...token.$extensions,
        "com.figma.type": "fontFamily",
      };
    }
    return token;
  }

  if (type === "string" && isFontWeightPath(segments)) {
    token.$type = "fontWeight";

    const isAliasRef =
      token.$value &&
      typeof token.$value === "object" &&
      typeof token.$value.$ref === "string";

    if (!isAliasRef) {
      const mapped = toNumericFontWeight(token.$value);
      if (mapped !== null) {
        token.$value = mapped;
      } else {
        report.unmappedFontWeights.push({
          path: segments.join("/"),
          value: token.$value,
        });
      }
    }

    if (token.$extensions && token.$extensions["com.figma.type"] === "string") {
      token.$extensions = {
        ...token.$extensions,
        "com.figma.type": "fontWeight",
      };
    }
    return token;
  }

  if (type === "number" && !isUnitlessNumberPath(segments)) {
    const dimension = parseDimensionValue(token.$value);
    if (dimension) {
      token.$type = "dimension";
      token.$value = dimension;
    }
    return token;
  }

  return token;
}

function transformNodeToW3C(node, segments, report) {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node)) {
    return node.map((entry, index) =>
      transformNodeToW3C(entry, [...segments, String(index)], report),
    );
  }

  if (isTokenNode(node)) {
    return transformTokenNodeToW3C(node, segments, report);
  }

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = transformNodeToW3C(value, [...segments, key], report);
  }
  return out;
}

function stripFigmaExtensions(node) {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map(stripFigmaExtensions);

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === "$extensions" && value && typeof value === "object") {
      const cleaned = {};
      for (const [extKey, extValue] of Object.entries(value)) {
        if (!extKey.startsWith("com.figma.")) {
          cleaned[extKey] = stripFigmaExtensions(extValue);
        }
      }
      if (Object.keys(cleaned).length > 0) {
        out[key] = cleaned;
      }
      continue;
    }
    out[key] = stripFigmaExtensions(value);
  }
  return out;
}

/**
 * Convert Figma-style alias references to DTCG alias syntax.
 * Figma: { "$ref": "Path/To/Token" }
 * DTCG:  "{Path.To.Token}"
 */
function convertAliasesToDTCG(node) {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map(convertAliasesToDTCG);

  // If this is a token node, convert its $value (and leave $type/$extensions alone)
  if (isTokenNode(node)) {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (key === "$value") {
        out[key] = convertValueAliases(value);
      } else if (key === "$extensions") {
        out[key] = convertAliasesToDTCG(value);
      } else {
        out[key] = value;
      }
    }
    return out;
  }

  // Recurse into groups
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = convertAliasesToDTCG(value);
  }
  return out;
}

/**
 * Convert a $value that may be a Figma alias object to a DTCG alias string.
 * { "$ref": "Color/Neutral/800" } → "{Color.Neutral.800}"
 */
function convertValueAliases(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (typeof value.$ref === "string") {
      const dtcgPath = value.$ref.replace(/\//g, ".");
      return `{${dtcgPath}}`;
    }
  }
  return value;
}

/**
 * Convert Figma color value objects to DTCG hex strings.
 * Figma: { colorSpace: "srgb", components: [r, g, b], alpha: 1, hex: "#333333" }
 * DTCG:  "#333333" or "#333333cc" (with alpha)
 */
function convertColorValuesToDTCG(node) {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map(convertColorValuesToDTCG);

  if (isTokenNode(node)) {
    const type = String(node.$type || "").toLowerCase();
    if (type === "color" && isFigmaColorObject(node.$value)) {
      const out = { ...node };
      out.$value = figmaColorToHex(node.$value);
      return convertColorValuesToDTCG(out);
    }
    // Recurse into $extensions in case there are nested structures
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = key === "$extensions" ? convertColorValuesToDTCG(value) : value;
    }
    return out;
  }

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = convertColorValuesToDTCG(value);
  }
  return out;
}

function isFigmaColorObject(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.colorSpace === "string" &&
    Array.isArray(value.components)
  );
}

function figmaColorToHex(colorObj) {
  const { components, alpha } = colorObj;
  const toHex = (n) => {
    const clamped = Math.round(Math.min(1, Math.max(0, n)) * 255);
    return clamped.toString(16).padStart(2, "0");
  };
  const r = toHex(components[0] || 0);
  const g = toHex(components[1] || 0);
  const b = toHex(components[2] || 0);

  if (typeof alpha === "number" && alpha < 1) {
    const a = toHex(alpha);
    return `#${r}${g}${b}${a}`;
  }
  return `#${r}${g}${b}`;
}

function withSchema(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;
  return {
    $schema: DTCG_SCHEMA_URL,
    ...node,
  };
}

async function extractTokens() {
  try {
    const files = await fg(EXPORT_PATTERNS, {
      cwd: REPO_ROOT,
      absolute: true,
      onlyFiles: true,
      unique: true,
    });

    if (files.length === 0) {
      throw new Error(`No token exports found in ${EXPORTS_DIR}`);
    }

    const allTokens = [];
    const perFileTokens = [];
    const shouldMockMissing = !process.argv.includes("--strict");

    for (const filePath of files.sort()) {
      const data = readJsonLike(filePath);

      // Content-based scope detection:
      // 1. If file has modeValues → expand per mode, derive scope from mode names
      // 2. Otherwise → global scope with ID derived from token content
      const modeNames = collectModeNames(data);
      if (modeNames.length > 1) {
        for (const modeName of modeNames) {
          const modeScope = inferScopeFromModeName(modeName);
          const tokenList = [];
          flattenTokens(data, [], tokenList, {
            scope: `${modeScope.bucket}:${modeScope.id}`,
            bucket: modeScope.bucket,
            id: modeScope.id,
            filePath,
            fileName: path.basename(filePath),
          });
          for (const token of tokenList) {
            const modeVal = getModeValue(token, modeName);
            if (modeVal !== undefined) {
              token.value = modeVal;
              if (modeVal && typeof modeVal === 'object' && modeVal.$ref) {
                const refPath = normalizeTokenPath(modeVal.$ref);
                token.aliasRefPath = refPath;
                token.aliasTargetName = refPath;
                // clear ID-based lookup so path-based resolution takes over
                token.aliasTargetId = null;
              }
            }
          }
          allTokens.push(...tokenList);
          perFileTokens.push({ filePath, tokenList, scope: modeScope });
        }
        continue;
      }

      const scope = inferScopeFromContent(data, filePath);
      const tokenList = [];
      flattenTokens(data, [], tokenList, {
        scope: `${scope.bucket}:${scope.id}`,
        bucket: scope.bucket,
        id: scope.id,
        filePath,
        fileName: path.basename(filePath),
      });
      allTokens.push(...tokenList);
      perFileTokens.push({ filePath, tokenList, scope });
    }

    const report = {
      missingWeb: [],
      invalidWeb: [],
      duplicates: [],
      aliasCycles: [],
      missingAliasTargets: [],
      scopeSeen: new Map(),
    };
    assignCssVars(allTokens, report);

    // --mock-missing: inject temporary fallback tokens for unresolved aliases
    // Pre-check: try resolving all aliases to find missing targets early
    if (shouldMockMissing) {
      const preCheckLookup = createTokenLookup(allTokens);
      const preCheckReport = { missingAliasTargets: [], aliasCycles: [] };
      const { resolveAliasRef } = require("./extract-tokens.lookup.js");
      for (const token of allTokens) {
        if (token.aliasTargetId || token.aliasTargetName || token.aliasRefPath) {
          resolveAliasRef(token, preCheckLookup, preCheckReport);
        }
      }

      if (preCheckReport.missingAliasTargets.length > 0) {
        const mockedPaths = new Set();
        for (const tokenPath of preCheckReport.missingAliasTargets) {
          const token = allTokens.find((t) => t.path === tokenPath);
          if (!token) continue;
          const refPath = token.aliasRefPath || token.aliasTargetName;
          if (!refPath || mockedPaths.has(refPath)) continue;
          const normalizedRef = normalizeTokenPath(refPath);
          if (preCheckLookup.byPath.has(normalizedRef)) continue;

          const mock = suggestMockValue(refPath);
          const segments = refPath.split("/");
          const mockToken = {
            pathSegments: segments,
            type: mock.type === "color" ? "color" : "number",
            value: mock.value,
            variableId: null,
            path: segments.join("/"),
            pathKey: segments.join("."),
            aliasTargetId: null,
            aliasTargetName: null,
            aliasRefPath: null,
            webSyntax: `var(--${slugifyName(segments.join("-"))})`,
            cssVar: null,
            cssVarRef: null,
            sourceScope: "global:components-ui",
            sourceFile: "mock",
            sourceFileName: "mock",
            _modeValues: null,
            _isMock: true,
          };
          allTokens.push(mockToken);
          mockedPaths.add(refPath);
        }

        if (mockedPaths.size > 0) {
          // Re-assign CSS vars with the new mock tokens included
          report.missingAliasTargets = [];
          assignCssVars(allTokens, report);
          console.warn(`\n🔧 Mocked ${mockedPaths.size} missing token(s) with temporary fallbacks:`);
          for (const p of mockedPaths) {
            const mock = suggestMockValue(p);
            console.warn(`   • ${p} → ${mock.value} (${mock.note})`);
          }
          console.warn("   ⚠️  These are temporary — create the real tokens in Figma and re-export.\n");
        }
      }
    }

    const cssDir = path.join(OUTPUT_DIR, "css");
    const jsonDir = path.join(OUTPUT_DIR, "json");
    const tsDir = path.join(OUTPUT_DIR, "ts");
    const tokensYamlPath = path.join(OUTPUT_DIR, "tokens.yaml");

    for (const dir of [cssDir, jsonDir, tsDir]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    clearGeneratedFiles(cssDir, [".css"]);
    clearGeneratedFiles(jsonDir, [".json"]);
    clearGeneratedFiles(tsDir, [".ts"]);

    const includeFigmaMetadata = process.argv.includes(
      "--include-figma-metadata",
    );
    const globalLookup = createTokenLookup(allTokens);

    for (const { filePath, tokenList, scope } of perFileTokens) {
      const rawBase = normalizeOutputBase(filePath);
      // For mode-expanded files, append the scope id to avoid overwriting
      const scopeSuffix = (scope.bucket === "mode" || scope.bucket === "brand")
        ? `.${scope.bucket}-${scope.id}`
        : "";
      const base = normalizePerFileBase(rawBase + scopeSuffix) || rawBase + scopeSuffix;
      const sourceData = readJsonLike(filePath);
      const perTokens = buildTokensFromList(tokenList, report, globalLookup);
      const transformReport = { unmappedFontWeights: [] };
      const w3cTokens = transformNodeToW3C(sourceData, [], transformReport);
      const dtcgAliases = convertAliasesToDTCG(w3cTokens);
      const dtcgColors = convertColorValuesToDTCG(dtcgAliases);
      const cleanTokens = withSchema(stripFigmaExtensions(dtcgColors));
      const jsonOut = JSON.stringify(cleanTokens, null, 2);
      const cssOut = generateCSS(perTokens, scope);
      const tsOut = generateTypeScript(perTokens);

      fs.writeFileSync(path.join(jsonDir, `${base}.json`), jsonOut);
      fs.writeFileSync(path.join(cssDir, `${base}.css`), cssOut);
      fs.writeFileSync(path.join(tsDir, `${base}.ts`), tsOut);
      const figmaJsonPath = path.join(jsonDir, `${base}.figma.json`);
      if (includeFigmaMetadata) {
        fs.writeFileSync(
          figmaJsonPath,
          `${JSON.stringify(w3cTokens, null, 2)}\n`,
        );
      } else if (fs.existsSync(figmaJsonPath)) {
        fs.unlinkSync(figmaJsonPath);
      }

      if (rawBase !== base) {
        const oldJson = path.join(jsonDir, `${rawBase}.json`);
        const oldCss = path.join(cssDir, `${rawBase}.css`);
        const oldTs = path.join(tsDir, `${rawBase}.ts`);
        for (const oldFile of [oldJson, oldCss, oldTs]) {
          if (fs.existsSync(oldFile)) {
            fs.unlinkSync(oldFile);
          }
        }
      }

      if (transformReport.unmappedFontWeights.length > 0) {
        console.warn(`⚠️ Unmapped font weights in ${path.basename(filePath)}:`);
        transformReport.unmappedFontWeights.forEach((entry) =>
          console.warn(`  - ${entry.path}: ${entry.value}`),
        );
      }
    }

    const allTokenIndex = buildFlatTokenIndex(allTokens, report, globalLookup);
    const allTokensDoc = {
      summary: {
        total: allTokenIndex.length,
      },
      tokens: allTokenIndex,
    };
    fs.writeFileSync(tokensYamlPath, generateYamlDocument(allTokensDoc));

    console.log("✅ Tokens generated from local exports!");
    console.log(`📁 Files created in ${path.relative(REPO_ROOT, OUTPUT_DIR)}/`);
    console.log(
      "   • css/*.css, json/*.json, ts/*.ts (per-file files) + tokens.yaml",
    );

    const sanityToken = allTokens.find(
      (token) => token.pathSegments.join("/") === "Breakpoint/100",
    );
    if (sanityToken && sanityToken.cssVar !== "--breakpoint-100") {
      console.warn(
        `⚠️ Sanity check failed: Breakpoint/100 cssVar is ${sanityToken.cssVar}`,
      );
    }

    console.log("📊 Extract report:");
    console.log(`   • missing codeSyntax.WEB: ${report.missingWeb.length}`);
    console.log(`   • unparseable codeSyntax.WEB: ${report.invalidWeb.length}`);
    console.log(
      `   • duplicate css var names (same scope): ${report.duplicates.length}`,
    );
    if (report.missingAliasTargets.length > 0) {
      console.log(
        `   • missing alias targets: ${report.missingAliasTargets.length}`,
      );
    }
    if (report.aliasCycles.length > 0) {
      console.log(`   • alias cycles: ${report.aliasCycles.length}`);
    }

    if (report.missingWeb.length > 0) {
      console.warn("⚠️ Tokens missing codeSyntax.WEB (fallback applied):");
      report.missingWeb.forEach((entry) => console.warn(`  - ${entry}`));
    }
    if (report.invalidWeb.length > 0) {
      console.warn("⚠️ Tokens with invalid codeSyntax.WEB (fallback applied):");
      report.invalidWeb.forEach((entry) => console.warn(`  - ${entry}`));
    }
    if (report.duplicates.length > 0) {
      console.warn("⚠️  Duplicate cssVar names within the same scope:");
      report.duplicates.forEach((entry) =>
        console.warn(
          `   • [${entry.scope}] ${entry.name}: winner ${entry.winner}, dropped ${entry.dropped}`,
        ),
      );
    }
    if (report.missingAliasTargets.length > 0) {
      console.warn("⚠️ Alias target not found (literal fallback applied):");
      report.missingAliasTargets.forEach((entry) =>
        console.warn(`  - ${entry}`),
      );

      // Generate mock suggestions for missing alias targets
      const missingRefs = new Map();
      for (const tokenPath of report.missingAliasTargets) {
        const token = allTokens.find((t) => t.path === tokenPath);
        if (!token) continue;
        const refPath = token.aliasRefPath || token.aliasTargetName;
        if (refPath && !missingRefs.has(refPath)) {
          missingRefs.set(refPath, {
            ref: refPath,
            referencedBy: [],
            suggestedMock: suggestMockValue(refPath),
          });
        }
        if (refPath) {
          missingRefs.get(refPath).referencedBy.push(tokenPath);
        }
      }

      if (missingRefs.size > 0) {
        const mockReport = {
          generated: new Date().toISOString(),
          description: "Missing alias targets — these tokens are referenced but do not exist in any Figma export. Create them in Figma or add temporary mocks.",
          missing: [...missingRefs.values()],
        };
        const mockReportPath = path.join(OUTPUT_DIR, "missing-tokens.json");
        fs.writeFileSync(mockReportPath, JSON.stringify(mockReport, null, 2));
        console.warn(`\n📋 Missing token report written to ${path.relative(REPO_ROOT, mockReportPath)}`);
        console.warn("   Options:");
        console.warn("   1. Create these variables in Figma and re-export");
        console.warn("   2. Run: npm run tokens:generate -- --strict  (fail without mocks)");
      }
    }
    if (report.aliasCycles.length > 0) {
      console.warn("⚠️ Alias cycle detected (literal fallback applied):");
      report.aliasCycles.forEach((entry) => console.warn(`  - ${entry}`));
    }

    const shouldTrash =
      process.argv.includes("--trash") ||
      process.env.npm_config_trash === "true";
    if (shouldTrash) {
      for (const filePath of files) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      console.log("🧹 Removed source exports from figma/exports");
    }
  } catch (error) {
    console.error("❌ Error extracting tokens:", error.message);
    process.exit(1);
  }
}

function generateCSS(tokens, scope) {
  const selector = selectorForScope(scope);
  let css = `/* Auto-generated design tokens from Figma */\n/* Generated on ${new Date().toISOString()} */\n\n${selector} {\n`;

  const merged = {
    ...tokens.colors,
    ...tokens.typography,
    ...tokens.spacing,
    ...tokens.radii,
    ...tokens.shadows,
    ...tokens.breakpoints,
    ...tokens.containers,
    ...tokens.components,
  };

  Object.entries(merged).forEach(([key, value]) => {
    let cssValue = value;
    if (key.startsWith("--font-weight-")) {
      const mapped = toNumericFontWeight(value);
      if (mapped !== null) cssValue = mapped;
    }
    css += `  ${key}: ${cssValue};\n`;
  });

  css += `}\n`;
  return css;
}

function generateTypeScript(tokens) {
  const compact = compactTokenGroups(tokens);

  const typeDefinitions = [
    ["colors", "ColorToken"],
    ["typography", "TypographyToken"],
    ["spacing", "SpacingToken"],
    ["radii", "RadiusToken"],
    ["shadows", "ShadowToken"],
    ["breakpoints", "BreakpointToken"],
    ["containers", "ContainerToken"],
    ["components", "ComponentToken"],
  ]
    .filter(([group]) => Object.prototype.hasOwnProperty.call(compact, group))
    .map(
      ([group, typeName]) =>
        `export type ${typeName} = keyof typeof tokens.${group};`,
    )
    .join("\n");

  return `// Auto-generated design tokens from Figma\n// Generated on ${new Date().toISOString()}\n\nexport const tokens = ${JSON.stringify(
    compact,
    null,
    2,
  )} as const;\n\n${typeDefinitions}\n`;
}

function compactTokenGroups(tokens) {
  return Object.fromEntries(
    Object.entries(tokens).filter(([, value]) => {
      return (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length > 0
      );
    }),
  );
}

function generateYamlDocument(data) {
  return `# Auto-generated design tokens from Figma\n# Generated on ${new Date().toISOString()}\n\n${toYaml(data)}\n`;
}

function toYaml(value, indent = 0) {
  const spacing = " ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return `${spacing}[]`;
    return value
      .map((item) => {
        if (item && typeof item === "object") {
          const nested = toYaml(item, indent + 2);
          return `${spacing}-\n${nested}`;
        }
        return `${spacing}- ${formatYamlScalar(item)}`;
      })
      .join("\n");
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return `${spacing}{}`;

    return entries
      .map(([key, entryValue]) => {
        const yamlKey = formatYamlKey(key);
        if (entryValue && typeof entryValue === "object") {
          return `${spacing}${yamlKey}:\n${toYaml(entryValue, indent + 2)}`;
        }
        return `${spacing}${yamlKey}: ${formatYamlScalar(entryValue)}`;
      })
      .join("\n");
  }

  return `${spacing}${formatYamlScalar(value)}`;
}

function formatYamlKey(key) {
  if (/^[a-zA-Z0-9_-]+$/.test(key)) return key;
  return JSON.stringify(key);
}

function formatYamlScalar(value) {
  if (value === null) return "null";
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(String(value));
}

if (require.main === module) {
  extractTokens();
}

module.exports = { extractTokens };
