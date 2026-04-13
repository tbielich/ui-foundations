---
title: Foundation-009: Component Boundaries and Utility Test
status: active
type: foundation-decision
---

# Foundation-009: Component Boundaries and Utility Test

## Purpose

Ensure new UI building blocks are introduced only when they provide reusable system value, not one-off complexity.

## Rules

1. Run a boundary decision before creating any new component.
   - First ask: can this be modeled as composition of an existing component family?
   - Typical composition cases: grouping, layout wrappers, orchestration of existing parts.

2. Promote to a standalone component only if at least one applies:
   - distinct semantics/responsibility
   - stable public API that is not just a thin wrapper
   - independent lifecycle/behavior that needs dedicated ownership

3. Apply the utility test ("Snowflake check"):
   - If it solves only one local case, keep it local and avoid adding system-level surface.
   - If it is reusable across products/contexts, model it at system level.

4. Token work is independent from component boundaries.
   - New tokens may be required in both paths.
   - New tokens alone do not justify a new standalone component.

## Implications

- The system surface stays smaller and easier to maintain.
- Documentation remains clearer by keeping compositions near their base component.
- Reusable patterns still scale when they pass the utility test.
