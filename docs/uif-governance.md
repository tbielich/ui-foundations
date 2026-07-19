---
title: UIF Governance Consumption
status: active
type: governance
owner: ui-foundations-runtime
---

# UIF Governance Consumption

## Purpose

This repository consumes reusable governance from the UI Foundations Vault while
remaining an independent runtime repository. The Vault is the source of truth for
reusable governance. Local runtime decisions stay local unless reviewed and
promoted.

## Architecture

Governance consumption lives under `.uif/`:

- `.uif/registry/` records source, hierarchy, and sync policy.
- `.uif/packs/` reserves reviewed Vault pack locations.
- `.uif/workspace/` stores local runtime decisions, overrides, lessons, and reflection.

No automatic synchronization is implemented. Imports are reviewed manually and
must be versioned through the registry.

## Governance Hierarchy

The operating hierarchy is:

1. Knowledge
2. Governance
3. Specifications
4. Skills
5. Export Packs
6. Runtime Consumption
7. Implementation
8. Reflection
9. Promotion Candidate
10. Vault

The short architecture contract is stored in
`.uif/registry/governance-hierarchy.md`.

## Pack Concept

Packs are consumed governance bundles. This repository currently reserves these
pack channels:

- `agent`: tool-independent agent operating guidance.
- `governance`: reusable governance rules and review criteria.
- `runtime`: runtime repository boundaries and consumption guidance.

Pack directories are placeholders until a reviewed Vault version is imported.
Vault content must not be copied into a pack without updating
`.uif/registry/source.yml` and reviewing `.uif/registry/sync-policy.yml`.

## Versioning

Pack consumption must be reproducible:

- Stable pack consumption uses Git tags.
- Reproducible snapshots may use Git SHAs.
- Branch refs are allowed only for experiments.

Pack versions are tracked in `.uif/registry/source.yml`. A pack may use
`lastKnownVersion: unknown` only when its `versionStatus` is explicitly
`experimental`. Reviewed consumption should replace experimental branch refs
with a tag or SHA before the pack is treated as stable governance.

Current version interpretation:

- **Published pack version:** `0.6.0` (from consumed Vault pack artifacts under
  `.uif/packs/governance/`)
- **Runtime-consumed snapshot/version:** `0.7.0` at SHA
  `10f78061cd65e6ad6d7304376ead27d44efc01b3` (from `.uif/registry/source.yml`)
- **Planned/forward reference:** `0.8.0` (decision-aligned target, not yet
  published or consumed baseline)

Runtime treats `.uif/registry/source.yml` as authoritative for adoption status,
while Vault pack artifacts remain authoritative for published pack versions.

For the full version conflict resolution and lifecycle policy, see
[ADR: Governance Baseline Version Policy](adr/adr-governance-baseline-version-policy.md)
and the [Governance Baseline Reference Matrix](governance-baseline.md).

## Workspace Concept

The workspace is local to this repository:

- `decisions/`: local decision records.
- `overrides/`: documented local exceptions to consumed governance.
- `lessons/`: observations from applying governance in this runtime.
- `reflection/`: broader review notes and reusable insight candidates.

Workspace artifacts use YAML frontmatter so humans, agents, and CI can inspect
ownership, status, affected artifacts, and promotion intent.

## Owners

Review ownership is declared in `.uif/registry/sync-policy.yml`.

Current owner values are placeholders until maintainers assign named owners:

- `TODO-governance-owner`
- `TODO-runtime-owner`
- `TODO-agent-owner`

The placeholders make missing ownership visible without inventing authority.

## Promotion Process

Local insight becomes reusable governance only after review:

1. Capture a lesson or reflection locally.
2. Decide whether it is runtime-specific or reusable.
3. Mark it as a promotion candidate.
4. Review the candidate with repository maintainers.
5. Submit the candidate to the Vault.
6. Consume it back only after the Vault publishes a reviewed pack version.

Until that happens, the insight remains local and must not be treated as Vault
governance.

Promotion candidates use these lifecycle statuses:

- `draft`: captured locally but not ready for review.
- `proposed`: submitted for repository review.
- `approved`: accepted locally as suitable for Vault submission.
- `rejected`: reviewed and not suitable for promotion.
- `promoted`: accepted into the Vault and available through a reviewed pack.

## Responsibilities

Humans own final governance decisions, local overrides, and promotion approval.

Agents may read packs, create local workspace artifacts, propose changes, and
run validation. Agents must not silently alter governance or treat local lessons
as Vault rules.

Systems may validate registry, pack, and workspace structure. Systems must not
perform automatic synchronization or mutate repository files as part of sync
checks.

## Conflict Handling

When consumed governance conflicts with documented runtime decisions, the local
documented decision wins until reviewed. The conflict must be recorded as a
decision, override, lesson, or reflection, depending on its scope.

Conflict priority is fixed:

1. Local runtime safety rules
2. Local documented overrides
3. Consumed Vault packs
4. Generic agent rules

This priority prevents generic or imported guidance from silently weakening
runtime safety or documented local ownership.

## Validation

`scripts/uif-sync-check.mjs` validates only local structure and metadata:

- registry files exist
- pack and workspace directories exist
- schemas exist
- required registry fields are present
- enum values are valid
- unknown pack versions are limited to experimental packs
- workspace Markdown files include valid YAML frontmatter

The script performs no synchronization, no remote access, and no file changes.


## Related docs

- `docs/governance-baseline.md`
- `docs/canonical-reference-matrix.md`
- `docs/terminology.md`
