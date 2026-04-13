---
title: Foundation-002 – Naming and Grouping Conventions
status: active
type: foundation-decision
---

# Foundation-002: Naming and Grouping Conventions

## Purpose

Keep token naming readable in Figma, searchable in code, and scalable across variants/states.

## Rules

1. Component tokens follow a variant-first path:
   `Component.variant.part.property.state`

   Examples:
   - `Button.solid.container.background.default`
   - `Button.outline.container.border-color.hover`
   - `Button.ghost.label.text-color.disabled`

2. Semantic tokens remain role-based and component-agnostic:
   - `Color.Text.Default`
   - `Color.Fill.Surface`
   - `Color.Border.Brand`
   - `Typography.Label`
   - `Corner.Medium`

3. States are always the last segment:
   `...property.state`

   Common states:
   `default`, `hover`, `active`, `focus`, `disabled`

4. Naming style:
   - Component name in PascalCase; subsequent segments in lowercase
   - Multi-word properties in kebab-case (`border-color`, `line-height`)
   - No device labels (`mobile/tablet/desktop`) in token names

## Implications

- Figma browsing remains predictable.
- Token APIs stay implementation-friendly while preserving semantic clarity.
