---
layout: layouts/docs.njk
title: Accessibility
description: How UI Foundations ensures inclusive, standards-compliant experiences for all users.
navTitle: Accessibility
order: 3
permalink: /foundations/accessibility/
---

Canonical design foundation knowledge is maintained in the UI Foundations Vault. This repository only documents implementation-specific usage.

Vault reference: <a href="{{ 'foundations/accessibility-principles.md' | vaultDocumentationUrl }}">configured vault accessibility principles</a>

## Local implementation expectations

Accessibility is a baseline requirement for shipped patterns, components,
examples, and documentation in this repository. Local implementation guidance
focuses on how accessibility principles are expressed in code and validation.

### Semantic markup

Components use the correct HTML element or ARIA role so assistive technology can
identify them. Buttons are `<button>`, links are `<a>`, form controls use
`<input>`, `<select>`, or `<textarea>` with associated `<label>` elements.

### Keyboard access

All interactive components are reachable and operable with a keyboard. Focus
order follows the visual reading order. Focus traps are used only in modals and
are documented.

### State communication

States like disabled, checked, expanded, selected, and invalid are communicated
through native HTML attributes or ARIA states — not through visual styling
alone.

### Color and contrast

Text meets a 4.5:1 contrast ratio (3:1 for large text). UI component boundaries
and states meet 3:1. Semantic color tokens enforce these ratios across brands
and modes.

## Design checklist for accessibility

Every component page includes a design checklist. The accessibility-related
items are:

- Accessible use of color (WCAG 1.4.1)
- Accessible contrast for text (WCAG 1.4.3)
- Accessible contrast for UI components (WCAG 1.4.11)
- Keyboard interactions documented
- Screen reader behavior verified

## Testing expectations

Automated checks catch structural issues. Manual testing with screen readers
(VoiceOver, NVDA) and keyboard-only navigation is required before a component
reaches stable status.
