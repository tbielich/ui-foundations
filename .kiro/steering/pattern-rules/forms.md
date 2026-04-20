# Pattern: forms

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- forms
- field groups
- validation messages

## Purpose
Help users provide structured input with clear labels, predictable grouping, and
recoverable errors.

## Structure
Place each control with its label, help text, and error text in one field group.
Group related fields under a visible section label when the relationship changes.
Place the primary submit action after the fields it submits.

## Rules
- Every input control must have a programmatic label or accessible name.
- Required, optional, help, and error text must sit in the same field group as
  the control they describe.
- Group related options as a fieldset, radio group, checkbox group, or equivalent
  semantic grouping.
- Primary and secondary form actions must remain visually distinct and ordered by
  task priority.

## Interaction rules
- Validation feedback must identify the field, the problem, and the recovery
  action.
- Disabled controls must communicate disabled state visually and semantically.
- Focus must move predictably through fields in reading order.

## Accessibility considerations
- Use semantic labels and native form controls before ARIA.
- Preserve visible focus on all interactive controls.
- Error text must be reachable by assistive technology through the field
  relationship or documented markup.

## Applied principles
- `principle.proximity`
- `principle.hierarchy`
- `principle.affordance`
- `principle.cognitive-load`

## Applied heuristics
- `heuristic.feedback`
- `heuristic.error-prevention`
- `heuristic.recognition`
- `heuristic.accessibility`

## Failure signals
- A control appears without a visible or programmatic label.
- Error text is separated from the field it describes.
- Required state is only communicated by color or position.
- Field order differs from the visual reading order.

## Agent check
- Verify each form control has a label, `aria-label`, or `aria-labelledby`.
- Verify grouped choices use a shared name, fieldset, role, or documented group
  wrapper.
- Verify error and help copy are colocated with the field they describe.
