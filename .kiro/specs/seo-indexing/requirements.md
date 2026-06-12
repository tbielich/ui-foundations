# Requirements Document

## Introduction

The UI Foundations documentation site (built with Eleventy, deployed on Netlify) currently lacks SEO infrastructure. There is no sitemap, no robots.txt, no structured metadata, and no canonical URLs. This feature adds comprehensive search engine and AI agent discoverability to ensure all documentation pages are properly indexed by Google, social platforms, and AI crawlers.

## Glossary

- **Docs_Site**: The Eleventy-generated documentation site output to `_site/`, served via Netlify
- **Sitemap_Generator**: An Eleventy plugin or build step that produces a valid XML sitemap of all public pages
- **Meta_Template**: The Nunjucks base layout (`site/_includes/layouts/docs.njk`) responsible for rendering HTML `<head>` metadata
- **Robots_File**: A `robots.txt` file at the site root instructing crawlers which paths to index or ignore
- **Structured_Data**: JSON-LD markup embedded in pages to provide machine-readable context about page content
- **Canonical_URL**: A `<link rel="canonical">` element specifying the authoritative URL for each page
- **Open_Graph_Tags**: HTML meta elements following the Open Graph protocol for rich link previews on social platforms
- **LLMs_File**: A `/llms.txt` file providing AI agents with a structured summary of site content and navigation
- **Base_URL**: The production URL of the deployed docs site (configurable via Eleventy global data)

## Requirements

### Requirement 1: XML Sitemap Generation

**User Story:** As a search engine crawler, I want to discover all public documentation pages via a sitemap, so that I can index the full site efficiently.

#### Acceptance Criteria

1. WHEN the Eleventy build completes, THE Sitemap_Generator SHALL produce a valid `sitemap.xml` file in the `_site/` output directory
2. THE Sitemap_Generator SHALL include all pages with a `permalink` value that do not have `eleventyExcludeFromCollections: true` or `noindex: true` in front matter
3. THE Sitemap_Generator SHALL exclude playground pages (pages where `isPlayground: true`) from the sitemap
4. WHEN a page has a `lastModified` or `date` value, THE Sitemap_Generator SHALL include a `<lastmod>` element for that page entry
5. THE Sitemap_Generator SHALL set the Base_URL as the root for all `<loc>` elements in the sitemap
6. THE Sitemap_Generator SHALL produce XML that validates against the Sitemaps.org 0.9 schema

### Requirement 2: Robots.txt Configuration

**User Story:** As a site owner, I want to control which paths crawlers access, so that only meaningful documentation pages are indexed.

#### Acceptance Criteria

1. WHEN the Eleventy build completes, THE Docs_Site SHALL include a `robots.txt` file at the site root
2. THE Robots_File SHALL allow all user agents to crawl the site by default
3. THE Robots_File SHALL disallow crawling of `/assets/` paths (static assets not useful for indexing)
4. THE Robots_File SHALL disallow crawling of playground pages matching `/components/*-playground/`
5. THE Robots_File SHALL include a `Sitemap:` directive pointing to the absolute URL of `sitemap.xml`

### Requirement 3: Canonical URLs

**User Story:** As a search engine, I want each page to declare its canonical URL, so that I can avoid duplicate content issues.

#### Acceptance Criteria

1. THE Meta_Template SHALL render a `<link rel="canonical">` element in the `<head>` of every page
2. THE Canonical_URL SHALL be constructed from the Base_URL combined with the page permalink
3. THE Canonical_URL SHALL use a trailing slash to match the permalink format used by Eleventy
4. WHEN the Base_URL is not configured, THE Meta_Template SHALL omit the canonical link rather than render an invalid URL

### Requirement 4: Meta Descriptions and Title Tags

**User Story:** As a search engine results page, I want each page to have a unique title and description, so that users can understand page content before clicking.

#### Acceptance Criteria

1. THE Meta_Template SHALL render a `<meta name="description">` element using the page front matter `description` field
2. WHEN a page has no `description` in front matter, THE Meta_Template SHALL omit the meta description element rather than render an empty value
3. THE Meta_Template SHALL render a `<title>` element in the format `{page title} · UI Foundations Docs`
4. WHEN the page is the homepage, THE Meta_Template SHALL render the title as `UI Foundations Docs` without a prefix separator

### Requirement 5: Open Graph and Social Meta Tags

**User Story:** As a user sharing a link on social media, I want rich previews with title, description, and type, so that shared links are informative and visually appealing.

#### Acceptance Criteria

1. THE Meta_Template SHALL render `og:title` using the page title
2. THE Meta_Template SHALL render `og:description` using the page description when available
3. THE Meta_Template SHALL render `og:type` as `website` for all pages
4. THE Meta_Template SHALL render `og:url` using the Canonical_URL value
5. WHEN the Base_URL is configured, THE Meta_Template SHALL render `og:site_name` as `UI Foundations Docs`
6. THE Meta_Template SHALL render `twitter:card` as `summary`

### Requirement 6: Structured Data (JSON-LD)

**User Story:** As a search engine, I want machine-readable structured data on component pages, so that I can understand and present the content in rich results.

#### Acceptance Criteria

1. WHEN a page is a component documentation page (URL starts with `/components/` and `isPlayground` is not true), THE Structured_Data SHALL render a JSON-LD script block in the page `<head>`
2. THE Structured_Data SHALL use the `TechArticle` schema type for component pages
3. THE Structured_Data SHALL include `name`, `description`, `url`, and `headline` properties from page front matter
4. THE Structured_Data SHALL include `isPartOf` referencing the documentation site with type `WebSite`
5. WHEN the page has no description, THE Structured_Data SHALL omit the `description` property rather than include an empty string

### Requirement 7: LLMs.txt for AI Agent Discoverability

**User Story:** As an AI agent, I want a machine-readable index of the documentation site, so that I can efficiently navigate and summarize its content for users.

#### Acceptance Criteria

1. WHEN the Eleventy build completes, THE Docs_Site SHALL produce an `llms.txt` file at the site root
2. THE LLMs_File SHALL include a title line identifying the site as UI Foundations documentation
3. THE LLMs_File SHALL include a description summarizing the site purpose and scope
4. THE LLMs_File SHALL list all non-playground component pages with their title and absolute URL
5. THE LLMs_File SHALL list all foundation pages with their title and absolute URL
6. THE LLMs_File SHALL group entries by section (Foundations, Components, Examples, Getting Started)

### Requirement 8: Build-Time Base URL Configuration

**User Story:** As a developer, I want the production URL configured in one place, so that all SEO features derive URLs consistently without hardcoding.

#### Acceptance Criteria

1. THE Docs_Site SHALL read the Base_URL from an Eleventy global data file (`site/_data/site.json` or equivalent)
2. THE Base_URL SHALL have no trailing slash to allow clean URL concatenation with permalinks
3. WHEN the Base_URL is missing or empty, THE Docs_Site SHALL generate relative URLs and omit absolute-URL-dependent features (canonical, sitemap `<loc>`, OG url)
4. THE Base_URL SHALL be the single source of truth for all generated absolute URLs across sitemap, canonical, Open Graph, and structured data

### Requirement 9: Noindex Support for Excluded Pages

**User Story:** As a site owner, I want to exclude specific pages from search indexes, so that draft or internal pages do not appear in search results.

#### Acceptance Criteria

1. WHEN a page has `noindex: true` in front matter, THE Meta_Template SHALL render a `<meta name="robots" content="noindex, nofollow">` element
2. WHEN a page has `isPlayground: true` in front matter, THE Meta_Template SHALL render a `<meta name="robots" content="noindex, nofollow">` element
3. WHEN a page has neither `noindex` nor `isPlayground` set to true, THE Meta_Template SHALL NOT render a robots meta element (allowing default indexing)
