---
id: adr.uif-public-api-namespace
title: UIF Public API Namespace
type: adr
status: review
owners:
  - ui-foundations
created: 2026-07-15
updated: 2026-07-15
authority: source
summary: Defines the canonical UIF namespace for public macro invocations and Custom Element tag names.
applies_to:
  - ui-foundations
related:
  governs:
    - export-pack.governance.naming-rules
    - export-pack.governance.naming-contract
  references:
    - governance.precedence
    - governance.lifecycle
---

# ADR: UIF Public API Namespace

## Context

UI Foundations already reserves `uif-` for public CSS classes and `--uif-`
for UIF-owned public CSS custom properties. Its Nunjucks examples currently use
the consumer-selected alias `ui`, and its autonomous Custom Elements are
registered with `ui-*` tag names.

Version 1.0 is intentionally breaking. The public namespace therefore needs to
be decided before macro examples or Custom Element registrations are migrated.

## Decision

All UIF-owned public APIs use the canonical `uif` namespace unless an accepted
or stable decision defines a separate namespace contract for a specific API.

For the surfaces approved by this decision:

- Public Nunjucks examples and generated snippets import the macro module with
  the consumer-selected alias `uif` and invoke macros as `uif.*`.
- Public autonomous Custom Element tag names use the `uif-` prefix and the form
  `<uif-[component]>`.

The Nunjucks alias rule governs invocation examples, not the macro module's
package path or its named macro exports. The Custom Element rule governs tag
names, including registration strings and `HTMLElementTagNameMap` keys.

This decision does not define compatibility aliases, dual registration,
deprecation periods, or migration sequencing. It also does not decide whether
JavaScript constructor names, JavaScript exports, element module filenames, or
package subpaths must be renamed. Those surfaces require explicit follow-up
decisions before implementation changes them.

## Rationale

A single visible namespace makes UIF ownership recognizable across CSS,
templates, and HTML. `uif` is already the canonical CSS namespace and avoids
introducing a second public abbreviation for the same owner.

Nunjucks import aliases are selected by consumers, so adopting `uif.*` does not
require a new macro implementation. Custom Element tag names are registered
public APIs, so their migration is a breaking runtime change and must follow a
separately reviewed implementation plan.

## Consequences

- New public macro documentation uses `uif.*`.
- New UIF Custom Element APIs use `<uif-*>`.
- Existing `ui.*` documentation and `<ui-*>` registrations become migration
  inventory for the v1 implementation work.
- No compatibility behavior can be inferred from this ADR.
- Package paths and JavaScript identifiers remain unchanged until separately
  decided.
- Consuming repositories adopt the corresponding governance-pack version only
  through reviewed local changes.

## Alternatives Considered

- Keep `ui.*` and `<ui-*>`: rejected because it preserves a second public UIF
  namespace without a separately approved contract.
- Change only Custom Elements: rejected because public examples would continue
  to teach inconsistent ownership prefixes.
- Rename every adjacent `ui` identifier immediately: rejected because package
  paths and JavaScript identifiers have distinct compatibility consequences
  that were not approved by this decision.
- Define aliases or dual registration here: rejected because compatibility and
  migration behavior require separate evidence and approval.

## Verification

- The canonical naming contract contains a Nunjucks alias rule with `uif`.
- The canonical naming contract contains a Custom Element tag prefix rule with
  `uif-`.
- Examples in the naming contract are explicitly non-normative.
- Runtime implementation does not begin until compatibility and migration
  policy are approved.

## Related

- Runtime issue: https://github.com/tbielich/ui-foundations/issues/154
- Governance pack: `exports/governance-pack/`
