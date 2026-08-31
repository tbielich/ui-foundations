---
layout: layouts/docs.njk
title: Notification
description: Toast/notification messages for transient feedback after user actions.
navTitle: Notification
order: 49
permalink: /patterns/notification/
playgroundUrl: /patterns/notification-playground/
playgroundLabel: Open Notification Playground
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
    <div class="docs-hero-preview-stage">
      {% call uif.notificationStack() %}
        {{ uif.notification("Changes saved successfully.", "success", true, "Undo", "#") }}
      {% endcall %}
    </div>
  </div>
  <div class="docs-hero-meta">
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
  </div>
</div>

## Variants

{% call uif.notificationStack() %}
  {{ uif.notification("Information message", "info", false) }}
  {{ uif.notification("Success message", "success", false) }}
  {{ uif.notification("Warning message", "warning", false) }}
  {{ uif.notification("Error message", "error", false) }}
{% endcall %}

## Accessibility

- Non-error messages use `role="status"` and `aria-live="polite"`.
- Error messages use `role="alert"` and `aria-live="assertive"`.

## Auto-dismiss

Set `duration` (milliseconds) on `<uif-notification>` to auto-dismiss:

```html
<uif-notification
  message="Profile updated."
  variant="success"
  duration="5000"
  dismissible
></uif-notification>
```

Use `0` (or omit) to keep notifications visible until dismissed.
