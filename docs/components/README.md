# Components

## Purpose

This section is the Runtime entry point for component-facing documentation.

Use this page to understand which component surfaces are implemented now, which
are pattern-level only, and which are placeholders.

## Scope boundary

- **Patterns** describe reusable composition rules (`docs/patterns/README.md`).
- **Components** describe runtime behavior surfaces that add interactivity or
  encapsulation.
- Canonical governance and architecture ownership remain in Vault-linked
  governance and ADR documentation.

## Current component status

### Implemented runtime component surfaces

Runtime currently provides light-DOM Custom Element surfaces under
`src/elements/` (for example: `ui-button.js`, `ui-input.js`, `ui-select.js`,
`ui-tooltip.js`, `ui-tabs.js`).

These are implementation surfaces for existing UI patterns and are not treated
as separate product-component governance in this documentation layer.

### Planned or placeholder component docs

| Topic | Status | Current source |
|---|---|---|
| Modal | Placeholder | `docs/patterns/modal.md` |
| Notification | Placeholder | `docs/patterns/notification.md` |
| Select (standalone component doc) | Placeholder | `docs/patterns/select.md` |

Placeholder pages are explicitly non-canonical and must not be interpreted as
final behavior documentation.

## Recommended path

1. Start with `docs/patterns/README.md` for composition context.
2. Use `docs/public-api.md` for authored public surface usage.
3. Use `src/elements/` and `site/patterns/` for implementation-level behavior.
4. Use `docs/validation/README.md` for checks and CI-facing validation.

## Related docs

- `docs/patterns/README.md`
- `docs/public-api.md`
- `docs/architecture.md`
- `docs/validation/README.md`
