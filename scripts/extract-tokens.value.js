const { toKebabCase, formatLength } = require("./extract-tokens.utils.js");
const { resolveAliasRef } = require("./extract-tokens.lookup.js");
const { classifyPatternTokenName } = require("./vault-naming-contract.js");

function normalizeColor(value) {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object") {
    if (Array.isArray(value.components)) {
      const [r, g, b] = value.components;
      const a = value.alpha === undefined ? 1 : value.alpha;
      return a < 1 ? toRgba(r, g, b, a) : toRgb(r, g, b);
    }
    if (typeof value.hex === "string") return value.hex;
  }
  return value;
}

function toRgb(r, g, b) {
  const to255 = (c) => Math.round(c * 255);
  return `rgb(${to255(r)} ${to255(g)} ${to255(b)})`;
}

function toRgba(r, g, b, a) {
  const to255 = (c) => Math.round(c * 255);
  const alpha = Number(a.toFixed(4)).toString();
  return `rgba(${to255(r)} ${to255(g)} ${to255(b)} / ${alpha})`;
}

function isBreakpointToken(segments) {
  return String(segments[0] || "").toLowerCase() === "breakpoint";
}

function isContainerToken(segments) {
  return String(segments[0] || "").toLowerCase() === "container";
}

function isLayoutColumnsToken(segments) {
  return (
    String(segments[0] || "").toLowerCase() === "layout" &&
    String(segments[1] || "").toLowerCase() === "columns"
  );
}

function isLayoutPxToken(segments) {
  if (String(segments[0] || "").toLowerCase() !== "layout") return false;
  const second = String(segments[1] || "").toLowerCase();
  return (
    second.includes("max width") ||
    second.includes("column max width") ||
    second.includes("breakpoint")
  );
}

function formatPx(value) {
  if (typeof value === "number") return `${value}px`;
  return value;
}

function buildTokenKey(segments) {
  return toKebabCase(segments.join("-"));
}

function isFontWeightPath(segments) {
  const joined = segments.join(".").toLowerCase();
  return (
    joined.startsWith("font.weight") ||
    joined.endsWith(".font weight") ||
    joined.includes(".font.weight")
  );
}

function toNumericFontWeight(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (/^\d{1,4}$/.test(trimmed)) {
    return Number(trimmed);
  }

  const normalized = trimmed.toLowerCase().replace(/[\s_]+/g, "-");
  const map = {
    thin: 100,
    "extra-light": 200,
    light: 300,
    normal: 400,
    regular: 400,
    medium: 500,
    "semi-bold": 600,
    bold: 700,
    "extra-bold": 800,
    black: 900,
  };
  return map[normalized] ?? null;
}

function formatTokenValue(token, rawValue, tokenKey, segments) {
  const type = String(token.type || "").toLowerCase();
  const lowerKey = tokenKey.toLowerCase();

  if (type === "color") {
    return normalizeColor(rawValue);
  }

  if (isFontWeightPath(segments)) {
    const mapped = toNumericFontWeight(rawValue);
    if (mapped !== null) return mapped;
  }

  if (type === "number") {
    if (lowerKey.startsWith("zindex-") || lowerKey.startsWith("z-index-")) {
      return rawValue;
    }
    if (isLayoutColumnsToken(segments)) {
      return rawValue;
    }
    if (isLayoutPxToken(segments)) {
      return formatPx(rawValue);
    }
    if (isBreakpointToken(segments) || isContainerToken(segments)) {
      return formatPx(rawValue);
    }
    return formatLength(rawValue);
  }

  if (type === "shadow") {
    if (
      rawValue &&
      typeof rawValue === "object" &&
      rawValue.offsetX !== undefined
    ) {
      return `${formatLength(rawValue.offsetX)} ${formatLength(
        rawValue.offsetY,
      )} ${formatLength(rawValue.blur)} ${rawValue.color}`;
    }
  }

  if (type === "dimension") {
    if (rawValue && typeof rawValue === "object" && rawValue.value !== undefined) {
      const num = Number(rawValue.value);
      if (rawValue.unit === "rem") return `${num}rem`;
      return formatLength(num);
    }
  }

  if (lowerKey.startsWith("zindex-") || lowerKey.startsWith("z-index-")) {
    return rawValue;
  }

  return formatLength(rawValue);
}

function resolveTokenOutputValue(token, lookup, report) {
  let resolved = token.value;
  if (token.aliasTargetId || token.aliasTargetName || token.aliasRefPath) {
    const aliasRef = resolveAliasRef(token, lookup, report);
    if (aliasRef) {
      resolved = aliasRef;
    }
  }
  const segments = token.pathSegments || [];
  const tokenKey = buildTokenKey(segments);

  // If value is still an unresolved $ref object (e.g. font weight alias),
  // try to extract a usable value from the ref path
  if (resolved && typeof resolved === "object" && resolved.$ref) {
    const refPath = String(resolved.$ref);
    // Font weight refs like "Font/Weight/700" → extract the number
    if (isFontWeightPath(segments)) {
      const lastSegment = refPath.split("/").pop();
      const mapped = toNumericFontWeight(lastSegment);
      if (mapped !== null) return mapped;
    }
    // Fall back to var() reference from the ref path
    resolved = `var(--${toKebabCase(refPath.replace(/[/.]/g, "-"))})`;
  }

  return formatTokenValue(token, resolved, tokenKey, segments);
}

function classifyTokenGroup(token) {
  const segments = token.pathSegments || [];
  const category = String(segments[0] || "").toLowerCase();
  const subCategory = String(segments[1] || "").toLowerCase();
  const prefix = String(token.cssVar || "").toLowerCase();

  if (
    category === "color" ||
    (category === "brand" && subCategory === "color") ||
    prefix.startsWith("--color-") ||
    prefix.startsWith("--brand-color-")
  ) {
    return "colors";
  }

  if (
    category === "typography" ||
    (category === "brand" && subCategory === "font") ||
    prefix.startsWith("--typography-") ||
    prefix.startsWith("--font-") ||
    prefix.startsWith("--brand-font-") ||
    prefix.startsWith("--line-height-") ||
    prefix.startsWith("--letter-spacing-")
  ) {
    return "typography";
  }

  if (
    category === "spacing" ||
    category === "space" ||
    (category === "brand" && subCategory === "spacing") ||
    prefix.startsWith("--spacing-") ||
    prefix.startsWith("--space-") ||
    prefix.startsWith("--brand-spacing-") ||
    prefix.startsWith("--size-spacing-")
  ) {
    return "spacing";
  }

  if (
    category === "radius" ||
    category === "corner" ||
    (category === "brand" &&
      (subCategory === "corner" || subCategory === "radius")) ||
    prefix.startsWith("--radius-") ||
    prefix.startsWith("--corner-") ||
    prefix.startsWith("--brand-radius-") ||
    prefix.startsWith("--brand-corner-") ||
    prefix.startsWith("--size-radius-")
  ) {
    return "radii";
  }

  if (category === "shadow" || prefix.startsWith("--shadow-")) {
    return "shadows";
  }

  if (category === "breakpoint" || prefix.startsWith("--breakpoint-")) {
    return "breakpoints";
  }

  if (category === "container" || prefix.startsWith("--container-")) {
    return "containers";
  }

  if (["canonical", "deprecated"].includes(classifyPatternTokenName(prefix).status)) {
    return "components";
  }

  return "components";
}

module.exports = {
  buildTokenKey,
  classifyTokenGroup,
  formatTokenValue,
  isFontWeightPath,
  resolveTokenOutputValue,
  toNumericFontWeight,
};
