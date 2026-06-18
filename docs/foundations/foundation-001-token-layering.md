---
title: Foundation-001 – Token Layering Principles
status: active
type: foundation-decision
---

# Foundation-001: Token Layering Principles

## Purpose

Define a stable token architecture that:
- aligns Figma Variables with CSS custom properties
- supports Light/Dark modes and multiple brands
- scales across components without duplication
- remains maintainable and code-aligned

## Rules

1. Use three abstraction layers with strict downward-only references:
   - **Core (Primitives)**: raw physical values (spacing, radii, borders, typography primitives, layout constants)
   - **Semantics (Roles)**: meaning-based roles (`Color.Text.*`, `Color.Fill.*`, `Color.Border.*`, `Typography.*`, `Corner.*`)
   - **Components (APIs)**: variants/parts/properties/states, referencing Semantic or Core tokens only

2. Modes and Themes are **resolution mechanisms** within the Semantic layer, not independent abstraction layers:
   - **Themes (Brands)**: brand-specific value assignments (`Brand/Corner/*`, `Brand/Color/*`, `Brand/Font/*`) that Semantics consumes
   - **Appearance (Modes)**: light/dark color mappings that resolve Semantic color roles per mode
   - Both feed *into* the Semantic layer — they do not sit above or beside it

3. Reference direction (strict):
   ```
   Core ← Themes/Modes ← Semantics ← Components
   ```
   Components must **never** reference Themes or Modes directly. All brand/mode variation reaches Components through Semantic tokens.

4. Components must not introduce raw values for color, typography, or layout fundamentals.

5. Typography color must stay in semantic color roles, not inside typography role definitions.

## Layer Diagram

```
┌─────────────────────────────────────────────┐
│              Components (APIs)               │
│  references: Semantics, Core                │
└───────────────────┬─────────────────────────┘
                    │ $ref
┌───────────────────▼─────────────────────────┐
│              Semantics (Roles)               │
│  references: Core, Themes, Modes            │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Themes (Brands) │  │ Appearance      │  │
│  │ resolution by   │  │ (Modes)         │  │
│  │ data-brand      │  │ resolution by   │  │
│  │                 │  │ data-mode       │  │
│  └────────┬────────┘  └────────┬────────┘  │
│           │ $ref                │ $ref       │
└───────────┼─────────────────────┼───────────┘
            │                     │
┌───────────▼─────────────────────▼───────────┐
│              Core (Primitives)               │
│  raw values: no references                  │
└─────────────────────────────────────────────┘
```

## Implications

- Brand/mode changes happen in Themes/Modes, propagate through Semantics automatically.
- Component APIs remain stable while underlying values evolve.
- Layout constants (breakpoints, containers, z-index) stay centralized in Core.
- Agents and developers can determine allowed references by checking only the layer above and below — never sideways.
