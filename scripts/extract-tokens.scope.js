const path = require("path");

function normalizeOutputBase(filePath) {
  const base = path.basename(filePath).toLowerCase().replace(/\s+/g, "-");
  return base.replace(/\.jsonc?$/i, "").replace(/[()]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function normalizePerFileBase(base) {
  if (base === "mode-light.tokens") return "color.light.tokens";
  if (base === "mode-dark.tokens") return "color.dark.tokens";
  if (base === "light-mode.tokens") return "color.light.tokens";
  if (base === "dark-mode.tokens") return "color.dark.tokens";
  if (base === "color-light.tokens") return "color.light.tokens";
  if (base === "color-dark.tokens") return "color.dark.tokens";
  return base;
}

function parseScopeKey(scopeKey) {
  const raw = String(scopeKey || "global:global");
  const separator = raw.indexOf(":");
  if (separator === -1) {
    return { bucket: raw || "global", id: "global" };
  }
  return {
    bucket: raw.slice(0, separator) || "global",
    id: raw.slice(separator + 1) || "global",
  };
}

function selectorForScope(scope) {
  if (!scope || typeof scope !== "object") return ":root";

  if (scope.bucket === "brand") {
    return `:root[data-brand="${scope.id}"]`;
  }

  if (scope.bucket === "mode") {
    if (scope.id === "light") return ":root";
    if (scope.id === "dark") return ':root[data-mode="dark"]';
    return `:root[data-mode="${scope.id}"]`;
  }

  return ":root";
}

module.exports = {
  normalizeOutputBase,
  normalizePerFileBase,
  parseScopeKey,
  selectorForScope,
};
