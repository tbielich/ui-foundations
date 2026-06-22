import test from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

// ---------------------------------------------------------------------------
// Pure logic extracted from SEO templates for property-based testing.
// These functions replicate the conditional logic in Nunjucks templates so we
// can verify correctness with random inputs.
// ---------------------------------------------------------------------------

/**
 * Sitemap page filtering logic (mirrors site/sitemap.njk).
 * Returns true if the page should be INCLUDED in the sitemap.
 */
function shouldIncludeInSitemap(page) {
  if (page.data.isPlayground) return false;
  if (page.data.noindex) return false;
  if (page.data.eleventyExcludeFromCollections) return false;
  return true;
}

/**
 * Absolute URL construction (mirrors canonical, sitemap <loc>, og:url).
 * Concatenates baseUrl (no trailing slash) with page.url (has leading slash).
 */
function buildAbsoluteUrl(baseUrl, pageUrl) {
  if (!baseUrl) return null;
  return baseUrl + pageUrl;
}

/**
 * Lastmod rendering logic (mirrors sitemap.njk).
 * Returns the lastmod value or null if no date is available.
 */
function resolveLastmod(page) {
  if (page.data.lastModified) return page.data.lastModified;
  if (page.date) return page.date.toISOString();
  return null;
}

/**
 * Title tag formatting (mirrors docs.njk head).
 */
function formatTitle(title, pageUrl) {
  if (pageUrl === "/") return "UI Foundations Docs";
  if (title) return `${title} · UI Foundations Docs`;
  return "UI Foundations Docs";
}

/**
 * Whether meta description should render (mirrors docs.njk head).
 */
function shouldRenderDescription(description) {
  return Boolean(description);
}

/**
 * Whether robots noindex meta should render (mirrors docs.njk head).
 */
function shouldRenderNoindex(page) {
  return Boolean(page.data.noindex || page.data.isPlayground);
}

/**
 * Whether JSON-LD structured data should render (mirrors docs.njk head).
 * Only for /patterns/* pages that are not playground and not the index.
 */
function shouldRenderJsonLd(page) {
  const url = page.url;
  if (!url.startsWith("/patterns/")) return false;
  if (page.data.isPlayground) return false;
  if (url === "/patterns/") return false;
  return true;
}

/**
 * LLMs.txt page filtering — a page qualifies if it is in a named collection.
 * Playground pages are excluded by virtue of not being in these collections,
 * but this validates that every qualifying page gets listed.
 */
function filterLlmsPages(pages) {
  // In practice, collections already exclude playground pages.
  // The rule: every page in the collection should appear in output.
  return pages.filter((p) => p.data.title);
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const pageDataArb = fc.record({
  title: fc.oneof(fc.string({ minLength: 1, maxLength: 60 }), fc.constant(undefined)),
  description: fc.oneof(fc.string({ minLength: 1, maxLength: 120 }), fc.constant(undefined)),
  isPlayground: fc.oneof(fc.boolean(), fc.constant(undefined)),
  noindex: fc.oneof(fc.boolean(), fc.constant(undefined)),
  eleventyExcludeFromCollections: fc.oneof(fc.boolean(), fc.constant(undefined)),
  lastModified: fc.oneof(
    fc.integer({ min: 1577836800000, max: 1893456000000 }).map((ms) => new Date(ms).toISOString()),
    fc.constant(undefined),
  ),
});

const pageArb = fc.record({
  data: pageDataArb,
  url: fc.constantFrom(
    "/",
    "/patterns/button/",
    "/patterns/input/",
    "/patterns/button-playground/",
    "/patterns/",
    "/foundations/colors/",
    "/getting-started/",
  ),
  date: fc.oneof(
    fc.integer({ min: 1577836800000, max: 1893456000000 }).map((ms) => new Date(ms)),
    fc.constant(undefined),
  ),
});

const baseUrlArb = fc.oneof(
  fc.constant("https://ui-foundations.netlify.app"),
  fc.constant("https://example.com"),
  fc.constant("https://docs.design-system.io"),
  fc.domain().map((d) => `https://${d}`), // origin only, no path (Req 8.2)
  fc.constant(""),
);

const permalinkArb = fc.constantFrom(
  "/",
  "/patterns/button/",
  "/foundations/colors/",
  "/getting-started/",
  "/patterns/checkbox/",
);

// ---------------------------------------------------------------------------
// Property 1: Sitemap page filtering
// Validates: Requirements 1.2, 1.3
// ---------------------------------------------------------------------------

test("PBT Property 1: Sitemap excludes playground, noindex, and excludeFromCollections pages", () => {
  fc.assert(
    fc.property(
      fc.array(pageArb, { minLength: 0, maxLength: 30 }),
      (pages) => {
        const included = pages.filter(shouldIncludeInSitemap);

        for (const page of included) {
          assert.ok(
            !page.data.isPlayground,
            "Playground page must not appear in sitemap",
          );
          assert.ok(
            !page.data.noindex,
            "Noindex page must not appear in sitemap",
          );
          assert.ok(
            !page.data.eleventyExcludeFromCollections,
            "ExcludeFromCollections page must not appear in sitemap",
          );
        }

        // Every page NOT excluded must be in the included set
        const expected = pages.filter(
          (p) => !p.data.isPlayground && !p.data.noindex && !p.data.eleventyExcludeFromCollections,
        );
        assert.equal(included.length, expected.length);
      },
    ),
    { numRuns: 200 },
  );
});

// ---------------------------------------------------------------------------
// Property 2: Absolute URL construction
// Validates: Requirements 1.5, 3.1, 3.2, 3.3, 5.4
// ---------------------------------------------------------------------------

test("PBT Property 2: Absolute URL is baseUrl + pageUrl with no double slashes in path", () => {
  fc.assert(
    fc.property(baseUrlArb, permalinkArb, (baseUrl, pageUrl) => {
      const result = buildAbsoluteUrl(baseUrl, pageUrl);

      if (!baseUrl) {
        assert.equal(result, null, "Empty baseUrl must produce null");
        return;
      }

      assert.ok(result.startsWith(baseUrl), "Must start with baseUrl");
      assert.ok(result.endsWith(pageUrl), "Must end with pageUrl");

      // No double slashes after protocol
      const afterProtocol = result.replace(/^https?:\/\//, "");
      assert.ok(
        !afterProtocol.includes("//"),
        `Double slash found in path: ${result}`,
      );
    }),
    { numRuns: 200 },
  );
});

// ---------------------------------------------------------------------------
// Property 3: Conditional lastmod rendering
// Validates: Requirements 1.4
// ---------------------------------------------------------------------------

test("PBT Property 3: Lastmod is present iff page has lastModified or date", () => {
  fc.assert(
    fc.property(pageArb, (page) => {
      const lastmod = resolveLastmod(page);
      const hasDate = Boolean(page.data.lastModified || page.date);

      if (hasDate) {
        assert.ok(lastmod !== null, "Must produce lastmod when date exists");
        assert.ok(typeof lastmod === "string", "Lastmod must be a string");
      } else {
        assert.equal(lastmod, null, "Must produce null when no date");
      }
    }),
    { numRuns: 200 },
  );
});

// ---------------------------------------------------------------------------
// Property 4: Title propagation
// Validates: Requirements 4.3, 5.1
// ---------------------------------------------------------------------------

test("PBT Property 4: Title tag follows format rules", () => {
  const titleArb = fc.oneof(
    fc.string({ minLength: 1, maxLength: 80 }),
    fc.constant(undefined),
  );

  fc.assert(
    fc.property(titleArb, permalinkArb, (title, pageUrl) => {
      const result = formatTitle(title, pageUrl);

      if (pageUrl === "/") {
        assert.equal(result, "UI Foundations Docs", "Homepage must have plain title");
      } else if (title) {
        assert.equal(result, `${title} · UI Foundations Docs`);
        assert.ok(result.includes(title), "Title must contain the page title");
      } else {
        assert.equal(result, "UI Foundations Docs", "Missing title falls back to site name");
      }
    }),
    { numRuns: 200 },
  );
});

// ---------------------------------------------------------------------------
// Property 5: Description propagation
// Validates: Requirements 4.1, 4.2, 5.2
// ---------------------------------------------------------------------------

test("PBT Property 5: Meta description renders iff description is non-empty", () => {
  const descArb = fc.oneof(
    fc.string({ minLength: 1, maxLength: 160 }),
    fc.constant(undefined),
    fc.constant(""),
  );

  fc.assert(
    fc.property(descArb, (description) => {
      const renders = shouldRenderDescription(description);

      if (description) {
        assert.ok(renders, "Non-empty description must render");
      } else {
        assert.ok(!renders, "Falsy description must not render");
      }
    }),
    { numRuns: 200 },
  );
});

// ---------------------------------------------------------------------------
// Property 6: Noindex meta rendering
// Validates: Requirements 9.1, 9.2, 9.3
// ---------------------------------------------------------------------------

test("PBT Property 6: Robots noindex renders iff noindex or isPlayground is true", () => {
  fc.assert(
    fc.property(pageArb, (page) => {
      const renders = shouldRenderNoindex(page);
      const expected = Boolean(page.data.noindex || page.data.isPlayground);

      assert.equal(renders, expected);
    }),
    { numRuns: 200 },
  );
});

// ---------------------------------------------------------------------------
// Property 7: JSON-LD conditional rendering
// Validates: Requirements 6.1, 6.3, 6.5
// ---------------------------------------------------------------------------

test("PBT Property 7: JSON-LD renders only for qualifying /patterns/* pages", () => {
  const jsonLdPageArb = fc.record({
    data: fc.record({
      title: fc.string({ minLength: 1, maxLength: 60 }),
      description: fc.oneof(fc.string({ minLength: 1, maxLength: 120 }), fc.constant(undefined)),
      isPlayground: fc.oneof(fc.boolean(), fc.constant(undefined)),
    }),
    url: fc.constantFrom(
      "/patterns/button/",
      "/patterns/input/",
      "/patterns/button-playground/",
      "/patterns/",
      "/foundations/colors/",
      "/getting-started/",
      "/",
    ),
  });

  fc.assert(
    fc.property(jsonLdPageArb, (page) => {
      const renders = shouldRenderJsonLd(page);
      const startsWithPatterns = page.url.startsWith("/patterns/");
      const isIndex = page.url === "/patterns/";
      const isPlayground = Boolean(page.data.isPlayground);

      if (!startsWithPatterns || isIndex || isPlayground) {
        assert.ok(!renders, `JSON-LD must not render for ${page.url} (playground=${isPlayground})`);
      } else {
        assert.ok(renders, `JSON-LD must render for ${page.url}`);
      }
    }),
    { numRuns: 200 },
  );
});

// ---------------------------------------------------------------------------
// Property 8: LLMs.txt page listing completeness
// Validates: Requirements 7.4, 7.5
// ---------------------------------------------------------------------------

test("PBT Property 8: LLMs.txt includes every page with a title from a collection", () => {
  const collectionPageArb = fc.record({
    data: fc.record({
      title: fc.oneof(fc.string({ minLength: 1, maxLength: 60 }), fc.constant(undefined)),
    }),
    url: fc.constantFrom(
      "/foundations/colors/",
      "/foundations/spacing/",
      "/patterns/button/",
      "/patterns/input/",
      "/getting-started/",
    ),
  });

  fc.assert(
    fc.property(
      fc.array(collectionPageArb, { minLength: 0, maxLength: 20 }),
      (pages) => {
        const listed = filterLlmsPages(pages);

        // Every page with a title must be listed
        const withTitle = pages.filter((p) => p.data.title);
        assert.equal(listed.length, withTitle.length);

        // Every listed page must have a title
        for (const page of listed) {
          assert.ok(page.data.title, "Listed page must have a title");
        }
      },
    ),
    { numRuns: 200 },
  );
});
