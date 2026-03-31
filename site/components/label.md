---
layout: layouts/docs.njk
title: Label
description: Text and icon label primitives for components and form fields.
navTitle: Label
order: 30
permalink: /components/label/
playgroundUrl: /components/label-playground/
playgroundLabel: Open Label Playground
---
{% import "macros/ui.njk" as ui %}


## Preview

<div class="docs-stack" style="line-height: 24px;">
  <span class="label-content">
    <span class="icon" data-slot="start" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
    <span class="label-content__text">Search</span>
  </span>

  <span class="label-content is-icon-only">
    <span class="icon" data-slot="start" style="--icon-src: url('/assets/icons/menu.svg');" aria-hidden="true"></span>
  </span>

  <label class="field-label" for="preview-email">
    <span class="label-content">
      <span class="label-content__text">Email address</span>
    </span>
    <span class="field-label__required" aria-hidden="true">*</span>
    <span class="field-label__required-text"> (required)</span>
  </label>
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
<span class="label-content">
  <span class="icon" data-slot="start" style="--icon-src: url('/assets/icons/search.svg')" aria-hidden="true"></span>
  <span class="label-content__text">Search</span>
</span>

<label class="field-label" for="email">
  <span class="label-content">
    <span class="label-content__text">Email address</span>
  </span>
  <span class="field-label__required" aria-hidden="true">*</span>
  <span class="field-label__required-text"> (required)</span>
</label>
```

</div>
<div class="code-tabs-panel" data-lang="njk">

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.labelContent("Search", startIcon="search") }}
{{ ui.labelContent("Add", endIcon="plus") }}
{{ ui.labelContent(startIcon="menu", iconOnly=true) }}
{{ ui.fieldLabel("Email address", htmlFor="email", required=true) }}
```
{% endraw %}

</div>
<div class="code-tabs-panel" data-lang="react">

{% raw %}
```jsx
import { LabelContent, FieldLabel } from "ui-foundations/react/label";

<LabelContent text="Search" startIcon="search" />
<LabelContent text="Add" endIcon="plus" />
<FieldLabel htmlFor="email" text="Email address" required />
```
{% endraw %}

</div>
</div>

## Notes

- Use `FieldLabel` for inputs/selects/textarea so `htmlFor` links label and field.
- For buttons, use `LabelContent` inside the button content path.
- `Icon` stays decorative by default when passed as `startIcon`/`endIcon`.

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
      <tr><td><code>--label-gap</code></td><td>Spacing between icon and text inside <code>.label-content</code></td></tr>
      <tr><td><code>--field-label-gap</code></td><td>Spacing between label content and required marker</td></tr>
      <tr><td><code>--field-label-line-height</code></td><td>Line-height override for field labels</td></tr>
      <tr><td><code>--field-label-required-color</code></td><td>Color of required marker (<code>*</code>)</td></tr>
    </tbody>
  </table>
</div>

## React exports

- `LabelContent`: visual primitive for text with optional start/end icons
- `FieldLabel`: semantic `<label>` wrapper that composes `LabelContent`
