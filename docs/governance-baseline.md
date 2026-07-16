---
title: Governance Baseline Reference Matrix
status: active
type: governance
owner: ui-foundations-runtime
issue: 208
related_epic: 205
consumed_pack_version: 0.7.0
consumed_pack_sha: 10f78061cd65e6ad6d7304376ead27d44efc01b3
---

# Governance Baseline Reference Matrix

This document records the governance artifacts consumed from the UI Foundations
Vault, their canonical sources, consumed versions, and current review status.

It is the Runtime's authoritative record of governance consumption. Any change
to a consumed version must be reviewed and recorded here before it takes effect
in Runtime documentation or implementation.

## Consumed Pack

| Field | Value |
|-------|-------|
| Pack ID | `governance-pack` |
| Vault source | `ui-foundations-vault` |
| Consumed version | `0.7.0` |
| Vault SHA | `10f78061cd65e6ad6d7304376ead27d44efc01b3` |
| Consumption mode | `reviewed-manual` |
| Channel | `snapshot` |
| Last reviewed | 2026-07-09 |
| Source registry | `.uif/registry/source.yml` |

> **Note:** The pack files under `.uif/packs/governance/` reflect Vault release
> `0.6.0` (the last published tag at time of consumption). The Runtime consumed
> a SHA snapshot between 0.6.0 and the anticipated 0.7.0 release. The source
> registry version (`0.7.0`) is the authoritative consumed baseline per
> [ADR: Governance Baseline Version Policy](adr/adr-governance-baseline-version-policy.md).

---

## Consumed Artifacts

### Naming Rules

| Field | Value |
|-------|-------|
| Artifact ID | `governance-pack.naming-rules` |
| Vault path | `.uif/packs/governance/exports/governance-pack/naming-rules.md` |
| Contract | `.uif/packs/governance/contracts/naming-contract.json` |
| Consumed version | `0.7.0` |
| Status | `draft` |
| Review required | Yes |
| Runtime owner | ui-foundations-runtime |
| Related ADR | [`adr-uif-public-api-namespace.md`](adr/adr-uif-public-api-namespace.md) |
| Notes | Naming contract version aligned to 0.7.0 per WS2-I2. |

### Token Governance

| Field | Value |
|-------|-------|
| Artifact ID | `governance-pack.token-governance` |
| Vault path | `.uif/packs/governance/exports/governance-pack/token-governance.md` |
| Consumed version | `0.7.0` |
| Status | `draft` |
| Review required | Yes |
| Runtime owner | ui-foundations-runtime |
| Notes | Governs Core → Semantic → Component token layer separation and `--uif-*` prefix convention. |

### Component Governance

| Field | Value |
|-------|-------|
| Artifact ID | `governance-pack.component-governance` |
| Vault path | `.uif/packs/governance/exports/governance-pack/component-governance.md` |
| Consumed version | `0.7.0` |
| Status | `draft` |
| Review required | Yes |
| Runtime owner | ui-foundations-runtime |
| Notes | Governs `.uif-*` CSS class convention, pattern lifecycle, and component boundaries. |

### Accessibility Baseline

| Field | Value |
|-------|-------|
| Artifact ID | `governance-pack.accessibility-baseline` |
| Vault path | `.uif/packs/governance/exports/governance-pack/accessibility-baseline.md` |
| Consumed version | `0.7.0` |
| Status | `draft` |
| Review required | Yes |
| Runtime owner | ui-foundations-runtime |
| Notes | Defines native-first accessibility model; ARIA is supplementary not primary. |

### Decisions

| Artifact | Vault Path | Status |
|----------|-----------|--------|
| UIF Public API Namespace | `.uif/packs/governance/decisions/uif-public-api-namespace.md` | Accepted |

### Pattern Governance

| Artifact | Vault Path | Status |
|----------|-----------|--------|
| Pattern Schema | `.uif/packs/governance/patterns/schemas/pattern.schema.md` | Draft |
| Base Pattern Template | `.uif/packs/governance/patterns/templates/base-pattern.template.md` | Draft |
| Composition Pattern Template | `.uif/packs/governance/patterns/templates/composition-pattern.template.md` | Draft |
| Product Pattern Template | `.uif/packs/governance/patterns/templates/product-pattern.template.md` | Draft |
| Button Pattern (pilot) | `.uif/packs/governance/patterns/base/button.pattern.md` | Draft |

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 0.7.0 | 2026-07-09 | Initial consumption baseline (SHA snapshot). Naming rules, token governance, component governance, accessibility baseline, UIF namespace decision. |
| 0.6.0 | 2026-07-09 | Last published Vault release tag. Pack files reflect this version. |

---

## Lifecycle Policy

When a new governance pack version is available from the Vault:

1. A governance review is required before consumption.
2. The reviewed version must be recorded in `.uif/registry/source.yml`.
3. This matrix must be updated in the same commit.
4. Any Runtime documentation that references the pack version must be updated.
5. No automatic synchronisation is permitted.

For the full version lifecycle policy, see
[ADR: Governance Baseline Version Policy](adr/adr-governance-baseline-version-policy.md).

---

## Canonical Source

- Vault remote: `https://github.com/tbielich/ui-foundations-vault.git`
- Source registry: `.uif/registry/source.yml`
- Pack registry (consumed): `.uif/packs/governance/registry/governance-packs.yml`
