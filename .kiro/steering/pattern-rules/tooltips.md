---
type: pattern-rule
domain: ui-foundations
status: active
pattern: tooltips
applies_to:
  - tooltip
  - contextual-help
  - hover-labels
principles:
  - principle.cognitive-load
  - principle.proximity
  - principle.contrast
heuristics:
  - heuristic.recognition
  - heuristic.accessibility
inclusion: manual
---

# Pattern: tooltips

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- tooltip
- contextual help
- hover labels

## Purpose
Provide brief supplementary information without cluttering the interface,
appearing only when the user needs it.

## Structure
A tooltip is positioned relative to a trigger element. It appears on
hover/focus and disappears when the pointer leaves or focus moves away.
The tooltip is non-interactive — it cannot contain links or buttons.

## Rules
- Tooltip text must be brief (1 short sentence max).
- Tooltip must appear on both hover and focus (keyboard accessible).
- Tooltip must not obscure the trigger element.
- Tooltip must have `role="tooltip"`.
- Trigger should reference the tooltip via `aria-describedby`.
- Tooltip must not contain interactive elements.

## Interaction rules
- Show on hover with a short delay (~200ms).
- Show immediately on focus.
- Hide when pointer leaves or focus moves away.
- Hide on Escape key press.

## Accessibility considerations
- `role="tooltip"` identifies the element to assistive technology.
- `aria-describedby` on the trigger associates the tooltip content.
- Must be keyboard accessible (shows on focus, not just hover).
- Content must be readable by screen readers.

## Applied principles
- `principle.cognitive-load`
- `principle.proximity`
- `principle.contrast`

## Applied heuristics
- `heuristic.recognition`
- `heuristic.accessibility`

## Failure signals
- Tooltip only appears on hover (not focus)
- Tooltip contains interactive elements (links, buttons)
- Tooltip text is too long (multiple sentences)
- Tooltip obscures the trigger or important content
- Missing role="tooltip"

## Agent check
- Verify role="tooltip" is present
- Verify tooltip shows on both :hover and :focus-within
- Verify tooltip contains no interactive elements
- Verify max-inline-size constraint prevents overly wide tooltips
- Verify placement attribute controls positioning
