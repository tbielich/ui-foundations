---
title: Foundation-004: Typography Scale and Line Height
status: active
type: foundation-decision
---

# Foundation-004: Typography Scale and Line Height

## Purpose

Align typography between Figma and CSS with a predictable rhythm.

## Rules

1. Core typography primitives define:
   - `Font.Size.*` (px)
   - `LineHeight.*` (px, aligned to 4px grid)
   - `Font.Weight.*`
   - `Font.Family.*`

2. Line-height target:
   - Use a 140% target
   - Round to nearest 4px grid for published line-height primitives

3. Semantic typography roles (`Typography.*`) bundle:
   - font-family
   - font-size
   - line-height
   - font-weight

   Example scale:
   - xs (12) -> xs (16)
   - sm (14) -> sm (20)
   - md (16) -> md (24)
   - lg (20) -> lg (28)
   - xl (24) -> xl (32)
   - 2xl (32) -> 2xl (44)
   - 3xl (40) -> 3xl (56)

4. Typography roles must not include color; text color belongs to `Color.Text.*`.

## Implications

- Designers and engineers share the same typographic rhythm.
- Typography tokens remain reusable across components.
