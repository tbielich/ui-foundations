---
title: Foundation-008: Mode Activation and Consumer Control
status: active
type: foundation-decision
---

# Foundation-008: Mode Activation and Consumer Control

## Purpose

Support dark mode in a reusable way without forcing activation behavior on consumers.

## Rules

1. Token outputs are scope-ready, not runtime activation logic:
   - Light tokens at `:root`
   - Dark tokens at `:root[data-mode="dark"]`
   - Brand tokens scoped by `data-brand`

2. Core theme layer remains neutral:
   - `src/core/themes/mode.css` keeps non-invasive base behavior (`color-scheme`)
   - no hard-coded dark token overrides in core theme CSS

3. Each consumer owns mode policy:
   - whether dark mode is available
   - how system preference is interpreted
   - when/how `data-mode` is set/removed

## Implications

- No unintended global dark overrides in downstream consumers.
- Clear separation between token definitions and runtime mode policy.
- Consumers can implement light-only, manual toggle, or system-following behavior.
