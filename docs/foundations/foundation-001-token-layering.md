---
title: Foundation-001 – Token Layering Principles
status: active
type: foundation-decision
---

# Foundation-001: Token Layering Principles

## Purpose

Define a stable token architecture that:
- aligns Figma Variables with CSS custom properties
- supports appearance modes and multiple brands
- scales across components without duplication
- remains maintainable and code-aligned

## Rules

1. Use four abstraction layers with strict downward-only references:
   - **Core (Primitives)**: raw physical values (spacing, radii, borders, typography primitives, layout constants)
   - **Appearance (Modes)**: mode-dependent decisions such as light/dark or compact/regular/expanded values
   - **Semantics (Brands)**: brand-scoped semantic roles (`Brand/Color/*`, `Brand/Corner/*`, `Brand/Font/*`, `Brand/Size/*`)
   - **Patterns / Components (APIs)**: variants/parts/properties/states, consuming semantic roles or Core tokens

2. `Semantics (Brands)` replaces the old `Themes (Brands)` concept:
   - use **Semantics (Brands)** for the Figma/token collection label
   - use **brand semantics** for explanatory prose
   - do not describe these tokens as arbitrary visual skins

3. Reference direction (strict):
   ```
   Core ← Appearance ← Semantics (Brands) ← Patterns/Components
   ```
   Pattern and component tokens consume semantic roles, not raw primitive values.

4. Pattern and component tokens must not introduce raw values for color, typography, or layout fundamentals.

5. Typography color must stay in semantic color roles, not inside typography role definitions.

## Layer Diagram

```
┌─────────────────────────────────────────────┐
│              Components (APIs)               │
│  references: Semantics (Brands), Core        │
└───────────────────┬─────────────────────────┘
                    │ $ref
┌───────────────────▼─────────────────────────┐
│           Semantics (Brands)                 │
│  brand-scoped semantic roles via data-brand  │
└───────────┬─────────────────────────────────┘
            │ $ref
┌───────────▼─────────────────────────────────┐
│              Appearance (Modes)              │
│  mode-dependent decisions via data-mode      │
└───────────┬─────────────────────────────────┘
            │ $ref
┌───────────▼─────────────────────────────────┐
│              Core (Primitives)               │
│  raw values: no references                  │
└─────────────────────────────────────────────┘
```

## Implications

- Brand changes happen in Semantics (Brands); appearance changes happen in Appearance (Modes).
- Component APIs remain stable while underlying values evolve.
- Layout constants (breakpoints, containers, z-index) stay centralized in Core.
- Agents and developers can determine allowed references by checking only the layer above and below — never sideways.
