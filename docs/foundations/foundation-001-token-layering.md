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

1. Use four layers:
   - **Core (Primitives)**: raw physical values (spacing, radii, borders, typography primitives, layout constants)
   - **Color Modes (Light/Dark)**: raw color palettes (brand, neutral, overlays), no semantics
   - **Semantics (Roles)**: meaning-based roles (`Color.Text.*`, `Color.Fill.*`, `Color.Border.*`, `Typography.*`, `Corner.*`)
   - **Components (APIs)**: variants/parts/properties/states, referencing Semantic/Core tokens

2. Components must not introduce raw values for color, typography, or layout fundamentals.

3. Typography color must stay in semantic color roles, not inside typography role definitions.

## Implications

- Brand/mode changes happen primarily in Semantic/Mode mappings.
- Component APIs remain stable while references evolve.
- Layout constants (breakpoints, containers, z-index) stay centralized in Core.
