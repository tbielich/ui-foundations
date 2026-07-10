---
id: template.pattern.base
title: Base Pattern Template
type: template
status: draft
owners:
  - ui-foundations
created: 2026-07-08
updated: 2026-07-09
authority: source
summary: Template for standard-native UI primitive pattern specifications.
related:
  references:
    - specification.pattern.schema
---

# Base Pattern Name

## Metadata

- id: `pattern.base.<slug>`
- type: base
- status: draft
- source: `<existing docs or standards>`
- related standards: `<native HTML, WAI-ARIA, WCAG>`
- related components: `<component names or None identified>`
- related tokens: `<semantic token areas or None identified>`

## Intent

Describe the native or near-native user intent the primitive protects.

## Problem

Describe the recurring primitive-level interface problem.

## Use When

- Use when native HTML already provides the correct semantics.
- Use when a component needs a stable primitive contract before visual styling.

## Do Not Use When

- Do not use when the interaction is a composed workflow that depends on multiple primitives.
- Do not use ARIA-only constructs where native HTML is available.

## Standard Basis

Name the native element first. Add ARIA only when native semantics are insufficient. Identify relevant WCAG requirements for names, focus, contrast, and state communication.

## Anatomy

- Native element or control.
- Label or accessible name.
- Optional icon or visual affordance.
- Optional helper, error, or state text.

## Structure Contract

| Item | Classification | Contract |
|---|---|---|
| Native element | Required | Define the exact native element. |
| Required child parts | Required | Define labels, text nodes, controls, or indicators that must exist. |
| Optional child parts | Optional | Define optional icons, helpers, errors, or indicators and their DOM order. |
| Required attributes | Required | Define default attributes such as `type`, `disabled`, `aria-*`, or form attributes. |
| Optional attributes | Optional | Define optional attributes and when they are valid. |
| Forbidden structures | Out of scope | Define structures agents must not generate without a documented exception. |

## Implementation Naming Contract

### CSS Class Contract

- Public component classes use the `uif-` prefix.
- Use class name chains for variants and `is-*` authored states.
- Use native pseudo-classes for native states where possible.
- Do not use BEM syntax or unscoped public component classes.

### Token Contract

- UIF-owned public CSS custom properties use the `--uif-` prefix.
- Component token slots use `--uif-[component]-*`.
- Experimental unresolved tokens use `--uif-proof-*` or `--uif-assumption-*`.
- Do not use unscoped public tokens such as `--button-*`.

### Data Attribute Contract

- Document any allowed UIF-specific data attributes.
- Data attributes are secondary metadata or state hooks.
- Data attributes must not replace public classes, tokens, native semantics, or ARIA.

### Native / ARIA Precedence

- Native attributes win where available.
- ARIA is used for accessibility semantics.
- Data attributes may mirror component state but must not be the only semantic source.

### Agent Freedom Boundary

- CSS naming, token scoping, native semantics, and accessibility semantics are not agent freedom.
- New naming or data-attribute ideas must be marked as proposed or recorded in `Open Questions`.

## Required Semantics

- Prefer the native HTML element.
- Preserve an accessible name.
- Preserve native disabled, required, invalid, pressed, expanded, or checked semantics when applicable.
- Hide decorative icons from assistive technology.

## Behaviour

Describe activation, focus, form submission, value changes, validation, and disabled behavior. Use browser behavior as the default.

## Keyboard Interaction

List required keyboard behavior from the native element or WAI-ARIA pattern. Include `Tab`, activation keys, editing keys, and escape behavior only when applicable.

## Accessibility Rules

- Accessible names are required.
- Focus indicators must be visible and meet contrast requirements.
- ARIA must not override native semantics.
- State must be communicated programmatically.
- Color must not be the only state indicator.

## Token Requirements

List semantic token slots for container, text, border, focus, disabled, hover, active, invalid, spacing, size, and radius as applicable.

## Token Slot Matrix

| Part | Property | State / Variant | Required semantic token slot | Notes |
|---|---|---|---|---|
| Root | `<property>` | Default | `<semantic slot>` | Use stable slot names when final token names are unresolved. |

## States

List only supported states such as default, hover, active, focus, disabled, invalid, selected, checked, expanded, or loading.

## State Semantics

| State | Required semantics | User interaction | Notes |
|---|---|---|---|
| Default | Native semantics preserved | Normal interaction | Replace with pattern-specific states. |

## Variants

List variants and explain that variants must not change required semantics.

## Responsive / Density Behaviour

Describe wrapping, minimum target size, inline/block sizing, and density behavior.

## Component Dependencies

List any related UI Foundations component or primitive. Use `None` when the base pattern stands alone.

## Minimum Component API

| API | Classification | Default | Contract |
|---|---|---|---|
| `<prop>` | Required | `<default>` | Define props, attributes, callbacks, controlled behavior, and out-of-scope API. |

## Agent Freedom

| Decision Area | Freedom Level | Allowed Choices | Requires Human Review |
|---|---|---|---|
| Native element and semantics | none | Use the defined native element and semantic contract. | Yes, for any exception. |
| Visual implementation | guided | Any framework/runtime approach that uses semantic token slots and preserves states. | No, unless token slots are missing. |
| Component API naming | limited | Use the minimum API meaning; framework-specific naming can vary when documented. | Yes, if semantics or ownership changes. |
| Optional child parts | limited | Use only optional parts declared in Structure Contract. | Yes, for new parts. |
| Internal DOM wrappers | guided | Wrappers are allowed when they do not alter semantics, focus, names, or DOM order constraints. | No. |

## Implementation Contract

- Use native HTML first.
- Define the native element.
- Define required attributes.
- Define optional attributes.
- Define events or callbacks.
- Define state-to-ARIA mapping.
- Define the minimum component API.
- Define the token slot matrix.
- Add ARIA only when needed.
- Preserve accessible names, focus order, and state semantics.
- Use semantic tokens rather than hardcoded values.
- Do not remove native keyboard behavior.

## Test Requirements

- Native element and role checks.
- Accessible name checks.
- Keyboard interaction checks.
- Focus visibility checks.
- State and disabled behavior checks.
- Token usage and contrast checks.

## Negative Test Requirements

- Native element replacement with a generic element fails unless a documented exception exists.
- Missing accessible name fails.
- Removed focus indicator fails.
- Hardcoded state color outside semantic tokens fails.

## Documentation Requirements

Human-facing docs must explain usage, variants, content guidance, examples, accessibility notes, and theming without duplicating this contract.

## Anti-Patterns

- Replacing a native element with a generic element and ARIA.
- Removing focus styles.
- Using placeholder text as the only label.
- Hardcoding colors that bypass semantic tokens.
- Creating visual variants that alter semantics.

## Agent Output

Agents can generate component acceptance criteria, review checklists, documentation deltas, and test plans from this pattern. Agents must not add runtime code to this vault.

## Open Questions

- Add unresolved semantic, token, component, or documentation gaps here.
