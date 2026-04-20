# Pattern: modals

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- dialogs
- modal confirmations
- blocking overlays

## Purpose
Interrupt the current task only when a focused decision or blocking information
must be handled before returning to the page.

## Structure
Use a dialog container with a title, focused body content, and explicit actions.
The primary action must reflect the dialog purpose. Destructive actions must be
clearly named and separated from cancel or close.

## Rules
- A modal must have an accessible title and a clear reason to interrupt.
- Body content must stay focused on the decision or task inside the dialog.
- Provide an obvious close, cancel, or safe escape path unless the blocking
  condition is mandatory and documented.
- Destructive confirmation must use explicit action copy.

## Interaction rules
- Opening a modal moves focus into the dialog.
- Closing a modal returns focus to the invoking control where possible.
- Escape and backdrop behavior must be intentional and documented for the dialog
  type.

## Accessibility considerations
- Use dialog semantics and connect the accessible title.
- Prevent keyboard focus from moving behind a modal while it is open.
- Ensure modal actions are keyboard reachable.

## Applied principles
- `principle.hierarchy`
- `principle.contrast`
- `principle.affordance`
- `principle.cognitive-load`

## Applied heuristics
- `heuristic.feedback`
- `heuristic.error-prevention`
- `heuristic.user-control`
- `heuristic.accessibility`

## Failure signals
- The modal has no accessible title.
- Users can tab into page content behind the modal.
- The primary action label is vague, such as "OK", for a destructive choice.
- The dialog includes unrelated content or navigation.

## Agent check
- Verify dialog role, accessible title, focus entry, and focus return strategy.
- Verify destructive actions use explicit labels.
- Verify close behavior is documented for the modal type.
