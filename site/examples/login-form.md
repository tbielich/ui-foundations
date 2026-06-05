---
layout: layouts/docs.njk
title: Login Form
description: Simple login form as an organism composed of Label, Input, and Button.
navTitle: Login Form
order: 10
permalink: /examples/login-form/
templateEngineOverride: njk
breadcrumb:
  - label: Examples
    url: /examples/
  - label: Login Form
---

{% import "macros/ui.njk" as ui %}

<h2>Preview</h2>

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

<div class="example-form-shell">
  {% call ui.form(borderless=true) %}
    {% call ui.formGroup(title="Sign in") %}
      <p class="form-field__helper">Use your account email and password.</p>
      {% call ui.formField() %}
        {{ ui.fieldLabel("Email address", htmlFor="login-email", required=true) }}
        {{ ui.input(type="email", id="login-email", name="email", placeholder="name@example.com") }}
      {% endcall %}
      {% call ui.formField() %}
        {{ ui.fieldLabel("Password", htmlFor="login-password", required=true) }}
        {{ ui.input(type="password", id="login-password", name="password", placeholder="Enter password") }}
      {% endcall %}
    {% endcall %}
    {% call ui.formActions() %}
      {{ ui.button(label="Sign in", type="submit") }}
    {% endcall %}
  {% endcall %}
</div>

  </div>
</div>

<h2>Scope</h2>

<ul>
  <li>This is an organism-level example in the sense of Atomic Design.</li>
  <li>It intentionally stays HTML/CSS only for now.</li>
  <li>Next step: JS enhancement for accessibility (validation messaging, live region feedback, and robust focus management).</li>
</ul>
