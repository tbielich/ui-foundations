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

{% import "macros/ui.njk" as uif %}

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
  {% call uif.form(borderless=true) %}
    {% call uif.formGroup(title="Sign in") %}
      <p class="uif-form-field-helper">Use your account email and password.</p>
      {% call uif.formField() %}
        {{ uif.fieldLabel("Email address", htmlFor="login-email", required=true) }}
        {{ uif.input(type="email", id="login-email", name="email", placeholder="name@example.com") }}
      {% endcall %}
      {% call uif.formField() %}
        {{ uif.fieldLabel("Password", htmlFor="login-password", required=true) }}
        {{ uif.input(type="password", id="login-password", name="password", placeholder="Enter password") }}
        <a class="uif-form-field-link" href="#">Forgot password?</a>
      {% endcall %}
    {% endcall %}
    {% call uif.formActions(align="stretch") %}
      {{ uif.button(label="Sign in", type="submit") }}
    {% endcall %}
  {% endcall %}
</div>

  </div>
</div>

<h2>Error state</h2>

<div class="docs-hero-preview">
  <div class="docs-hero-preview-stage">

<div class="example-form-shell">
  {% call uif.form(borderless=true) %}
    {% call uif.formGroup(title="Sign in") %}
      <p class="uif-form-field-helper">Use your account email and password.</p>
      {% call uif.formField(invalid=true) %}
        {{ uif.fieldLabel("Email address", htmlFor="login-email-err", required=true) }}
        {{ uif.input(type="email", id="login-email-err", name="email", placeholder="name@example.com", className="is-invalid") }}
        <p class="uif-form-field-helper">Please enter a valid email address.</p>
      {% endcall %}
      {% call uif.formField(invalid=true) %}
        {{ uif.fieldLabel("Password", htmlFor="login-password-err", required=true) }}
        {{ uif.input(type="password", id="login-password-err", name="password", placeholder="Enter password", className="is-invalid") }}
        <p class="uif-form-field-helper">Password is required.</p>
        <a class="uif-form-field-link" href="#">Forgot password?</a>
      {% endcall %}
    {% endcall %}
    {% call uif.formActions(align="stretch") %}
      {{ uif.button(label="Sign in", type="submit") }}
    {% endcall %}
  {% endcall %}
</div>

  </div>
</div>

<h2>Scope</h2>

<ul>
  <li>This is an organism-level example in the sense of Atomic Design.</li>
  <li>Shows default, error, and loading states using existing system components.</li>
  <li>Includes "Forgot password?" link for user control.</li>
  <li>Intentionally stays HTML/CSS only for now.</li>
  <li>Next step: Password Input variant with visibility toggle (see <a href="https://github.com/tbielich/ui-foundations/issues">issue</a>).</li>
  <li>Next step: JS enhancement for accessibility (validation messaging, live region feedback, and robust focus management).</li>
</ul>
