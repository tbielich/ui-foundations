---
title: ADR – Runtime and Vault Documentation Architecture
status: proposed
type: adr
---

# ADR: Runtime and Vault Documentation Architecture

## Context

UI Foundations documentation is split across two repositories:

- **Vault** for durable, reusable foundation knowledge.
- **Runtime** for implementation-facing guidance and repository-specific usage.

Recent audits showed that developer comprehension and governance traceability both degrade when ownership is ambiguous, when the same concept is repeated in multiple places, or when canonical source intent is unclear.

This ADR defines enduring architectural principles for Runtime ↔ Vault documentation decisions.

## Decision

### 1. Purpose of Runtime documentation

Runtime documentation exists to help developers and contributors understand, use, and evolve the Runtime repository effectively:

- architecture and implementation context
- public surface usage and migration guidance
- runtime-specific decisions and constraints
- practical navigation for day-to-day engineering work

### 2. Purpose of the Vault

Vault documentation exists to hold durable, reusable, cross-repository knowledge:

- canonical design and governance principles
- long-lived conceptual models
- reusable documentation guidance that should not be redefined per runtime

### 3. Relationship between Runtime and Vault

Runtime and Vault are complementary, not competing:

- Vault provides canonical knowledge and governance intent.
- Runtime applies that intent to local implementation and delivery reality.
- Runtime may reference Vault canon, but remains responsible for local clarity and usability.

### 4. Canonical knowledge vs implementation guidance

Documentation must preserve a clear boundary:

- **Canonical knowledge** belongs to Vault.
- **Implementation guidance** belongs to Runtime.

Runtime should explain how canonical principles are applied locally, without redefining canon.

### 4a. Governance vs developer documentation

- **Governance documentation** defines durable boundaries, authority, and decision intent.
- **Developer documentation** explains practical repository usage and implementation application.
- Governance informs developer documentation; developer documentation does not redefine governance.

### 5. Documentation ownership principles

- Every major documentation topic has an explicit owner and decision path.
- Ownership is accountable stewardship, not isolated authorship.
- Cross-repository topics require explicit responsibility boundaries between Runtime and Vault.

### 6. Long-term documentation architecture

Documentation architecture must remain:

- understandable to new developers without hidden context
- resilient to repository evolution and release cycles
- stable under incremental change
- explicit about source-of-truth location per topic

### 7. Duplication minimization principle

Duplication should be minimized because it increases drift risk, weakens trust, and creates competing truths.

Allowed duplication is limited to:

- concise summaries that improve local readability
- migration context that translates canon into runtime actions

When summaries exist, they must clearly point to canonical sources.

### 8. Future evolution principle

Future documentation changes should:

- preserve the Runtime/Vault boundary
- prefer extension of existing canonical paths over parallel definitions
- make ownership and authority clearer over time
- be reviewable as architectural change, not only editorial change

## Consequences

- Documentation initiatives can optimize local developer experience without diluting canonical ownership.
- Governance and implementation documentation can evolve independently but coherently.
- Future restructuring efforts have a stable architectural baseline for decisions.

## Out of scope

This ADR intentionally does **not** define:

- metadata schemas
- CI or validation tooling
- automation strategy
- authoring templates or low-level format rules

Those are resolved in subsequent governance and automation decisions.

## Related

- `docs/linking-strategy.md`
- `docs/uif-governance.md`
- `docs/README.md`
- `docs/adr/adr-uif-public-api-namespace.md`
