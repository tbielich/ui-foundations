---
type: pattern-rule
domain: ui-foundations
status: active
pattern: accordion
applies_to:
  - accordion
  - disclosure
  - expandable-sections
principles:
  - principle.hierarchy
  - principle.cognitive-load
  - principle.affordance
heuristics:
  - heuristic.recognition
  - heuristic.user-control
  - heuristic.accessibility
inclusion: manual
---

# Pattern: accordion

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- accordion
- disclosure
- expandable sections

## Purpose
Reduce cognitive load by hiding secondary content behind expandable triggers,
while keeping the information hierarchy visible through summary labels.

## Structure
Stack accordion items vertically. Each item has a summary trigger and a content
area. The trigger communicates expand/collapse state visually (chevron) and
programmatically (aria-expanded via native details/summary).

## Rules
- Use native `<details>` and `<summary>` elements for built-in keyboard and
  screen reader support.
- Summary text must clearly describe the hidden content.
- Chevron indicator must rotate to reflect open/closed state.
- Items must be separated by visible borders.
- Disabled items must be visually muted and non-interactive.

## Interaction rules
- Click or Enter/Space on summary toggles the item.
- Tab moves between summary elements.
- Opening one item does not close others (multi-expand by default).

## Accessibility considerations
- Native details/summary provides aria-expanded automatically.
- Focus must be visible on the summary element.
- Content must be reachable by Tab when expanded.

## Applied principles
- `principle.hierarchy`
- `principle.cognitive-load`
- `principle.affordance`

## Applied heuristics
- `heuristic.recognition`
- `heuristic.user-control`
- `heuristic.accessibility`

## Failure signals
- Summary text is vague or duplicated across items
- No visual indicator of expand/collapse state
- Content not reachable by keyboard when expanded
- Items collapse when another opens (unless explicitly single-expand mode)

## Agent check
- Verify `<details>` and `<summary>` elements are used
- Verify chevron rotates on open state
- Verify Tab reaches summary elements
- Verify disabled items have muted styling and pointer-events: none
