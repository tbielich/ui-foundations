---
title: Foundation-006 – Z-Index and Layering Strategy
status: active
type: foundation-decision
---

# Foundation-006: Z-Index and Layering Strategy

## Purpose

Ensure predictable stacking behavior without scattered magic numbers.

## Rules

1. Define z-index values as Core primitives under `Core.ZIndex.*`.

2. Recommended base levels:
   - `Core.ZIndex.Hidden = -1`
   - `Core.ZIndex.Base = 0`
   - `Core.ZIndex.Raised = 1`

3. Recommended overlay stack:
   - `Core.ZIndex.DropdownBase = 900`
   - `Core.ZIndex.Dropdown = 1000`
   - `Core.ZIndex.Sticky = 1020`
   - `Core.ZIndex.Fixed = 1030`
   - `Core.ZIndex.ModalOverlay = 1040`
   - `Core.ZIndex.Modal = 1050`
   - `Core.ZIndex.Popover = 1060`
   - `Core.ZIndex.Tooltip = 1070`

4. Components must reference these tokens and must not introduce new stacking numbers.

## Implications

- Layering remains predictable across components and products.
- Z-index conflicts are reduced.
