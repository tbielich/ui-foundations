# Foundations

## Purpose

Foundations docs describe the canonical token, naming, theming, parity, and
format rules that other layers build on.

This section is the developer-facing entry point for Runtime foundation
implementation. It points to the detailed foundation records instead of
repeating them.

## Foundations at a glance

Use foundations docs to understand:

1. how token layers are separated
2. how public naming is derived
3. how mode and brand context are activated
4. how generated token outputs feed patterns and components

For the repository-wide system view, start with `docs/architecture.md`.

## Recommended reading path

1. `foundation-001-token-layering.md` — token layer model
2. `foundation-002-naming-and-grouping.md` — naming structure and grouping
3. `foundation-008-mode-activation-and-consumer-control.md` — mode ownership
4. `foundation-010-implementation-and-pipeline-workflow.md` — implementation workflow
5. `docs/token-pipeline.md` — generation mechanics and output files

## Canonical files

The detailed foundation ADRs are the source of truth:

| File | Topic |
|---|---|
| `foundation-001-token-layering.md` | Core -> Appearance -> Semantics (Brands) -> Patterns/Components token layering |
| `foundation-002-naming-and-grouping.md` | Token naming, grouping, and variant-first structure |
| `foundation-003-color-semantics-and-status.md` | Semantic color roles, status vs interaction state |
| `foundation-004-typography-scale-and-line-height.md` | Typography scale, line height, and role composition |
| `foundation-005-responsive-breakpoints-and-containers.md` | Breakpoints, container thresholds, and responsive separation |
| `foundation-006-z-index-layering.md` | Z-index tokenization and overlay layering |
| `foundation-007-typography-selectors-and-specificity.md` | Typography selectors, class API, and specificity rules |
| `foundation-008-mode-activation-and-consumer-control.md` | Light/dark mode scoping and consumer-owned activation |
| `foundation-009-component-boundaries-and-utility.md` | Standalone component boundary test and utility check |
| `foundation-010-implementation-and-pipeline-workflow.md` | Token-first implementation workflow and validation commands |
| `foundation-011-branching-and-release-governance.md` | Feature-branch, PR, and release governance |
| `foundation-012-minimal-markup-and-composition.md` | Minimal markup, composition, and wrapper discipline |

## Who should read this

- Designers defining token and naming decisions
- Engineers implementing or validating token-driven UI
- Agents doing token, component, or parity work

## Related docs

- `docs/architecture.md`
- `docs/token-pipeline.md`
- `docs/patterns/README.md`
- `IMPLEMENTATION.md`
