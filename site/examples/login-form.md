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
  <form id="example-login-form" class="example-form" action="#" method="post" novalidate>
    <fieldset class="example-form__group">
      <legend class="example-form__group-title">Sign in</legend>
      <p class="example-form__intro">Use your account email and password.</p>

      <div class="example-form__field">
        <label class="field-label" for="login-email" style="line-height: 24px;">
          <span class="label-content">
            <span class="label-content__text">Email address</span>
          </span>
          <span class="field-label__required" aria-hidden="true">*</span>
          <span class="field-label__required-text"> (required)</span>
        </label>
        {{ ui.input(type="email", id="login-email", name="email", placeholder="name@example.com") }}
      </div>

      <div class="example-form__field">
        <label class="field-label" for="login-password" style="line-height: 24px;">
          <span class="label-content">
            <span class="label-content__text">Password</span>
          </span>
          <span class="field-label__required" aria-hidden="true">*</span>
          <span class="field-label__required-text"> (required)</span>
        </label>
        {{ ui.input(type="password", id="login-password", name="password", placeholder="Enter password") }}
      </div>
    </fieldset>

    <div class="example-form__actions">
      {{ ui.button(label="Sign in", type="submit") }}
    </div>
  </form>
</div>

  </div>
</div>

<h2>Scope</h2>

<ul>
  <li>This is an organism-level example in the sense of Atomic Design.</li>
  <li>It intentionally stays HTML/CSS only for now.</li>
  <li>Next step: JS enhancement for accessibility (validation messaging, live region feedback, and robust focus management).</li>
</ul>
