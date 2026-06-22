# Implementation Plan: SEO Indexing

## Overview

Add comprehensive search engine and AI agent discoverability to the UI Foundations Eleventy documentation site. Implementation uses pure Nunjucks templates, a global data file for base URL configuration, and modifications to the existing docs layout for `<head>` metadata. No external plugins required.

## Tasks

- [x] 1. Create global data file and standalone template files
  - [x] 1.1 Create `site/_data/site.json` with `baseUrl` configuration
    - Create the file with `{ "baseUrl": "https://ui-foundations.netlify.app" }`
    - No trailing slash on the URL
    - This becomes the single source of truth for all absolute URLs
    - _Requirements: 8.1, 8.2, 8.4_

  - [x] 1.2 Create `site/sitemap.njk` template to generate `sitemap.xml`
    - Front matter: `permalink: /sitemap.xml`, `eleventyExcludeFromCollections: true`
    - Iterate `collections.all`, exclude pages with `isPlayground: true`, `noindex: true`, or `eleventyExcludeFromCollections: true`
    - Each `<url>` contains `<loc>` (baseUrl + page.url) and optional `<lastmod>` (from `lastModified` or `date`)
    - Only render entries when `site.baseUrl` is configured
    - Output must conform to Sitemaps.org 0.9 schema
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.3 Create `site/robots.njk` template to generate `robots.txt`
    - Front matter: `permalink: /robots.txt`, `eleventyExcludeFromCollections: true`
    - Content: `User-agent: *`, `Allow: /`, `Disallow: /assets/`, `Disallow: /components/*-playground/`
    - Include `Sitemap:` directive with absolute URL only when `site.baseUrl` is configured
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.4 Create `site/llms.njk` template to generate `llms.txt`
    - Front matter: `permalink: /llms.txt`, `eleventyExcludeFromCollections: true`
    - Include title line identifying the site and description of purpose
    - Group entries by section: Foundations, Components, Examples, Getting Started
    - Use existing collections: `foundationsDocs`, `componentsDocs`, `examplesDocs`
    - Each entry: `- {title}: {baseUrl}{page.url}`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 2. Modify base layout for SEO head metadata
  - [x] 2.1 Add canonical URL, meta description, and robots meta to `site/_includes/layouts/docs.njk`
    - Add `<link rel="canonical">` using `site.baseUrl + page.url` (only when `site.baseUrl` exists)
    - Add `<meta name="description">` from front matter `description` (omit if missing)
    - Add `<meta name="robots" content="noindex, nofollow">` when `noindex: true` or `isPlayground: true`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 9.1, 9.2, 9.3_

  - [x] 2.2 Add title tag formatting to `site/_includes/layouts/docs.njk`
    - Render `<title>` as `{title} · UI Foundations Docs` for regular pages
    - Render `<title>` as `UI Foundations Docs` for the homepage (no prefix/separator)
    - _Requirements: 4.3, 4.4_

  - [x] 2.3 Add Open Graph and Twitter meta tags to `site/_includes/layouts/docs.njk`
    - Add `og:title` (page title), `og:type` ("website"), `twitter:card` ("summary")
    - Add `og:description` (only when `description` exists in front matter)
    - Add `og:url` and `og:site_name` (only when `site.baseUrl` is configured)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 2.4 Add JSON-LD structured data to `site/_includes/layouts/docs.njk`
    - Render JSON-LD script block only for component pages (URL starts with `/components/`, not playground, not index)
    - Use `TechArticle` schema type with `name`, `headline`, `url`, and `isPartOf` (WebSite)
    - Include `description` only when present in front matter
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3. Checkpoint - Verify build output
  - Ensure all tests pass, ask the user if questions arise.
  - Run `npx eleventy` and verify `_site/sitemap.xml`, `_site/robots.txt`, and `_site/llms.txt` are generated
  - Inspect a rendered component HTML page to verify all `<head>` SEO elements are present

- [x] 4. Write property-based and unit tests
  - [x]* 4.1 Write property test for sitemap page filtering
    - **Property 1: Sitemap page filtering**
    - **Validates: Requirements 1.2, 1.3**
    - Create `tests/seo-indexing.property.test.mjs`
    - Use fast-check to generate page sets with random `isPlayground`, `noindex`, `eleventyExcludeFromCollections` combinations
    - Verify inclusion/exclusion matches the filtering logic

  - [x]* 4.2 Write property test for absolute URL construction
    - **Property 2: Absolute URL construction**
    - **Validates: Requirements 1.5, 3.1, 3.2, 3.3, 5.4**
    - Use fast-check to generate valid base URLs (no trailing slash) and permalinks (with trailing slash)
    - Verify concatenation produces correct URLs with no double slashes

  - [x]* 4.3 Write property test for conditional lastmod rendering
    - **Property 3: Conditional lastmod rendering**
    - **Validates: Requirements 1.4**
    - Use fast-check to generate pages with/without `date`/`lastModified` values
    - Verify `<lastmod>` presence correlates exactly with date presence

  - [x]* 4.4 Write property test for title propagation
    - **Property 4: Title propagation**
    - **Validates: Requirements 4.3, 5.1**
    - Use fast-check to generate random title strings
    - Verify title tag format `{title} · UI Foundations Docs` and og:title value match

  - [x]* 4.5 Write property test for description propagation
    - **Property 5: Description propagation**
    - **Validates: Requirements 4.1, 4.2, 5.2**
    - Use fast-check to generate pages with/without descriptions
    - Verify meta description and og:description presence/absence is consistent

  - [x]* 4.6 Write property test for noindex meta rendering
    - **Property 6: Noindex meta rendering**
    - **Validates: Requirements 9.1, 9.2, 9.3**
    - Use fast-check to generate pages with various `noindex`/`isPlayground` combinations
    - Verify robots meta presence = (noindex OR isPlayground)

  - [x]* 4.7 Write property test for JSON-LD conditional rendering
    - **Property 7: JSON-LD conditional rendering and completeness**
    - **Validates: Requirements 6.1, 6.3, 6.5**
    - Use fast-check to generate pages with various URL patterns, isPlayground values, and descriptions
    - Verify JSON-LD is present only for qualifying component pages and fields are complete

  - [x]* 4.8 Write property test for LLMs.txt page listing completeness
    - **Property 8: LLMs.txt page listing completeness**
    - **Validates: Requirements 7.4, 7.5**
    - Use fast-check to generate random page collections with titles and URLs
    - Verify every qualifying page appears in output and no playground pages are listed

- [x] 5. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Run `npm run test:unit` and verify no regressions
  - Run `npm run docs:build` to confirm the full Eleventy build succeeds

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests use Node.js built-in test runner (`node --test`) and fast-check
- All templates are pure Nunjucks — no external Eleventy plugins needed
- The `site.json` data file is automatically available as `site.baseUrl` in all templates via Eleventy global data

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "2.1", "2.2", "2.3", "2.4"] },
    { "id": 2, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8"] }
  ]
}
```
