---
layout: layouts/docs.njk
title: Icon
description: Icons communicate meaning through simple, recognizable symbols. They reinforce labels, indicate actions, and provide visual cues that reduce cognitive load.
navTitle: Icon
order: 20
permalink: /components/icon/
playgroundUrl: /components/icon-playground/
playgroundLabel: Open Icon Playground
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
      <span class="icon" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
      <span class="icon" style="--icon-src: url('/assets/icons/menu.svg');" aria-hidden="true"></span>
      <span class="icon" style="--icon-src: url('/assets/icons/plus.svg');" aria-hidden="true"></span>
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

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="icon" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Icon element — square, inherits color from <code>currentColor</code> and size from parent <code>line-height</code></li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Decorative vs. meaningful

Most icons are decorative — they sit next to a visible text label and are hidden
from assistive technology with `aria-hidden="true"`. When an icon is the only
content (no adjacent label), it must have an accessible name via `aria-label`.

<div class="docs-stack docs-icon-line-height">
  <span class="icon" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
  <span class="icon docs-icon-color-brand" style="--icon-src: url('/assets/icons/star.svg');" aria-hidden="true"></span>
  <span class="icon docs-icon-color-danger" style="--icon-src: url('/assets/icons/login.svg');" aria-hidden="true"></span>
</div>

### Color

Icons inherit `currentColor` by default. Apply semantic color tokens through the
parent element or a utility class to change the icon color. Never hardcode hex
values on icons.

### Size

Icon size is controlled by the parent's `line-height`. A parent with
`line-height: 24px` produces a 24×24 icon. No explicit width or height is
needed.

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td><code>--icon-src</code></td><td>icon URL path</td><td>—</td></tr>
    <tr><td>color</td><td>Inherited from <code>currentColor</code></td><td>parent text color</td></tr>
    <tr><td>size</td><td>Inherited from parent <code>line-height</code></td><td><code>1lh</code></td></tr>
    <tr><td><code>aria-hidden</code></td><td><code>true</code> (decorative) / omitted (meaningful)</td><td><code>true</code></td></tr>
    <tr><td><code>aria-label</code></td><td>text (meaningful icons only)</td><td>—</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <span class="icon" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
    </div>
    <div class="docs-behavior-body">
      <h3>Color inheritance</h3>
      <p>The icon uses <code>currentColor</code> as its fill. Changing the parent's <code>color</code> property or applying a semantic token class changes the icon color automatically.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview docs-icon-line-height">
      <span class="icon" style="--icon-src: url('/assets/icons/star.svg');" aria-hidden="true"></span>
    </div>
    <div class="docs-behavior-body">
      <h3>Size from line-height</h3>
      <p>The icon is always square and matches the inherited <code>line-height</code> of its parent. A 24px line-height produces a 24×24 icon. No explicit dimensions are needed.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <span class="icon" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
      <span>Search</span>
    </div>
    <div class="docs-behavior-body">
      <h3>Inline alignment</h3>
      <p>Icons use <code>vertical-align: middle</code> to sit on the text baseline. They align naturally next to text in buttons, labels, and links without extra positioning.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <span class="icon" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
    </div>
    <div class="docs-behavior-body">
      <h3>CSS mask rendering</h3>
      <p>The SVG is applied as a CSS <code>mask-image</code>, not as an inline SVG or <code>&lt;img&gt;</code>. This allows color control via <code>currentColor</code> and avoids DOM bloat from inline SVG markup.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Use icons to reinforce, not replace, labels

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <span class="label-content"><span class="icon" data-slot="start" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span><span class="label-content__text">Search</span></span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Pair icons with visible text labels so the meaning is clear to all users.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <span class="icon" style="--icon-src: url('/assets/icons/search.svg');" aria-hidden="true"></span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use a standalone icon without an accessible name — screen readers will skip it entirely.</p>
    </div>
  </div>
</div>

### Use semantic color tokens for icon color

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <span class="icon docs-icon-color-brand" style="--icon-src: url('/assets/icons/star.svg');" aria-hidden="true"></span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use semantic tokens like <code>--color-text-brand</code> or <code>--color-text-success</code> to color icons.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <span class="icon docs-dont-custom-color" style="--icon-src: url('/assets/icons/star.svg');" aria-hidden="true"></span>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't hardcode hex colors on icons — they won't adapt across brands and modes.</p>
    </div>
  </div>
</div>

### Mark decorative icons correctly

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <code>aria-hidden="true"</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Add <code>aria-hidden="true"</code> to decorative icons that sit next to a text label.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <code>aria-label="Search"</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't add an accessible name to a decorative icon — it creates duplicate announcements for screen reader users.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

### Accessible names for meaningful icons

When an icon is the only interactive content (e.g. an icon-only button), provide
a concise `aria-label` that describes the action, not the icon shape.

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <code>aria-label="Close dialog"</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Describe the action the icon triggers.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <code>aria-label="X icon"</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't describe the visual shape — users need to know what it does, not what it looks like.</p>
    </div>
  </div>
</div>

### Icon file naming

Icon SVG files use kebab-case names that describe the concept, not the visual
form: `checkmark.svg`, `arrow-right.svg`, `luggage-trolley.svg`.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

Icons are not interactive on their own. Keyboard interactions are handled by the
parent component (button, link, or other control) that contains the icon.

<table class="docs-keyboard-table">
  <thead>
    <tr><th>Key</th><th>Interaction</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><kbd>Tab</kbd></td>
      <td>Icons are not focusable. Focus moves to the parent interactive element.</td>
    </tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Decorative icons must have `aria-hidden="true"` to be skipped by screen
  readers.
- Meaningful icons (icon-only buttons, status indicators) must have an
  `aria-label` on the icon or the parent element.
- Icons inherit `currentColor` — they automatically meet the same contrast ratio
  as the surrounding text.
- Never use an icon as the sole means of conveying critical information (e.g.
  error state). Always pair with text or a semantic state.
- The CSS mask technique preserves the icon in Windows High Contrast Mode
  because it uses `background-color: currentColor`.

<h2 id="theming">Theming</h2>

Icons adapt automatically across brands and color modes because they inherit
`currentColor`. Use the hero preview switches above to see it in action.

For the full theming architecture — brands, modes, and how tokens cascade — see
[Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>All color themes</strong>
      <span>Icons inherit <code>currentColor</code> and adapt across light and dark modes.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Accessible use of color</strong>
      <span>Color is not the only visual means of conveying information (WCAG 1.4.1).</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Accessible contrast for text</strong>
      <span>Icons inherit text contrast — meets 4.5:1 for small, 3:1 for large (WCAG 1.4.3).</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Accessible contrast for UI</strong>
      <span>UI component contrast ratio of at least 3:1 (WCAG 1.4.11).</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Content standards</strong>
      <span>Accessible naming guidelines for meaningful vs. decorative icons are documented.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Defined options</strong>
      <span>Source, color, size, and accessibility options are documented.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Defined behaviors</strong>
      <span>Color inheritance, sizing, alignment, and rendering behaviors are documented.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Usage guidelines</strong>
      <span>Do and don't examples for labeling, color, and decorative usage are included.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Keyboard interactions</strong>
      <span>Documented that icons delegate keyboard handling to their parent control.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Design tokens</strong>
      <span>All visual attributes are available as design tokens.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Figma component</strong>
      <span>Component is available in the Figma library.</span>
    </div>
  </div>
</div>
