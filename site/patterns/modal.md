---
layout: layouts/docs.njk
title: Modal
description: Focused dialog for confirmations and alerts that require user attention.
navTitle: Modal
order: 22
permalink: /patterns/modal/
playgroundUrl: /patterns/modal-playground/
playgroundLabel: Open Modal Playground
---
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
      <div class="uif-modal-root is-preview is-open">
        <button class="uif-modal-overlay" type="button" aria-label="Dismiss dialog"></button>
        <section class="uif-modal alert md" role="dialog" aria-modal="true" aria-labelledby="docs-modal-title" aria-describedby="docs-modal-description">
          <header class="uif-modal-header">
            <h2 class="uif-modal-title" id="docs-modal-title">Delete file?</h2>
            <button class="uif-modal-close" type="button" aria-label="Close dialog">×</button>
          </header>
          <div class="uif-modal-body">
            <p class="uif-modal-description" id="docs-modal-description">This action cannot be undone.</p>
            <p>Deleting this file permanently removes it from your workspace.</p>
          </div>
          <footer class="uif-modal-actions">
            <button class="uif-button outline" type="button">Cancel</button>
            <button class="uif-button solid" type="button">Delete</button>
          </footer>
        </section>
      </div>
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

<h2 id="options">Options</h2>

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>variant</td><td><code>confirmation</code> / <code>alert</code></td><td><code>confirmation</code></td></tr>
    <tr><td>size</td><td><code>s</code> / <code>m</code> / <code>l</code></td><td><code>m</code></td></tr>
    <tr><td>dismissible</td><td><code>true</code> / <code>false</code></td><td><code>true</code></td></tr>
    <tr><td>open</td><td><code>true</code> / <code>false</code></td><td><code>true</code></td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<ul>
  <li>Backdrop overlay blocks page interaction while open.</li>
  <li>Focus is trapped inside the modal while open.</li>
  <li>Dismissible modals close on backdrop click, Escape, or close button.</li>
  <li>Non-dismissible modals require an explicit primary action.</li>
</ul>

<h2 id="accessibility">Accessibility</h2>

- Uses <code>role="dialog"</code> and <code>aria-modal="true"</code>.
- Wires <code>aria-labelledby</code> and optional <code>aria-describedby</code>.
- Keeps keyboard focus within the dialog until the modal closes.
