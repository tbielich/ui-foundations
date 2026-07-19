---
title: ADR – Governance Baseline Version Policy
status: accepted
type: adr
issue: 206
related_epic: 205
governance_pack_published: 0.6.0
governance_pack_consumed_snapshot: 0.7.0
governance_pack_planned: 0.8.0
---

# ADR: Governance Baseline Version Policy

## Context

The Runtime repository consumes governance artifacts from the UI Foundations
Vault. After the initial consumption, four different version numbers appeared
across Runtime-owned files:

| File | Version Referenced |
|------|--------------------|
| `.uif/registry/source.yml` | `0.7.0` (snapshot) |
| `.uif/packs/governance/registry/governance-packs.yml` | `0.6.0` (draft) |
| `.uif/packs/governance/exports/governance-pack/pack.yml` | `0.6.0` |
| `.uif/packs/governance/contracts/naming-contract.json` | `0.8.0` |
| `docs/adr/adr-uif-public-api-namespace.md` | `0.8.0` |

This creates ambiguity about which version the Runtime has actually consumed and
which version its governance decisions are based upon.

## Analysis

### The 0.6.0 references

The pack manifest and registry files record the published Vault pack version at
the time of consumption. These are correct for the state of the Vault pack at
snapshot time (`10f78061cd65e6ad6d7304376ead27d44efc01b3`).

### The 0.7.0 reference

The source registry (`source.yml`) records `lastKnownVersion: 0.7.0`. This
represents the Runtime's knowledge of the Vault pack version at the time of
manual consumption. The discrepancy between `0.6.0` (pack files) and `0.7.0`
(registry) indicates that the pack files were consumed from a SHA snapshot that
was slightly ahead of the 0.6.0 tag but the registry was updated to reflect the
anticipated 0.7.0 release milestone.

### The 0.8.0 references

The naming contract (`naming-contract.json`) and the public API namespace ADR
(`adr-uif-public-api-namespace.md`) reference governance pack `0.8.0`. These
are **forward references** — they were authored with the expectation that the
UIF public API namespace decision would be captured in a forthcoming 0.8.0 pack
release. The 0.8.0 pack does not yet exist in the Vault.

## Decision

The Runtime uses a three-value interpretation model:

1. **Published governance pack version:** `0.6.0`
   Authority: Vault pack manifest and governance registry under
   `.uif/packs/governance/`.
2. **Runtime-consumed snapshot/version:** `0.7.0`
   Authority: Runtime source registry `.uif/registry/source.yml` at SHA
   `10f78061cd65e6ad6d7304376ead27d44efc01b3`.
3. **Planned/forward-referenced version:** `0.8.0`
   Authority: forward reference in governance decision context; not yet the
   published pack baseline and not the currently consumed Runtime baseline.

This model preserves Vault authority while accurately representing Runtime
adoption status.

## Version Lifecycle Policy

This policy applies to future governance pack consumption:

1. **Published version authority stays with Vault artifacts.** Runtime must not
   rewrite consumed Vault artifacts in `.uif/packs/governance/` just to align
   values.

2. **Consumed version authority stays with Runtime registry.**
   `.uif/registry/source.yml` is authoritative for what Runtime has adopted.

3. **Planned versions must be labeled explicitly as planned/forward references.**
   They must not be presented as published or consumed until a reviewed
   consumption event updates the Runtime registry.

4. **Version updates require governance review.** Updating the consumed version
   in `source.yml` is a governance consumption event and requires review.

## Resolution for Existing Files

| File | Action Required |
|------|----------------|
| `.uif/registry/source.yml` | Keep `0.7.0` as consumed Runtime snapshot/version |
| `.uif/packs/governance/registry/governance-packs.yml` and `exports/governance-pack/pack.yml` | Keep `0.6.0` as published Vault pack version |
| `.uif/packs/governance/contracts/naming-contract.json` | Keep `0.8.0` as planned/forward reference in consumed artifact context |
| Runtime docs (`docs/uif-governance.md`, `docs/governance-baseline.md`, relevant ADR frontmatter/notes) | Explicitly distinguish published vs consumed vs planned values |

## Consequences

- Runtime documentation becomes explicit about authority boundaries.
- Vault artifacts remain unchanged as consumed source evidence.
- Future adoption of `0.8.0` requires a reviewed consumption update rather than
  silent normalization in Runtime files.
