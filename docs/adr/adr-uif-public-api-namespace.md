---
title: ADR – UIF Public API Namespace
status: accepted
type: adr
issue: 154
vault_decision: adr.uif-public-api-namespace
implementation_issue: 197
governance_pack: 0.8.0
---

# ADR: UIF Public API Namespace

## Context

UI Foundations already uses `uif-` for public CSS classes and `--uif-` for
UIF-owned public CSS custom properties. Public Nunjucks examples currently use
the consumer-selected alias `ui`, while autonomous Custom Elements are
registered with `ui-*` tag names.

Version 1.0 is intentionally breaking. Issue
[#154](https://github.com/tbielich/ui-foundations/issues/154) assessed the
affected source, exports, tests, examples, documentation, and package entry
points before approving the canonical namespace for these two surfaces.

## Decision

Adopt the canonical UIF namespace defined by Vault decision
`adr.uif-public-api-namespace` and Governance Pack `0.8.0`:

- Public Nunjucks documentation and generated snippets import the existing
  macro module with the consumer-selected alias `uif` and invoke macros as
  `uif.*`.
- Public autonomous Custom Element tag names use `<uif-[component]>`.

The Nunjucks decision changes the recommended import alias only. It does not
rename `macros/ui.njk` or its named macro exports.

The Custom Element decision governs registration strings, authored tag names,
and `HTMLElementTagNameMap` keys. JavaScript constructor and export names,
module filenames, and package subpaths remain unchanged.

## Implementation Boundary

Issue [#197](https://github.com/tbielich/ui-foundations/issues/197) is the
approved v1 runtime migration boundary. It replaces `<ui-*>` registrations
directly with `<uif-*>`; no compatibility alias, dual registration, wrapper
constructor, deprecation period, or package redirect is provided. Element
module filenames, `ui-foundations/elements/ui-*` subpaths, `UI*` JavaScript
identifiers, and `macros/ui.njk` remain stable.

## Rationale

The visible public namespace becomes consistent across CSS, templates, and
HTML, while surfaces with different compatibility costs remain explicit rather
than being renamed by inference.

Because a Nunjucks import alias is selected by the consumer, `uif.*` can be
adopted without changing the macro implementation. Custom Element tag names are
registered public APIs and therefore require a separately approved breaking
migration.

## Consequences

- New and migrated macro examples will use `uif.*`.
- New and migrated Custom Element examples will use `<uif-*>`.
- Existing `ui.*` examples and `<ui-*>` registrations are removed from owned
  public output in v1.
- Consumers must migrate authored tags; legacy tag aliases are not provided.
- Runtime package paths, module filenames, and JavaScript identifiers remain
  unchanged.
- The consumed naming contract is updated through a reviewed runtime change;
  no automatic cross-repository synchronization is introduced.

## Alternatives Considered

| Alternative | Outcome |
|---|---|
| Keep `ui.*` and `<ui-*>` | Rejected because it preserves a second public UIF namespace without an approved exception. |
| Rename every adjacent `ui` identifier now | Rejected because package and JavaScript identifiers were not approved by this decision. |
| Define compatibility aliases here | Rejected because compatibility requires a separate implementation decision. |

## Verification

- The consumed naming contract requires the `uif` Nunjucks alias and `uif-`
  Custom Element tag prefix.
- Generated runtime contract data remains synchronized with the consumed JSON.
- Runtime registrations, public examples, generated snippets, types, and
  documentation use the canonical namespace.
- Regression tests reject legacy registrations and preserve the explicitly
  stable package and JavaScript surfaces.

## Related

- [Issue #154](https://github.com/tbielich/ui-foundations/issues/154)
- [Issue #197](https://github.com/tbielich/ui-foundations/issues/197)
- `docs/migrations/public-api-namespace-v1.md`
- Vault decision `decisions/uif-public-api-namespace.md`
- `.uif/packs/governance/contracts/naming-contract.json`
