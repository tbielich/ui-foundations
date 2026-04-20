---
inclusion: always
---

# Design Principles

These principles are the source of truth for cross-cutting UI composition intent.
They describe what good UI structure must preserve before any pattern or component
rule is generated.

## Traceability Contract

- Pattern rules must cite at least one principle id from this file.
- Component rules must preserve the cited pattern intent instead of inventing a
  separate rationale.
- Validation rules must point back to principle, heuristic, pattern, or component
  rule ids.
- If a principle does not apply to a generated pattern, omit it rather than
  forcing a weak mapping.

## Principles

- `principle.proximity`
  Group related controls, labels, descriptions, and actions close enough that
  their relationship is obvious without extra explanation.

- `principle.hierarchy`
  Make the primary task, current context, and next action visually and
  structurally easier to find than secondary material.

- `principle.contrast`
  Preserve readable foreground/background relationships, visible boundaries, and
  clearly distinguishable states across brand and mode.

- `principle.affordance`
  Interactive elements must communicate how they can be used through semantic
  HTML, state styling, labels, and predictable cursor/focus behavior.

- `principle.cognitive-load`
  Reduce the number of simultaneous decisions by grouping choices, removing
  redundant structure, and exposing only controls needed for the current task.

- `principle.consistency`
  Reuse naming, placement, state treatment, and interaction behavior across
  related patterns so users and agents can transfer expectations.
