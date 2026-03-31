---
layout: layouts/docs.njk
title: Button
description: Variants, grouped usage, states, and token-driven rendering.
navTitle: Button
order: 10
permalink: /components/button/
playgroundUrl: /components/button-playground/
playgroundLabel: Open Button Playground
---

{% import "macros/ui.njk" as ui %}

## Variants

<div class="docs-stack">
  {{ ui.button("Solid") }}
  {{ ui.button("Outline", "outline") }}
  {{ ui.button("Ghost", "ghost") }}
  {{ ui.button("Disabled", "", true) }}
</div>

## Grouped Actions (Button Group Wrapper)

[Open Button Group Playground](/components/button-group-playground/)

Use `ButtonGroup` to keep related actions visually and semantically grouped.

```html
<div
  class="button-group"
  role="group"
  aria-label="Travel dates"
  data-orientation="horizontal"
  data-attached="false"
  data-justify="start"
>
  <button class="button outline" type="button">Day 1</button>
  <button class="button outline" type="button">Day 2</button>
  <button class="button outline" type="button">Day 3</button>
</div>
```

<div class="docs-stack" style="max-inline-size: 34rem;">
  {% call ui.buttonGroup(false, "horizontal", "start", "Travel dates") %}
    {{ ui.button("Day 1", "outline") }}
    {{ ui.button("Day 2", "outline") }}
    {{ ui.button("Day 3", "outline") }}
  {% endcall %}
</div>

- `orientation`: `"horizontal"` (default) or `"vertical"`
- `attached`: `false` (default) removes shared borders/gaps when `true`
- `justify`: `"start"` (default) or `"stretch"`

## Usage

<div class="code-tabs">
{% call ui.buttonGroup(true, "horizontal", "start", "Code format", "code-tabs-bar") %}
  {{ ui.toggleButton("HTML", "lang", "html", "outline") }}
  {{ ui.toggleButton("Nunjucks", "lang", "njk", "outline") }}
  {{ ui.toggleButton("React", "lang", "react", "outline") }}
{% endcall %}
<div class="code-tabs-panel" data-lang="html">

```html
<button class="button" type="button">Solid</button>
<button class="button outline" type="button">Outline</button>
<button class="button ghost" type="button">Ghost</button>
<button class="button" type="button" disabled>Disabled</button>
```

</div>
<div class="code-tabs-panel" data-lang="njk">

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.button("Solid") }}
{{ ui.button("Outline", "outline") }}
{{ ui.button("Ghost", "ghost") }}
{{ ui.button("Disabled", "", true) }}
```
{% endraw %}

</div>
<div class="code-tabs-panel" data-lang="react">

```jsx
import { Button } from "ui-foundations/react/button";

<Button>Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button startIcon="search">Search</Button>
<Button disabled>Disabled</Button>
```

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
      <tr><td><code>--button-solid-container-background-default</code></td><td>Solid background (default/hover/active base)</td></tr>
      <tr><td><code>--button-solid-container-background-focus</code></td><td>Solid background in focus-visible state</td></tr>
      <tr><td><code>--button-solid-border-color-default</code></td><td>Solid border color (default)</td></tr>
      <tr><td><code>--button-solid-border-color-hover</code></td><td>Solid border color (hover)</td></tr>
      <tr><td><code>--button-solid-border-color-active</code></td><td>Solid border color (active)</td></tr>
      <tr><td><code>--button-solid-border-color-focus</code></td><td>Solid border color (focus-visible)</td></tr>
      <tr><td><code>--button-solid-text-color-default</code></td><td>Solid text color (default/focus)</td></tr>
      <tr><td><code>--button-solid-text-color-hover</code></td><td>Solid text color (hover)</td></tr>
      <tr><td><code>--button-solid-text-color-active</code></td><td>Solid text color (active)</td></tr>
      <tr><td><code>--button-solid-border-size</code></td><td>Solid border width</td></tr>
      <tr><td><code>--button-outline-container-background-default</code></td><td>Outline background (default/hover/active base)</td></tr>
      <tr><td><code>--button-outline-container-background-focus</code></td><td>Outline background in focus-visible state</td></tr>
      <tr><td><code>--button-outline-border-color-default</code></td><td>Outline border color (default)</td></tr>
      <tr><td><code>--button-outline-border-color-hover</code></td><td>Outline border color (hover)</td></tr>
      <tr><td><code>--button-outline-border-color-active</code></td><td>Outline border color (active)</td></tr>
      <tr><td><code>--button-outline-border-color-focus</code></td><td>Outline border color (focus-visible)</td></tr>
      <tr><td><code>--button-outline-text-color-default</code></td><td>Outline text color (default/hover/focus)</td></tr>
      <tr><td><code>--button-outline-text-color-active</code></td><td>Outline text color (active)</td></tr>
      <tr><td><code>--button-outline-border-size</code></td><td>Outline border width</td></tr>
      <tr><td><code>--button-ghost-container-background-default</code></td><td>Ghost background (default/hover/active base)</td></tr>
      <tr><td><code>--button-ghost-container-background-focus</code></td><td>Ghost background in focus-visible state</td></tr>
      <tr><td><code>--button-ghost-border-color-default</code></td><td>Ghost border color (default)</td></tr>
      <tr><td><code>--button-ghost-border-color-hover</code></td><td>Ghost border color (hover)</td></tr>
      <tr><td><code>--button-ghost-border-color-active</code></td><td>Ghost border color (active)</td></tr>
      <tr><td><code>--button-ghost-border-color-focus</code></td><td>Ghost border color (focus-visible)</td></tr>
      <tr><td><code>--button-ghost-text-color-default</code></td><td>Ghost text color (default/hover/focus)</td></tr>
      <tr><td><code>--button-ghost-text-color-active</code></td><td>Ghost text color (active)</td></tr>
      <tr><td><code>--button-ghost-border-size</code></td><td>Ghost border width</td></tr>
      <tr><td><code>--button-overlay-hover</code></td><td>Hover overlay layer</td></tr>
      <tr><td><code>--button-overlay-active</code></td><td>Active overlay layer</td></tr>
      <tr><td><code>--button-padding-inline</code></td><td>Horizontal padding</td></tr>
      <tr><td><code>--button-padding-block</code></td><td>Vertical padding and icon-only inline padding</td></tr>
      <tr><td><code>--button-border-radius</code></td><td>Base corner radius</td></tr>
      <tr><td><code>--button-container-background-disabled</code></td><td>Disabled background</td></tr>
      <tr><td><code>--button-border-color-disabled</code></td><td>Disabled border color</td></tr>
      <tr><td><code>--button-text-color-disabled</code></td><td>Disabled text color</td></tr>
      <tr><td><code>--button-group-gap</code></td><td>Spacing between non-attached grouped buttons</td></tr>
      <tr><td><code>--button-group-border-radius</code></td><td>Corner radius override for attached button groups</td></tr>
      <tr><td><code>--size-spacing-100</code></td><td>Fallback value for group gap</td></tr>
    </tbody>
  </table>
</div>


