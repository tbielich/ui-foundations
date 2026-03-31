---
layout: layouts/docs.njk
title: Switch
description: Binary setting control with toggle-switch visuals for immediate on/off changes.
navTitle: Switch
order: 47
permalink: /components/switch/
playgroundUrl: /components/switch-playground/
playgroundLabel: Open Switch Playground
---

{% import "macros/ui.njk" as ui %}

## Preview

<div class="docs-stack">
  {{ ui.switch("Notifications") }}
  {{ ui.switch("Auto updates", true) }}
  {{ ui.switch("Airplane mode", false, true) }}
</div>

Use `Switch` for settings that turn a behavior on or off immediately. For binary selection inside a form list, use `Checkbox`.

## Usage

<div class="code-tabs">
{% call ui.buttonGroup(true, "horizontal", "start", "Code format", "code-tabs-bar") %}
  {{ ui.toggleButton("HTML", "lang", "html", "outline") }}
  {{ ui.toggleButton("Nunjucks", "lang", "njk", "outline") }}
  {{ ui.toggleButton("React", "lang", "react", "outline") }}
{% endcall %}
<div class="code-tabs-panel" data-lang="html">

```html
<label class="switch-field">
  <input class="switch" type="checkbox" role="switch" />
  <span class="switch-field__text">Notifications</span>
</label>
```

</div>
<div class="code-tabs-panel" data-lang="njk">

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.switch("Notifications") }}
{{ ui.switch("Auto updates", true) }}
{{ ui.switch("Airplane mode", false, true) }}
```
{% endraw %}

</div>
<div class="code-tabs-panel" data-lang="react">

{% raw %}
```jsx
import { Switch } from "ui-foundations/react";

<Switch label="Notifications" />
<Switch defaultChecked label="Auto updates" />
<Switch disabled label="Airplane mode" />
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
      <tr><td><code>--size-spacing-1000</code></td><td>Track width</td></tr>
      <tr><td><code>--size-spacing-600</code></td><td>Track height</td></tr>
      <tr><td><code>--size-spacing-100</code></td><td>Thumb inset</td></tr>
      <tr><td><code>--size-border-100</code></td><td>Track border width</td></tr>
      <tr><td><code>--size-radius-full</code></td><td>Pill track and thumb radius</td></tr>
      <tr><td><code>--typography-label-gap</code></td><td>Spacing between switch and text</td></tr>
      <tr><td><code>--typography-label-font-family</code></td><td>Label font family</td></tr>
      <tr><td><code>--typography-label-font-weight</code></td><td>Label font weight</td></tr>
      <tr><td><code>--typography-label-font-size</code></td><td>Label font size</td></tr>
      <tr><td><code>--typography-label-line-height</code></td><td>Label line-height</td></tr>
      <tr><td><code>--color-fill-surface</code></td><td>Unchecked track and checked thumb fill</td></tr>
      <tr><td><code>--color-fill-brand</code></td><td>Checked track fill</td></tr>
      <tr><td><code>--color-fill-disabled</code></td><td>Disabled unchecked track fill</td></tr>
      <tr><td><code>--color-border-default</code></td><td>Unchecked track and thumb color</td></tr>
      <tr><td><code>--color-border-brand</code></td><td>Interactive and checked track border</td></tr>
      <tr><td><code>--color-border-disabled</code></td><td>Disabled border</td></tr>
      <tr><td><code>--color-text-default</code></td><td>Default label color</td></tr>
      <tr><td><code>--color-text-disabled</code></td><td>Disabled label color</td></tr>
      <tr><td><code>--color-overlay-hover</code></td><td>Hover overlay</td></tr>
      <tr><td><code>--color-overlay-active</code></td><td>Active overlay</td></tr>
      <tr><td><code>--shadow-focus</code></td><td>Focus ring size</td></tr>
      <tr><td><code>--color-focus</code></td><td>Focus ring color</td></tr>
    </tbody>
  </table>
</div>


