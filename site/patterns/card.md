---
layout: layouts/docs.njk
title: Card
description: Content container for grouping related information. Supports image/media slots, header/body/footer structure, interactive (clickable) and horizontal layouts, and a selection state.
navTitle: Card
order: 21
permalink: /patterns/card/
playgroundUrl: /patterns/card-playground/
playgroundLabel: Open Card Playground
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
    <div class="docs-hero-preview-stage" style="inline-size: 100%; max-inline-size: 22rem;">
      {% call uif.card() %}
        {% call uif.cardHeader() %}<strong>Card title</strong>{% endcall %}
        {% call uif.cardBody() %}<p>A short description of the card content goes here.</p>{% endcall %}
        {% call uif.cardFooter() %}{{ uif.button("Action", variant="solid") }}{% endcall %}
      {% endcall %}
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
    <div class="docs-anatomy-subject" style="inline-size: 100%; max-inline-size: 22rem;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 30%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 58%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 90%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">4</span>
      </span>
      {% call uif.card() %}
        {% call uif.cardMedia() %}<div style="background: var(--color-fill-subtle); block-size: 8rem;"></div>{% endcall %}
        {% call uif.cardHeader() %}<strong>Card title</strong>{% endcall %}
        {% call uif.cardBody() %}<p>Card body text.</p>{% endcall %}
        {% call uif.cardFooter() %}{{ uif.button("Action") }}{% endcall %}
      {% endcall %}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Media slot — image or arbitrary media content</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Header — title and optional metadata</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Body — description or primary content</li>
    <li><span class="docs-anatomy-badge-inline">4</span> Footer — actions or supplemental information</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Layout

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item" style="align-items: stretch;">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%; max-inline-size: 18rem;">
      {% call uif.card() %}
        {% call uif.cardHeader() %}<strong>Vertical</strong>{% endcall %}
        {% call uif.cardBody() %}<p>Default stacked layout.</p>{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Vertical (default)</span>
  </div>
  <div class="docs-states-grid-item" style="align-items: stretch;">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%;">
      {% call uif.card(layout="horizontal") %}
        {% call uif.cardMedia() %}<div style="background: var(--color-fill-subtle); inline-size: 6rem; block-size: 100%;"></div>{% endcall %}
        {% call uif.cardBody() %}<strong>Horizontal</strong><p>Side-by-side media and content.</p>{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Horizontal</span>
  </div>
</div>

### Interactive

<div class="docs-states-grid" style="--docs-states-cols: 3">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%; max-inline-size: 16rem;">
      {% call uif.card(interactive=true) %}
        {% call uif.cardHeader() %}<strong>Default</strong>{% endcall %}
        {% call uif.cardBody() %}<p>Clickable card.</p>{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%; max-inline-size: 16rem;">
      {% call uif.card(interactive=true, className="is-hover") %}
        {% call uif.cardHeader() %}<strong>Hover</strong>{% endcall %}
        {% call uif.cardBody() %}<p>Hover state.</p>{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview" style="inline-size: 100%; max-inline-size: 16rem;">
      {% call uif.card(interactive=true, selected=true) %}
        {% call uif.cardHeader() %}<strong>Selected</strong>{% endcall %}
        {% call uif.cardBody() %}<p>Selection state.</p>{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Selected</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>layout</td><td><code>vertical</code> / <code>horizontal</code></td><td><code>vertical</code></td></tr>
    <tr><td>interactive</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>selected</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>href</td><td>URL / none</td><td>none</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%; max-inline-size: 18rem;">
      {% call uif.card(interactive=true, href="#") %}
        {% call uif.cardHeader() %}<strong>Link card</strong>{% endcall %}
        {% call uif.cardBody() %}<p>When <code>href</code> is set, the card renders as an <code>&lt;a&gt;</code> element.</p>{% endcall %}
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>Link variant</h3>
      <p>When <code>href</code> is provided the card renders as an <code>&lt;a&gt;</code> element, making the entire surface navigable. Combine with <code>interactive</code> for hover/active styles.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview" style="inline-size: 100%; max-inline-size: 18rem;">
      {% call uif.card(interactive=true, selected=true) %}
        {% call uif.cardHeader() %}<strong>Selected card</strong>{% endcall %}
        {% call uif.cardBody() %}<p>The border weight increases on the selected side to indicate state.</p>{% endcall %}
      {% endcall %}
    </div>
    <div class="docs-behavior-body">
      <h3>Selection</h3>
      <p>Adding <code>is-selected</code> / <code>selected</code> highlights the card border with the brand selection color and increases the border weight. Use in card-picker or grid-selection patterns.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Use slots consistently

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview" style="inline-size: 100%; max-inline-size: 18rem;">
      {% call uif.card() %}
        {% call uif.cardHeader() %}<strong>Title</strong>{% endcall %}
        {% call uif.cardBody() %}<p>Description that supports the title.</p>{% endcall %}
        {% call uif.cardFooter() %}{{ uif.button("Action") }}{% endcall %}
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use the header for the title, body for supporting content, and footer for actions.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview" style="inline-size: 100%; max-inline-size: 18rem;">
      {% call uif.card() %}
        {% call uif.cardBody() %}<strong>Title in body</strong><p>Description and <a href="#">action link</a> mixed in body.</p>{% endcall %}
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't place titles and actions in the body. Use dedicated slots for predictable layout.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Keep card titles short — 1–5 words.
- Body copy should support but not repeat the title.
- Footer actions use the button component; limit to 1–2 actions.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus to the interactive card</td></tr>
    <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd></td><td>Activates the card (for link or button-role cards)</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Non-interactive cards use `<article>` — a landmark element that can be navigated by screen readers.
- Interactive cards add `tabindex="0"` for keyboard focus; link cards use `<a>` for native keyboard support.
- `is-selected` cards include `aria-selected="true"` to convey state to assistive technologies.
- Media images must have meaningful `alt` text; decorative images should use `alt=""`.

<h2 id="theming">Theming</h2>

Card adapts across brands and modes through semantic tokens. Use the hero switches above.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Image/media slot</strong><span>Dedicated media slot with responsive image sizing.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Header/body/footer structure</strong><span>Semantic slot system for predictable layout.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Interactive variant</strong><span>Hover, active, and focus states for clickable cards.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Layouts</strong><span>Vertical (default) and horizontal orientations.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Selection state</strong><span>Brand-colored border and aria-selected for selected cards.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard accessible</strong><span>Tab, Enter, and Space interactions documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes as component-scoped tokens (<code>--uif-card-*</code>).</span></div></div>
</div>
