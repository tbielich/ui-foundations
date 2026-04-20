# Pattern: tables

## Rule type
pattern composition rule

## Scope
pattern

## Applies to
- data tables
- comparison tables
- dense record lists

## Purpose
Expose structured data so users can compare records across consistent columns.

## Structure
Use a table only when row and column relationships matter. Provide column headers
and keep row actions consistently placed. Put filtering, sorting, and pagination
controls outside the table body.

## Rules
- Every data column must have a header.
- Row actions must be scoped to the row and placed consistently.
- Sorting state must identify the sorted column and direction.
- Empty, loading, and error states must preserve the table context.

## Interaction rules
- Sort and pagination changes must produce visible feedback.
- Bulk actions must require clear selection state.
- Keyboard focus must not be trapped inside table controls.

## Accessibility considerations
- Use table semantics for tabular data.
- Use scoped headers where supported.
- Do not use tables for layout-only composition.

## Applied principles
- `principle.hierarchy`
- `principle.contrast`
- `principle.cognitive-load`
- `principle.consistency`

## Applied heuristics
- `heuristic.feedback`
- `heuristic.consistency`
- `heuristic.recognition`
- `heuristic.accessibility`

## Failure signals
- Table headers are missing or visually implied only.
- Row actions shift position between rows.
- Sorting state is color-only or not announced.
- Layout content is implemented as a data table.

## Agent check
- Verify table use is justified by row/column relationships.
- Verify each column has a header.
- Verify sort, selection, empty, loading, and error states are represented when
  the table supports them.
