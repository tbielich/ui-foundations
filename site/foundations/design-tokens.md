---
layout: layouts/docs.njk
title: Design Tokens
description: The layered token architecture that connects Figma designs to production code.
navTitle: Design Tokens
order: 4
permalink: /foundations/design-tokens/
---

Design tokens are the single source of truth for visual style. They flow from
Figma exports through a build pipeline into CSS custom properties.

## Token layers

The system uses four layers. Each layer references only the layer below it.

<table class="docs-options-table">
  <thead>
    <tr>
      <th>Layer</th>
      <th>Purpose</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Core (Primitives)</td>
      <td>Primitive/reference values — spacing, radii, borders, typography</td>
      <td><code>--size-spacing-200</code></td>
    </tr>
    <tr>
      <td>Appearance (Modes)</td>
      <td>Mode-dependent decisions such as light and dark color mappings</td>
      <td><code>--color-fill-surface</code></td>
    </tr>
    <tr>
      <td>Semantics (Brands)</td>
      <td>Brand-scoped semantic roles for color, corner, font, and size decisions</td>
      <td><code>--brand-corner-button</code></td>
    </tr>
    <tr>
      <td>Patterns / Components</td>
      <td>Implementation tokens consuming semantic roles or Core tokens</td>
      <td><code>--button-solid-background-default</code></td>
    </tr>
  </tbody>
</table>

## Naming convention

- Component tokens: `--component-variant-part-property-state`
- Semantic tokens: role-based (e.g. `--color-text-default`, `--color-fill-brand`)
- States are always the last segment: `default`, `hover`, `active`, `focus`, `disabled`

## Pipeline

Figma exports JSON token files to `figma/exports/`. The build step
`npm run tokens:generate` transforms them into CSS custom properties in `dist/tokens/css/`.

Generated files in `dist/` are never edited directly.

## Brand and mode

Brand and appearance mode are orthogonal concerns controlled by `data-brand`
and `data-mode` attributes on the root element. Switching either attribute swaps
the active token values without changing component markup.

## Rules

- Components reference only Semantic or Core tokens — never raw color values.
- Never mix token layers in a single declaration.
- Never hardcode hex, rgb, or hsl values in component CSS.
- Always use `var(--...)` for every visual property.

## Reference

- [All Tokens](/foundations/design-tokens/all/) — complete tabular index of all generated tokens
