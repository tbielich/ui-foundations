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
      {{ ui.switch("Notifications", true) }}
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

{% componentTokenTable "src/ui/patterns/switch.css" %}

