# AGENTS

This file is the entry point for AI coding agents working in this repository.

## Agentic docs

- `docs/agentic/assistant-behavior-rules.md` — behavior and architecture guardrails for assistants
- `docs/agentic/team-ai-playbook.md` — team workflow for AI-assisted implementation
- `docs/agentic/figma-plugin-api-reference.md` — Figma Plugin API rules and patterns for Token Foundry
- `docs/agentic/figma-code-connect-workflow.md` — workflow for connecting Figma components to code
- `docs/agentic/figma-design-to-code-workflow.md` — workflow for implementing Figma designs in code

## Required baseline

1. Follow foundation rules in `docs/foundations/` as source of truth.
2. Keep changes small, reviewable, and non-breaking by default.
3. Validate changes before handoff with:
   - `npm run lint`
   - `npm run test:unit`
   - `npm run ci:check`

## Scope notes

- This repo is token-first and Figma-aligned.
- Prefer extending existing patterns over introducing new frameworks.
- Keep docs and implementation in sync when changing workflows.
