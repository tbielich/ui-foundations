---
title: ADR – UIF Public API Namespace
status: proposed
type: adr
issue: 154
vault_decision: adr.uif-public-api-namespace
governance_pack: 0.8.0-review
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
and `HTMLElementTagNameMap` keys. It does not yet decide JavaScript constructor
or export names, module filenames, or package subpaths.

## Implementation Boundary

This ADR authorizes the namespace direction, not the runtime migration.
Implementation remains blocked until a reviewed plan explicitly decides:

1. whether v1 removes `<ui-*>` registrations outright or provides any
   compatibility period;
2. migration sequencing across source, tests, examples, documentation, types,
   and generated package output;
3. treatment of element module subpaths and exported `UI*` JavaScript names.

No alias, wrapper constructor, dual registration, deprecation period, or package
redirect is implied by this decision.

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
- Existing `ui.*` examples and `<ui-*>` registrations are migration inventory.
- Compatibility behavior remains an explicit open decision.
- Runtime package paths and JavaScript identifiers remain unchanged until
  separately approved.
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
- No runtime registration, macro implementation, package export, example, or
  documentation call site is renamed in this governance change.

## Related

- [Issue #154](https://github.com/tbielich/ui-foundations/issues/154)
- Vault decision `decisions/uif-public-api-namespace.md`
- `.uif/packs/governance/contracts/naming-contract.json`

