# UI Foundations — Agent Rules

## Source of Truth
This repository is token-first and Figma-aligned.

Follow:
- docs/foundations/ → architecture decisions
- docs/agentic/ → workflows and behavior

Also read CLAUDE.md for implementation details.

Never contradict these sources.

---

## Core Principle
Never assume system state. Always verify before acting.

Workflow:
Plan → Execute → Verify → Report

---

## Repository Rules
- Verify repo state before changes:
  - pwd
  - git status
  - git branch
- Work on feature branches only
- Never rely on assumed state
- Keep changes small, reviewable, non-breaking

---

## Token Workflow (MANDATORY)
1. Ingest tokens (Figma export)
2. Compare with code
3. Identify drift:
   - missing tokens
   - naming mismatches
   - value differences
4. Propose fix plan
5. Apply changes
6. Re-validate

Never:
- invent tokens
- skip comparison
- modify tokens blindly

---

## Design System Rules
- Respect token layers:
  Core → Semantic → Component
- Never mix layers
- Never hardcode values
- Always use CSS variables: var(--...)

Do not edit generated files in `dist/`

---

## Implementation Rules
- Use existing patterns and file structure
- Do not introduce new frameworks
- Keep docs and implementation in sync

---

## Validation (REQUIRED)
Before completion:
- npm run lint
- npm run test:unit
- npm run ci:check

---

## Behavior
- Be concise and structured
- Explain intent before actions
- Show commands before execution
- Verify results after execution

If not verified → not true
