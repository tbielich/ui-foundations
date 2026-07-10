---
id: specification.pattern.schema
title: Pattern Authoring Schema
type: specification
status: draft
owners:
  - ui-foundations
created: 2026-07-08
updated: 2026-07-09
authority: source
summary: Defines the markdown authoring schema for agent-readable pattern specifications.
related:
  governed_by:
    - governance.precedence
    - governance.lifecycle
  references:
    - specification.vault-metadata
    - specification.ui-foundations.pattern-model
---

# Pattern Authoring Schema

This is a markdown authoring schema, not a JSON schema. It defines the expected sections for agent-readable UI pattern specifications and how agents interpret them.

Agents can derive implementation guidance only from content that is explicitly present, safely implied by native platform behavior, or required by cited standards. Uncertainty must be represented in `Open Questions`.

## Required / Optional / Out of Scope Rule

Any behavior described with permission language, recommendation language, conditional language, or source-dependent uncertainty must be explicitly classified as one of:

- Required
- Optional
- Out of scope
- Open question

Agents must not implement open questions as if they were requirements.

## Implementation Naming Contract

Pattern specs that can derive implementation output must include an `Implementation Naming Contract`. This is the canonical section for pattern-level CSS class naming, token scoping, data attributes, native and ARIA precedence, and naming freedom boundaries.

### CSS Class Contract

Define the public component class scope. Public component classes must use the `uif-` prefix. UIF uses class name chains, not BEM. Variants are chained classes. Authored states use `is-*` chained classes. Native states use pseudo-classes where possible. Do not use BEM modifier syntax, BEM element syntax, or unscoped public component classes.

### Token Contract

Define the CSS custom property scope. UIF-owned public CSS custom properties must use the `--uif-` prefix. Component token slots must use `--uif-[component]-*`. Experimental unresolved tokens must use `--uif-proof-*` or `--uif-assumption-*`. Do not use unscoped public tokens such as `--button-*`.

### Data Attribute Contract

Define any UIF-specific data attributes the pattern allows. Data attributes are secondary metadata or state hooks. They must not replace public component classes, tokens, native semantics, or ARIA. Pattern specs must document any UIF-specific data attributes they allow.

### Native / ARIA Precedence

Define semantic precedence. Native attributes win where available. ARIA is used for accessibility semantics. Data attributes may mirror component state but must not be the only semantic source.

### Agent Freedom Boundary

Define naming decisions that are not agent freedom. CSS naming, token scoping, native semantics, and accessibility semantics are not agent freedom. Agents may only introduce naming or data-attribute proposals when explicitly marked as proposed or recorded as an open question.

## Required Sections

### `# Pattern Name`

Use the human-readable pattern name. Agents can derive display names and references from this heading. Do not encode status, ownership, or implementation names here.

### `## Metadata`

List pattern-level metadata:

```md
- id:
- type:
- status:
- source:
- related standards:
- related components:
- related tokens:
```

Agents can derive traceability links and map entries from this section. Do not invent source documents, components, or token areas. Use `None identified` or add an `Open Questions` item when a relationship is unknown.

### `## Intent`

Describe the durable user and system purpose of the pattern. Agents can use this to decide whether a pattern fits a task. Do not include implementation details unless they are part of the intent.

### `## Problem`

State the recurring interface problem the pattern solves. Agents can use this to compare alternatives. Do not describe one product scenario as if it were universal.

### `## Use When`

List conditions where the pattern is appropriate. Agents can use these as selection criteria. Do not add cases that are unsupported by source docs or standards.

### `## Do Not Use When`

List conditions where the pattern is inappropriate. Agents can use these as rejection criteria. Do not use this section for stylistic preferences unless they protect semantics, accessibility, or documented usage.

### `## Standard Basis`

Identify native HTML, WAI-ARIA, WCAG, or other standards that constrain the pattern. Agents can derive minimum semantic and accessibility requirements from cited standards. Do not overstate standards; if the standard relationship is unclear, record it in `Open Questions`.

### `## Anatomy`

Describe required and optional parts. Agents can derive component slots, DOM responsibilities, and documentation diagrams from this section. Do not prescribe private implementation structure unless the pattern requires it.

### `## Structure Contract`

Describe the required structural parts an agent can derive.

For base patterns, include required native element, required child parts, optional child parts, required attributes, optional attributes, DOM order constraints, and forbidden structures.

For composition patterns, include required dependent base patterns, required parts, DOM ownership boundaries, popup or layer ownership when relevant, focus entry and return points, and the value ownership boundary.

Agents can derive HTML structure, DOM acceptance criteria, and structural anti-pattern checks from this section. Do not use this section to invent private framework implementation details.

### `## Implementation Naming Contract`

Required for any pattern spec that can derive implementation output. Use these subsections in this order:

- `### CSS Class Contract`
- `### Token Contract`
- `### Data Attribute Contract`
- `### Native / ARIA Precedence`
- `### Agent Freedom Boundary`

Agents can derive naming, token, and data-attribute acceptance criteria only from this section, from native platform behavior, or from approved dependent pattern contracts. Do not introduce CSS naming, token naming, native semantics, accessibility semantics, or UIF-specific data attributes as agent freedom.

### `## Ownership Contract`

Required for composition patterns. Define which pattern, component, or dependent part owns state, focus, validation, popup/layer behavior, value synchronization, and other cross-part concerns.

Use a table when possible:

```md
| Concern | Owner | Notes |
|---|---|---|
```

Agents can derive dependency boundaries and integration responsibilities from this section. Do not leave a cross-part concern implicitly owned.

### `## Required Semantics`

Define native elements, roles, names, states, and relationships. Agents can derive accessibility checks from this section. Do not replace native semantics with ARIA unless native HTML cannot express the pattern.

### `## Behaviour`

Describe pointer, form, validation, focus, and state behavior. Agents can derive behavioral tests from this section. Do not invent complex interaction flows beyond source-backed or standard behavior.

### `## Keyboard Interaction`

List expected keyboard operations. Agents can derive keyboard tests from this section. Do not add application-specific shortcuts without source evidence.

### `## Accessibility Rules`

List accessibility requirements including names, focus visibility, contrast, status messaging, and relationships. Agents can derive automated and manual accessibility checks from this section. Do not weaken WCAG or WAI-ARIA requirements for visual variants.

### `## Token Requirements`

Describe semantic token slots required by the pattern. Agents can derive token audit requirements from this section. Do not name implementation tokens unless they exist or are explicitly proposed as slots.

### `## Token Slot Matrix`

Replace broad token areas with actionable semantic token slots.

Use this table format:

```md
| Part | Property | State / Variant | Required semantic token slot | Notes |
|---|---|---|---|---|
```

Do not invent final token names if the system does not already define them. Use stable semantic slot names where exact token names are not yet available. Mark unresolved names in `Open Questions`.

### `## States`

List supported states and required state communication. Agents can derive visual and semantic state tests from this section. Do not add states that the source docs do not support unless they are native states.

### `## State Semantics`

Map each visual or component state to required semantics.

Use this table:

```md
| State | Required semantics | User interaction | Notes |
|---|---|---|---|
```

Agents can derive state APIs, accessibility checks, and negative tests from this section.

### `## Variants`

List variants and the boundaries between them. Agents can derive variant API requirements from this section. Do not let variants change the required semantics.

### `## Responsive / Density Behaviour`

Describe behavior across viewport, container, pointer, and density contexts. Agents can derive responsive checks from this section. Do not invent breakpoints unless they are documented.

### `## Component Dependencies`

List base patterns, components, or primitives needed to implement the pattern. Agents can derive dependency maps from this section. Do not reference files or components that do not exist.

### `## Minimum Component API`

Define the minimum implementation-facing API an agent can derive.

Include props or attributes, events or callbacks, required defaults, optional values, controlled versus uncontrolled behavior where relevant, and explicitly out-of-scope API items.

Agents can derive component spec scaffolds from this section. Do not add APIs unsupported by source docs, platform behavior, or explicitly documented pattern decisions.

### `## Agent Freedom`

Define which implementation decisions are fixed, constrained, guided, or open.

Use this table:

```md
| Decision Area | Freedom Level | Allowed Choices | Requires Human Review |
|---|---|---|---|
```

Freedom levels:

- `none`: agents must follow the specified contract exactly.
- `limited`: agents can choose only from listed options.
- `guided`: agents can choose an approach that satisfies the stated guardrails.
- `open`: agents can choose freely within native semantics, accessibility requirements, token governance, ownership boundaries, and documented open questions.

Agents can make implementation choices inside the declared freedom level, but must not violate native semantics, accessibility requirements, token governance, or ownership boundaries.

### `## Implementation Contract`

State what every implementation must preserve. Agents can derive acceptance criteria from this section. Do not include framework-specific details unless the contract requires them.

### `## Test Requirements`

List expected unit, integration, accessibility, visual, keyboard, and documentation tests. Agents can derive test plans from this section. Do not claim coverage exists unless verified.

### `## Negative Test Requirements`

Define anti-pattern tests expected to fail. Examples include icon-only buttons without accessible names, inputs with placeholder-only labels, invalid inputs without linked visible error text, date grids with multiple active tabindex targets, or popup triggers without accessible popup relationships.

Agents can derive failure cases and review checks from this section. Do not include negative tests that depend on unresolved open questions.

### `## Documentation Requirements`

Describe what human-facing docs must explain. Agents can derive documentation updates from this section. Do not copy full docs into the vault.

### `## Anti-Patterns`

List mistakes that violate the pattern. Agents can derive review checks from this section. Do not include personal preference unless tied to standards or documented UI Foundations guidance.

### `## Agent Output`

Define what agents can produce from the spec, such as component acceptance criteria, test plans, documentation deltas, or review notes. Agents must not produce runtime implementation in this vault.

### `## Open Questions`

Record missing, ambiguous, or conflicting guidance. Agents must use this section instead of inventing rules. Use short, actionable questions with enough context for maintainers to resolve them.
