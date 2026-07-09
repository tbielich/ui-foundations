---
id: governance.lifecycle
title: Document Lifecycle
type: governance
status: stable
owners:
  - ui-foundations
created: 2026-07-07
updated: 2026-07-07
authority: source
summary: Defines lifecycle states, review expectations, and ownership for vault documents.
---

# Document Lifecycle

## Purpose

Every governed vault document has a lifecycle state. Lifecycle states help humans and agents understand whether knowledge is exploratory, under review, authoritative, mature, retired, or preserved only for history.

## States

### Draft

Draft documents capture work in progress.

Entry criteria:

- The topic belongs in the vault.
- The document has an owner.
- The document is clearly incomplete or exploratory.

Exit criteria:

- The author believes the document is ready for review.
- Open assumptions and unresolved questions are visible.

Review expectations:

- Drafts may be used as context but should not be treated as authoritative.

Ownership:

- At least one owner is responsible for moving the draft forward or removing it.

### Review

Review documents are ready for evaluation but not yet accepted.

Entry criteria:

- The document has a clear purpose.
- Required structure is present.
- Known assumptions and dependencies are explicit.

Exit criteria:

- Reviewers accept the document.
- Reviewers request revision.
- The document is withdrawn.

Review expectations:

- Check clarity, scope, relationship to existing knowledge, and evidence.
- Check that the document does not duplicate or contradict higher-precedence sources.

Ownership:

- Owners coordinate review and resolve feedback.

### Accepted

Accepted documents are authoritative enough to guide work.

Entry criteria:

- Review is complete.
- The document has no unresolved blocking conflicts.
- The owner accepts responsibility for stewardship.

Exit criteria:

- The document matures into stable status.
- The document needs revision and returns to review.
- The document is deprecated.

Review expectations:

- Accepted documents should be reviewed when materially affected by new decisions, specifications, or external constraints.

Ownership:

- Owners keep the document aligned with current vault knowledge.

### Stable

Stable documents represent mature guidance expected to change rarely.

Entry criteria:

- The document has been accepted and used without major revision.
- The document expresses durable guidance rather than temporary process.
- Known relationships and precedence are clear.

Exit criteria:

- A material change returns the document to review.
- The document is deprecated or archived.

Review expectations:

- Stable documents require deliberate review before major changes.
- Minor editorial updates may remain stable when meaning does not change.

Ownership:

- Owners protect stability and prevent unnecessary churn.

### Deprecated

Deprecated documents should no longer guide new work but remain available for transition and traceability.

Entry criteria:

- A replacement exists, or the document is no longer recommended.
- The reason for deprecation is clear.

Exit criteria:

- The document is archived.
- The document is revised and returns to review.

Review expectations:

- Deprecated documents should point to replacement guidance when available.

Ownership:

- Owners ensure consumers are not misled by stale guidance.

### Archived

Archived documents are preserved for history only.

Entry criteria:

- The document is obsolete.
- It is no longer needed for active reasoning.
- Keeping it has traceability value.

Exit criteria:

- Archived documents normally do not return to active use.

Review expectations:

- Archived documents should not be used as current guidance.

Ownership:

- Owners may be historical. Active maintainers may preserve the document for auditability.

## Ownership Rules

- Every governed document has at least one owner.
- Owners may be people, teams, or durable roles.
- Ownership means stewardship, not unilateral authority.
- Governance documents require the highest review care because they shape all other documents.

## Review Rules

- Draft and review documents may inform discussion but should not be treated as final.
- Accepted and stable documents may guide work.
- Deprecated and archived documents should not guide new work.
- Lower-precedence documents should return to review when they conflict with higher-precedence documents.

