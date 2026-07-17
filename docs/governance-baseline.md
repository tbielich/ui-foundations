---
title: Governance Baseline Reference Matrix
status: active
type: governance
owner: ui-foundations-runtime
issue: 208
related_epic: 205
---

# Governance Baseline Reference Matrix

This Runtime reference matrix captures governance baseline interpretation without
changing consumed Vault artifacts.

| Concept | Authoritative Source | Current Value / State | Authority | Runtime Interpretation |
|---|---|---|---|---|
| Published governance pack version | `.uif/packs/governance/registry/governance-packs.yml`, `.uif/packs/governance/exports/governance-pack/pack.yml` | `0.6.0` (draft channel) | Vault published pack artifacts (consumed copy) | Treat as published baseline currently present in consumed pack files |
| Runtime-consumed governance snapshot/version | `.uif/registry/source.yml` (`consumedPacks[id=governance]`) | `lastKnownVersion: 0.7.0`, `versionRef.type: sha`, `value: 10f78061cd65e6ad6d7304376ead27d44efc01b3`, `versionStatus: snapshot` | Runtime source registry | Treat as current Runtime adoption baseline |
| Planned/forward governance reference | `.uif/packs/governance/contracts/naming-contract.json` (`governance_pack_version: 0.8.0`), `docs/adr/adr-uif-public-api-namespace.md` | `0.8.0` (forward reference) | Decision context / forward planning reference | Treat as planned target only; not published baseline and not consumed Runtime baseline |
| Consumption lifecycle/channel | `.uif/registry/source.yml` | `mode: reviewed-manual`, `automaticSync: false`, `versionStatus: snapshot` | Runtime source registry | Reviewed manual adoption only; no automatic sync |
| Vault canonical authority | `vault.repository`, `vault.ref.strategy`, `vault.sourceOfTruthFor` in `.uif/registry/source.yml` | Vault is source of truth for reusable governance | Vault definition recorded by Runtime | Runtime documents local adoption status; it does not redefine Vault publication state |

## Usage Rules for Runtime-owned Documentation

1. Use **published** when referencing version state declared in consumed Vault
   pack artifacts (`0.6.0` currently).
2. Use **consumed** when referencing Runtime registry adoption (`0.7.0`
   snapshot currently).
3. Use **planned** or **forward reference** when referencing `0.8.0`.
4. Do not modify consumed Vault artifacts under `.uif/packs/governance/` only to
   align numbers.

## Related

- `docs/adr/adr-governance-baseline-version-policy.md`
- `docs/uif-governance.md`
- `.uif/registry/source.yml`
