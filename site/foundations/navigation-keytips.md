---
title: Navigation Key Tips
description: Experimental keyboard shortcut overlay for the main documentation navigation.
layout: layouts/docs.njk
order: 90
---

## Overview

| Property | Value |
|----------|-------|
| Feature | Navigation Key Tips |
| Scope | Main Navigation (sidebar) |
| Trigger | Short press and release of `Alt` |
| Search focus | `Alt` + `Space` |
| Selection | `1`–`9` |
| Dismiss | `Escape`, `Alt`, Pointer click, Navigation |
| Status | **Experimental** |

Navigation Key Tips provide a fast keyboard shortcut to open or navigate to top-level navigation sections without tabbing through the entire sidebar.

## How it works

1. Press and release `Alt` quickly (under 400 ms, no other key held).
2. Numeric badges appear next to each navigable section.
3. Press the corresponding number to activate that section or link.
4. The mode auto-dismisses after selection, or can be cancelled with `Escape`, another `Alt` tap, or any pointer interaction.

### Quick search

Press `Alt` + `Space` at any time to jump directly into the search input. Any existing text is selected so you can immediately type a new query.

## Key assignments

| Key | Target |
|-----|--------|
| `1` | Foundations |
| `2` | Patterns |
| `3` | Examples |
| `4` | Getting Started |

## Design decisions

### No `accesskey`

The HTML `accesskey` attribute is intentionally **not** used. Its behavior varies unpredictably between browsers and operating systems, often conflicting with assistive technology shortcuts. Key Tips provide a controlled, consistent alternative.

### Alt key conflicts

The `Alt` key has platform-specific behaviors:

- **Windows/Linux**: Alt activates the browser menu bar. The short-tap detection avoids this by only activating key tips on a clean release without a combo.
- **macOS**: Alt (Option) produces alternate characters. Again, only a standalone tap (no other key pressed) activates the mode.
- **Screen readers**: Alt combinations are often used for screen reader commands. Key Tips never intercept `Alt+<key>` combos — only a standalone `Alt` release.

### Normal keyboard navigation preserved

Tab, Shift+Tab, Enter, Space, and all standard keyboard interactions continue to work exactly as before. Key Tips are purely additive.

### Visual implementation

Key tip badges are rendered via CSS `::after` pseudo-elements — no additional DOM nodes are created. This ensures they do not affect the accessible name of navigation links or appear in the tab order.

## Technical details

- CSS: `site/assets/docs-keytips.css`
- JS: `site/assets/docs-keytips.js`
- Logic utilities: `site/assets/keytips-utils.js`
- Mode activation: `html[data-keytip-mode="active"]`
- Scope: `[data-keytip-scope="main-nav"]`

## Accessibility

- Complies with **WCAG 2.1.1** (Keyboard): all functionality remains operable via keyboard.
- Complies with **WCAG 2.1.4** (Character Key Shortcuts): number keys only function while the explicit mode is active; they never intercept normal text input.
- `aria-keyshortcuts` documents the shortcut for assistive technologies without implementing the behavior.
- The `::after` content is presentational and does not alter the computed accessible name of links.
- `prefers-reduced-motion` disables transitions.

## Touch devices

Key Tips rely on a physical keyboard and the `Alt` key. On touch-only devices (phones, tablets) the feature is inert — no activation path exists, and no UI is rendered. This is intentional: touch navigation uses direct tap targets and does not benefit from a shortcut overlay.

## Scalability

The current design supports up to 9 key tips per scope (digits `1`–`9`). If the navigation grows beyond 9 top-level sections, possible strategies include:

- **Nested scopes**: activate a group first, then show sub-tips within it (two-step selection).
- **Pagination**: show tips for the visible viewport section, scroll to reveal more.
- **Priority assignment**: assign tips only to the most-used sections; leave the rest for standard keyboard navigation.

No immediate action is needed — the documentation site currently has 4 sections.

## Limitations

- Maximum 9 key tips per scope (digits 1–9).
- Currently limited to the main navigation; not yet applied to sub-navigation or other components.
- The Alt trigger may not fire reliably if the browser intercepts the keyup event (rare, mostly on Linux with certain window managers).
- No activation path on touch-only devices (by design — see above).
