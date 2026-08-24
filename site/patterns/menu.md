---
layout: layouts/docs.njk
title: Menu
description: Action menu for contextual options and commands. Supports icons, keyboard navigation, submenus, sections, dividers, disabled items, and selection.
navTitle: Menu
order: 22
permalink: /patterns/menu/
playgroundUrl: /patterns/menu-playground/
playgroundLabel: Open Menu Playground
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
    <div class="docs-hero-preview-stage" style="display: flex; justify-content: center; padding-block: 2rem;">
      {% call uif.menu(ariaLabel="Options") %}
        {% call uif.menuItem() %}Edit{% endcall %}
        {% call uif.menuItem() %}Duplicate{% endcall %}
        {% call uif.menuItem() %}Share{% endcall %}
        {{ uif.menuDivider() }}
        {% call uif.menuItem(disabled=true) %}Delete{% endcall %}
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
    <div class="docs-anatomy-subject" style="display: flex; justify-content: center;">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 20%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">1</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 45%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 70%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">3</span>
      </span>
      {% call uif.menu(ariaLabel="Demo") %}
        {% call uif.menuItem() %}Menu item{% endcall %}
        {{ uif.menuDivider() }}
        {% call uif.menuItem(disabled=true) %}Disabled item{% endcall %}
      {% endcall %}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Menu item — interactive list item</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Divider — visual separator between items or sections</li>
    <li><span class="docs-anatomy-badge-inline">3</span> Disabled item — non-interactive menu item</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Items

<div class="docs-states-grid" style="--docs-states-cols: 4">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.menu(ariaLabel="Default") %}
        {% call uif.menuItem() %}Edit{% endcall %}
        {% call uif.menuItem() %}Duplicate{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Default</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.menu(ariaLabel="Disabled") %}
        {% call uif.menuItem() %}Edit{% endcall %}
        {% call uif.menuItem(disabled=true) %}Disabled{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Disabled item</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.menu(ariaLabel="Selected") %}
        {% call uif.menuItem(selected=true) %}Selected{% endcall %}
        {% call uif.menuItem() %}Unselected{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Selected item</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.menu(ariaLabel="With icons") %}
        {% call uif.menuItem(icon="✏️") %}Edit{% endcall %}
        {% call uif.menuItem(icon="📋") %}Copy{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">With icons</span>
  </div>
</div>

### Sections with dividers

<div class="docs-states-grid" style="--docs-states-cols: 2">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.menu(ariaLabel="Sections") %}
        {% call uif.menuSection(label="Actions") %}
          {% call uif.menuItem() %}Edit{% endcall %}
          {% call uif.menuItem() %}Duplicate{% endcall %}
        {% endcall %}
        {% call uif.menuSection(label="Danger zone") %}
          {% call uif.menuItem() %}Delete{% endcall %}
        {% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Sections with labels</span>
  </div>
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.menu(ariaLabel="Divider") %}
        {% call uif.menuItem() %}Edit{% endcall %}
        {% call uif.menuItem() %}Duplicate{% endcall %}
        {{ uif.menuDivider() }}
        {% call uif.menuItem() %}Delete{% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Divider</span>
  </div>
</div>

### Submenu

<div class="docs-states-grid" style="--docs-states-cols: 1">
  <div class="docs-states-grid-item">
    <div class="docs-states-grid-item-preview">
      {% call uif.menu(ariaLabel="Submenu example") %}
        {% call uif.menuItem() %}Edit{% endcall %}
        {% call uif.menuItem(hasSubmenu=true) %}
          Share
          {% call uif.menu(ariaLabel="Share submenu", className="uif-menu-submenu") %}
            {% call uif.menuItem() %}Via link{% endcall %}
            {% call uif.menuItem() %}Via email{% endcall %}
          {% endcall %}
        {% endcall %}
      {% endcall %}
    </div>
    <span class="docs-states-grid-item-label">Submenu on hover</span>
  </div>
</div>

### Table of options

<table class="docs-options-table">
  <thead><tr><th>Property</th><th>Values</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td>ariaLabel</td><td>text</td><td>—</td></tr>
    <tr><td>role</td><td><code>menu</code> / <code>listbox</code></td><td><code>menu</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>selected</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>icon</td><td>text / HTML</td><td>—</td></tr>
    <tr><td>hasSubmenu</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
  </tbody>
</table>

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead><tr><th>Key</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><kbd>ArrowDown</kbd></td><td>Moves focus to the next item; wraps to first</td></tr>
    <tr><td><kbd>ArrowUp</kbd></td><td>Moves focus to the previous item; wraps to last</td></tr>
    <tr><td><kbd>Home</kbd></td><td>Moves focus to the first item</td></tr>
    <tr><td><kbd>End</kbd></td><td>Moves focus to the last item</td></tr>
    <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd></td><td>Activates the focused item</td></tr>
    <tr><td><kbd>Escape</kbd></td><td>Closes the menu (fires <code>uif-menu:close</code> event)</td></tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Use `role="menu"` on the container and `role="menuitem"` on each item.
- Use `aria-label` on the menu to describe its purpose.
- Use `aria-disabled="true"` (not just `disabled`) on disabled items to keep them discoverable to screen readers.
- For selection menus, use `role="menuitemradio"` or `role="menuitemcheckbox"` with `aria-checked` on items.
- The `<uif-menu>` web component manages roving `tabindex` automatically.

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>All brand/mode contexts</strong><span>Works across light and dark modes.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Keyboard interactions</strong><span>Arrow key navigation, Escape to close.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Submenus</strong><span>Nested menu revealed on hover/focus.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Sections/dividers</strong><span>Grouped items with optional labels and separators.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Disabled items</strong><span>Non-interactive items retain accessible presence.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Selection states</strong><span>Single and multi-select via aria-checked.</span></div></div>
  <div class="docs-checklist-item" data-done="true"><div class="docs-checklist-icon">✓</div><div class="docs-checklist-text"><strong>Design tokens</strong><span>Component-scoped tokens (<code>--uif-menu-*</code>).</span></div></div>
</div>
