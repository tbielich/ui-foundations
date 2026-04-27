---
layout: layouts/docs.njk
title: Examples
description: Composed patterns and guidance on creating new components.
navTitle: Overview
order: 1
permalink: /examples/
---

This section shows concrete UI compositions built from existing components.

<ul class="docs-link-list">
  {% for entry in collections.examplesDocs %}
    {% if entry.url != page.url %}
    <li>
      <a href="{{ entry.url }}">{{ entry.data.title }}</a>
      {% if entry.data.description %}
      <span>{{ entry.data.description }}</span>
      {% endif %}
    </li>
    {% endif %}
  {% endfor %}
</ul>

## Creating new components

When building examples or pages that use a UI pattern not yet in the system
(tooltip, card, dropdown, etc.), follow the component promotion workflow.

### Which steering to use

Reference `#component-doc-template` in your prompt. It contains the full
Spectrum-style section structure, hero markup with inline theme switches,
behavior grid, do/don't blocks, and all CSS class names needed to build a
complete component page.

### Required integration surfaces (Rule 8)

Every new component needs all 10 surfaces:

1. CSS pattern — `src/ui/patterns/<component>.css`
2. CSS index import — `src/ui/index.css`
3. React wrapper — `src/react/<component>.js`
4. React export — `src/react/index.js`
5. Nunjucks macro — `site/_includes/macros/ui.njk`
6. Playground renderer — `site/assets/playground/renderers.js`
7. Playground page — `site/components/<component>-playground.md`
8. Docs page — `site/components/<component>.md`
9. Code Connect — `schemas/web-<component>.figma.ts`
10. Code generator — `site/assets/playground/code-generators.js`

### Boundary check (Rule 7)

Before creating a standalone component, verify:

- Does it introduce distinct semantics, API surface, or lifecycle?
- Is it reusable across multiple contexts?
- Or is it a local one-off that should stay in the example?

Prefer composition inside an existing component family when the behavior is
mainly layout, wrapping, or grouping.

### Example prompt

Copy and paste this into a new conversation to scaffold a component:

```text
Create a new "Tooltip" component for the UI Foundations design system.

Use #component-doc-template for the docs page structure.

Requirements:
- Variants: default, brand
- Positioning: top, bottom, left, right
- Trigger: hover and focus
- Token naming: --tooltip-<part>-<property>-<state>
- Reference the Button and Icon docs pages as models for section depth

Complete all 10 integration surfaces per Rule 8.
Do NOT auto-create the Figma token export — propose token names only.
```

### Token ownership (Rule 9)

Every new component must have its own tokens. Never reuse tokens from another
component. Follow the naming pattern `--<component>-<part>-<property>-<state>`
and reference only Semantic or Core tokens.
