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
      scopeBucket: String(token.scopeBucket || ""),
      scopeId: String(token.scopeId || ""),
    }));
}

function sortByName(tokens) {
  return [...tokens].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true }),
  );
}

function pickByScope(tokens, bucket, id) {
  return tokens.filter(
    (token) => token.scopeBucket === bucket && token.scopeId === id,
  );
}

function pickByPrefixes(tokens, prefixes) {
  return tokens.filter((token) =>
    prefixes.some((prefix) => token.cssVar.startsWith(prefix)),
  );
}

module.exports = () => {
  const tokens = normalizeTokens(loadTokensFromYaml());
  const semanticPrefixes = [
    "--color-text-",
    "--color-fill-",
    "--color-border-",
    "--color-overlay-",
  ];

  const groups = [
    {
      id: "brand-a",
      title: "Brand A",
      description: "Filtered from tokens.yaml (scope brand:a).",
      tokens: sortByName(
        pickByPrefixes(pickByScope(tokens, "brand", "a"), ["--brand-color-"]),
      ),
    },
    {
      id: "brand-b",
      title: "Brand B",
      description: "Filtered from tokens.yaml (scope brand:b).",
      tokens: sortByName(
        pickByPrefixes(pickByScope(tokens, "brand", "b"), ["--brand-color-"]),
      ),
    },
    {
      id: "brand-c",
      title: "Brand C",
      description: "Filtered from tokens.yaml (scope brand:c).",
      tokens: sortByName(
        pickByPrefixes(pickByScope(tokens, "brand", "c"), ["--brand-color-"]),
      ),
    },
    {
      id: "light-semantic",
      title: "Light Semantic Mapping",
      description: "Filtered from tokens.yaml (scope mode:light).",
      tokens: sortByName(
        pickByPrefixes(pickByScope(tokens, "mode", "light"), semanticPrefixes),
      ),
    },
    {
      id: "dark-semantic",
      title: "Dark Semantic Mapping",
      description: "Filtered from tokens.yaml (scope mode:dark).",
      tokens: sortByName(
        pickByPrefixes(pickByScope(tokens, "mode", "dark"), semanticPrefixes),
      ),
    },
    {
      id: "core-neutral-overlay",
      title: "Core Neutrals & Overlay",
      description: "Filtered from tokens.yaml (scope global:core-primitives).",
      tokens: sortByName(
        pickByPrefixes(pickByScope(tokens, "global", "core-primitives"), [
          "--color-transparent",
          "--color-neutral-",
          "--color-neutral-alpha-",
        ]),
      ),
    },
  ].filter((group) => group.tokens.length > 0);

  return {
    groups,
    sourceDir: TOKENS_YAML_RELATIVE_PATH,
  };
};
