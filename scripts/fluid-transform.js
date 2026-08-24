/**
 * Fluid Typography Transform Module
 *
 * Detects multi-mode typography tokens (Min/Max) from the Typography Scale
 * collection and generates CSS clamp() values for fluid interpolation.
 *
 * Architecture:
 *   - Reads tokens.config.json for container bounds and mode names
 *   - Identifies tokens where Min ≠ Max
 *   - Generates clamp(minRem, intercept + slope*cqi, maxRem)
 *   - Uses container query inline units (cqi) instead of viewport units (vw)
 *     so typography scales relative to its container, not the viewport.
 *     This ensures correct sizing in multi-column layouts, sidebars, and cards.
 *   - Returns transformed CSS values for the pipeline to use
 *
 * Requires: container-type: inline-size on an ancestor element.
 *
 * See: docs/foundations/foundation-013-fluid-typography.md
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(REPO_ROOT, "tokens.config.json");

/**
 * Load fluid configuration from tokens.config.json.
 * Returns defaults if config is missing.
 */
function loadFluidConfig() {
  const defaults = {
    containerMin: 320,
    containerMax: 1200,
    baseFontSize: 16,
    unit: "rem",
    modes: { min: "Min", max: "Max" },
    collections: ["Typography Scale"],
  };

  if (!fs.existsSync(CONFIG_PATH)) {
    return defaults;
  }

  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    const config = JSON.parse(raw);
    return { ...defaults, ...(config.fluid || {}) };
  } catch {
    return defaults;
  }
}

/**
 * Calculate a CSS clamp() expression from min/max pixel values and container bounds.
 *
 * Uses container query inline units (cqi) so text scales relative to its
 * container width, not the viewport. Works correctly in columns, sidebars, cards.
 *
 * Formula (Utopia-aligned, adapted for cqi):
 *   slope = (max - min) / (containerMax - containerMin)
 *   intercept = min - slope * containerMin
 *   clamp(minRem, interceptRem + slope*100cqi, maxRem)
 *
 * @param {number} minPx - Minimum value in pixels
 * @param {number} maxPx - Maximum value in pixels
 * @param {number} containerMin - Minimum container width in pixels
 * @param {number} containerMax - Maximum container width in pixels
 * @param {number} baseFontSize - Base font size for rem conversion (default 16)
 * @returns {string} CSS clamp() expression
 */
function computeClamp(minPx, maxPx, containerMin, containerMax, baseFontSize = 16) {
  if (minPx === maxPx) {
    return `${roundTo(minPx / baseFontSize, 4)}rem`;
  }

  const minRem = minPx / baseFontSize;
  const maxRem = maxPx / baseFontSize;
  const slope = (maxPx - minPx) / (containerMax - containerMin);
  const intercept = minPx - slope * containerMin;
  const interceptRem = intercept / baseFontSize;
  const slopeCqi = slope * 100;

  const minStr = `${roundTo(minRem, 4)}rem`;
  const maxStr = `${roundTo(maxRem, 4)}rem`;

  // Build preferred value: intercept + slope*cqi
  const interceptStr = `${roundTo(interceptRem, 4)}rem`;
  const slopeStr = `${roundTo(slopeCqi, 4)}cqi`;

  let preferred;
  if (interceptRem === 0) {
    preferred = slopeStr;
  } else if (interceptRem > 0) {
    preferred = `${interceptStr} + ${slopeStr}`;
  } else {
    preferred = `${roundTo(Math.abs(interceptRem), 4)}rem - ${slopeStr}`;
    // Negative intercept with positive slope: intercept + slope*cqi
    // Rewrite as: -|intercept| + slope*cqi → slope*cqi - |intercept|
    preferred = `${slopeStr} - ${roundTo(Math.abs(interceptRem), 4)}rem`;
  }

  // If slope is negative (min > max, shouldn't happen with valid input), swap
  if (minPx > maxPx) {
    return `clamp(${maxStr}, ${preferred}, ${minStr})`;
  }

  return `clamp(${minStr}, ${preferred}, ${maxStr})`;
}

/**
 * Round a number to a given number of decimal places, removing trailing zeros.
 */
function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Determine if a token file is a fluid typography collection.
 *
 * @param {object} data - Parsed JSON token file content
 * @param {string} fileName - Filename for matching
 * @param {object} config - Fluid configuration
 * @returns {boolean}
 */
function isFluidCollection(data, fileName, config) {
  if (!config || !config.collections) return false;
  const baseName = fileName.replace(/\.(token|tokens)\.jsonc?$/i, "").replace(/\.jsonc?$/i, "");
  return config.collections.some(
    (c) => baseName.toLowerCase() === c.toLowerCase()
  );
}

/**
 * Extract fluid token data from a Typography Scale token file.
 * Returns an array of { cssVar, clampValue, minPx, maxPx } objects.
 *
 * @param {object} data - Parsed JSON token file
 * @param {object} config - Fluid configuration
 * @returns {Array<{cssVar: string, clampValue: string, minPx: number, maxPx: number, path: string}>}
 */
function extractFluidTokens(data, config) {
  const results = [];
  const minMode = config.modes.min;
  const maxMode = config.modes.max;

  function walk(node, segments) {
    if (!node || typeof node !== "object") return;

    // Check if this is a token node (has $type and $value)
    if (node.$type !== undefined && node.$value !== undefined) {
      const modeValues = node.$extensions && node.$extensions["com.figma.modeValues"];
      if (!modeValues) return;

      const minVal = modeValues[minMode];
      const maxVal = modeValues[maxMode];

      if (minVal === undefined || maxVal === undefined) return;
      if (typeof minVal !== "number" || typeof maxVal !== "number") return;

      // Only generate clamp if min !== max (fluid behavior)
      if (minVal === maxVal) return;

      // Get CSS variable name from codeSyntax
      const webSyntax =
        node.$extensions &&
        node.$extensions["com.figma.codeSyntax"] &&
        node.$extensions["com.figma.codeSyntax"].WEB;

      if (!webSyntax) return;

      // Extract --var-name from var(--var-name)
      const varMatch = webSyntax.match(/var\((--[^)]+)\)/);
      const cssVar = varMatch ? varMatch[1] : null;
      if (!cssVar) return;

      const clampValue = computeClamp(
        minVal,
        maxVal,
        config.containerMin,
        config.containerMax,
        config.baseFontSize
      );

      results.push({
        cssVar,
        clampValue,
        minPx: minVal,
        maxPx: maxVal,
        path: segments.join("/"),
      });

      return;
    }

    // Recurse into child nodes
    for (const [key, val] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      walk(val, [...segments, key]);
    }
  }

  walk(data, []);
  return results;
}

/**
 * Validate fluid tokens. Returns an array of error messages.
 *
 * @param {Array} fluidTokens - Output from extractFluidTokens
 * @param {object} config - Fluid configuration
 * @returns {Array<string>} Validation errors (empty = valid)
 */
function validateFluidTokens(fluidTokens, config) {
  const errors = [];
  const minAllowed = 12; // Minimum 12px (0.75rem) for accessibility

  for (const token of fluidTokens) {
    if (token.minPx > token.maxPx) {
      errors.push(
        `${token.cssVar}: min (${token.minPx}px) > max (${token.maxPx}px) — fluid slope would be negative`
      );
    }
    if (token.minPx < minAllowed) {
      errors.push(
        `${token.cssVar}: min value ${token.minPx}px is below ${minAllowed}px accessibility floor`
      );
    }
    if (config.viewportMin >= config.viewportMax) {
      errors.push(
        `${token.cssVar}: viewportMin (${config.viewportMin}) >= viewportMax (${config.viewportMax})`
      );
    }
  }

  return errors;
}

module.exports = {
  loadFluidConfig,
  computeClamp,
  isFluidCollection,
  extractFluidTokens,
  validateFluidTokens,
  roundTo,
};
