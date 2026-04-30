---
inclusion: always
---

# UI Foundations Usability Heuristics

These project-specific heuristics are the source of truth for interaction and
validation intent in UI Foundations.

They override or narrow generic global usability-review skills for UI Foundations
work. Use the global `usability-heuristics` skill as background knowledge, but
use these IDs when generating pattern rules, component rules, validation checks,
or review findings for this project.

## Traceability Contract

- Pattern rules must cite the heuristic ids they rely on.
- Component rules must implement the cited heuristics with semantic markup,
  state classes, tokens, or documented behavior.
- Validation must prefer deterministic checks tied to these ids.

## Heuristics

- `heuristic.feedback`
  User actions must produce visible, semantic, or assistive feedback through
  states, messages, focus, or updated content.

- `heuristic.consistency`
  Similar controls and patterns must behave, read, and respond consistently
  across surfaces.

- `heuristic.error-prevention`
  Structure should prevent avoidable mistakes before they happen through clear
  labels, grouping, required/optional cues, disabled states, and constrained
  choices.

- `heuristic.recognition`
  Interfaces should make available actions and context visible instead of
  relying on memory, hidden conventions, or implied relationships.

- `heuristic.user-control`
  Users should be able to understand the current state, change reversible
  choices, cancel where appropriate, and recover from mistakes.

- `heuristic.accessibility`
  Patterns must preserve semantic HTML, programmatic names, keyboard access,
  visible focus, and assistive-technology state communication.
