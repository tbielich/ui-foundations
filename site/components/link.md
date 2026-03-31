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
  <a href="#" class="link">Default link</a>
  <a href="#" class="link is-hover">Hover state</a>
  <a href="#" class="link is-active">Active state</a>
  <a href="#" class="link is-visited">Visited state</a>
  <a href="#" class="link is-disabled" aria-disabled="true">Disabled link</a>
</div>

### With Icon

<div class="docs-stack">
  <a href="#" class="link">
    <span class="icon" style="--icon-src: url('/assets/icons/login.svg');" aria-hidden="true"></span>
    Link with leading icon
  </a>
  <a href="#" class="link">
    Link with trailing icon
    <span class="icon" style="--icon-src: url('/assets/icons/logout.svg');" aria-hidden="true"></span>
  </a>
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

```html
<a href="/page" class="link">Go to page</a>
```

With icon:

```html
<a href="/page" class="link">
  <span class="icon" style="--icon-src: url('/assets/icons/login.svg')" aria-hidden="true"></span>
  Go to page
</a>
```

Disabled:

```html
<a class="link" aria-disabled="true">Unavailable</a>
```

## Open Questions

- Should visited state be brand-scoped or use a dedicated semantic token?
- Should there be a `link--subtle` variant with muted color?

## Full Proposal

See [docs/proposals/link-component.md](https://github.com/tbielich/ui-foundations/blob/main/docs/proposals/link-component.md) for the complete implementation plan.
