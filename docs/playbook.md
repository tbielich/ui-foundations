# Documentation Playbook

## Purpose

This playbook explains how to consume UI Foundations documentation without
guessing which file owns which rule.

## Reading order

### Developer-first navigation (default)

`README.md` → `docs/README.md` → `docs/public-api.md` →
`docs/foundations/*` → `docs/patterns/*` → `docs/validation/*`

### Agent/contributor navigation

`AGENTS.md` → `docs/playbook.md` → `docs/foundations/*` →
`docs/principles/*` → `docs/patterns/*` → `docs/validation/*`

### Missing-reference fallback policy

If a Runtime-local reference target is missing:

1. Prefer linking to an existing Runtime page that carries the concept.
2. If no Runtime page exists, add a minimal Runtime stub that points to the
   canonical Vault source.
3. Do not leave unresolved links or infer canonical ownership from local drafts.

Supplemental context:

- `DESIGN.md` for the executive design contract
- `IMPLEMENTATION.md` for repo-specific execution guidance
- `docs/uif-governance.md` for governance consumption state
- `docs/ui-foundations-rules.md` for canonical operating rules
- `docs/token-pipeline.md` for token generation and DTCG format details
- `docs/terminology.md` for canonical terminology baseline
- `docs/canonical-reference-matrix.md` for topic-to-source traceability

## Operating model

Principles  
→ Patterns  
→ Components  
→ Tokens  
→ Validation  
→ CI

How that applies in this repo:

- **Principles** define the cross-cutting design intent.
- **Patterns** translate that intent into reusable composition rules.
- **Components** apply those rules locally in markup, tokens, wrappers, and docs.
- **Tokens** carry the design decisions through Figma exports and generated outputs.
- **Validation** checks the rule chain and technical integrity.
- **CI** runs those checks consistently.

## Agent roles

- **ChatGPT**: strategy, structure, prompts, storytelling
- **Kiro**: specs, implementation planning, Figma-to-code workflows
- **Goose**: repo audit, cleanup, validation support
- **Codex**: code changes, refactoring, scripts, tests

## Canonical docs by task

- Token architecture: `docs/foundations/foundation-001-token-layering.md`
- Naming: `docs/foundations/foundation-002-naming-and-grouping.md`
- Theming: `docs/foundations/foundation-008-mode-activation-and-consumer-control.md`
- Public API entry: `docs/public-api.md`
- Figma/code parity: `docs/ui-foundations-rules.md`, `IMPLEMENTATION.md`
- Token format / DTCG: `docs/token-pipeline.md`
- Agent behavior: `docs/agentic/assistant-behavior-rules.md`
- Validation and CI: `docs/validation/ci.md`
- Terminology baseline: `docs/terminology.md`
- Canonical topic-source map: `docs/canonical-reference-matrix.md`

## Related docs

- `docs/README.md`
- `docs/agentic/README.md`
- `docs/validation/README.md`
