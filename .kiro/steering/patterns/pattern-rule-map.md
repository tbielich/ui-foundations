---
inclusion: manual
---

# Component Rule Map

Use this map when translating pattern rules into component work. It keeps local
component decisions tied to the same source intent as pattern rules and
validation.

## Source Order

1. `.kiro/steering/foundations/design-principles.md`
2. `.kiro/steering/foundations/usability-heuristics.md`
3. `.kiro/steering/pattern-rules/*.md`
4. `docs/foundations/`
5. `docs/agentic/assistant-behavior-rules.md`
6. Component implementation files

## Handoff Rules

- Pattern rules define composition intent; component rules define local markup,
  token usage, state classes, and Custom Element APIs.
- Components must not add visual intent that contradicts the pattern rule that
  motivated them.
- Validation checks must cite the component rule or pattern rule they enforce.
- If a component supports multiple patterns, document the supported pattern ids
  before adding new component-level behavior.

## Current Component Coverage

| Component | Primary patterns | Existing rule files | Validation intent |
|---|---|---|---|
| Button | forms, cards, modals, tables, search-and-filter | `.kiro/steering/patterns/pattern-css-rules.md`, `docs/agentic/assistant-behavior-rules.md` | semantic button, variant state classes, focus visibility, token-only styling |
| ButtonGroup | navigation, forms | `docs/agentic/assistant-behavior-rules.md` | grouped controls use `role="group"` and accessible label where needed |
| Input | forms, search-and-filter | `.kiro/steering/patterns/pattern-css-rules.md`, `docs/agentic/assistant-behavior-rules.md` | programmatic label via consuming pattern, focus visibility, token-only styling |
| Checkbox | forms, search-and-filter | `.kiro/steering/patterns/pattern-css-rules.md`, `docs/agentic/assistant-behavior-rules.md` | native checkbox semantics, checked/indeterminate/disabled state parity |
| Radio | forms | `.kiro/steering/patterns/pattern-css-rules.md`, `docs/agentic/assistant-behavior-rules.md` | native radio semantics, shared name grouping, checked/disabled state parity |
| Switch | forms | `.kiro/steering/patterns/pattern-css-rules.md`, `docs/agentic/assistant-behavior-rules.md` | switch role, checked/disabled state parity, visible focus |
| Label | forms, cards, search-and-filter | `.kiro/steering/patterns/pattern-css-rules.md` | label composition, required text accessible to screen readers |
| Icon | navigation, cards, search-and-filter | `.kiro/steering/patterns/pattern-css-rules.md`, `docs/agentic/assistant-behavior-rules.md` | decorative icons hidden, informative icons named |
| Link | navigation, cards | `docs/foundations/foundation-012-minimal-markup-and-composition.md` | semantic link, disabled state via `aria-disabled` when needed |

## Agent Check

- Before adding component behavior, identify the pattern id and cited principle or
  heuristic.
- Before adding validation, identify the upstream rule it enforces.
- When a component cannot satisfy a pattern rule alone, document the responsibility
  at the pattern or macro level instead of forcing it into the component.
