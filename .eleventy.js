const { renderComponentTokenTable } = require("./site/lib/component-token-table.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("componentTokenTable", renderComponentTokenTable);
  eleventyConfig.addPassthroughCopy({
    "dist/main.css": "vendor/ui-foundations/main.css",
  });
  eleventyConfig.addPassthroughCopy({
    "src/ui/components": "vendor/ui-foundations/components",
  });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "site/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "site/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "site/site.webmanifest": "site.webmanifest" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/prism-okaidia.min.css":
      "assets/vendor/prism/prism.css",
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/prism.js": "assets/vendor/prism/prism.js",
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/components/prism-markup.min.js":
      "assets/vendor/prism/prism-markup.min.js",
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/components/prism-jsx.min.js":
      "assets/vendor/prism/prism-jsx.min.js",
  });
  eleventyConfig.addCollection("tokensDocs", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("site/tokens/**/*.md")
      .sort((a, b) => {
        const aOrder = Number(a.data.order || 999);
        const bOrder = Number(b.data.order || 999);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return String(a.data.title || "").localeCompare(
          String(b.data.title || ""),
        );
      });
  });
  eleventyConfig.addCollection("componentsDocs", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("site/patterns/**/*.md")
      .filter((entry) => !entry.data.isPlayground)
      .sort((a, b) => {
        const aOrder = Number(a.data.order || 999);
        const bOrder = Number(b.data.order || 999);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return String(a.data.title || "").localeCompare(
          String(b.data.title || ""),
        );
      });
  });
  eleventyConfig.addCollection("examplesDocs", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("site/examples/**/*.md")
      .sort((a, b) => {
        const aOrder = Number(a.data.order || 999);
        const bOrder = Number(b.data.order || 999);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return String(a.data.title || "").localeCompare(
          String(b.data.title || ""),
        );
      });
  });
  eleventyConfig.addCollection("foundationsDocs", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("site/foundations/**/*.md")
      .filter((entry) => entry.data.permalink !== "/foundations/" && entry.data.permalink !== "/foundations/design-tokens/" && entry.data.permalink !== "/foundations/governance/" && !String(entry.data.permalink || "").startsWith("/foundations/governance/") && !entry.data.excludeFromNav)
      .sort((a, b) => {
        const aOrder = Number(a.data.order || 999);
        const bOrder = Number(b.data.order || 999);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return String(a.data.title || "").localeCompare(
          String(b.data.title || ""),
        );
      });
  });

  eleventyConfig.addCollection("primitivesDocs", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("site/primitives/**/*.md")
      .filter((entry) => entry.data.permalink !== "/primitives/")
      .sort((a, b) => {
        const aOrder = Number(a.data.order || 999);
        const bOrder = Number(b.data.order || 999);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return String(a.data.title || "").localeCompare(
          String(b.data.title || ""),
        );
      });
  });

  eleventyConfig.addCollection("governanceDocs", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter((entry) => {
        const p = String(entry.data.permalink || "");
        return p.startsWith("/foundations/governance/") && p !== "/foundations/governance/";
      })
      .sort((a, b) => {
        const aOrder = Number(a.data.order || 999);
        const bOrder = Number(b.data.order || 999);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return String(a.data.title || "").localeCompare(
          String(b.data.title || ""),
        );
      });
  });

  eleventyConfig.addCollection("searchIndex", (collectionApi) => {
    const foundations = collectionApi
      .getFilteredByGlob("site/foundations/**/*.md")
      .filter((page) => page.data.title);
    const components = collectionApi
      .getFilteredByGlob("site/patterns/**/*.md")
      .filter((page) => !page.data.isPlayground && page.data.title);

    const entries = [];

    for (const page of foundations) {
      entries.push({
        title: page.data.title,
        description: page.data.description || "",
        url: page.url,
        type: "token",
      });
    }

    for (const page of components) {
      entries.push({
        title: page.data.title,
        description: page.data.description || "",
        url: page.url,
        type: "pattern",
      });
    }

    return entries;
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "site",
      output: "_site",
    },
  };
};
