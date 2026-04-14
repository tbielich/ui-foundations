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

{% componentTokenTable "src/ui/patterns/button.css" %}

