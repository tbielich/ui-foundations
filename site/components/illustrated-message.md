---
layout: layouts/docs.njk
title: Illustrated Message
description: Empty, error, and no-results messaging with an illustration, supporting text, and an optional action.
navTitle: Illustrated Message
order: 19
permalink: /components/illustrated-message/
playgroundUrl: /components/illustrated-message-playground/
playgroundLabel: Open Illustrated Message Playground
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
    <div class="docs-hero-preview-stage">
      {{ uif.illustratedMessage(preset="empty", actionLabel="Create item") }}
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
      {{ uif.illustratedMessage(preset="empty", actionLabel="Create item") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Illustration — visual slot for an icon, SVG, or decorative asset</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Content — heading and supporting description</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Actions — optional primary next step</li>
  </ol>
</div>

<h2 id="presets">Presets</h2>

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.illustratedMessage(preset="empty", actionLabel="Create item") }}</div>
    <span class="docs-states-grid-item-label">Empty</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.illustratedMessage(preset="error", actionLabel="Try again") }}</div>
    <span class="docs-states-grid-item-label">Error</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.illustratedMessage(preset="no-results", actionLabel="Clear filters", actionVariant="outline") }}</div>
    <span class="docs-states-grid-item-label">No results</span>
  </div>
</div>

<h2 id="options">Options</h2>

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>preset</td><td><code>empty</code> / <code>error</code> / <code>no-results</code></td><td><code>empty</code></td></tr>
    <tr><td>heading</td><td>text</td><td>Preset-specific</td></tr>
    <tr><td>description</td><td>text</td><td>Preset-specific</td></tr>
    <tr><td>illustrationIcon</td><td>icon name</td><td>Preset-specific</td></tr>
    <tr><td>actionLabel</td><td>text</td><td>—</td></tr>
    <tr><td>actionHref</td><td>URL</td><td>—</td></tr>
    <tr><td>actionVariant</td><td><code>solid</code> / <code>outline</code> / <code>ghost</code></td><td><code>solid</code></td></tr>
  </tbody>
</table>

<h2 id="custom-illustration">Custom illustration slot</h2>

<p>Supply custom markup in the illustration region when an icon is not enough.</p>

```html
<uif-illustrated-message heading="Invite your team" description="Add collaborators to start working together.">
  <span slot="illustration" class="uif-avatar xl" role="img" aria-label="Team">
    <span class="uif-avatar-initials">UI</span>
  </span>
  <a slot="action" class="uif-button solid" href="/invite">Invite teammates</a>
</uif-illustrated-message>
```

<h2 id="accessibility">Accessibility</h2>

- Treat illustrations as decorative unless they communicate unique meaning.
- Keep the heading concise and the description actionable.
- Include a single clear action when the user can recover immediately.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Preset coverage</strong><span>Includes empty, error, and no-results defaults.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Flexible illustration slot</strong><span>Supports icons by default and custom illustration markup when needed.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-illustrated-message-*</code>).</span></div></div>
</div>
