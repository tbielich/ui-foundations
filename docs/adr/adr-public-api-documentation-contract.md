---
title: ADR – Public API Documentation Contract (v1)
status: accepted
type: adr
---

# ADR: Public API Documentation Contract (v1)

## Context

Runtime documentation contains migration guidance and API usage examples across
multiple entry points (`README.md`, migration docs, and ADR references).

For v1, the public API surface is intentionally breaking and must be documented
consistently to avoid conflicting consumer guidance.

## Decision

For owned Runtime documentation, v1 public API guidance follows this contract:

1. Canonical examples use the `uif` namespace for public usage:
   - classes: `.uif-*`
   - custom elements: `<uif-*>`
   - macro invocation alias in examples: `uif.*`
2. Legacy names (`.button`, `<ui-*>`, legacy token prefixes) are compatibility
   context only and must be explicitly labeled as migration/compatibility.
3. Migration detail lives in migration docs; entry docs summarize and link
   instead of duplicating exhaustive mappings.
4. Stable package/module surfaces that intentionally remain unchanged in v1
   (for example `ui-foundations/elements/ui-*` subpaths) may still appear in
   examples when explicitly called out as stable package surface behavior.

## Consequences

- Top-level docs present one consistent public API story for v1.
- Consumers can distinguish canonical v1 usage from compatibility context.
- Migration docs remain the detailed source for before/after mappings.

## Out of scope

This decision does not define:

- governance pack lifecycle policy
- documentation metadata schema
- CI validation implementation
- automation or drift tooling

## Related

- `docs/adr/adr-runtime-and-vault-documentation-architecture.md`
- `docs/adr/adr-uif-public-api-namespace.md`
- `docs/migrations/public-api-namespace-v1.md`
- `MIGRATION.md`
