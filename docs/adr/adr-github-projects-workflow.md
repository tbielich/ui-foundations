# ADR: Adopt GitHub Projects as the delivery workflow for project-driven development

## Status

Proposed

## Context

The repository needs a more structured way to manage work from idea through
implementation and validation.

Current task execution can be too prompt-led or implementation-led, which creates
several risks:

- work begins before scope is clear
- requirements are not consistently captured
- acceptance criteria may be implicit or missing
- implementation and review are harder to trace back to the original objective
- architectural decisions and delivery work are not always linked
- agent-driven work can become under-specified or difficult to verify

A GitHub Projects-based workflow would provide a lightweight but explicit
operating model for project-driven development using:

- GitHub Issues for work definition
- GitHub Projects for tracking and workflow state
- Pull Requests for implementation
- ADRs for durable architectural or process decisions

This supports clearer delivery, better review discipline, and stronger
traceability across human and agent work.

## Decision

Adopt GitHub Projects as the standard delivery workflow for project-driven
development in this repository.

Work should move through a defined chain:

1. Idea or request is captured as a GitHub Issue
2. The issue is added to the GitHub Project
3. The issue defines:
   - problem statement
   - goal
   - scope
   - out of scope
   - acceptance criteria
   - dependencies or unknowns
4. If the work introduces a lasting architectural, governance, or process
   decision, create or update an ADR
5. Implementation is executed on a linked branch and Pull Request
6. The Pull Request references the issue and validates the acceptance criteria
7. The project item is updated as work progresses
8. The issue is closed only when implementation and validation are complete

## Workflow model

### Required artefacts

- GitHub Project item for tracked work
- GitHub Issue as the delivery definition
- Pull Request for implementation
- ADR when the work introduces a durable decision

### Minimum issue structure

Each feature or improvement issue should include:

- Problem statement
- Goal
- Scope
- Out of scope
- Acceptance criteria
- Dependencies or unknowns

### Pull Request expectations

Each Pull Request should:

- reference the linked issue
- describe the change made
- explain how acceptance criteria were met
- include validation evidence
- note any remaining risks or follow-up work

### ADR trigger

An ADR is required when work changes:

- architecture
- token or component governance
- design-to-code contracts
- repository workflow or operating model
- shared metadata or indexing patterns
- other decisions expected to guide future work

## Consequences

### Positive

- clearer delivery structure
- better traceability from request to implementation
- stronger review quality through explicit acceptance criteria
- improved compatibility with agent-driven execution
- easier prioritisation and status visibility
- reduced ambiguity around what "done" means

### Negative

- introduces some process overhead
- requires discipline in issue writing and project maintenance
- can become noisy if every small task is over-formalised
- depends on consistent use by both humans and agents

## Alternatives considered

### 1. Continue with ad-hoc issue and PR management

Rejected because it does not provide enough structure for predictable
project-driven delivery.

### 2. Use issues only, without GitHub Projects

Rejected because issues alone do not provide the same workflow visibility,
prioritisation, and operational tracking.

### 3. Use GitHub Projects without issue structure standards

Rejected because tracking without clear work definition still leads to ambiguity
and weak execution.

### 4. Use an external project management tool

Rejected for now because GitHub Projects keeps planning and delivery close to
the code, issues, and PRs.

## Operating rules

### Required

- Work starts from an issue, not from an implementation prompt alone
- Issues must contain explicit acceptance criteria
- PRs must link back to the issue
- Durable decisions must be captured in ADRs
- Project status should reflect real delivery state

### Preferred

- Agent prompts should be derived from issues
- Feature branches should map to a single scoped issue where possible
- Closure notes should summarise what was delivered and validated

### Not required

- ADRs for every small implementation detail
- Project items for trivial housekeeping work, unless the team wants full
  visibility

## Notes

This decision establishes GitHub Projects as the primary workflow framework for
delivery tracking. It does not replace repository-specific engineering, token, or
documentation governance rules.
