# Accessibility Principles (Runtime)

## Purpose

Provide a stable, high-level accessibility principles surface for Runtime
developers.

This page explains **how Runtime applies accessibility principles**. It does not
replace canonical principle definitions owned by the Vault.

## Runtime vs canonical scope

- **Canonical principle definitions:** Vault foundation knowledge.
- **Runtime principle application:** this repository's patterns, elements,
  authored examples, and validation paths.

Use this page for implementation orientation, then follow linked Runtime docs
for concrete behavior and checks.

## Runtime accessibility principles

### 1. Native semantics first

Prefer native HTML semantics before ARIA layering. Components and patterns should
start from semantic elements and only add ARIA where native semantics are
insufficient.

Implementation entry points:

- `docs/patterns/forms.md`
- `docs/patterns/input.md`
- `src/elements/`

### 2. Keyboard and focus are required behavior

Interactive surfaces must support keyboard navigation and visible focus states as
first-class behavior, not optional enhancements.

Implementation entry points:

- `docs/patterns/navigation.md`
- `docs/patterns/modal.md` (placeholder tracker)
- `docs/accessibility-audit-interactive-components.md`

### 3. State and feedback must be perceivable

Status, validation errors, and interaction outcomes must be exposed through
semantic structure and perceivable text/state, not color alone.

Implementation entry points:

- `docs/patterns/feedback.md`
- `docs/patterns/forms.md`

### 4. Principle and practice are separate

- **Principles** explain expected accessibility outcomes.
- **Practice/workflows** explain how audits, checks, and remediation are run.

Workflow and validation entry points:

- `docs/accessibility-audit-interactive-components.md`
- `docs/validation/README.md`
- `docs/validation/ci.md`

## Validation path

Use Runtime validation docs to verify accessibility-related implementation work:

1. `docs/validation/README.md`
2. `docs/validation/ci.md`
3. repository checks via `npm run ci:check`

## Related docs

- `docs/principles/usability-heuristics.md`
- `docs/patterns/README.md`
- `docs/accessibility-audit-interactive-components.md`
- `docs/validation/README.md`
