---
layout: layouts/docs.njk
title: Inline Alert
description: Inline contextual messages for informing users within content flow. Use to communicate status, errors, warnings, or confirmations without blocking the page.
navTitle: Inline Alert
order: 22
permalink: /patterns/inline-alert/
playgroundUrl: /patterns/inline-alert-playground/
playgroundLabel: Open Inline Alert Playground
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
    <div class="docs-hero-preview-stage" style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
      {{ uif.inlineAlert(title="Information", description="Here is some helpful information for you.", variant="info") }}
      {{ uif.inlineAlert(title="Success", description="Your changes have been saved.", variant="positive") }}
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
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 10%; ">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 40%;">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 70%;">
        <span class="docs-anatomy-badge">3</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      {{ uif.inlineAlert(title="Title", description="Description text here.", variant="info", dismissible=true) }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Icon — decorative indicator for the variant</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Content — title and optional description text</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Dismiss button — optional; removes the alert</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Variants

<div class="docs-states-grid" style="--docs-states-cols: 1">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.inlineAlert(title="Default", description="A neutral message with no specific status.", variant="") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.inlineAlert(title="Information", description="Here is some helpful context.", variant="info") }}</div>
    <span class="docs-states-grid-item-label">Info</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.inlineAlert(title="Success", description="Your action completed successfully.", variant="positive") }}</div>
    <span class="docs-states-grid-item-label">Positive</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.inlineAlert(title="Error", description="Something went wrong. Please try again.", variant="negative") }}</div>
    <span class="docs-states-grid-item-label">Negative</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.inlineAlert(title="Notice", description="Please review the following before proceeding.", variant="notice") }}</div>
    <span class="docs-states-grid-item-label">Notice</span>
  </div>
</div>

### Dismissible

<div class="docs-states-grid" style="--docs-states-cols: 1">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.inlineAlert(title="Dismissible alert", description="You can dismiss this message.", variant="info", dismissible=true) }}</div>
    <span class="docs-states-grid-item-label">With dismiss button</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>title</td><td>text</td><td>—</td></tr>
    <tr><td>description</td><td>text</td><td>—</td></tr>
    <tr><td>variant</td><td><code>default</code> / <code>info</code> / <code>positive</code> / <code>negative</code> / <code>notice</code></td><td><code>default</code></td></tr>
    <tr><td>icon</td><td>icon name</td><td>variant-appropriate icon</td></tr>
    <tr><td>dismissible</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.inlineAlert(title="Dismissible", description="Click the × to remove this alert.", variant="info", dismissible=true) }}</div>
    <div class="docs-behavior-body">
      <h3>Dismiss</h3>
      <p>When <code>dismissible</code> is true, a close button appears. Clicking it hides the alert by adding the <code>is-hidden</code> class. The Web Component fires a <code>uif-dismiss</code> event.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ uif.inlineAlert(title="Title only", variant="positive") }}</div>
    <div class="docs-behavior-body">
      <h3>Title-only mode</h3>
      <p>The description is optional. When omitted, the title occupies the full content area.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Choose the right variant

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">{{ uif.inlineAlert(title="Booking confirmed", description="Your reservation has been saved.", variant="positive") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use <code>positive</code> for confirmed actions or successful outcomes.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">{{ uif.inlineAlert(title="Booking confirmed", description="Your reservation has been saved.", variant="negative") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use <code>negative</code> for success states — it signals an error.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Keep titles short (3–7 words). Use sentence case.
- Descriptions should be concise, actionable, and in plain language.
- Avoid duplicating title content in the description.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

| Key | Action |
|-----|--------|
| <kbd>Tab</kbd> | Moves focus to the dismiss button (when present) |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the dismiss button |

<h2 id="accessibility">Accessibility</h2>

- Container uses `role="alert"` so assistive technologies announce the message on insertion.
- Icons are decorative (`aria-hidden="true"`).
- The dismiss button has an explicit `aria-label="Dismiss"`.
- Color is not the only means of conveying variant meaning; icons provide a second cue.

<h2 id="theming">Theming</h2>

Inline Alert adapts across brands and modes through semantic tokens. Use the hero switches above.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="component-tokens">Component tokens</h2>

| Token | Description |
|-------|-------------|
| `--uif-inline-alert-default-container-background` | Default variant background |
| `--uif-inline-alert-default-border-color` | Default variant border |
| `--uif-inline-alert-default-text-color` | Default variant text |
| `--uif-inline-alert-info-container-background` | Info variant background |
| `--uif-inline-alert-info-border-color` | Info variant border |
| `--uif-inline-alert-info-text-color` | Info variant text |
| `--uif-inline-alert-positive-container-background` | Positive variant background |
| `--uif-inline-alert-positive-border-color` | Positive variant border |
| `--uif-inline-alert-positive-text-color` | Positive variant text |
| `--uif-inline-alert-negative-container-background` | Negative variant background |
| `--uif-inline-alert-negative-border-color` | Negative variant border |
| `--uif-inline-alert-negative-text-color` | Negative variant text |
| `--uif-inline-alert-notice-container-background` | Notice variant background |
| `--uif-inline-alert-notice-border-color` | Notice variant border |
| `--uif-inline-alert-notice-text-color` | Notice variant text |
| `--uif-inline-alert-border-size` | Border width |
| `--uif-inline-alert-border-radius` | Corner radius |
| `--uif-inline-alert-padding-inline` | Horizontal padding |
| `--uif-inline-alert-padding-block` | Vertical padding |
| `--uif-inline-alert-gap` | Gap between icon and content |

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Icons provide a second cue alongside color (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible role</strong><span>role="alert" announced to assistive technologies.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Variant, dismissible, icon documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Variant selection do/don't provided.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes as tokens.</span></div></div>
</div>
