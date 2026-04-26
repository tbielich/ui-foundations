# UI Foundations — DESIGN.md

## Source of Truth

This file is an agent-facing design contract.
It does not replace token files, Figma variables, ADRs, or component documentation.

Canonical sources:

- `AGENTS.md`
- `docs/ui-foundations-rules.md`
- `docs/foundations/`
- `figma/exports/*.tokens.json`
- `dist/tokens.css`
- `dist/tokens.json`

## Design Philosophy

UI Foundations is a token-first, Figma-aligned design system built for reliable
design-to-code parity. The system prioritises semantic intent over visual
guesswork.

## Token Architecture

The system follows a layered model:

1. Core primitives
2. Semantic tokens
3. Component tokens
4. Brand / mode / theme application

Agents must never invent token names.
Use existing CSS custom properties from `codeSyntax.WEB` or exported token files.

## Theming Model

Themes are orthogonal:

- `data-brand`
- `data-mode`

Brand and appearance must not be hardcoded into components.

## Color Rules

Use semantic tokens for UI decisions.
Do not use raw hex values in components unless explicitly documented.

## Typography Rules

Use existing typography tokens.
Do not infer font stacks, line heights, or weights from screenshots.

## Spacing Rules

Prefer semantic spacing intent where available.
Avoid arbitrary pixel values.

## Component Rules

Components must:

- use existing tokens
- support theming
- respect accessibility
- avoid hardcoded brand-specific styling
- match Figma/code naming where possible

## Accessibility

Generated UI must meet WCAG expectations.
Colour choices must preserve contrast.
Interactive states must be explicit.

## Agent Rules

Before creating UI:

1. Read this file.
2. Read `AGENTS.md`.
3. Inspect token exports.
4. Reuse existing tokens/components.
5. Validate with available scripts.
