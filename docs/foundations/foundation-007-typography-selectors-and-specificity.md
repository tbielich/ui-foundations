---
title: Foundation-007 – Typography Selectors and Specificity
status: active
type: foundation-decision
---

# Foundation-007: Typography Selectors and Specificity

## Purpose

Provide a consistent typography API with low selector specificity and predictable overrides.

## Rules

1. Heading elements (`h1`..`h6`) define baseline heading styles.

2. `.heading` mirrors heading baseline styles for non-heading elements.

3. Size/scale classes define typography variants:
   - Heading sizes: `.heading-xxxl` to `.heading-sm`
   - Text scale: `.text-xs` to `.text-xxxl`

4. Use `:where()` for zero-specificity size/scale selectors where possible.

5. Reserve data attributes (for example `[data-theme]`, `[data-density]`) for context/state, not as primary styling API.

## Implications

- Component styles can override typography defaults without `!important`.
- API remains clear between semantic element defaults and class-based variants.
