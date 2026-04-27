---
layout: layouts/docs.njk
title: Content Standards
description: Writing guidelines for labels, messages, and in-product copy used in UI components.
navTitle: Content Standards
order: 5
permalink: /foundations/content/
---

Clear, consistent language makes interfaces easier to use. These standards apply
to every label, message, and action in the system.

## Labels

- Use sentence case for all labels and button text.
- Keep button labels to 1–4 words. Write them as verbs that describe the action.
- Avoid punctuation in button labels — no periods or exclamation points.

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      <code>Save changes</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use a verb that describes the outcome.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <code>Submit</code>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Avoid generic labels that don't describe the specific action.</p>
    </div>
  </div>
</div>

## Error messages

- Identify the field, the problem, and the recovery action.
- Use plain language — avoid codes or jargon.
- Place error text next to the field it describes.

## Placeholder text

- Use placeholder text to show format examples, not as a replacement for labels.
- Placeholders disappear on input and are not reliably read by screen readers.

## Tone

- Be direct and helpful. Avoid humor, emoji, or exclamation points in
  functional UI.
- Use positive framing when possible: "Enter your email" rather than "Email
  cannot be empty."
