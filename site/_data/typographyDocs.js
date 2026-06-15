const {
  TOKENS_YAML_RELATIVE_PATH,
  loadTokensFromYaml,
} = require("../lib/tokens-yaml");

module.exports = () => {
  const tokens = loadTokensFromYaml().filter(
    (t) => t.cssVar && t.cssVar.startsWith("--"),
  );

  // Font families
  const families = tokens
    .filter((t) => t.cssVar.startsWith("--font-family-"))
    .map((t) => ({
      cssVar: t.cssVar,
      name: t.cssVar.replace("--font-family-", ""),
      value: String(t.value || ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Font sizes (core scale)
  const sizes = tokens
    .filter(
      (t) =>
        t.cssVar.startsWith("--font-size-") &&
        !t.cssVar.includes("badge") &&
        !t.cssVar.includes("button") &&
        !t.cssVar.includes("input") &&
        !t.cssVar.includes("link") &&
        !t.cssVar.includes("select") &&
        !t.cssVar.includes("textarea"),
    )
    .map((t) => ({
      cssVar: t.cssVar,
      name: t.cssVar.replace("--", ""),
      value: String(t.value || ""),
    }))
    .sort((a, b) => {
      const order = ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl"];
      const aKey = a.name.replace("font-size-", "");
      const bKey = b.name.replace("font-size-", "");
      return order.indexOf(aKey) - order.indexOf(bKey);
    });

  // Font weights
  const weights = tokens
    .filter(
      (t) =>
        t.cssVar.startsWith("--font-weight-") &&
        /--font-weight-\d+$/.test(t.cssVar),
    )
    .map((t) => ({
      cssVar: t.cssVar,
      name: t.cssVar.replace("--", ""),
      value: String(t.value || ""),
    }))
    .sort((a, b) => Number(a.value) - Number(b.value));

  // Line heights
  const lineHeights = tokens
    .filter(
      (t) =>
        t.cssVar.startsWith("--line-height-") &&
        !t.cssVar.includes("badge") &&
        !t.cssVar.includes("button") &&
        !t.cssVar.includes("input") &&
        !t.cssVar.includes("link") &&
        !t.cssVar.includes("select") &&
        !t.cssVar.includes("textarea"),
    )
    .map((t) => ({
      cssVar: t.cssVar,
      name: t.cssVar.replace("--", ""),
      value: String(t.value || ""),
    }))
    .sort((a, b) => {
      const order = ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl"];
      const aKey = a.name.replace("line-height-", "");
      const bKey = b.name.replace("line-height-", "");
      return order.indexOf(aKey) - order.indexOf(bKey);
    });

  // Brand font tokens
  const brandFonts = tokens
    .filter(
      (t) =>
        t.cssVar.startsWith("--brand-font-") &&
        t.scopeBucket === "brand",
    )
    .map((t) => ({
      cssVar: t.cssVar,
      name: t.cssVar.replace("--", ""),
      value: String(t.value || ""),
      brand: t.scopeId || "",
    }));

  // Heading scale tokens
  const headingScale = [
    { class: "heading-xxxl", label: "XXXL", element: "h1" },
    { class: "heading-xxl", label: "XXL", element: "h2" },
    { class: "heading-xl", label: "XL", element: "h3" },
    { class: "heading-lg", label: "LG", element: "h4" },
    { class: "heading-md", label: "MD", element: "h5" },
    { class: "heading-sm", label: "SM", element: "h6" },
  ];

  // Text scale
  const textScale = [
    { class: "text-xxxl", label: "XXXL" },
    { class: "text-xxl", label: "XXL" },
    { class: "text-xl", label: "XL" },
    { class: "text-lg", label: "LG" },
    { class: "text-md", label: "MD" },
    { class: "text-sm", label: "SM" },
    { class: "text-xs", label: "XS" },
  ];

  return {
    families,
    sizes,
    weights,
    lineHeights,
    brandFonts,
    headingScale,
    textScale,
    sourceDir: TOKENS_YAML_RELATIVE_PATH,
  };
};
