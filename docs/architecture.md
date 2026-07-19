# Runtime Architecture Overview

## Purpose

This page explains how the `ui-foundations` Runtime is assembled and where to
look next when you need implementation detail.

It is intentionally implementation-oriented. Canonical principles, governance,
and reusable architecture decisions remain in the Vault and the documented ADR
set.

## Narrative boundary

Use Runtime docs for:

- repository structure
- token flow and generated outputs
- implementation layers and consumer surfaces
- where patterns, elements, validation, and docs connect

Use canonical sources for:

- durable design principles
- governance rules
- cross-repository documentation architecture
- reusable specifications

When this page summarizes a concept, it links to the deeper Runtime source
instead of restating Vault canon.

## System map

```text
Figma exports
  -> token generation scripts
  -> generated dist outputs
  -> consumption surfaces
  -> validation and docs
```

## Runtime layers

### 1. Source inputs

- `figma/exports/*.tokens.json` — Figma variable exports
- `src/ui/patterns/` — CSS pattern sources
- `src/elements/` — light-DOM Custom Elements
- `site/` — docs-site pages, macros, and examples

### 2. Generation and build

- token generation scripts transform Figma exports into CSS, JSON, TS, and YAML
- CSS bundles assemble core, token, context, and UI layers
- docs build renders implementation guidance and playground pages

For the pipeline mechanics, see `docs/token-pipeline.md`.

### 3. Generated outputs

- `dist/tokens/` — generated token artifacts
- `dist/core/` and `dist/ui/` — CSS output layers
- `dist/macros/` — generated macro copies
- package exports consumed by CSS users, macro users, and Custom Element users

Generated `dist/` files are outputs, not authored sources.

### 4. Consumer surfaces

- plain HTML + CSS patterns
- Nunjucks macros
- light-DOM Custom Elements
- token exports for downstream tooling

The public API entry point for those surfaces is `docs/public-api.md`.

## Token and UI layering

Runtime implementation follows four practical layers:

1. **Core** — primitives and shared references
2. **Appearance** — mode-dependent decisions
3. **Semantics** — brand-scoped semantic roles
4. **Patterns / Components** — UI-facing usage tokens and implementation

This page only names the layers. For the canonical detailed layer rules, start
with `docs/foundations/foundation-001-token-layering.md`.

## How developers should navigate

- Start with `docs/public-api.md` for authored usage
- Read `docs/foundations/README.md` for token and naming deep links
- Use `docs/patterns/README.md` for composition guidance
- Use `docs/validation/README.md` for checks and CI-facing validation
- Use `IMPLEMENTATION.md` when you need repository execution detail

## Runtime vs Vault

The Runtime explains how this repository applies the system.

The Vault remains the canonical source for durable knowledge. Runtime docs
should link to canon, not replace it.
