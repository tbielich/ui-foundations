---
layout: layouts/docs.njk
title: Icon
description: Primitive for SVG icons from `src/assets/icons`.
navTitle: Icon
order: 20
permalink: /components/icon/
playgroundUrl: /components/icon-playground/
playgroundLabel: Open Icon Playground
---

## Preview

<div class="docs-stack" style="line-height: 24px;">
  <span class="icon" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
  <span class="icon" style="--icon-src: url('/assets/icons/menu.svg'); color: #0057b8;" aria-hidden="true"></span>
  <span class="icon" style="--icon-src: url('/assets/icons/plus.svg'); color: #d81b60;" aria-hidden="true"></span>
</div>

## Usage

### SSG / Nunjucks

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.icon("search") }}
{{ ui.icon("menu", "Open menu") }}
```
{% endraw %}

### HTML

```html
<span
  class="icon"
  style="--icon-src: url('/assets/icons/search.svg')"
  aria-hidden="true"
></span>
```

### React

{% raw %}
```jsx
import { Icon } from "ui-foundations/react/icon";

<Icon name="search" />
<Icon name="search" label="Search" decorative={false} />
<Icon src="/assets/icons/search.svg" />
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
      <tr><td><code>--icon-src</code></td><td>Mask image source URL for the icon glyph</td></tr>
    </tbody>
  </table>
</div>

## React props

- `name` (required without `src`): icon filename without `.svg`
- `src` (optional): direct icon URL instead of `name` + `folder`
- `label` (optional): accessible name for non-decorative icons
- `decorative` (optional): defaults to `true` when no label is set
- `folder` (optional): asset subfolder under `assets/` (default: `icons`)
- Size behavior: icon is square and follows the inherited `line-height` of the parent element (for example, `24px` -> `24x24`)
