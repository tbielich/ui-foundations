---
layout: layouts/docs.njk
title: Getting Started
description: How to install and use UI Foundations in your project.
navTitle: Getting Started
order: 1
permalink: /getting-started/
---

## Install

```bash
npm install ui-foundations
```

Package on npm: [ui-foundations](https://www.npmjs.com/package/ui-foundations)

Figma library: [UI Foundations on Figma](https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations)

Starter template: [ui-foundations-starter](https://github.com/tbielich/ui-foundations-starter)

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

Set `data-brand` and `data-mode` on the root element to control theming at runtime:

```js
const root = document.documentElement;
root.dataset.brand = "a"; // "a" | "b"
root.dataset.mode = "light"; // "light" | "dark"
```

```html
<html data-brand="a" data-mode="light">
```

## Using Components

Components are available as plain HTML classes, Nunjucks macros (for SSG), and optional React wrappers.

### HTML

```html
<button class="button" type="button">Label</button>
<input class="input" type="text" placeholder="Email" />
<a href="/page" class="link">Go to page</a>
```

### SSG / Nunjucks

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

## Available Macros

| Macro | Description |
|---|---|
| `ui.button(label, variant, disabled)` | Button with solid/outline/ghost variants |
| `ui.buttonGroup(attached, orientation, justify, ariaLabel)` | Grouped button wrapper |
| `ui.input(type, placeholder, value, state, disabled)` | Text input |
| `ui.checkbox(label, checked, disabled)` | Checkbox with label |
| `ui.switch(label, checked, disabled)` | Toggle switch with label |
| `ui.icon(name, label)` | SVG icon via CSS mask |
| `ui.labelContent(text, startIcon, endIcon, iconOnly)` | Text + icon label primitive |
| `ui.fieldLabel(text, htmlFor, required, startIcon)` | Form field label |
| `ui.link(text, href, startIcon, endIcon, state, disabled)` | Link with optional icons |

## Token Architecture

Tokens are layered in four levels:

1. **Primitives** — raw values (colors, sizes, weights)
2. **Brand** — brand-specific aliases (`brand-a`, `brand-b`)
3. **Semantic** — role-based mappings (`color-text-default`, `color-fill-brand`)
4. **Component** — component-specific tokens (`button-border-radius`, `input-height`)

See [Token Overview](/tokens/) for the full token reference.

## Validation

```bash
npm run lint          # JS syntax check
npm run test:unit     # unit tests
npm run ci:check      # full validation pipeline
```

## Figma Integration

Design tokens are synced from Figma via the Token Foundry plugin. See the [plugin README](https://github.com/tbielich/ui-foundations/blob/main/figma/plugin/README.md) for details.
