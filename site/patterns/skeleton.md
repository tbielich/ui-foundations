---
layout: layouts/docs.njk
title: Skeleton
description: Skeletons are loading placeholders that mimic content layout. They use an animated shimmer to indicate progress and are composable for custom layouts.
navTitle: Skeleton
order: 65
permalink: /patterns/skeleton/
playgroundUrl: /patterns/skeleton-playground/
playgroundLabel: Open Skeleton Playground
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
      <div class="uif-skeleton-group" style="inline-size: 100%; max-inline-size: 20rem;">
        <div class="uif-skeleton-group row">
          {{ uif.skeleton(shape="circle") }}
          <div class="uif-skeleton-group" style="flex: 1;">
            {{ uif.skeleton(shape="text", width="medium") }}
            {{ uif.skeleton(shape="text", width="short") }}
          </div>
        </div>
        {{ uif.skeleton(shape="rect") }}
        {{ uif.skeleton(shape="text") }}
        {{ uif.skeleton(shape="text", width="medium") }}
      </div>
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
    {% if figmaConnections and figmaConnections.urlsByName and figmaConnections.urlsByName[page.fileSlug] %}
    <a class="docs-page-link" href="{{ figmaConnections.urlsByName[page.fileSlug] }}" target="_blank" rel="noopener noreferrer">Open in Figma</a>
    {% endif %}
  </div>
</div>

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject" style="inline-size: 100%; max-inline-size: 16rem;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      {{ uif.skeleton(shape="text") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Skeleton — animated fill that mimics a content region</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Shapes

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ uif.skeleton(shape="text") }}</div>
    <span class="docs-states-grid-item-label">Text</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ uif.skeleton(shape="heading") }}</div>
    <span class="docs-states-grid-item-label">Heading</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.skeleton(shape="circle") }}</div>
    <span class="docs-states-grid-item-label">Circle</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ uif.skeleton(shape="rect", size="sm") }}</div>
    <span class="docs-states-grid-item-label">Rectangle</span>
  </div>
</div>

### Text width

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ uif.skeleton(shape="text") }}</div>
    <span class="docs-states-grid-item-label">Full (default)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ uif.skeleton(shape="text", width="medium") }}</div>
    <span class="docs-states-grid-item-label">Medium (80%)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ uif.skeleton(shape="text", width="short") }}</div>
    <span class="docs-states-grid-item-label">Short (60%)</span>
  </div>
</div>

### Sizes

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.skeleton(shape="circle", size="sm") }}</div>
    <span class="docs-states-grid-item-label">Small</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.skeleton(shape="circle") }}</div>
    <span class="docs-states-grid-item-label">Medium (default)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.skeleton(shape="circle", size="lg") }}</div>
    <span class="docs-states-grid-item-label">Large</span>
  </div>
</div>

### Animation

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ uif.skeleton(shape="text") }}</div>
    <span class="docs-states-grid-item-label">Shimmer (default)</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">{{ uif.skeleton(shape="text", animated=false) }}</div>
    <span class="docs-states-grid-item-label">Static (no animation)</span>
  </div>
</div>

<h2 id="composable-layouts">Composable layouts</h2>

Use the `.uif-skeleton-group` wrapper to compose custom skeleton layouts. The `row` modifier arranges children horizontally.

<div class="docs-states-grid" style="--docs-states-cols: 1">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">
      <div class="uif-skeleton-group" style="inline-size: 100%; max-inline-size: 20rem;">
        <div class="uif-skeleton-group row">
          {{ uif.skeleton(shape="circle") }}
          <div class="uif-skeleton-group" style="flex: 1;">
            {{ uif.skeleton(shape="text", width="medium") }}
            {{ uif.skeleton(shape="text", width="short") }}
          </div>
        </div>
        {{ uif.skeleton(shape="rect", size="sm") }}
        {{ uif.skeleton(shape="text") }}
        {{ uif.skeleton(shape="text", width="medium") }}
        {{ uif.skeleton(shape="text", width="short") }}
      </div>
    </div>
    <span class="docs-states-grid-item-label">Card layout</span>
  </div>
</div>

<h2 id="code">Code</h2>

### CSS pattern

```html
<!-- Text line -->
<span class="uif-skeleton text" role="status" aria-label="Loading…" aria-busy="true"></span>

<!-- Heading -->
<span class="uif-skeleton heading" role="status" aria-label="Loading…" aria-busy="true"></span>

<!-- Circle -->
<span class="uif-skeleton circle" role="status" aria-label="Loading…" aria-busy="true"></span>

<!-- Rectangle -->
<span class="uif-skeleton rect" role="status" aria-label="Loading…" aria-busy="true"></span>

<!-- No animation -->
<span class="uif-skeleton text no-animation" role="status" aria-label="Loading…" aria-busy="true"></span>

<!-- Composable group -->
<div class="uif-skeleton-group">
  <div class="uif-skeleton-group row">
    <span class="uif-skeleton circle" role="status" aria-label="Loading…" aria-busy="true"></span>
    <div class="uif-skeleton-group" style="flex: 1;">
      <span class="uif-skeleton text medium" role="status" aria-label="Loading…" aria-busy="true"></span>
      <span class="uif-skeleton text short" role="status" aria-label="Loading…" aria-busy="true"></span>
    </div>
  </div>
</div>
```

### Web Component

```html
<uif-skeleton shape="text"></uif-skeleton>
<uif-skeleton shape="circle" size="lg"></uif-skeleton>
<uif-skeleton shape="rect" size="sm"></uif-skeleton>
<uif-skeleton shape="text" width="short" animated="false"></uif-skeleton>
```

<h2 id="tokens">Component tokens</h2>

| Token | Description |
|---|---|
| `--uif-skeleton-background` | Base fill color |
| `--uif-skeleton-background-highlight` | Shimmer highlight color |
| `--uif-skeleton-border-radius` | Corner radius |
| `--uif-skeleton-text-height` | Height of text line variants |
| `--uif-skeleton-heading-height` | Height of heading variant |
| `--uif-skeleton-circle-size` | Diameter for circle shape |
| `--uif-skeleton-rect-height` | Height for rectangle shape |
| `--uif-skeleton-animation-duration` | Shimmer animation duration |
| `--uif-skeleton-group-gap` | Gap in `.uif-skeleton-group` |

<h2 id="accessibility">Accessibility</h2>

Each skeleton element should carry `role="status"`, `aria-label="Loading…"`, and `aria-busy="true"` so assistive technologies announce the loading state. Remove these attributes (or the entire skeleton markup) once content has loaded.
