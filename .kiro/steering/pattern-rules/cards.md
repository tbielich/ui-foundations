---
type: pattern-rule
domain: ui-foundations
status: active
pattern: cards
applies_to:
  - cards
  - summary-panels
  - selectable-content-blocks
principles:
  - principle.proximity
  - principle.hierarchy
  - principle.affordance
  - principle.consistency
heuristics:
  - heuristic.consistency
  - heuristic.recognition
  - heuristic.user-control
  - heuristic.accessibility
inclusion: manual
---

# Pattern: cards

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- cards
- summary panels
- selectable content blocks

## Purpose
Present one coherent object or choice with a clear title, supporting content, and
optional actions.

## Structure
Use one card for one object. Put the title before supporting metadata and place
actions after the content they affect. Avoid nested cards unless the inner item
is a separate repeated object with its own interaction model.

## Rules
- A card must have one primary subject: title, object name, or accessible label.
- Supporting content must reinforce the subject rather than introduce unrelated
  tasks.
- Actions inside a card must apply to that card only.
- If the whole card is clickable, nested interactive controls must be avoided or
  the interaction model must be documented.

## Interaction rules
- Hover, selected, focused, and disabled states must be visually distinct when
  the card is interactive.
- The click target must be predictable: either the whole card or explicit
  controls, not both without a documented reason.
- Repeated cards must keep action placement consistent.

## Accessibility considerations
- Use semantic headings or labels for the card subject.
- Preserve keyboard focus for card actions.
- Do not rely on visual card boundaries as the only grouping signal.

## Applied principles
- `principle.proximity`
- `principle.hierarchy`
- `principle.affordance`
- `principle.consistency`

## Applied heuristics
- `heuristic.consistency`
- `heuristic.recognition`
- `heuristic.user-control`
- `heuristic.accessibility`

## Failure signals
- Multiple unrelated objects compete inside one card.
- The whole card and inner controls both trigger ambiguous actions.
- Repeated cards move actions or metadata between positions.
- The card has no accessible subject.

## Agent check
- Verify each card has one title or accessible subject.
- Verify actions inside the card target only that card.
- Verify repeated cards use consistent structure and action placement.
