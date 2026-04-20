# Pattern: navigation

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- primary navigation
- secondary navigation
- breadcrumbs
- tabs

## Purpose
Show users where they are, where they can go, and which destinations are related.

## Structure
Use semantic navigation landmarks for destination lists. Keep primary navigation
separate from local or contextual navigation. Use breadcrumbs only for hierarchy,
not for process steps.

## Rules
- Navigation groups must have a visible label or accessible `aria-label`.
- Current location must be marked with `aria-current` or the correct selected
  state for the navigation type.
- Primary, secondary, and contextual navigation must remain structurally
  separate.
- Navigation labels must be stable and recognizable across pages.

## Interaction rules
- Active and focus states must be distinct.
- Disabled destinations should be avoided; when necessary, explain why they are
  unavailable.
- Keyboard order must follow the visual navigation order.

## Accessibility considerations
- Use `<nav>` for navigation regions.
- Use lists where the navigation is a list of destinations.
- Use `aria-current="page"` for the current page link.

## Applied principles
- `principle.hierarchy`
- `principle.affordance`
- `principle.cognitive-load`
- `principle.consistency`

## Applied heuristics
- `heuristic.recognition`
- `heuristic.consistency`
- `heuristic.user-control`
- `heuristic.accessibility`

## Failure signals
- Current page is only indicated by color.
- Primary and contextual destinations are mixed in one unlabeled group.
- Navigation order changes between similar views.
- A breadcrumb is used as a progress indicator.

## Agent check
- Verify each navigation region has a label.
- Verify current destination state is semantic, not color-only.
- Verify primary and secondary navigation are separate structures.
