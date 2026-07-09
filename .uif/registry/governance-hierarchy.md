---
title: UIF Governance Consumption Hierarchy
status: active
type: governance-architecture
owner: ui-foundations-runtime
---

# UIF Governance Consumption Hierarchy

This repository consumes reusable governance from the UI Foundations Vault while
remaining an independent runtime repository.

## Hierarchy

1. Knowledge
   - Reusable findings, practices, constraints, and context.
2. Governance
   - Durable rules derived from validated knowledge.
3. Specifications
   - Actionable requirements that apply governance to a domain.
4. Skills
   - Repeatable operating procedures for humans, agents, and systems.
5. Export Packs
   - Versioned bundles prepared by the Vault for downstream consumption.
6. Runtime Consumption
   - Local import, review, and interpretation of export packs.
7. Implementation
   - Runtime-specific code, documentation, tokens, and workflow changes.
8. Reflection
   - Local observations from applying governance in this repository.
9. Promotion Candidate
   - Local reflection prepared for Vault review.
10. Vault
   - Source of truth for reusable governance after review and promotion.

## Boundary

Imported packs inform local work. They do not automatically change runtime
implementation, local decisions, or repository ownership.
