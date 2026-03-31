---
layout: layouts/docs.njk
title: Link
description: Inline and standalone link component with token-driven states.
navTitle: Link
order: 60
permalink: /components/link/
---

{% import "macros/ui.njk" as ui %}

<p class="page-intro">Status: <strong>Draft Proposal</strong></p>

## Preview

<div class="docs-stack">
  {{ ui.link("Default link") }}
  {{ ui.link("Hover state", state="hover") }}
  {{ ui.link("Active state", state="active") }}
  {{ ui.link("Visited state", state="visited") }}
  {{ ui.link("Disabled link", disabled=true) }}
</div>

### With Icon

<div class="docs-stack">
  {{ ui.link("Link with leading icon", startIcon="login") }}
  {{ ui.link("Link with trailing icon", endIcon="logout") }}
</div>

## Token Map

| Token | Value |
|---|---|
| `--link-text-color-default` | `var(--color-text-brand)` |
| `--link-text-color-hover` | `var(--color-text-brand)` |
| `--link-text-color-active` | `var(--color-text-brand)` |
| `--link-text-color-visited` | `var(--brand-color-primary-dark)` |
| `--link-text-color-disabled` | `var(--color-text-disabled)` |
| `--link-text-decoration-default` | `underline` |
| `--link-text-decoration-hover` | `none` |
| `--link-gap` | `var(--size-spacing-100)` |

## Usage

<div class="code-tabs">
{% call ui.buttonGroup(true, "horizontal", "start", "Code format", "code-tabs-bar") %}
  {{ ui.toggleButton("HTML", "lang", "html", "outline") }}
  {{ ui.toggleButton("Nunjucks", "lang", "njk", "outline") }}
{% endcall %}
<div class="code-tabs-panel" data-lang="html">

```html
<a href="/page" class="link">Go to page</a>

<a href="/page" class="link">
  <span class="icon" style="--icon-src: url('/assets/icons/login.svg')" aria-hidden="true"></span>
  With icon
</a>

<a class="link" aria-disabled="true">Disabled</a>
```

</div>
<div class="code-tabs-panel" data-lang="njk">

{% raw %}
```njk
{% import "macros/ui.njk" as ui %}

{{ ui.link("Go to page", href="/page") }}
{{ ui.link("With icon", startIcon="login") }}
{{ ui.link("Disabled", disabled=true) }}
```
{% endraw %}

</div>
</div>

## Open Questions

- Should visited state be brand-scoped or use a dedicated semantic token?
- Should there be a `link--subtle` variant with muted color?

## Full Proposal

See [docs/proposals/link-component.md](https://github.com/tbielich/ui-foundations/blob/main/docs/proposals/link-component.md) for the complete implementation plan.
