# UI Foundations

A token-first design system that uses Figma as the single source of truth and automatically generates CSS, JSON, and TypeScript tokens.

[Documentation](https://ui-foundations.netlify.app/) · [Starter Template](https://github.com/tbielich/ui-foundations-starter) · [npm](https://www.npmjs.com/package/ui-foundations) · [Figma Library](https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations)

## Pipeline

```
Figma Variables → Plugin Export → figma/exports/*.tokens.json → extract-tokens.js → dist/ (CSS, JSON, TS, YAML)
```

Rule pipeline:

```
Principles → Heuristics → Pattern rules → Component rules → Validation → CI
```

Rule sources live in `.kiro/steering/`, the executable manifest lives in
`docs/validation/rule-pipeline.manifest.json`, and CI runs
`npm run rules:validate` through `npm run ci:check`.

## Features

- 5 variable collections: Core Primitives, Themes (Brands), Appearance (Modes), Semantics (Roles), Components (UI)
- Multi-brand support (Brand A/B) via `data-brand` selectors
- Dark/light mode via `data-mode` selectors
- Content-based scope detection (independent of filenames)
- Figma plugin with Validate + Export tabs (see `figma/plugin/README.md`)
- CI pipeline: lint, unit tests, build, smoke check, docs build
- Docs site with Eleventy, auto-generated from token data

## Tech Stack

Vanilla CSS (Custom Properties, Layers), Node.js scripts, Eleventy, Figma Plugin API, MCP.

## Install

```bash
npm install ui-foundations
```

## Usage

```js
import "ui-foundations/core.css";
import "ui-foundations/ui.css";
```

Runtime scope switching:

```js
const root = document.documentElement;
root.dataset.brand = "a"; // "a" | "b"
root.dataset.mode = "light"; // "light" | "dark"
```

## Local Development

```bash
npm run build:all       # generate tokens + build CSS
npm run docs:dev        # build + serve docs site
```

Figma sync workflow:

```bash
# 1. Export tokens via Figma plugin (📦 Export tab)
# 2. Place JSON files in figma/exports/
# 3. Build
npm run build:all
```

Validation:

```bash
npm run lint
npm run test:unit
npm run rules:validate
npm run ci:check
```

## MCP Integration

This repo supports Figma integration via MCP (Model Context Protocol). Two servers are used:

- `figma-developer-mcp` — REST API read access (requires `FIGMA_TOKEN` in `.env`)
- Figma Desktop MCP — local server via Figma Desktop app (enable in Dev Mode inspect panel)

Configure these in your agent's MCP config. Example for the REST API server:

```json
{
  "command": "npx",
  "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_TOKEN", "--stdio"]
}
```

## Documentation

- Foundations: `docs/foundations/`
- Rule pipeline: `docs/agentic/rule-pipeline.md`
- AI playbook: `docs/agentic/team-ai-playbook.md`
- Figma plugin (Token Foundry): `figma/plugin/README.md`
- Docs site: `site/`
- Vanilla starter: `site/examples/vanilla-starter.md`

## Release

```bash
npm run release:patch   # or release:minor / release:major
npm run release:push
npm run release:publish
```
