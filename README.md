# UI Foundations

Keep Figma and code in sync by default — with tokens, not guesswork.

- **Token-first architecture** — every value comes from a token, no hardcoded exceptions
- **Figma as single source of truth** — variables export directly into production code
- **Agent-ready workflows** — structured docs that give AI agents deterministic context
- **Reproducible pipeline** — same input, same output, validated by CI on every change

[Documentation](https://ui-foundations.netlify.app/) · [Starter Template](https://github.com/tbielich/ui-foundations-starter) · [npm](https://www.npmjs.com/package/ui-foundations) · [Figma Library](https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations)

---

## Why This Exists

Design systems break when design and code drift apart.
Manual syncing is slow, error-prone, and doesn't scale.

UI Foundations solves this with a pipeline that turns Figma variables into
production tokens automatically — and structures everything so AI agents can
work with the system reliably.

---

## Key Features

- **Token-first architecture** — Core → Semantic → Component → Theme, strictly separated
- **Figma ↔ code alignment** — `codeSyntax.WEB` maps Figma names directly to CSS
- **Multi-brand and dark mode** — `data-brand` and `data-mode` switch independently
- **Agent-ready documentation** — deterministic context for AI-assisted workflows
- **DTCG-compliant output** — 2025.10 format with proper alias syntax and hex colors
- **CI-enforced integrity** — full validation pipeline in one `npm run ci:check`

---

## How It Works

### Token Flow

```
Figma Variables
      ↓
figma/exports/*.tokens.json
      ↓
extract-tokens.js
      ↓
dist/
```

The pipeline outputs:

- CSS custom properties (`dist/tokens/css/`)
- DTCG-compliant JSON (`dist/tokens/json/`)
- TypeScript constants (`dist/tokens/ts/`)
- A flat YAML index (`dist/tokens/tokens.yaml`)

### Layering

Tokens follow a strict hierarchy:

1. **Core** — raw values (spacing, radii, colors, typography)
2. **Semantic** — intent-based aliases (`--color-text-default`, `--color-fill-brand`)
3. **Component** — scoped to one component (`--button-solid-container-background-hover`)
4. **Theme** — brand and mode overrides via `data-brand` / `data-mode`

Components reference only Semantic or Core. Never raw values.

### Component Integration

Every component ships with:
CSS pattern, React wrapper, Nunjucks macro, playground page, docs page,
and Code Connect mapping.

All surfaces must be present for the component to work predictably across
docs, playgrounds, and consumer apps.

---

## For Different Audiences

### Designers

- Work in Figma variables — they are the source of truth
- Token names in Figma map directly to CSS variable names
- Brand and mode switching is built into the variable structure

### Developers

- Use generated CSS custom properties — `var(--color-text-default)`
- No hardcoded values — everything comes from tokens
- Theming via `data-brand` and `data-mode` attributes on the root element

### Agents

- Start with `AGENTS.md` — it defines context loading order
- Follow deterministic rules in `docs/agentic/assistant-behavior-rules.md`
- Select a mode from `docs/agentic/modes/` based on the task

---

## Getting Started

### Install

```bash
npm install ui-foundations
```

### Import

```js
import "ui-foundations/core.css";
import "ui-foundations/ui.css";
```

### Apply Theming

```js
document.documentElement.dataset.brand = "a";     // "a" | "b"
document.documentElement.dataset.mode  = "light";  // "light" | "dark"
```

Explore the [docs site](https://ui-foundations.netlify.app/) or the
[vanilla starter](https://github.com/tbielich/ui-foundations-starter)
to see it in action.

---

## Components

Label, Button (solid / outline / ghost), ButtonGroup, Input, Icon, Checkbox,
Radio, RadioGroup, Switch, Slider, Link

Each component uses its own token layer and supports theming out of the box.

---

## Agent Integration

This repo is structured for agent consumption:

| File | Purpose |
|---|---|
| `AGENTS.md` | Entry point — behavior rules and context loading order |
| `docs/playbook.md` | Documentation hierarchy and operating model |
| `DESIGN.md` | Executive design contract |
| `docs/working-context.md` | Current priorities |
| `docs/context-manifest.json` | Machine-readable file index |
| `docs/agentic/modes/` | Task-specific modes (implementation, audit, pattern discovery, token proposal) |

Agents operate in modes:

- **Default** → Implementation
- **Exploratory tasks** → Pattern Discovery or Token Proposal
- **Review tasks** → Audit

---

## Documentation Structure

| Directory | Content |
|---|---|
| `docs/foundations/` | Token layering, naming, theming, parity, and 12 foundation ADRs |
| `docs/principles/` | Perception laws, heuristics, and accessibility intent |
| `docs/patterns/` | Pattern-level composition guidance |
| `docs/components/` | Component entry docs |
| `docs/agentic/` | Agent behavior rules, modes, workflows, rule pipeline |
| `docs/validation/` | CI pipeline, token parity, rule pipeline manifest |
| `docs/token-pipeline.md` | Token generation pipeline and format reference |
| `site/` | Docs site source (Eleventy) |

---

## Local Development

### Build

```bash
npm run build:all       # generate tokens + build CSS
npm run docs:dev        # build + serve docs site
```

### Figma Sync

```bash
# 1. Export tokens from Figma
# 2. Place JSON files in figma/exports/
npm run build:all
```

### Validation

```bash
npm run ci:check        # full pipeline
npm run tokens:validate # token structure
npm run dtcg:validate   # DTCG compliance
npm run rules:validate  # rule pipeline traceability
```

---

## MCP Integration

Figma integration via Model Context Protocol:

- `figma-developer-mcp` — REST API read access (requires `FIGMA_TOKEN` in `.env`)
- Figma Desktop MCP — local server via Figma Desktop app

```json
{
  "command": "npx",
  "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_TOKEN", "--stdio"]
}
```

---

## Contributing

- Follow token rules — no invented tokens, no hardcoded values
- Use semantic tokens over primitives
- Validate before commit: `npm run ci:check`
- Work on feature branches

---

## Release

```bash
npm run release:patch   # or release:minor / release:major
npm run release:push
npm run release:publish
```

---

## Tech Stack

Vanilla CSS (Custom Properties, `@layer`) · Node.js · Eleventy · React (optional wrappers) · Nunjucks macros · Figma MCP

---

Designed for consistency, built for scale, ready for agents.
