---
layout: layouts/docs.njk
title: DropZone
description: Drag-and-drop file upload area with button fallback, filtering, and multiple file support.
navTitle: DropZone
order: 52
permalink: /patterns/dropzone/
playgroundUrl: /patterns/dropzone-playground/
playgroundLabel: Open DropZone Playground
---

{% import "macros/ui.njk" as uif %}

<div class="docs-hero">
  <div class="docs-hero-preview">
    <div class="docs-hero-preview-stage">
      {{ uif.dropzone() }}
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

<h2 id="states">States</h2>

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.dropzone() }}</div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.dropzone(className="is-dragover") }}</div>
    <span class="docs-states-grid-item-label">Dragover</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.dropzone(filled=true, filesText="invoice.pdf") }}</div>
    <span class="docs-states-grid-item-label">Filled</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">{{ uif.dropzone(disabled=true) }}</div>
    <span class="docs-states-grid-item-label">Disabled</span>
  </div>
</div>

<h2 id="options">Options</h2>

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>accept</td><td>valid file accept string</td><td>—</td></tr>
    <tr><td>multiple</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>filled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- The drop area keeps a visible button fallback for keyboard-only users.
- File status text is announced via <code>aria-live="polite"</code>.
- Use a label that describes expected file content.
