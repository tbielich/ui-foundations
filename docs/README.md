# Documentation Map

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
| `components/` | Component-facing entry docs and TODO gaps | `docs/components/README.md` |
| `agentic/` | Agent behavior, workflows, prompts, and migration context | `docs/agentic/README.md` |
| `adr/` | Architecture decision records and documentation migration notes | `docs/adr/README.md` |
| `validation/` | Validation checklists, CI, token parity, and accessibility checks | `docs/validation/README.md` |

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
- [Pi deployment](./pi-deployment.md)
