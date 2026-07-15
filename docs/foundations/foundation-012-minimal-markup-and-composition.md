---
title: Foundation-012 – Minimal Markup and Composition
status: active
type: foundation-decision
---

# Foundation-012: Minimal Markup and Composition

## Purpose

Keep component markup as flat and simple as possible. Complexity in HTML structure should only exist when it solves a real problem.

## Rules

1. Start with the flattest possible markup.
   - A link with an icon is `<a class="uif-link"><span class="uif-icon">...</span> Text</a>`, not three nested wrappers.
   - Add structure only when layout or behavior requires it.

2. Use CSS on the component root for layout.
   - `inline-flex`, `gap`, `align-items` on the component class itself.
   - Avoid wrapper elements whose only purpose is layout.

3. Composition patterns (like `uif-label-content`) are opt-in, not default.
   - Use them only when the component genuinely needs slot management, reordering, or icon-only modes.
   - A simple text + icon combination does not need a composition wrapper.

4. Measure complexity by counting elements.
   - If a simple variant needs more than 2 elements (root + content), question the structure.
   - Complex variants (e.g. button with icon-only mode, loading state) may justify more elements.

5. Avoid premature abstraction.
   - Do not add wrapper elements "in case we need them later".
   - Add structure when a real variant or behavior demands it.

## Test

Before finalizing component markup, ask:

- Can I remove any element without losing functionality?
- Is every wrapper solving a real layout or behavior problem?
- Would a developer using this component find the markup obvious?

## Implications

- Components stay readable and debuggable in browser DevTools.
- CSS stays simpler with fewer selectors.
- Consumers write less HTML.
- Complex components can still use composition patterns when justified.
