---
layout: layouts/docs.njk
title: TreeView
description: Hierarchical tree structure for nested data with expand/collapse, selection, keyboard navigation, drag-and-drop reorder, and lazy loading hooks.
navTitle: TreeView
order: 23
permalink: /components/tree-view/
playgroundUrl: /components/tree-view-playground/
playgroundLabel: Open TreeView Playground
---
{% import "macros/ui.njk" as uif %}

<div class="docs-hero">
  <div class="docs-hero-preview">
    <div class="docs-hero-preview-stage" style="inline-size: 100%;">
      <uif-tree-view selection="single">
        {% call uif.treeView() %}
          {% call uif.treeNode(label="Workspace", id="workspace", expanded=true, selected=true) %}
            {{ uif.treeNode(label="Components", id="components") }}
            {{ uif.treeNode(label="Tokens", id="tokens") }}
          {% endcall %}
          {{ uif.treeNode(label="Archive", id="archive", lazyUrl="/api/tree-view/lazy.json") }}
        {% endcall %}
      </uif-tree-view>
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>↑</kbd> / <kbd>↓</kbd></td><td>Move focus between visible nodes</td></tr>
    <tr><td><kbd>→</kbd></td><td>Expand node or move to first child</td></tr>
    <tr><td><kbd>←</kbd></td><td>Collapse node or move to parent</td></tr>
    <tr><td><kbd>Enter</kbd></td><td>Toggle expand/collapse and select node</td></tr>
    <tr><td><kbd>Space</kbd></td><td>Select focused node</td></tr>
    <tr><td><kbd>Home</kbd> / <kbd>End</kbd></td><td>Jump to first/last visible node</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Uses ARIA tree pattern roles (`tree`, `treeitem`, `group`).
- Maintains roving focus (`tabindex="0"` on active row, `-1` otherwise).
- Reflects selection via `aria-selected` and expansion via `aria-expanded`.
