```
╭─────────────────╖
│ 16              ║
│            ⬤   ║
│   ██   ██       ║
│   ██   ██  ██   ║
│   ██   ██  ██   ║
│   ░▒███▒░  ██   ║
├─────────────────╢
│   Foundations   ║
╘═════════════════╝
```

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
 ┌─────────────────────────────────┐
 │        Figma Variables          │
 └───────────────┬─────────────────┘
                 ▼
 ┌─────────────────────────────────┐
 │  figma/exports/*.tokens.json    │
 └───────────────┬─────────────────┘
                 ▼
 ┌─────────────────────────────────┐
 │       extract-tokens.js         │
 └───────────────┬─────────────────┘
     ┌───────────┼───────────┐
     ▼           ▼           ▼
 ┌───────┐  ┌───────┐  ┌───────┐
 │  CSS  │  │ JSON  │  │ TS/YML│
 └───────┘  └───────┘  └───────┘
```

```
 dist/
 ├── tokens/
 │   ├── css/   ← Custom Properties
 │   ├── json/  ← DTCG-compliant
 │   ├── ts/    ← TypeScript constants
 │   └── tokens.yaml ← Flat index
 ├── core/      ← Reset + Base + Tokens
 ├── ui/        ← Component patterns
 ├── react/     ← Optional wrappers
 └── main.css   ← Bundled (all layers)
```

### Layering

Token layers from foundation to surface:

``` 
   ╱─ THEME        Brand + Mode
  ╱── COMPONENT    Scoped tokens
 ╱─── SEMANTIC     Intent aliases
╱──── CORE         Raw values
```

Patterns consume Semantic or Core tokens. Never raw values.

### Component Integration

Every component ships with:

```
 ┌────────────┬────────────┬────────────┐
 │ CSS pattern│ Nunjucks   │ Playground │
 ├────────────┼────────────┼────────────┤
 │ Docs page  │ React wrap │ Code Conn. │
 └────────────┴────────────┴────────────┘
```

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

```css
@import "ui-foundations/core.css";
@import "ui-foundations/ui.css";
```

### Use Patterns (plain HTML)

```html
<button class="button">Label</button>
<button class="button outline">Outline</button>
<input class="input" type="text" />
```

### Optional: React Wrappers

```js
import { Button } from "ui-foundations/react/button";
```

The React wrappers are thin convenience layers that apply CSS classes and
add dev-mode accessibility warnings. They contain no framework-specific
logic — the same result is achievable with plain HTML + CSS classes.

### Apply Theming

```js
document.documentElement.dataset.brand = "a";     // "a" | "b" | "c"
document.documentElement.dataset.mode  = "light";  // "light" | "dark"
```

Explore the [docs site](https://ui-foundations.netlify.app/) or the
[vanilla starter](https://github.com/tbielich/ui-foundations-starter)
to see it in action.

---

## Patterns

CSS-only, stateless UI building blocks. No JavaScript required.

```
 ┌──────────┬──────────┬──────────┬──────────┐
 │ Button   │ Input    │ Checkbox │ Radio    │
 ├──────────┼──────────┼──────────┼──────────┤
 │ Switch   │ Tabs     │ Accordion│ Tooltip  │
 ├──────────┼──────────┼──────────┼──────────┤
 │ Badge    │ Avatar   │ Divider  │ Link     │
 ├──────────┼──────────┼──────────┼──────────┤
 │ Label    │ TextArea │ Icon     │ Select   │
 ├──────────┼──────────┼──────────┼──────────┤
 │ Form     │ FormGroup│          │          │
 └──────────┴──────────┴──────────┴──────────┘
```

Each pattern uses semantic tokens and supports theming out of the box.

## Components (coming next)

Functional units that add state and interactivity on top of patterns.

```
 ┌──────────┬──────────┬──────────┐
 │ Calendar │ DatePckr │ ComboBox │
 ├──────────┼──────────┼──────────┤
 │ Dialog   │ Table    │   ...    │
 └──────────┴──────────┴──────────┘
```

Components will live in `src/ui/components/` and require JavaScript.

---

## Agent Integration

```
 ┌─────────────────────────────────────────┐
 │ AGENTS.md                               │
 │ ├── DESIGN.md                           │
 │ ├── docs/playbook.md                    │
 │ ├── docs/working-context.md             │
 │ ├── docs/ui-foundations-rules.md        │
 │ ├── docs/agentic/modes/                 │
 │ │   ├── implementation                  │
 │ │   ├── audit                           │
 │ │   ├── pattern-discovery               │
 │ │   └── token-proposal                  │
 │ └── docs/context-manifest.json          │
 └─────────────────────────────────────────┘
```

Agents operate in modes:

- **Default** → Implementation
- **Exploratory tasks** → Pattern Discovery or Token Proposal
- **Review tasks** → Audit

---

## Documentation Structure

```
 docs/
 ├── foundations/    ← Token layering, naming, 12 ADRs
 ├── patterns/      ← Composition guidance
 ├── agentic/       ← Agent rules, modes, workflows
 ├── validation/    ← CI pipeline, parity checks
 └── token-pipeline.md
 site/
 ├── components/    ← Component docs + playgrounds
 ├── foundations/   ← Token and principle pages
 └── examples/     ← Usage examples
```

---

## Local Development

### Build

```bash
npm run build:all       # generate tokens + build CSS
npm run docs:dev        # build + serve docs site
```

### Build Output

```
╭──────────────────────────────────────╮
│ ╻╻· │ FOUNDATIONS                    │
│ ┗┛╹ │ BUILD 0.7.0                    │
╰──────────────────────────────────────╯
█ ICONS                             [OK]
├ Entries                           0289
└ Output                   icon-names.ts
────────────────────────────────────────
█ TOKENS
├ CSS                              READY
├ JSON                             READY
├ TypeScript                       READY
└ YAML                             READY
────────────────────────────────────────
█ INTEGRITY                         [OK]
├ Missing WEB                       0000
├ Unparseable WEB                   0000
└ Duplicate vars                    0000
────────────────────────────────────────
█ DIST                              [OK]
├ Token CSS                         0008
├ Macros                           READY
└ Bundles                          READY
────────────────────────────────────────
BUILD OK · READY · 503ms
```

### Figma Sync

```bash
# Option A: Manual export from Figma plugin → place files → build
npm run build:all

# Option B: Agent-assisted sync via MCP (recommended)
npm run tokens:sync
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

Figma integration uses the Model Context Protocol. Token exports live in
`figma/exports/` and are processed by `npm run tokens:generate`.

```
 ┌────────────────────┐     ┌───────────────────┐
 │   Figma Desktop    │────▶│  Local MCP Server │
 └────────────────────┘     └────────┬──────────┘
                                     │
                                     ▼
                            ┌───────────────────┐
                            │  figma/exports/   │
                            └───────────────────┘
```

- **Figma Desktop MCP** — local server via the Figma Desktop app (primary path)
- **figma-developer-mcp** — REST API read access (requires `FIGMA_TOKEN` in `.env`)

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

### Adding a New Component

Load the `#component-creation` steering file for the full 10-phase workflow.
Key steps: semantic HTML first, then Figma tokens (bind variables, never hardcode),
CSS pattern, Nunjucks macro, React wrapper, docs page, playground, Code Connect.

---

## Release

```bash
npm run release:patch   # or release:minor / release:major
npm run release:push
npm run release:publish
```

---

## Tech Stack

```
 ┌────────────────┬───────────────────────────┐
 │ Tokens         │ CSS Custom Properties     │
 ├────────────────┼───────────────────────────┤
 │ Build          │ Node.js                   │
 ├────────────────┼───────────────────────────┤
 │ Docs           │ Eleventy + Nunjucks       │
 ├────────────────┼───────────────────────────┤
 │ Design         │ Figma + MCP               │
 ├────────────────┼───────────────────────────┤
 │ Components     │ Vanilla CSS (@layer)      │
 ├────────────────┼───────────────────────────┤
 │ Optional       │ React wrappers            │
 └────────────────┴───────────────────────────┘
```

---

## Roadmap

- **Calendar Component** — first functional component with state, date logic, and keyboard navigation. Built on top of existing patterns.
- **Web Components** — replace React wrappers with framework-agnostic custom elements (light DOM, no shadow DOM) so patterns are truly platform-independent (#104).

---

PolyForm Noncommercial License 1.0.0
