# UI Foundations

A token-first design system that uses Figma as the single source of truth and automatically generates CSS, JSON, and TypeScript tokens.

## Pipeline

```
Figma Variables → Plugin Export → figma/exports/*.tokens.json → extract-tokens.js → dist/ (CSS, JSON, TS, YAML)
```

## Features

- 5 variable collections: Core Primitives, Themes (Brands), Appearance (Modes), Semantics (Roles), Components (UI)
- Multi-brand support (Brand A/B) via `data-brand` selectors
- Dark/light mode via `data-mode` selectors
- Content-based scope detection (independent of filenames)
- Figma plugin with Validate + Export tabs (see `figma/plugin/README.md`)
- CI pipeline: lint, unit tests, build, smoke check, docs build
- MCP integration: Figma Desktop + REST API for read access from the IDE
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
npm run ci:check
```

## Documentation

- Foundations: `docs/foundations/`
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
