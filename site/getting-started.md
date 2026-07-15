---
layout: layouts/docs.njk
title: Getting Started
description: How to install and use UI Foundations in your project.
navTitle: Getting Started
order: 1
permalink: /getting-started/
---

UI Foundations is a token-first design system that provides CSS custom properties,
HTML component patterns, Nunjucks macros, and optional React wrappers. Tokens are
authored in Figma and generated into CSS, JSON, and TypeScript.

## Install

```bash
npm install ui-foundations
```

**Resources**

- [ui-foundations on npm](https://www.npmjs.com/package/ui-foundations)
- [Figma library](https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations)
- [Starter template](https://github.com/tbielich/ui-foundations-starter)

## CSS Setup

Import the full bundle for all tokens and components:

```css
@import "ui-foundations/core.css";
@import "ui-foundations/ui.css";
```

Or import individual token layers for more control:

```css
@import "ui-foundations/tokens/primitives.css";
@import "ui-foundations/tokens/brand-a.css";
@import "ui-foundations/tokens/color-light.css";
@import "ui-foundations/tokens/semantic.css";
@import "ui-foundations/tokens/components.css";
```

## Brand and Mode Switching

Set `data-brand` and `data-mode` on the root element to control theming at
runtime:

```html
<html data-brand="a" data-mode="light">
```

```js
const root = document.documentElement;
root.dataset.brand = "a"; // "a" | "b" | "c"
root.dataset.mode = "light"; // "light" | "dark"
```

## Using Components

Components are available as plain HTML classes, Nunjucks macros for static site
generation, and optional React wrappers.

### HTML

```html
<button class="uif-button solid" type="button">Label</button>
<input class="input" type="text" placeholder="Email" />
<a href="/page" class="link">Go to page</a>
```

### Nunjucks Macros

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.button("Label") }}
{{ ui.input(type="text", placeholder="Email") }}
{{ ui.link("Go to page", href="/page") }}
{{ ui.icon("search") }}
{{ ui.checkbox("Accept terms") }}
{{ ui.switch("Notifications") }}
```
{% endraw %}

### React

```jsx
import { Button } from "ui-foundations/react/button";
import { Input } from "ui-foundations/react/input";
import { Icon } from "ui-foundations/react/icon";

<Button>Label</Button>
<Input placeholder="Email" />
<Icon name="search" />
```

## Macro Reference

| Macro | Description |
|---|---|
| `ui.button(label, variant, disabled)` | Button — solid, outline, or ghost variant |
| `ui.buttonGroup(attached, orientation, justify, ariaLabel)` | Groups related buttons |
| `ui.input(type, placeholder, value, state, disabled)` | Text input field |
| `ui.checkbox(label, checked, disabled)` | Checkbox with visible label |
| `ui.radio(label, name, value, checked, disabled)` | Radio button with visible label |
| `ui.switch(label, checked, disabled)` | Toggle switch with visible label |
| `ui.icon(name, label)` | Icon rendered via CSS mask |
| `ui.labelContent(text, startIcon, endIcon, iconOnly)` | Label primitive with optional icons |
| `ui.fieldLabel(text, htmlFor, required, startIcon)` | Form field label with required indicator |
| `ui.link(text, href, startIcon, endIcon, state, disabled)` | Link with optional start and end icons |
| `ui.badge(text, variant, size, startIcon)` | Status badge with optional icon |

## Token Architecture

Tokens are layered in four levels:

1. **Primitives** — raw values such as colours, sizes, and font weights
2. **Brand** — brand-specific aliases (`brand-a`, `brand-b`, `brand-c`)
3. **Semantic** — role-based mappings (`color-text-default`, `color-fill-brand`)
4. **Component** — component-specific tokens (`button-border-radius`, `input-height`)

See [Token Overview](/foundations/design-tokens/) for the full token reference.

## Validation

```bash
npm run lint          # JS syntax check
npm run test:unit     # Unit tests
npm run ci:check      # Full validation pipeline
```

## Figma Integration

Design tokens are synced from Figma using the MCP integration. Token exports
live in `figma/exports/` and are processed by `npm run tokens:generate`.
