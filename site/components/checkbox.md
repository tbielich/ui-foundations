---
layout: layouts/docs.njk
title: Checkbox
description: Selection control for binary form choices with token-based states.
navTitle: Checkbox
order: 45
permalink: /components/checkbox/
playgroundUrl: /components/checkbox-playground/
playgroundLabel: Open Checkbox Playground
---

{% import "macros/ui.njk" as ui %}

## Preview

<div class="docs-stack">
  {{ ui.checkbox("Accept terms") }}
  {{ ui.checkbox("Receive updates", true) }}
  {{ ui.checkbox("Disabled option", false, true) }}
</div>

## Usage

### SSG / Nunjucks

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.checkbox("Accept terms") }}
{{ ui.checkbox("Receive updates", true) }}
{{ ui.checkbox("Disabled option", false, true) }}
```
{% endraw %}

### HTML

```html
<label class="checkbox-field">
  <input class="checkbox" type="checkbox" />
  <span class="checkbox-field__text">Accept terms</span>
</label>
```

### React

{% raw %}
```jsx
import { Checkbox } from "ui-foundations/react";

<Checkbox label="Accept terms" />
<Checkbox defaultChecked label="Receive updates" />
<Checkbox disabled label="Disabled option" />
```
{% endraw %}

## Used tokens

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>Token</th>
        <th>Usage</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>--size-spacing-600</code></td><td>Checkbox control size</td></tr>
      <tr><td><code>--size-border-100</code></td><td>Default border width</td></tr>
      <tr><td><code>--size-border-200</code></td><td>Active border width</td></tr>
      <tr><td><code>--brand-corner-input</code></td><td>Corner radius</td></tr>
      <tr><td><code>--typography-label-gap</code></td><td>Spacing between checkbox and text</td></tr>
      <tr><td><code>--typography-label-font-family</code></td><td>Label font family</td></tr>
      <tr><td><code>--typography-label-font-weight</code></td><td>Label font weight</td></tr>
      <tr><td><code>--typography-label-font-size</code></td><td>Label font size and checkmark size</td></tr>
      <tr><td><code>--typography-label-line-height</code></td><td>Label and checkmark line-height</td></tr>
      <tr><td><code>--color-fill-surface</code></td><td>Unchecked background</td></tr>
      <tr><td><code>--color-fill-brand</code></td><td>Checked background</td></tr>
      <tr><td><code>--color-fill-disabled</code></td><td>Disabled background</td></tr>
      <tr><td><code>--color-border-default</code></td><td>Unchecked border</td></tr>
      <tr><td><code>--color-border-brand</code></td><td>Interactive and checked border</td></tr>
      <tr><td><code>--color-border-disabled</code></td><td>Disabled border</td></tr>
      <tr><td><code>--color-text-default</code></td><td>Default label color</td></tr>
      <tr><td><code>--color-text-inverse</code></td><td>Checked checkmark color</td></tr>
      <tr><td><code>--color-text-disabled</code></td><td>Disabled label and checkmark color</td></tr>
      <tr><td><code>--color-overlay-hover</code></td><td>Hover overlay</td></tr>
      <tr><td><code>--color-overlay-active</code></td><td>Active overlay</td></tr>
      <tr><td><code>--shadow-focus</code></td><td>Focus ring size</td></tr>
      <tr><td><code>--color-focus</code></td><td>Focus ring color</td></tr>
    </tbody>
  </table>
</div>


