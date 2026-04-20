# Pattern: search-and-filter

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- search
- filters
- faceted filtering
- result refinement

## Purpose
Help users reduce a result set while keeping query, filters, result count, and
reset paths visible.

## Structure
Place search input, filter controls, active filters, reset action, and result
summary in one refinement region. Keep filters close to the results they affect.

## Rules
- Search input must have an accessible label that names the searchable scope.
- Active filters must be visible and individually removable when filters can
  stack.
- Result count or equivalent feedback must update after search or filter changes.
- Reset must clear only the refinement controls in the current region.

## Interaction rules
- Applying or clearing filters must update results and feedback together.
- Debounced search must still communicate loading or updated state when needed.
- Empty results must provide a recovery path.

## Accessibility considerations
- Use labels for search and filter controls.
- Announce result count changes where dynamic updates occur.
- Preserve keyboard access to active filter removal and reset controls.

## Applied principles
- `principle.proximity`
- `principle.hierarchy`
- `principle.affordance`
- `principle.cognitive-load`

## Applied heuristics
- `heuristic.feedback`
- `heuristic.error-prevention`
- `heuristic.recognition`
- `heuristic.user-control`
- `heuristic.accessibility`

## Failure signals
- Users cannot see which filters are active.
- Reset clears unrelated state outside the refinement region.
- Result count does not update after filtering.
- Search scope is ambiguous.

## Agent check
- Verify search and filter controls share a named refinement region.
- Verify active filters and reset behavior are represented.
- Verify result feedback changes when refinement state changes.
