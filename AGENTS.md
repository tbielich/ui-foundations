# UI Foundations — Agent Rules

## Context Loading Order

Before acting, agents must load context in this order:

1. `DESIGN.md` → executive design contract
2. `AGENTS.md` → this file (behavior rules)
3. `docs/playbook.md` → documentation hierarchy and operating model
4. `docs/working-context.md` → current priorities
5. `docs/ui-foundations-rules.md` → canonical operating rules
6. `docs/foundations/` → architecture decisions
7. `docs/agentic/assistant-behavior-rules.md` → component checklist
8. `IMPLEMENTATION.md` → repo-specific execution guidance

Never contradict these sources.

---

## Core Principle

Never assume system state. Always verify before acting.

Workflow: Plan → Execute → Verify → Report

---

## Repository Rules

- Verify repo state before changes:
  - `pwd`
  - `git status`
  - `git branch`
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

- Respect token layers: Core → Semantic → Component
- Never mix layers
- Never hardcode values
- Always use CSS variables: `var(--...)`
- Prefer explicit semantic naming over visual or convenience naming
- Align Figma naming and code naming as closely as possible
- Document exceptions when a rule must be broken

Do not edit generated files in `dist/`.

---

## Implementation Rules

- Use existing patterns and file structure
- Do not introduce new frameworks
- Keep docs and implementation in sync

---

## UIF Governance Consumption

- `.uif/packs/` contains consumed governance from the UI Foundations Vault.
- `.uif/workspace/` belongs only to this repository and stores local decisions, overrides, lessons, and reflection.
- Governance must never be changed silently; document the owner, rationale, and review status.
- New insights start locally in `.uif/workspace/lessons/` or `.uif/workspace/reflection/`.
- Only reviewed promotion candidates can become Vault governance.

---

## Validation (REQUIRED)

Before completion:

- `npm run lint`
- `npm run test:unit`
- `npm run ci:check`

---

## Behavior

- Be concise and structured
- Explain intent before actions
- Show commands before execution
- Verify results after execution

If not verified → not true

---

## Agent Modes

Depending on the task, load a mode from: `docs/agentic/modes/`

If unclear:

- default = Implementation
- exploratory tasks = Pattern Discovery or Token Proposal
- review tasks = Audit

---

## Agent-Specific Workflows

- Kiro: `docs/agentic/kiro-workflow.md`
- Goose: `docs/agentic/goose-workflow.md`
- Codex: `docs/agentic/codex-workflow.md`

---

## Agent Loop (MCP)

For autonomous token-drift resolution, use the MCP server tools in sequence:

1. `diagnose_drift` → identifies mismatches between Figma exports and generated tokens
2. `apply_token_fix` → corrects a single token (rename, update_value, remove)
3. `validate_system` → runs ci:check to verify the fix

Loop until `diagnose_drift` returns `driftCount: 0` or a non-fixable drift type.
Max iterations: 5. If the loop does not converge, report remaining drift and stop.
