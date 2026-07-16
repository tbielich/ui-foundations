---
layout: layouts/docs.njk
title: Avatar
description: Thumbnail representation of a user or entity. Supports images and initials fallback with multiple sizes.
navTitle: Avatar
order: 18
permalink: /patterns/avatar/
playgroundUrl: /patterns/avatar-playground/
playgroundLabel: Open Avatar Playground
---
{% import "macros/ui.njk" as uif %}

<div class="docs-hero">
  <div class="docs-hero-preview">
    <div class="docs-hero-preview-controls">
      <span class="docs-hero-switch" data-hero-group="brand">
        <button type="button" data-hero-brand="a" aria-pressed="true">Brand A</button>
        <button type="button" data-hero-brand="b" aria-pressed="false">Brand B</button>
        <button type="button" data-hero-brand="c" aria-pressed="false">Brand C</button>
      </span>
      <span class="docs-hero-switch" data-hero-group="mode">
        <button type="button" data-hero-mode="light" aria-pressed="true">Light</button>
        <button type="button" data-hero-mode="dark" aria-pressed="false">Dark</button>
      </span>
    </div>
    <div class="docs-hero-preview-stage" style="display: flex; gap: 1rem; align-items: center;">
      {{ uif.avatar(initials="XS", size="xs") }}
      {{ uif.avatar(initials="SM", size="sm") }}
      {{ uif.avatar(initials="TB", alt="Thomas Bielich") }}
      {{ uif.avatar(initials="LG", size="lg") }}
      {{ uif.avatar(initials="XL", size="xl") }}
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      {{ uif.avatar(initials="TB", alt="Thomas Bielich") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Container — circular shape with image or initials</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Sizes

<div class="docs-states-grid" style="--docs-states-cols: 5">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.avatar(initials="XS", size="xs") }}</div>
    <span class="docs-states-grid-item-label">XS (24px)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.avatar(initials="SM", size="sm") }}</div>
    <span class="docs-states-grid-item-label">SM (32px)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.avatar(initials="MD") }}</div>
    <span class="docs-states-grid-item-label">MD (40px)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.avatar(initials="LG", size="lg") }}</div>
    <span class="docs-states-grid-item-label">LG (48px)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.avatar(initials="XL", size="xl") }}</div>
    <span class="docs-states-grid-item-label">XL (64px)</span>
  </div>
</div>

### Content types

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.avatar(initials="TB", alt="Thomas Bielich") }}</div>
    <span class="docs-states-grid-item-label">Initials</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.avatar(src="https://i.pravatar.cc/80", alt="User photo") }}</div>
    <span class="docs-states-grid-item-label">Image</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>src</td><td>image URL</td><td>—</td></tr>
    <tr><td>alt</td><td>text</td><td>—</td></tr>
    <tr><td>initials</td><td>1–2 characters</td><td>—</td></tr>
    <tr><td>size</td><td><code>xs</code> / <code>sm</code> / <code>md</code> / <code>lg</code> / <code>xl</code></td><td><code>md</code></td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Uses `role="img"` with `aria-label` for the accessible name.
- Image avatars include `alt` text on the `<img>` element.
- Initials are decorative — the `aria-label` on the container provides the accessible name.

<h2 id="v1-naming-migration">v1 naming migration</h2>

Avatar emitters produce the canonical `.uif-avatar` and `.uif-avatar-initials` classes. The legacy `.avatar` and `.avatar-initials` selectors remain supported during the v1 compatibility period. Component token slots use `--uif-avatar-*`; library-owned legacy `--avatar-*` token aliases are not provided. The Custom Element now registers as `<uif-avatar>`; its existing module filename and package export remain unchanged.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Sizes and content types documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-avatar-*</code>).</span></div></div>
</div>
