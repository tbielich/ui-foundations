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

<div class="docs-hero">
  <div class="docs-hero-preview">
    <div class="docs-hero-preview-controls">
      <span class="docs-hero-switch" data-hero-group="brand">
        <button type="button" data-hero-brand="a" aria-pressed="true">Brand A</button>
        <button type="button" data-hero-brand="b" aria-pressed="false">Brand B</button>
      </span>
      <span class="docs-hero-switch" data-hero-group="mode">
        <button type="button" data-hero-mode="light" aria-pressed="true">Light</button>
        <button type="button" data-hero-mode="dark" aria-pressed="false">Dark</button>
      </span>
    </div>
    <div class="docs-hero-preview-stage">
      {{ ui.checkbox("Accept terms", true) }}
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
    {% if figmaConnections and figmaConnections.urlsByName and figmaConnections.urlsByName[page.fileSlug] %}
    <a class="docs-page-link" href="{{ figmaConnections.urlsByName[page.fileSlug] }}" target="_blank" rel="noopener noreferrer">Open in Figma</a>
    {% endif %}
  </div>
</div>

## Preview

<div class="docs-stack">
  {{ ui.checkbox("Accept terms") }}
  {{ ui.checkbox("Receive updates", true) }}
  {{ ui.checkbox("Partially selected", false, false, "indeterminate") }}
  {{ ui.checkbox("Disabled option", false, true) }}
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
<label class="checkbox-field">
  <input class="checkbox" type="checkbox" />
  <span class="checkbox-field__text">Accept terms</span>
</label>
```

</div>
<div class="code-tabs-panel" data-lang="njk">

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.checkbox("Accept terms") }}
{{ ui.checkbox("Receive updates", true) }}
{{ ui.checkbox("Partially selected", false, false, "indeterminate") }}
{{ ui.checkbox("Disabled option", false, true) }}
```
{% endraw %}

</div>
<div class="code-tabs-panel" data-lang="react">

{% raw %}
```jsx
import { Checkbox } from "ui-foundations/react";

<Checkbox label="Accept terms" />
<Checkbox defaultChecked label="Receive updates" />
<Checkbox indeterminate label="Partially selected" />
<Checkbox disabled label="Disabled option" />
```
{% endraw %}

</div>
</div>

## Used tokens

{% componentTokenTable "src/ui/patterns/checkbox.css" %}
