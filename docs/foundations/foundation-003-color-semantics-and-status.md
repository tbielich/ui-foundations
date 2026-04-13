---
title: Foundation-003 – Color Semantics, Status vs State
status: active
type: foundation-decision
---

# Foundation-003: Color Semantics, Status vs State

## Purpose

Provide a color model that supports brand/mode mapping and semantic meaning without component-level duplication.

## Rules

1. Keep raw palettes separate from semantics:
   - `Brand.*`, `Neutral.*`, `Overlay.*` provide raw color sources
   - `Color.Text.*`, `Color.Fill.*`, `Color.Border.*` provide semantic roles per mode

2. Semantic mappings are mode-scoped:
   - Light mappings at `:root`
   - Dark mappings at `:root[data-mode="dark"]`
   - Mode activation policy is consumer-owned (see Foundation-008)

3. Status is semantic meaning (global):
   - `Danger`, optionally `Warning`, `Success`, `Info`
   - Applied across role families (Text/Fill/Border)

4. State is interaction behavior (component-level):
   - `...background.hover`
   - `...border-color.focus`
   - `...text-color.disabled`

5. Support inverse readability via semantic roles where needed:
   - `Color.Text.Inverse`
   - optional `Color.Fill.Inverse`

## Implications

- Semantic APIs stay stable across modes.
- Components keep interaction logic without polluting global semantics.
- Multi-brand, multi-mode theming remains flexible.
