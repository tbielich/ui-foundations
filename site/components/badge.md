---
layout: layouts/docs.njk
title: Badge
description: Small pill-shaped label for status, counts, or highlights.
navTitle: Badge
order: 15
permalink: /components/badge/
playgroundUrl: /components/badge-playground/
playgroundLabel: Open Badge Playground
---
{% import "macros/ui.njk" as ui %}

<div class="docs-hero">
  <div class="docs-hero-preview">
    {{ ui.badge("Default") }}
    {{ ui.badge("Brand", variant="brand") }}
    {{ ui.badge("Success", variant="success") }}
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
  {{ ui.badge("Default") }}
  {{ ui.badge("Brand", variant="brand") }}
  {{ ui.badge("Success", variant="success") }}
  {{ ui.badge("Danger", variant="danger") }}
  {{ ui.badge("Small", size="sm") }}
  {{ ui.badge("With Icon", variant="brand", startIcon="star") }}
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
<span class="badge">
  <span class="badge__text">Default</span>
</span>

<span class="badge brand">
  <span class="badge__text">Brand</span>
</span>

<span class="badge success sm">
  <span class="badge__text">New</span>
</span>

<span class="badge danger">
  <span class="badge__text">3</span>
</span>
```

</div>
<div class="code-tabs-panel" data-lang="njk">

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.badge("Default") }}
{{ ui.badge("Brand", variant="brand") }}
{{ ui.badge("New", variant="success", size="sm") }}
{{ ui.badge("3", variant="danger") }}
{{ ui.badge("Featured", variant="brand", startIcon="star") }}
```
{% endraw %}

</div>
<div class="code-tabs-panel" data-lang="react">

{% raw %}
```jsx
import { Badge } from "ui-foundations/react/badge";

<Badge text="Default" />
<Badge text="Brand" variant="brand" />
<Badge text="New" variant="success" size="sm" />
<Badge text="3" variant="danger" />
<Badge text="Featured" variant="brand" startIcon="star" />
```
{% endraw %}

</div>
</div>

## Variants

| Variant   | Class     | Purpose                          |
|-----------|-----------|----------------------------------|
| default   | `.badge`  | Subtle background, default text  |
| brand     | `.brand`  | Brand fill, inverse text         |
| success   | `.success`| Success fill, inverse text       |
| danger    | `.danger` | Danger fill, inverse text        |

## Sizes

| Size | Class | Font size | Padding |
|------|-------|-----------|---------|
| md   | —     | `--badge-font-size-md` | `--badge-padding-inline-md` / `--badge-padding-block-md` |
| sm   | `.sm` | `--badge-font-size-sm` | `--badge-padding-inline-sm` / `--badge-padding-block-sm` |

## Notes

- Badge is non-interactive. For clickable status labels, compose with a link or button.
- Use `startIcon` for a leading decorative icon via the Icon component.
- All colors adapt to brand and mode through semantic tokens.

## Used tokens

{% componentTokenTable "src/ui/patterns/badge.css" %}

## React exports

- `Badge`: pill-shaped status label with variant, size, and optional icon
