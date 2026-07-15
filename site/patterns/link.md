---
layout: layouts/docs.njk
title: Link
description: Inline navigation element for text-level links with optional icon slots, visited state, and accessible disabled handling.
navTitle: Link
order: 60
permalink: /patterns/link/
playgroundUrl: /patterns/link-playground/
playgroundLabel: Open Link Playground
templateEngineOverride: njk
breadcrumb:
  - label: Components
    url: /patterns/
  - label: Link
---

{% import "macros/ui.njk" as ui %}

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
      <a class="link" href="#">Learn more</a>
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
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
      <span class="docs-anatomy-callout" data-dir="top" style="left: 10%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">2</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 90%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">3</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <a class="link" href="#"><span class="uif-icon" data-slot="start" style="--uif-icon-src: url('/assets/icons/target-blank.svg');" aria-hidden="true"></span>External link<span class="uif-icon" data-slot="end" style="--uif-icon-src: url('/assets/icons/target-blank.svg');" aria-hidden="true"></span></a>
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Start icon (optional) — decorative icon before text</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Label text — the clickable text content</li>
    <li><span class="docs-anatomy-badge-inline">3</span> End icon (optional) — decorative icon after text, commonly for external links</li>
  </ol>
</div>

<h2 id="options">Options</h2>

<h3>States</h3>

<div class="docs-states-grid" style="--docs-states-cols: 5">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview"><a class="link" href="#">Default</a></div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview"><a class="link is-hover" href="#">Hover</a></div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview"><a class="link is-active" href="#">Active</a></div>
    <span class="docs-states-grid-item-label">Active</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview"><a class="link is-visited" href="#">Visited</a></div>
    <span class="docs-states-grid-item-label">Visited</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview"><a class="link is-disabled" aria-disabled="true" tabindex="-1">Disabled</a></div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

<h3>Table of options</h3>

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>href</td><td>URL string</td><td><code>#</code></td></tr>
    <tr><td>startIcon</td><td>Icon name or element</td><td>—</td></tr>
    <tr><td>endIcon</td><td>Icon name or element</td><td>—</td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <a class="link" href="#">Inline link</a> within body text.
    </div>
    <div class="docs-behavior-body">
      <h3>Inline usage</h3>
      <p>Links inherit the surrounding font size and sit inline with text content.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      <a class="link is-disabled" aria-disabled="true" tabindex="-1">Disabled link</a>
    </div>
    <div class="docs-behavior-body">
      <h3>Disabled state</h3>
      <p>A disabled link has no <code>href</code>, uses <code>aria-disabled="true"</code> and <code>tabindex="-1"</code>. It is not focusable and does not navigate.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

<h3>Link vs Button</h3>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <a class="link" href="/settings">Account settings</a>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use a link for navigation to a new page or resource.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <a class="link" href="#">Submit form</a>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use a link for actions that don't navigate. Use a button instead.</p>
    </div>
  </div>
</div>

<h3>Descriptive text</h3>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <a class="link" href="#">View booking details</a>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use descriptive link text that explains the destination.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <a class="link" href="#">Click here</a>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Avoid generic link text that has no meaning out of context.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Link text should describe the destination or action clearly.
- Keep link text concise — 2–5 words is ideal.
- Avoid "click here", "read more", or "learn more" without context.
- For external links, consider adding a trailing icon to signal navigation away from the site.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead>
    <tr><th>Key</th><th>Interaction</th></tr>
  </thead>
  <tbody>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus to the link.</td></tr>
    <tr><td><kbd>Enter</kbd></td><td>Activates the link (navigates).</td></tr>
    <tr><td><kbd>Shift+Tab</kbd></td><td>Moves focus away from the link.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Uses semantic `<a>` element with native keyboard and screen reader support.
- Disabled links use `aria-disabled="true"` and `tabindex="-1"` to remove from tab order.
- Disabled links have no `href` attribute — prevents navigation via assistive technology.
- Link text must be meaningful in isolation (WCAG 2.4.4).
- Icon-only links are not supported — always include visible text.
- Focus indicator meets 3:1 contrast via shared `--color-focus` token.
- Color alone does not identify links — underline provides a secondary visual cue (WCAG 1.4.1).

<h2 id="theming">Theming</h2>

Link adapts automatically across brands and color modes through component
tokens. Use the hero preview switches above to see it in action.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All interactive states</strong><span>Default, hover, active, visited, focus, and disabled states are implemented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes for all brands.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible use of color</strong><span>Underline provides secondary identification beyond color (WCAG 1.4.1).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast for text</strong><span>Text contrast ratio of at least 4.5:1 (WCAG 1.4.3).</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Content standards</strong><span>Link text guidelines documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>href, startIcon, endIcon, disabled options documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined behaviors</strong><span>Inline usage and disabled behavior documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Link vs button and descriptive text guidelines included.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Tab and Enter interactions documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes available as design tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Component set created with State and Disabled variants, bound to semantic tokens.</span></div></div>
</div>
