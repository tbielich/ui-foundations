---
layout: layouts/docs.njk
title: Link
description: Links navigate users to another page or resource. They support inline and standalone usage with optional icons.
navTitle: Link
order: 60
permalink: /components/link/
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
      {{ ui.link("Default link") }}
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="draft">Draft</span>
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
      {{ ui.link("Learn more") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Link text — underlined anchor with token-driven color and states</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### States

<div class="docs-states-grid" style="--docs-states-cols: 5">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.link("Default") }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.link("Hover", state="hover") }}</div>
    <span class="docs-states-grid-item-label">Hover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.link("Active", state="active") }}</div>
    <span class="docs-states-grid-item-label">Active</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.link("Visited", state="visited") }}</div>
    <span class="docs-states-grid-item-label">Visited</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ ui.link("Disabled", disabled=true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>text</td><td>text</td><td>—</td></tr>
    <tr><td>href</td><td>URL</td><td>—</td></tr>
    <tr><td>startIcon</td><td>icon name / none</td><td>none</td></tr>
    <tr><td>endIcon</td><td>icon name / none</td><td>none</td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ ui.link("Inline link") }}</div>
    <div class="docs-behavior-body">
      <h3>Inline usage</h3>
      <p>Links sit inline with text. Underlined to distinguish from plain text.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">{{ ui.link("Hover", state="hover") }}</div>
    <div class="docs-behavior-body">
      <h3>Hover state</h3>
      <p>Color changes on hover to provide visual feedback.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">{{ ui.link("View details") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use links for navigation to another page.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">{{ ui.link("Save changes") }}</div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use links for actions — use a button.</p>
    </div>
  </div>
</div>

<h2 id="content-standards">Content standards</h2>

- Describe the destination: "View pricing" not "Click here".
- Sentence case. Keep to a few words.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Interaction</th></tr></thead>
  <tbody>
    <tr><td><kbd>Enter</kbd></td><td>Activates the link.</td></tr>
    <tr><td><kbd>Tab</kbd></td><td>Moves focus to the next element.</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Use `<a>` with a valid `href`.
- Link text must describe the destination.
- Disabled links: `aria-disabled="true"` and `tabindex="-1"`.
- Focus indicators meet 3:1 contrast.

<h2 id="theming">Theming</h2>

Link adapts across brands and modes through semantic color tokens.

For the full theming architecture see [Foundations: Theming](/foundations/theming/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All interactive states</strong><span>Default, hover, active, visited, disabled.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All color themes</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Accessible contrast</strong><span>Link text meets 4.5:1.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Content standards</strong><span>Descriptive link text guidelines.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Defined options</strong><span>Text, href, icons, disabled documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Usage guidelines</strong><span>Links vs. buttons do/don't.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Enter and Tab documented.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>All visual attributes as tokens.</span></div></div>
  <div class="docs-checklist-item" data-done="false"><div class="docs-checklist-icon">–</div><div class="docs-checklist-text"><strong>Figma component</strong><span>Not yet connected via Code Connect.</span></div></div>
</div>
