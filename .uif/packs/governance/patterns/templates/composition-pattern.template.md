---
id: template.pattern.composition
title: Composition Pattern Template
type: template
status: draft
owners:
  - ui-foundations
created: 2026-07-08
updated: 2026-07-09
authority: source
summary: Template for composed UI pattern specifications.
related:
  references:
    - specification.pattern.schema
---

# Composition Pattern Name

## Metadata

- id: `pattern.composition.<slug>`
- type: composition
- status: draft
- source: `<existing docs or standards>`
- related standards: `<native HTML, WAI-ARIA, WCAG>`
- related components: `<component names or None identified>`
- related tokens: `<semantic token areas or None identified>`

## Intent

Describe the composed user task and the quality the composition protects.

## Problem

Describe the recurring multi-part interface problem.

## Use When

- Use when the task requires coordination between multiple base patterns.
- Use when state, focus, validation, or relationships span multiple parts.

## Do Not Use When

- Do not use for a single native primitive.
- Do not use when a simpler native control satisfies the task and accessibility needs.

## Standard Basis

Identify standards for each dependent base pattern and any WAI-ARIA pattern used by the composition.

## Anatomy

- Container or field group.
- Dependent base patterns.
- Trigger or controls.
- Content region, popup, grid, list, or panel.
- Helper, validation, and status messaging.

## Ownership Contract

| Concern | Owner | Notes |
|---|---|---|
| State | `<owner>` | Define state ownership and synchronization. |
| Focus | `<owner>` | Define focus entry, movement, and return. |
| Validation | `<owner>` | Define whether composition, base part, or product owns validation. |
| Popup / layer | `<owner>` | Required when the composition opens layered content. |

## Structure Contract

| Item | Classification | Contract |
|---|---|---|
| Dependent base patterns | Required | List every required base pattern. |
| Required parts | Required | Define required container, controls, panels, grids, or messages. |
| DOM ownership boundaries | Required | Define which part owns each DOM subtree. |
| Popup / layer ownership | Required when relevant | Define role, label, trigger relationship, focus entry, and close return. |
| Value ownership boundary | Required | Define where canonical value lives and how dependent parts synchronize. |

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

- Document any allowed UIF-specific data attributes and inherited dependent-pattern attributes.
- Data attributes are secondary metadata or state hooks.
- Data attributes must not replace public classes, tokens, native semantics, ARIA, focus management, or ownership contracts.

### Native / ARIA Precedence

- Native attributes win where available.
- ARIA is used for accessibility semantics and relationships.
- Data attributes may mirror component state but must not be the only semantic source.

### Agent Freedom Boundary

- CSS naming, token scoping, native semantics, and accessibility semantics are not agent freedom.
- New naming or data-attribute ideas must be marked as proposed or recorded in `Open Questions`.

## Required Semantics

Describe labels, groups, relationships, ownership, `aria-controls`, `aria-expanded`, described-by references, roving focus, live regions, or grid/list semantics as applicable.

## Behaviour

Describe open/close behavior, focus management, interaction flow, validation timing, state synchronization, and dismissal behavior.

## Keyboard Interaction

List keyboard behavior for each composed part and the transitions between parts.

## Accessibility Rules

- Each base pattern keeps its own accessibility contract.
- Relationships between parts must be programmatic.
- Focus movement must be predictable.
- Validation and errors must be announced or associated.
- Touch targets and focus targets must remain usable.

## Token Requirements

List token slots inherited from base patterns plus composition-specific spacing, surface, elevation, overlay, and state slots.

## Token Slot Matrix

| Part | Property | State / Variant | Required semantic token slot | Notes |
|---|---|---|---|---|
| Container | `<property>` | Default | `<semantic slot>` | Include inherited and composition-specific slots. |

## States

List cross-part states such as closed, open, selecting, selected, invalid, disabled, loading, empty, and range states as applicable.

## State Semantics

| State | Required semantics | User interaction | Notes |
|---|---|---|---|
| Default | Dependent base semantics preserved | Normal interaction | Replace with composition-specific states. |

## Variants

List variants such as single/range, inline/popover, compact/comfortable, or single/multi-select. State how each variant preserves semantics.

## Responsive / Density Behaviour

Describe layout changes, popup placement, touch target expectations, overflow behavior, and density constraints.

## Component Dependencies

List all dependent base patterns and components.

## Minimum Component API

| API | Classification | Default | Contract |
|---|---|---|---|
| `<prop>` | Required | `<default>` | Define props, attributes, callbacks, controlled behavior, and out-of-scope API. |

## Agent Freedom

| Decision Area | Freedom Level | Allowed Choices | Requires Human Review |
|---|---|---|---|
| Dependent pattern contracts | none | Preserve all dependent base and composition pattern contracts. | Yes, for any exception. |
| State ownership | limited | Use the owners declared in Ownership Contract. | Yes, if ownership changes. |
| Focus management strategy | guided | Any deterministic strategy that preserves entry, movement, and return contracts. | Yes, if focus behavior changes user flow. |
| Popup / layer implementation | limited | Use only strategies declared as required or optional in Structure Contract. | Yes, when unresolved or new strategy is needed. |
| Visual implementation | guided | Any framework/runtime approach using declared token slots and preserving semantics. | No, unless token slots are missing. |

## Implementation Contract

- Preserve dependent base pattern contracts.
- Keep state ownership explicit.
- Keep focus management deterministic.
- Preserve validation and accessibility relationships.
- Use semantic token slots across composed parts.

## Test Requirements

- Tests for each base pattern in context.
- Focus management tests.
- Keyboard flow tests.
- Open/close and dismissal tests.
- Validation and error relationship tests.
- Responsive and density checks.

## Negative Test Requirements

- Broken dependent base pattern contract fails.
- Popup content without trigger relationship fails.
- Focus movement without defined return point fails.
- Visual state without programmatic state fails.
- Validation error not associated with its control fails.

## Documentation Requirements

Human-facing docs must explain when to use the composition, each part's role, interaction flow, states, accessibility, and examples.

## Anti-Patterns

- Managing visual state without programmatic state.
- Moving focus unexpectedly.
- Hiding errors from assistive technology.
- Creating popup content with no trigger relationship.
- Breaking a base pattern contract inside the composition.

## Agent Output

Agents can generate composition acceptance criteria, cross-part test plans, documentation deltas, and review checklists. Agents must not add runtime code to this vault.

## Open Questions

- Add unresolved dependencies, focus behavior, token slots, validation rules, or documentation gaps here.
