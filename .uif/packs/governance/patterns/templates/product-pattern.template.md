---
id: template.pattern.product
title: Product Pattern Template
type: template
status: draft
owners:
  - ui-foundations
created: 2026-07-08
updated: 2026-07-09
authority: source
summary: Template for domain-specific product UI pattern specifications.
related:
  references:
    - specification.pattern.schema
---

# Product Pattern Name

## Metadata

- id: `pattern.product.<slug>`
- type: product
- status: draft
- source: `<domain docs, product docs, standards, or research>`
- related standards: `<native HTML, WAI-ARIA, WCAG, commerce, travel, or data standards>`
- related components: `<component names or None identified>`
- related tokens: `<semantic token areas or None identified>`

## Intent

Describe the domain outcome, user decision, or business process the pattern supports.

## Problem

Describe the recurring product or domain problem.

## Use When

- Use when domain rules shape the UI beyond generic components.
- Use when data, localisation, fallback states, or business rules must be consistent.

## Do Not Use When

- Do not use for purely visual arrangement.
- Do not use when a base or composition pattern is sufficient.

## Standard Basis

Identify relevant native, accessibility, data, travel, commerce, legal, or policy standards. Do not invent compliance claims.

## Anatomy

- Required data fields.
- Base and composition pattern dependencies.
- Primary actions.
- Status, price, date, passenger, or travel-specific elements.
- Fallback, loading, and unavailable states.

## Ownership Contract

| Concern | Owner | Notes |
|---|---|---|
| Domain data | `<owner>` | Define source of truth for product data. |
| Business rules | `<owner>` | Define where constraints and decisions are owned. |
| Fallback states | `<owner>` | Define empty, loading, unavailable, stale, and error ownership. |
| Localisation | `<owner>` | Define formatting, language, market, and fallback ownership. |
| Analytics / events | `<owner or Out of scope>` | Include only when relevant and sourced. |

## Structure Contract

| Item | Classification | Contract |
|---|---|---|
| Domain data fields | Required | Define required and optional data. |
| Pattern dependencies | Required | Map base and composition patterns used by each part. |
| Fallback states | Required | Define structural treatment for loading, empty, unavailable, and error states. |
| Localised content | Required when relevant | Define what is formatted or translated. |

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

- Document any allowed UIF-specific data attributes, domain state hooks, analytics hooks, or test hooks.
- Data attributes are secondary metadata or state hooks.
- Data attributes must not replace public classes, tokens, native semantics, ARIA, localisation, or business-rule ownership.

### Native / ARIA Precedence

- Native attributes win where available.
- ARIA is used for accessibility semantics and relationships.
- Data attributes may mirror component state but must not be the only semantic source.

### Agent Freedom Boundary

- CSS naming, token scoping, native semantics, and accessibility semantics are not agent freedom.
- New naming or data-attribute ideas must be marked as proposed or recorded in `Open Questions`.

## Required Semantics

Define landmarks, headings, field groups, labels, status regions, price/date semantics, and relationships needed for the domain task.

## Behaviour

Describe business rules, validation, state transitions, dependency changes, localisation, formatting, fallback states, and analytics/events if relevant.

## Keyboard Interaction

Describe keyboard behavior inherited from dependent patterns and any domain-specific flow order.

## Accessibility Rules

- Preserve dependent pattern accessibility contracts.
- Keep dynamic updates perceivable.
- Keep error and constraint messaging associated with controls.
- Ensure localisation does not remove meaning.
- Do not rely on visual layout alone for price, date, or status meaning.

## Token Requirements

List semantic slots for surfaces, emphasis, status, price, unavailable states, spacing, typography, and responsive density as applicable.

## Token Slot Matrix

| Part | Property | State / Variant | Required semantic token slot | Notes |
|---|---|---|---|---|
| Domain element | `<property>` | Default | `<semantic slot>` | Include status, price, unavailable, and emphasis slots as applicable. |

## States

List domain states such as empty, loading, partial, selected, unavailable, sold out, invalid, stale, changed, confirmed, and error.

## State Semantics

| State | Required semantics | User interaction | Notes |
|---|---|---|---|
| Default | Dependent pattern semantics preserved | Normal interaction | Replace with product-specific states. |

## Variants

List variants by product context, market, brand, density, user segment, or flow step.

## Responsive / Density Behaviour

Describe layout, truncation, wrapping, progressive disclosure, mobile flow, and dense operational contexts.

## Component Dependencies

List base patterns, composition patterns, and product components.

## Minimum Component API

| API | Classification | Default | Contract |
|---|---|---|---|
| `<prop>` | Required | `<default>` | Define data props, callbacks, localisation inputs, events, and out-of-scope API. |

## Agent Freedom

| Decision Area | Freedom Level | Allowed Choices | Requires Human Review |
|---|---|---|---|
| Domain data ownership | none | Use the owner declared in Ownership Contract. | Yes, for any change. |
| Business rules | limited | Implement only sourced rules and declared defaults. | Yes, for new or changed rules. |
| Localisation and formatting | limited | Use declared locale inputs and formatting contracts. | Yes, when source is missing. |
| Analytics / events | guided | Emit only declared events or documented product events. | Yes, for new tracking semantics. |
| Visual implementation | guided | Any framework/runtime approach using declared token slots and dependent pattern contracts. | No, unless token slots are missing. |

## Implementation Contract

- Keep the pattern tool-independent.
- Preserve domain data requirements and accessibility relationships.
- Reuse base and composition patterns where possible.
- Do not hardcode market-specific rules unless the source requires them.
- Keep analytics or event requirements separate from visual styling.

## Test Requirements

- Domain rule tests.
- Localisation and formatting tests.
- Accessibility tests across dynamic states.
- Fallback and unavailable-state tests.
- Dependency and cross-component flow tests.

## Negative Test Requirements

- Missing required domain data handling fails.
- Business rule encoded only in visual copy fails.
- Localised value without accessible equivalent fails.
- Unavailable state without explanation fails.
- Dependent pattern contract violation fails.

## Documentation Requirements

Human-facing docs must explain domain use, examples, data requirements, variants, edge cases, and accessibility guidance without exposing internal implementation details unnecessarily.

## Anti-Patterns

- Encoding business rules only in copy or visuals.
- Hiding unavailable states without explanation.
- Making price, date, or passenger data ambiguous.
- Bypassing dependent base or composition patterns.
- Creating tool-specific instructions in the vault.

## Agent Output

Agents can generate domain acceptance criteria, scenario tests, documentation deltas, review checklists, and open-question inventories. Agents must not add runtime code to this vault.

## Open Questions

- Add unresolved business rules, data requirements, localisation rules, event requirements, or dependency gaps here.
