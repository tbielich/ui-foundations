---
layout: layouts/docs.njk
title: Input
description: Text input pattern with token-driven interaction states.
navTitle: Input
order: 40
permalink: /components/input/
playgroundUrl: /components/input-playground/
playgroundLabel: Open Input Playground
---

{% import "macros/ui.njk" as ui %}

## Preview

<div class="docs-stack" style="max-inline-size: 28rem;">
  {{ ui.input(type="text", placeholder="Email address") }}
  {{ ui.input(type="text", value="Focus preview", state="focus") }}
  {{ ui.input(type="text", value="Disabled field", disabled=true) }}
</div>

## Usage

<div class="code-tabs">
{% call ui.buttonGroup(true, "horizontal", "start", "Code format", "code-tabs-bar") %}
  {{ ui.toggleButton("HTML", "lang", "html", "outline") }}
  {{ ui.toggleButton("Nunjucks", "lang", "njk", "outline") }}
  {{ ui.toggleButton("React", "lang", "react", "outline") }}
{% endcall %}
<div class="code-tabs-panel" data-lang="html">

```html
<input class="input" type="text" placeholder="Email address" />
```

</div>
<div class="code-tabs-panel" data-lang="njk">

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.input(type="text", placeholder="Email address") }}
{{ ui.input(type="text", value="Focus preview", state="focus") }}
{{ ui.input(type="text", value="Disabled field", disabled=true) }}
```
{% endraw %}

</div>
<div class="code-tabs-panel" data-lang="react">

{% raw %}
```jsx
import { Input } from "ui-foundations/react/input";

<Input placeholder="Email address" />
<Input type="email" placeholder="name@example.com" />
<Input disabled value="Disabled field" />
```
{% endraw %}

</div>
</div>

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
      <tr><td><code>--input-height</code></td><td>Control height</td></tr>
      <tr><td><code>--input-font-family</code></td><td>Font family</td></tr>
      <tr><td><code>--input-font-weight</code></td><td>Font weight</td></tr>
      <tr><td><code>--input-font-size</code></td><td>Font size</td></tr>
      <tr><td><code>--input-line-height</code></td><td>Line height</td></tr>
      <tr><td><code>--input-padding-inline</code></td><td>Horizontal padding</td></tr>
      <tr><td><code>--input-padding-block</code></td><td>Vertical padding</td></tr>
      <tr><td><code>--input-border-radius</code></td><td>Corner radius</td></tr>
      <tr><td><code>--input-border-size-default</code></td><td>Border width (default)</td></tr>
      <tr><td><code>--input-border-size-hover</code></td><td>Border width (hover)</td></tr>
      <tr><td><code>--input-border-size-active</code></td><td>Border width (active)</td></tr>
      <tr><td><code>--input-text-text-color-default</code></td><td>Text color (default)</td></tr>
      <tr><td><code>--input-text-text-color-hover</code></td><td>Text color (hover)</td></tr>
      <tr><td><code>--input-text-text-color-active</code></td><td>Text color (active)</td></tr>
      <tr><td><code>--input-text-text-color-placeholder</code></td><td>Placeholder color</td></tr>
      <tr><td><code>--input-text-border-color-default</code></td><td>Border color (default)</td></tr>
      <tr><td><code>--input-text-border-color-hover</code></td><td>Border color (hover)</td></tr>
      <tr><td><code>--input-text-border-color-active</code></td><td>Border color (active)</td></tr>
      <tr><td><code>--input-text-border-color-focus</code></td><td>Border color (focus-visible)</td></tr>
      <tr><td><code>--input-text-container-background-default</code></td><td>Background (default/hover/active base)</td></tr>
      <tr><td><code>--input-text-container-background-focus</code></td><td>Background (focus-visible)</td></tr>
      <tr><td><code>--input-overlay-hover</code></td><td>Hover overlay layer</td></tr>
      <tr><td><code>--input-overlay-active</code></td><td>Active overlay layer</td></tr>
      <tr><td><code>--input-text-color-disabled</code></td><td>Disabled text color</td></tr>
      <tr><td><code>--input-container-background-disabled</code></td><td>Disabled background</td></tr>
      <tr><td><code>--input-border-color-disabled</code></td><td>Disabled border color</td></tr>
      <tr><td><code>--shadow-focus</code></td><td>Focus ring size</td></tr>
      <tr><td><code>--color-focus</code></td><td>Focus ring color</td></tr>
      <tr><td><code>--button-line-height</code></td><td>Fallback for line-height token</td></tr>
      <tr><td><code>--size-spacing-800</code></td><td>Fallback for control height token</td></tr>
    </tbody>
  </table>
</div>


