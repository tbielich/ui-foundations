---
inclusion: manual
---

# Cheatsheet Builder — Frame Content Definitions

Per-frame content for the UI Foundations cheatsheet slide deck.
Load `#cheatsheet-builder-rules` for layout, style, and validation rules.

## Icon Names by Topic

| Topic | Icons |
|---|---|
| Tokens | `pricetag`, `diamond`, `layers` |
| Components | `puzzle`, `code`, `list` |
| Tooling | `toolkit`, `linked`, `document`, `robot` |
| Governance | `shield`, `shield-check`, `checkmark-circled` |
| Theming | `settings`, `star`, `crown` |
| Pipeline | `sync`, `arrow`, `folder`, `picture` |
| Patterns | `notepad`, `compass`, `search`, `message-info` |
| Validation | `badge-check`, `accessibility-circled` |
| Workflow | `play`, `focus`, `light-bulb` |
| General | `world-globe`, `exclamation-mark-circled`, `typography` |

## Frame Order

```
00 Overview — Hero + pipeline flow + 4-layer grid
01 Tokens — 3-layer cards + theming model + naming
02 Components — Icon grid + structure card + code example
03 Tooling — Tool highlight cards + pipeline + commands
04 Governance — Rule bullets + CI pipeline + agent rules
05 Token Architecture — Layer cards with file paths + reference chain
06 Theming — Brand comparison + CSS strategy + layer order
07 Pipeline — Step flow cards + output files
08 Component Model — 10-surface checklist + CSS anatomy
09 Patterns — Pattern type cards + purpose + rule pipeline
10 Validation — Validation checks + numbered CI steps
11 Kiro Workflow — Agent step cards + steering files + hooks
12 Final Poster — 3-column summary + footer
```

## Frame 00 — Overview (Hero)

**Header:** Dark header (`Brand/Color/Functional/Base Dark`), icon: `world-globe`
**Body:**
- Left column: Pipeline flow card showing Figma → Tokens → CSS → Components → Docs
- Right column: 4-layer grid card (Core → Semantic → Component → Brand)
- Card types: Flow + Layer

## Frame 01 — Tokens

**Header:** Light, icon: `pricetag`
**Body:**
- Left: 3 stacked layer cards (Core Primitives, Semantics, Components) with
  example token names and values
- Right: Theming model key-value card showing how brands override core values +
  naming convention bullet card
- Card types: Layer + KeyValue + Bullet

## Frame 02 — Components

**Header:** Light, icon: `puzzle`
**Body:**
- Left: Icon grid card showing a selection of available icons in a wrap layout
- Right top: Structure card showing component anatomy (container, label, icon slots)
- Right bottom: Code card with HTML/CSS snippet for a button
- Card types: KeyValue + Code + Highlight

## Frame 03 — Tooling

**Header:** Light, icon: `toolkit`
**Body:**
- Left: Tool highlight cards (Figma, token pipeline, docs site, CI)
- Right: Pipeline flow card (export → generate → build → publish) + commands
  bullet card
- Card types: Highlight + Flow + Bullet

## Frame 04 — Governance

**Header:** Light, icon: `shield`
**Body:**
- Left: Rule bullet cards (token rules, component rules, naming rules)
- Right top: CI pipeline flow card
- Right bottom: Agent rules highlight card (behavior, modes, validation)
- Card types: Bullet + Flow + Highlight

## Frame 05 — Token Architecture

**Header:** Light, icon: `layers`
**Body:**
- Left: 4 stacked layer cards (Core → Appearance → Semantics → Components)
  each showing file path and example tokens
- Right: Reference chain flow card showing alias resolution
  (`--button-bg → --color-fill-brand → --brand-primary → #0066cc`)
- Card types: Layer + Flow

## Frame 06 — Theming

**Header:** Light, icon: `settings`
**Body:**
- Left: Brand comparison card — side-by-side columns for Brand A vs Brand B
  showing different token values applied to the same component
- Right top: CSS strategy bullet card (custom properties, layer order, selectors)
- Right bottom: Layer order numbered steps (core → brand → mode → semantic → component)
- Card types: Comparison + Bullet + Numbered steps

## Frame 07 — Pipeline

**Header:** Light, icon: `sync`
**Body:**
- Full width: Step flow cards showing the complete pipeline:
  1. Figma export (JSON)
  2. Token transform (CSS generation)
  3. Component build (patterns + Web Components)
  4. Docs build (11ty)
  5. CI validation
- Below flow: Output files key-value card listing generated artifacts
- Card types: Flow + KeyValue

## Frame 08 — Component Model

**Header:** Light, icon: `code`
**Body:**
- Left: 10-surface checklist card (tokens, CSS pattern, Web Component, macro,
  docs page, playground, Code Connect, Figma component, tests, icon)
- Right: CSS anatomy code card showing `@layer components`, custom properties,
  state selectors, logical properties
- Card types: Numbered steps + Code

## Frame 09 — Patterns

**Header:** Light, icon: `notepad`
**Body:**
- Left: Pattern type cards (forms, navigation, cards, modals, tables, tabs,
  accordion, search, tooltips) as a bullet list with icons per category
- Right top: Purpose highlight card explaining pattern rules as composition guides
- Right bottom: Rule pipeline flow (principle → heuristic → pattern → component)
- Card types: Bullet + Highlight + Flow

## Frame 10 — Validation

**Header:** Light, icon: `badge-check`
**Body:**
- Left: Validation checks bullet card listing what `ci:check` verifies
  (lint, test, build, smoke, tokens, assets, rules, docs)
- Right: Numbered CI steps card showing the execution sequence with pass/fail
  indicators
- Card types: Bullet + Numbered steps

## Frame 11 — Kiro Workflow

**Header:** Light, icon: `robot`
**Body:**
- Left: Agent step cards showing Plan → Execute → Verify → Report workflow
- Right top: Steering files key-value card (foundations, components, workflows,
  pattern-rules, figma)
- Right bottom: Hooks bullet card (file events, task events, tool gates)
- Card types: Flow + KeyValue + Bullet

## Frame 12 — Final Poster

**Header:** Dark header, icon: `star`
**Body:**
- 3-column layout:
  - Column 1: Architecture summary (4 layers, token pipeline)
  - Column 2: Components summary (10 surfaces, patterns, governance)
  - Column 3: Workflow summary (agents, CI, Figma sync)
- Footer row: Project URL + version + date
- Card types: Bullet + Highlight
