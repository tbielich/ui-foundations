---
inclusion: manual
---

# Agent Modes

Agents switch between modes based on task type. Mode files live in
`docs/agentic/modes/` and constrain what an agent may do during a session.

## Mode Selection

| Task type | Mode | May modify files? |
|-----------|------|-------------------|
| Build component, fix bug, add feature | Implementation | Yes |
| Review tokens, check naming, find drift | Audit | No (read-only) |
| Discover reusable patterns from codebase | Pattern Discovery | No (read-only) |
| Propose new or modified tokens | Token Proposal | No (propose only) |

Default mode when unclear: **Implementation**.

## Mode: Implementation

**Purpose**: Modify or create components, tokens, or styles.

Rules:
- Make the smallest possible change
- Complete all required integration surfaces before finishing
- No hardcoded values — tokens must exist and be valid
- Components must support theming
- `npm run ci:check` must pass

Inherits all rules from `docs/agentic/assistant-behavior-rules.md`.

## Mode: Audit

**Purpose**: Inspect the system for drift, inconsistency, or rule violations
without making changes.

Rules:
- Read-only — do not modify files
- Compare Figma exports against dist output
- Flag naming mismatches, missing tokens, value drift
- Report findings structured by severity (critical / warning / info)
- Suggest remediation but do not apply

## Mode: Pattern Discovery

**Purpose**: Identify reusable patterns from existing components, designs, or
usage across the codebase.

Rules:
- Read-only — do not create new files
- Analyse existing components for shared structure
- Compare against current pattern rules in `.kiro/steering/pattern-rules/`
- Identify candidates for new pattern rules or consolidation

Output: discovered patterns with evidence, mapping to principles/heuristics,
and recommendation (new rule, extend existing, or no action).

## Mode: Token Proposal

**Purpose**: Propose new or modified tokens based on Figma changes, component
needs, or identified gaps.

Rules:
- Propose only — do not create tokens directly
- Follow naming: `--component-variant-part-property-state`
- If a needed semantic token does not exist, flag it for Figma creation
- Provide justification referencing Figma source or component need
- Include impact assessment: which components/patterns are affected

Inherits token rules from `AGENTS.md` (Token Workflow, Design System Rules).

## Switching Modes

An agent should:
1. Identify task type from the user's request
2. Load the appropriate mode constraints
3. State the active mode at the start of work
4. Never exceed mode permissions (e.g. no file edits in Audit mode)
