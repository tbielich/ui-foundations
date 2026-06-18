---
title: ADR – Semantic Corner Indirection
status: active
type: adr
---

# ADR: Semantic Corner Indirection

## Context

Component tokens (`Components (UI).tokens.json`) referenced `Brand/Corner/*`
tokens from the Themes (Brands) collection directly, bypassing the Semantic
layer. This violated the governance rule that Components may only reference
Semantics or Core.

The Semantic layer already contained Corner tokens (`Corner/Button Radius`,
`Corner/Card Radius`, `Corner/Modal Radius`, `Corner/Form Radius`,
`Corner/Checkbox Radius`) that pointed to the same Themes values — they were
simply not being used by Components.

## Decision

1. Rewire all Component corner-radius tokens to reference Semantic Corner
   tokens instead of Themes directly.
2. Add `Corner/Input Radius` to Semantics (was missing — Input and Select
   need a shared semantic role distinct from Checkbox).
3. Document Themes and Modes as **resolution mechanisms** within the Semantic
   boundary, not as independent abstraction layers (Foundation-001 update).

## Changes

| Component Token | Before (`$ref`) | After (`$ref`) |
|---|---|---|
| `Button/Border/Radius` | `Brand/Corner/Button` | `Corner/Button Radius` |
| `Modal/Surface/Border Radius` | `Brand/Corner/Modal` | `Corner/Modal Radius` |
| `Input/Border/Radius` | `Brand/Corner/Input` | `Corner/Input Radius` |
| `Form/Border/Radius` | `Brand/Corner/Card` | `Corner/Form Radius` |
| `Select/Border/Radius` | `Brand/Corner/Input` | `Corner/Input Radius` |

New Semantic token added:
- `Corner/Input Radius` → `Brand/Corner/Input` (`--corner-input-radius`)

## Consequences

- The governance rule "Components reference only Semantics or Core" is now
  enforceable without exceptions for corner radii.
- Future corner-radius changes for a brand only need to update Themes — the
  Semantic layer propagates automatically.
- If a new component needs a radius, the decision is clear: find or create
  a Semantic Corner token, never reference Themes directly.
- Figma must mirror this change: reassign the variable references in the
  Components collection to point to the Semantics collection variables.

## Risks

- Until Figma is updated to match, the export files will diverge from
  Figma's actual variable graph on next sync. A manual Figma update is
  required before the next `tokens:sync`.
