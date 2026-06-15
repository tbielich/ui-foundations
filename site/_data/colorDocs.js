const {
  TOKENS_YAML_RELATIVE_PATH,
  loadTokensFromYaml,
} = require("../lib/tokens-yaml");

function normalizeTokens(tokens) {
  return tokens
    .filter((token) => String(token?.cssVar || "").startsWith("--"))
    .map((token) => ({
      cssVar: String(token.cssVar),
      name: String(token.name || token.cssVar.replace(/^--/, "")),
      value: token.value ?? "",
      type: String(token.type || ""),
      path: String(token.path || ""),
      scopeBucket: String(token.scopeBucket || ""),
      scopeId: String(token.scopeId || ""),
    }));
}

/**
 * Extract hex from an rgb(...) or direct hex value string.
 */
function extractHex(value) {
  if (!value) return "";
  const str = String(value).trim();
  if (str.startsWith("#")) return str.toUpperCase();
  const rgbMatch = str.match(
    /rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*[\d.]+)?\s*\)/,
  );
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    return (
      "#" +
      [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase()
    );
  }
  return str;
}

/**
 * Compute relative luminance from hex color.
 */
function luminance(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Contrast ratio against white (#FFFFFF).
 */
function contrastVsWhite(hex) {
  if (!hex || hex.length < 7) return "";
  const lum = luminance(hex);
  const whiteLum = 1;
  const ratio = (whiteLum + 0.05) / (lum + 0.05);
  return ratio.toFixed(2);
}

/**
 * Group color primitives by family (e.g. "Brand A / Green", "Neutral").
 */
function groupByFamily(tokens) {
  const families = new Map();

  for (const token of tokens) {
    if (token.type !== "color") continue;
    if (!token.path.startsWith("Color/")) continue;

    // Skip alpha/overlay/transparent tokens — handled separately
    const pathAfterColor = token.path.slice(6); // remove "Color/"
    if (pathAfterColor.startsWith("Transparent")) continue;

    // Parse family and step from path like "Brand A/Green/100" or "Neutral/400"
    const parts = pathAfterColor.split("/");
    let family;
    let step;

    if (parts.length === 3) {
      // e.g. ["Brand A", "Green", "100"]
      family = parts[0] + " / " + parts[1];
      step = parts[2];
    } else if (parts.length === 2) {
      // e.g. ["Neutral", "400"] or ["Neutral", "Alpha"]
      if (/^\d+$/.test(parts[1])) {
        family = parts[0];
        step = parts[1];
      } else {
        // Sub-family like "Neutral/Alpha"
        family = parts[0] + " / " + parts[1];
        step = "";
      }
    } else if (parts.length === 4) {
      // e.g. ["Neutral", "Alpha", "Inverse", "100"]
      family = parts.slice(0, -1).join(" / ");
      step = parts[parts.length - 1];
    } else {
      continue;
    }

    if (!step || !/^\d+$/.test(step)) continue;

    if (!families.has(family)) {
      families.set(family, []);
    }

    const hex = extractHex(token.value);

    families.get(family).push({
      step: parseInt(step, 10),
      cssVar: token.cssVar,
      name: token.name,
      hex,
      contrast: contrastVsWhite(hex),
      value: token.value,
    });
  }

  // Sort steps within each family
  for (const [, steps] of families) {
    steps.sort((a, b) => a.step - b.step);
  }

  return families;
}

/**
 * Group semantic color tokens by category (text, fill, border, overlay).
 */
function groupSemanticByCategory(tokens, bucket, id) {
  const scoped = tokens.filter(
    (t) => t.scopeBucket === bucket && t.scopeId === id,
  );

  const categories = {
    text: [],
    fill: [],
    border: [],
    overlay: [],
  };

  for (const token of scoped) {
    if (token.cssVar.startsWith("--color-text-")) categories.text.push(token);
    else if (token.cssVar.startsWith("--color-fill-")) categories.fill.push(token);
    else if (token.cssVar.startsWith("--color-border-")) categories.border.push(token);
    else if (token.cssVar.startsWith("--color-overlay-")) categories.overlay.push(token);
  }

  return Object.entries(categories)
    .filter(([, items]) => items.length > 0)
    .map(([category, items]) => ({
      category,
      tokens: items.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

module.exports = () => {
  const tokens = normalizeTokens(loadTokensFromYaml());

  // Primitive color palettes (core)
  const coreTokens = tokens.filter(
    (t) => t.scopeBucket === "global" && t.scopeId === "core-primitives",
  );
  const paletteFamilies = groupByFamily(coreTokens);

  // Organize into sections
  const palettes = [];
  const familyOrder = [
    "Neutral",
    "Neutral / Alpha",
    "Neutral / Alpha Inverse",
  ];

  // Add neutrals first
  for (const name of familyOrder) {
    if (paletteFamilies.has(name)) {
      palettes.push({ family: name, steps: paletteFamilies.get(name) });
      paletteFamilies.delete(name);
    }
  }

  // Remaining families sorted alphabetically
  const remaining = [...paletteFamilies.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
  for (const [name, steps] of remaining) {
    palettes.push({ family: name, steps });
  }

  // Brand tokens (semantic brand aliases)
  const brandGroups = ["a", "b", "c"]
    .map((id) => {
      const brandTokens = tokens.filter(
        (t) =>
          t.scopeBucket === "brand" &&
          t.scopeId === id &&
          t.cssVar.startsWith("--brand-color-"),
      );
      if (brandTokens.length === 0) return null;
      return {
        id,
        title: "Brand " + id.toUpperCase(),
        tokens: brandTokens.sort((a, b) => a.name.localeCompare(b.name)),
      };
    })
    .filter(Boolean);

  // Semantic mapping (light/dark)
  const lightSemantic = groupSemanticByCategory(tokens, "mode", "light");
  const darkSemantic = groupSemanticByCategory(tokens, "mode", "dark");

  return {
    palettes,
    brandGroups,
    lightSemantic,
    darkSemantic,
    sourceDir: TOKENS_YAML_RELATIVE_PATH,
  };
};
