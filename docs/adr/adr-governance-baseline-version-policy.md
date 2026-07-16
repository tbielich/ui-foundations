---
title: ADR – Governance Baseline Version Policy
status: accepted
type: adr
issue: 206
related_epic: 205
governance_pack: 0.7.0
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

**The authoritative consumed governance baseline for the Runtime is 0.7.0.**

Rationale:

1. The source registry (`source.yml`) is the Runtime's authoritative record of
   what has been consumed. It records `0.7.0` at SHA `10f78061`.
2. The pack manifest files (`0.6.0`) represent the Vault's published tag, not
   the Runtime's consumption record.
3. The `0.8.0` forward references in the naming contract and ADR are
   aspirational references to a planned Vault release. They are accurate in
   intent but incorrect as consumed-version labels.

## Version Lifecycle Policy

This policy applies to all future governance pack consumption:

1. **Source registry is authoritative.** `.uif/registry/source.yml` is the
   single source of truth for the consumed version. All other files must
   reference the same version.

2. **No forward references.** Governance files must only reference versions that
   have been consumed and recorded in the source registry. Planned future
   versions must be noted as `pending` or `proposed`, not referenced as if
   consumed.

3. **Pack file version must match registry version.** When a pack is consumed,
   the pack manifest version and the registry `lastKnownVersion` must be
   identical.

4. **Version updates require a governance review.** Updating the consumed
   version in `source.yml` constitutes a governance consumption event and
   requires the same review as the initial consumption.

5. **Forward references must be resolved before the next WS cycle.** If a
   forward reference is identified, it must be corrected to either the current
   consumed version or marked explicitly as `proposed: <version>` in the
   relevant file.

## Resolution for Existing Files

| File | Action Required |
|------|----------------|
| `.uif/registry/source.yml` | Remains at `0.7.0` — this is authoritative |
| Pack manifest and registry files | Update to `0.7.0` in WS2-I2 |
| `naming-contract.json` | Update `governance_pack_version` to `0.7.0` |
| `adr-uif-public-api-namespace.md` | Update `governance_pack` frontmatter to `0.7.0` and add note about 0.8.0 intent |

## Consequences

- All Runtime-owned governance references will use `0.7.0` as the consumed
  baseline.
- Future pack consumption will follow the lifecycle policy above.
- When the Vault publishes `0.8.0` (incorporating the UIF namespace decision),
  the Runtime must perform a new reviewed consumption and update `source.yml`.
