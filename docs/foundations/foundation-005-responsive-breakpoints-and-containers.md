---
title: Foundation-005: Responsive Strategy (Breakpoints and Containers)
status: active
type: foundation-decision
---

# Foundation-005: Responsive Strategy (Breakpoints and Containers)

## Purpose

Keep responsive thresholds precise, stable, and reusable across viewport and component contexts.

## Rules

1. Viewport breakpoints are Core primitives:
   - `Core.Breakpoint.*` (px)

2. Container query thresholds are separate Core primitives:
   - `Core.Container.*` (px)

3. Breakpoints and container thresholds are not interchangeable.

4. Avoid device names and t-shirt sizes in Core tokens.
   Numeric thresholds are the source of truth.

## Implications

- Clear separation between page-level and component-level responsiveness.
- Better long-term maintainability for responsive behavior.
