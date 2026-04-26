# UI Foundations

A token-first, agent-ready design system that ensures Figma ↔ code parity.

- Token-first architecture — no hardcoded values, ever
- Figma as single source of truth — variables flow directly to code
- Agent-ready workflows — structured docs for AI-assisted development
- Reproducible pipeline — deterministic token generation with CI validation

[Documentation](https://ui-foundations.netlify.app/) · [Starter Template](https://github.com/tbielich/ui-foundations-starter) · [npm](https://www.npmjs.com/package/ui-foundations) · [Figma Library](https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations)

---

## Why This Exists

Design systems break when design and code drift apart. Manual syncing is slow,
error-prone, and doesn't scale. UI Foundations solves this with a pipeline that
turns Figma variables into production tokens automatically — and structures
everything so AI agents can work with the system reliably.

---

## Key Features

**Token-first architecture**
Four layers — Core → Semantic → Component → Theme — with strict separation.
Components never touch raw values.

**Figma ↔ code alignment**
Every token carries a `codeSyntax.WEB` mapping from Figma. What you name in
Figma is what you get in CSS.

**Multi-brand and dark mode**
Theming is orthogonal: `data-brand` and `data-mode` switch independently.
No brand-specific logic leaks into components.

**Agent-ready documentation**
`AGENTS.md`, `DESIGN.md`, and structured mode docs give AI agents deterministic
context for implementation, audit, pattern discovery, and token proposals.

**DTCG-compliant output**
Dist JSON follows the Design Tokens Community Group 2025.10 format with proper
alias syntax, hex colors, and schema declaration.

**CI-enforced integrity**
Lint, unit tests, token validation, DTCG validation, asset checks, rule pipeline
validation, and docs build — all in one `npm run ci:check`.

---

## System Overview

```
Figma Variables
      │
      ▼
figma/exports/*.tokens.json        ← Figma REST API exports
      │
      ▼
npm run tokens:generate            ← extract-tokens.js
      │
      ├─► dist/tokens/css/*.css    ← CSS custom properties
      ├─► dist/tokens/json/*.json  ← DTCG 2025.10 JSON
      ├─► dist/tokens/ts/*.ts     ← TypeScript constants
      └─► dist/tokens/tokens.yaml ← flat index
```

Rule pipeline:

```
Principles → Heuristics → Pattern rules → Component rules → Validation → CI
```

---

## Install

```bash
npm install ui-foundations
```

## Usage

```js
import "ui-foundations/core.css";
import "ui-foundations/ui.css";
```

Runtime theming:

```js
document.documentElement.dataset.brand = "a"; // "a" | "b"
document.documentElement.dataset.mode = "light"; // "light" | "dark"
```

---

## Local Development

```bash
npm run build:all       # generate tokens + build CSS
npm run docs:dev        # build + serve docs site
```

Figma sync:

```bash
# 1. Export tokens from Figma
# 2. Place JSON files in figma/exports/
# 3. Build
npm run build:all
```

Validation:

```bash
npm run ci:check        # full pipeline
npm run tokens:validate # token structure
npm run dtcg:validate   # DTCG compliance
npm run rules:validate  # rule pipeline traceability
```

---

## Components

Label, Button (solid/outline/ghost), ButtonGroup, Input, Icon, Checkbox, Radio,
RadioGroup, Switch, Slider, Link

Each component uses its own token layer and supports theming out of the box.

---

## For AI Agents

This repo is structured for agent consumption:

| File | Purpose |
|---|---|
| `DESIGN.md` | Executive design contract |
| `AGENTS.md` | Behavior rules and context loading order |
| `docs/working-context.md` | Current priorities |
| `docs/context-manifest.json` | Machine-readable file index |
| `docs/agentic/modes/` | Task-specific agent modes |

Start with `AGENTS.md`. It tells you what to read and in what order.

---

## Documentation

| Resource | Location |
|---|---|
| Foundations | `docs/foundations/` |
| Token pipeline | `docs/token-pipeline.md` |
| Agent behavior rules | `docs/agentic/assistant-behavior-rules.md` |
| Rule pipeline | `docs/agentic/rule-pipeline.md` |
| Docs site source | `site/` |
| Vanilla starter | `site/examples/vanilla-starter.md` |

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

## Release

```bash
npm run release:patch   # or release:minor / release:major
npm run release:push
npm run release:publish
```

---

## Tech Stack

Vanilla CSS (Custom Properties, `@layer`), Node.js, Eleventy, React (optional
wrappers), Nunjucks macros, Figma MCP.
