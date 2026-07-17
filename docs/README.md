# Documentation Map

## Start here — Developer quickstart

If you are new to Runtime documentation, use this order:

1. `docs/public-api.md` — canonical v1 API surface and migration entry points
2. `docs/adr/adr-runtime-and-vault-documentation-architecture.md` — architecture boundary between Runtime and Vault
3. `docs/foundations/README.md` — foundations navigation (token architecture, naming, theming)
4. `docs/patterns/README.md` — pattern and component-facing composition guidance
5. `docs/validation/README.md` — validation and CI checks

From `docs/README.md`, each target is reachable directly in one click.

If you are contributing governance or agent behavior, continue with:

- `docs/uif-governance.md`
- `docs/playbook.md`
- `AGENTS.md`

## Purpose

This directory is the human- and agent-readable map of UI Foundations.
Use it to find the right level of documentation before diving into implementation
details or local agent configuration.

## Canonical sections

| Section | What belongs here | Start with |
|---|---|---|
| `playbook.md` | Reading order, operating model, and agent roles | `docs/playbook.md` |
| `foundations/` | Token architecture, naming, theming, parity, and format guidance | `docs/foundations/README.md` |
| `principles/` | Perception, heuristics, and accessibility intent | `docs/principles/README.md` |
| `patterns/` | Pattern-level composition guidance | `docs/patterns/README.md` |
| `components/` | Component-facing entry docs and TODO gaps | `docs/patterns/README.md` |
| `public-api.md` | Canonical Runtime-facing v1 public API summary and migration links | `docs/public-api.md` |
| `governance-baseline.md` | Consumed governance pack versions, artifact registry, and version lifecycle policy | `docs/governance-baseline.md` |
| `agentic/` | Agent behavior, workflows, prompts, and migration context | `docs/agentic/README.md` |
| `adr/` | Architecture decision records and documentation migration notes | `docs/adr/README.md` |
| `validation/` | Validation checklists, CI, token parity, and accessibility checks | `docs/validation/README.md` |
| `linking-strategy.md` | Vault link ownership and centralized documentation linking policy | `docs/linking-strategy.md` |

## Legacy docs kept in place

- `docs/ui-foundations-rules.md`
- `docs/token-pipeline.md`
- `docs/working-context.md`
- `docs/context-manifest.json`
- `docs/foundations/foundation-*.md`

These remain valid source material. New docs should point to them rather than
rewriting them unless a targeted migration is clearly safe.

## Related docs

- `AGENTS.md`
- `README.md`
- `IMPLEMENTATION.md`
- `DESIGN.md`
