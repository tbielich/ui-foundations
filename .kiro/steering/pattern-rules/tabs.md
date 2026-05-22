---
type: pattern-rule
domain: ui-foundations
status: active
pattern: tabs
applies_to:
  - tabs
  - tab-navigation
  - content-panels
principles:
  - principle.hierarchy
  - principle.consistency
  - principle.cognitive-load
heuristics:
  - heuristic.recognition
  - heuristic.user-control
  - heuristic.accessibility
inclusion: manual
---

# Pattern: tabs

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- tabs
- tab navigation
- content panels

## Purpose
Allow users to switch between related content views without leaving the page,
reducing cognitive load by showing one panel at a time.

## Structure
A horizontal (or vertical) tab list sits above (or beside) a content panel.
Only one tab is active at a time. The active tab has a visible indicator
(bottom border) and its panel is shown.

## Rules
- Use `role="tablist"`, `role="tab"`, and `role="tabpanel"` ARIA pattern.
- Only the selected tab has `tabindex="0"`; others have `tabindex="-1"`.
- Each tab must have `aria-selected` reflecting its state.
- Each tab should reference its panel via `aria-controls`.
- Only one panel is visible at a time.
- Tab labels must be concise (1-2 words).

## Interaction rules
- Click activates a tab and shows its panel.
- Arrow keys move between tabs (left/right for horizontal, up/down for vertical).
- Home/End move to first/last tab.
- Tab key moves focus into/out of the tablist (not between tabs).

## Accessibility considerations
- `aria-orientation` communicates layout direction.
- Roving tabindex ensures only one tab is in the tab order.
- Panel must have `tabindex="0"` to be focusable after activation.
- Disabled tabs remain in the DOM but are not activatable.

## Applied principles
- `principle.hierarchy`
- `principle.consistency`
- `principle.cognitive-load`

## Applied heuristics
- `heuristic.recognition`
- `heuristic.user-control`
- `heuristic.accessibility`

## Failure signals
- Multiple panels visible simultaneously
- Arrow keys don't move between tabs
- No visible active indicator
- Tab key moves between individual tabs instead of in/out of tablist
- Missing aria-selected or aria-controls

## Agent check
- Verify role="tablist", role="tab", role="tabpanel" are present
- Verify only one tab has aria-selected="true"
- Verify active tab has tabindex="0", others have tabindex="-1"
- Verify hidden panels have hidden attribute
- Verify aria-orientation matches visual layout
