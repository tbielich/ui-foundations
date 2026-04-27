# Documentation Playbook

## Purpose

This playbook explains how to consume UI Foundations documentation without
guessing which file owns which rule.

## Reading order

`AGENTS.md`  
↓  
`docs/playbook.md`  
↓  
`docs/foundations/*`  
↓  
`docs/principles/*`  
↓  
`docs/patterns/*`  
↓  
`docs/components/*`  
↓  
`docs/validation/*`

Supplemental context:

- `DESIGN.md` for the executive design contract
- `IMPLEMENTATION.md` for repo-specific execution guidance
- `docs/ui-foundations-rules.md` for governance
- `docs/token-pipeline.md` for token generation and DTCG format details

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
- Figma/code parity: `docs/ui-foundations-rules.md`, `IMPLEMENTATION.md`
- Token format / DTCG: `docs/token-pipeline.md`
- Agent behavior: `docs/agentic/assistant-behavior-rules.md`
- Validation and CI: `docs/validation/ci.md`

## Related docs

- `docs/README.md`
- `docs/agentic/README.md`
- `docs/validation/README.md`
