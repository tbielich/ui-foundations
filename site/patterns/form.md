---
layout: layouts/docs.njk
title: Form
description: Form provides layout structure for grouping fields, labels, helper text, and actions into a cohesive form experience.
navTitle: Form
order: 70
permalink: /patterns/form/
playgroundUrl: /patterns/form-playground/
playgroundLabel: Open Form Playground
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
      {% call ui.form() %}
        {% call ui.formField() %}
          {{ ui.fieldLabel("Email", htmlFor="hero-email", required=true) }}
          {{ ui.input(type="email", id="hero-email", placeholder="you@example.com") }}
        {% endcall %}
        {% call ui.formField() %}
          {{ ui.fieldLabel("Password", htmlFor="hero-pw", required=true) }}
          {{ ui.input(type="password", id="hero-pw") }}
        {% endcall %}
        {% call ui.formActions() %}
          {{ ui.button("Sign in", variant="solid", type="submit") }}
        {% endcall %}
      {% endcall %}
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
  <ol class="docs-anatomy-list">
    <li><strong>Form container</strong> — wraps all fields with padding, border, and background</li>
    <li><strong>Form group</strong> — fieldset with optional legend for related fields</li>
    <li><strong>Form field</strong> — single field row: label + input + helper</li>
    <li><strong>Helper text</strong> — description or error message below a field</li>
    <li><strong>Form actions</strong> — button area for submit/cancel</li>
  </ol>
</div>

<h2 id="options">Options</h2>

<table class="docs-options-table">
  <thead><tr><th>Option</th><th>Values</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td>Borderless</td><td><code>true</code> / <code>false</code></td><td>Remove border and background for inline forms</td></tr>
    <tr><td>Label position</td><td><code>top</code> / <code>side</code></td><td>Per-field label placement</td></tr>
    <tr><td>Actions align</td><td><code>start</code> / <code>end</code> / <code>stretch</code></td><td>Button alignment in the actions area</td></tr>
    <tr><td>Invalid</td><td><code>true</code> / <code>false</code></td><td>Marks a field as having a validation error</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<h3>Field grouping</h3>

Use `.form-group` with a `<fieldset>` and `<legend>` to group related fields. The legend provides an accessible name for the group.

<div class="docs-example">
{% call ui.form() %}
  {% call ui.formGroup(title="Personal Information") %}
    {% call ui.formField() %}
      {{ ui.fieldLabel("First name", htmlFor="fn") }}
      {{ ui.input(id="fn") }}
    {% endcall %}
    {% call ui.formField() %}
      {{ ui.fieldLabel("Last name", htmlFor="ln") }}
      {{ ui.input(id="ln") }}
    {% endcall %}
  {% endcall %}
  {% call ui.formGroup(title="Preferences") %}
    {{ ui.checkbox("Send newsletter") }}
    {{ ui.checkbox("Accept terms", checked=true) }}
  {% endcall %}
{% endcall %}
</div>

<h3>Validation and helper text</h3>

Mark a field as invalid with `.is-invalid` on `.form-field`. Helper text switches to danger color automatically.

<div class="docs-example">
{% call ui.form() %}
  {% call ui.formField(invalid=true) %}
    {{ ui.fieldLabel("Email", htmlFor="val-email", required=true) }}
    {{ ui.input(type="email", id="val-email", placeholder="you@example.com") }}
    {{ ui.formHelper("Please enter a valid email address.") }}
  {% endcall %}
  {% call ui.formField() %}
    {{ ui.fieldLabel("Name", htmlFor="val-name") }}
    {{ ui.input(id="val-name", placeholder="Jane Doe") }}
    {{ ui.formHelper("Your display name across the platform.") }}
  {% endcall %}
{% endcall %}
</div>

<h3>Side labels</h3>

Use `data-label-position="side"` for horizontal label layout. Best suited for wider viewports and settings forms.

<div class="docs-example">
{% call ui.form() %}
  {% call ui.formField(labelPosition="side") %}
    {{ ui.fieldLabel("Username") }}
    <div class="form-field__body">
      {{ ui.input(placeholder="janedoe") }}
      {{ ui.formHelper("Visible to other users.") }}
    </div>
  {% endcall %}
{% endcall %}
</div>

<h3>Borderless</h3>

Use the borderless variant when the form is embedded in a card or modal that already provides its own container.

<div class="docs-example">
{% call ui.form(borderless=true) %}
  {% call ui.formField() %}
    {{ ui.fieldLabel("Search") }}
    {{ ui.input(type="search", placeholder="Search...") }}
  {% endcall %}
{% endcall %}
</div>

<h2 id="usage-guidelines">Usage Guidelines</h2>

<div class="docs-guideline-grid">
  <div class="docs-guideline do">
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Group related fields with <code>formGroup</code> and a descriptive title.</p>
    </div>
  </div>
  <div class="docs-guideline dont">
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't place unrelated fields in the same group or omit labels.</p>
    </div>
  </div>
</div>

<h2 id="accessibility">Accessibility</h2>

- Form groups use `<fieldset>` + `<legend>` for accessible grouping.
- Every input must have an associated `<label>` via `for`/`id` pairing.
- Required fields are communicated with a visual indicator and `aria-required`.
- Error messages should be linked to the input via `aria-describedby`.
- The form uses `novalidate` to allow custom validation patterns.

<h2 id="theming">Theming</h2>

Form adapts to brands and modes through its component tokens:

| Token | Purpose |
|-------|---------|
| `--form-gap` | Spacing between fields |
| `--form-group-gap` | Spacing between fields in a group |
| `--form-padding-inline` | Horizontal padding |
| `--form-padding-block` | Vertical padding |
| `--form-border-radius` | Container corner radius |
| `--form-container-background` | Background color |
| `--form-container-border-color` | Border color |
| `--form-border-size` | Border width |
| `--form-field-gap` | Gap between label, input, helper |
| `--form-field-helper-text-color-default` | Helper text color |
| `--form-field-helper-text-color-invalid` | Error text color |
| `--form-group-title-color` | Group legend color |
