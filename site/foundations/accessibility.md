---
layout: layouts/docs.njk
title: Accessibility
description: How UI Foundations ensures inclusive, standards-compliant experiences for all users.
navTitle: Accessibility
order: 3
permalink: /foundations/accessibility/
---

Accessibility is a baseline requirement, not an optional enhancement. Every
component in the system is built to meet these standards.

## Guiding standards

- WCAG 2.1 AA as the minimum conformance target.
- Semantic HTML before ARIA — use native elements when they exist.
- Keyboard operability for every interactive control.
- Visible focus indicators that meet 3:1 contrast.
- Color is never the only means of conveying information.

## What every component provides

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
