---
type: pattern-rule
domain: ui-foundations
status: active
pattern: feedback
applies_to:
  - notifications
  - inline-alerts
  - banners
  - toast-messages
  - loading-states
  - status-messages
principles:
  - principle.hierarchy
  - principle.contrast
  - principle.affordance
heuristics:
  - heuristic.feedback
  - heuristic.recognition
  - heuristic.user-control
  - heuristic.accessibility
inclusion: manual
---

# Pattern: feedback

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- notifications and toast messages
- inline alerts and banners
- status messages (success, error, warning, info)
- loading and progress states

## Purpose
Communicate system state, action outcomes, and transient information clearly so
users can understand what happened, what is happening, or what needs attention.

## Structure
Feedback messages consist of:
1. A status indicator (icon and/or color) communicating severity or type
2. A concise message describing the state or outcome
3. An optional action (dismiss, retry, undo) when the user can respond
4. An optional detail or description for complex messages

Place feedback close to the trigger (inline) or in a consistent, predictable
location (banners at the top, toasts in a fixed corner).

## Rules
- Every feedback message must use a semantic functional color token
  (`--color-fill-success`, `--color-fill-danger`, `--color-fill-warning`,
  `--color-text-info`) to communicate severity — never rely on color alone.
- Inline feedback must appear adjacent to the element it relates to.
- Page-level banners must appear at a consistent position across pages.
- Toast notifications must appear in a consistent viewport region and auto-dismiss
  only for non-critical, recoverable messages.
- Critical or destructive feedback (errors, data loss warnings) must NOT
  auto-dismiss — they require explicit user acknowledgment.
- Loading states must provide visible indication that an operation is in progress.

## Interaction rules
- Toasts with actions must persist long enough for the user to read and act.
- Dismissible alerts must have a visible close affordance.
- Stacked notifications must not obscure each other — use vertical stacking with
  spacing tokens.
- Transitions must be subtle and not distract from content.

## Accessibility considerations
- Use `role="alert"` or `role="status"` (or `aria-live` regions) to announce
  dynamic feedback to assistive technology.
- `role="alert"` for urgent messages (errors, destructive warnings).
- `role="status"` for polite updates (success confirmations, progress).
- Ensure color is not the sole indicator of severity — pair with an icon and/or
  text label.
- Dismiss buttons must have an accessible name.
- Auto-dismissing toasts must respect `prefers-reduced-motion`.

## Applied principles
- `principle.hierarchy`
- `principle.contrast`
- `principle.affordance`

## Applied heuristics
- `heuristic.feedback`
- `heuristic.recognition`
- `heuristic.user-control`
- `heuristic.accessibility`

## Failure signals
- Feedback appears with no visible severity indicator.
- Error messages auto-dismiss before the user can read them.
- Toast notifications stack without spacing or overflow the viewport.
- Dynamic messages are not announced to screen readers.
- Color is the sole differentiator between success and error states.
- Loading state provides no indication that an operation is pending.

## Agent check
- Verify feedback elements use semantic functional tokens for color.
- Verify each feedback message pairs color with an icon or text severity label.
- Verify dynamic feedback uses `role="alert"` or `role="status"` (or
  `aria-live`) as appropriate.
- Verify critical/error feedback does not auto-dismiss.
- Verify dismiss controls have accessible names.
- Verify loading indicators are present for asynchronous operations.
