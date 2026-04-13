# UI Foundations — Agent Rules

## Source of Truth
This repository is token-first and Figma-aligned.

Use sources in this order when working on UI Foundations decisions:
1. `docs/ui-foundations-rules.md` → canonical operating rules for structure, naming, theming, governance, and review
2. `docs/foundations/` → architecture decisions and foundation-specific rules
3. `docs/agentic/` → workflows and agent behavior
4. `IMPLEMENTATION.md` → implementation details and repo-specific execution guidance

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

## Decision Bias
When in doubt, prefer the option that:
- preserves Core → Semantic → Component separation
- uses explicit semantic naming over visual naming
- keeps Figma naming and code naming closely aligned
- reduces ambiguity for humans and agents
- supports brand and mode as orthogonal concerns
- avoids undocumented exceptions
- improves design-to-code predictability
- scales beyond a single local use case

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
- Prefer explicit semantic naming over visual or convenience naming
- Align Figma naming and code naming as closely as possible
- Document exceptions when a rule must be broken

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
