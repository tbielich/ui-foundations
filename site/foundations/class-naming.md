---
layout: layouts/docs.njk
title: Class Naming
description: CSS class naming convention for ui-foundations components and patterns.
navTitle: Class Naming
order: 13
permalink: /foundations/class-naming/
---

## Convention

ui-foundations consumes the Vault Naming Contract for public classes. The
canonical source is `.uif/packs/governance/contracts/naming-contract.json`;
runtime generates its local contract module from that artifact.

The examples below illustrate the consumed contract. They are not source rules.

## Structure

```
.uif-component                 → root element
.uif-component-part            → structural child (compound with hyphen)
.uif-component-part.variant    → variant as modifier class
.uif-component.variant         → root-level variant
.uif-component.is-state        → state class (always .is- prefix)
```

## Rules

1. **Root class = `uif-` + component name**: `.uif-calendar`, `.uif-button`, `.uif-checkbox`
2. **Parts use hyphen-compound**: `.uif-calendar-header`, `.uif-calendar-cell`, `.uif-input-field`
3. **Variants are additional classes**: `.uif-button.ghost`, `.uif-badge.brand`, `.uif-divider.subtle`
4. **States use `.is-` prefix**: `.is-hover`, `.is-selected`, `.is-disabled`, `.is-today`
5. **No double-underscores** (`__`): use hyphen-compound instead
6. **No non-Vault namespace prefixes**: never `.ui-calendar`
7. **No BEM modifiers** (`--`): use multi-class instead (`.uif-button.ghost` not `.uif-button--ghost`)

## Examples

```css
/* Example: canonical */
.uif-calendar { }
.uif-calendar-header { }
.uif-calendar-cell { }
.uif-calendar-cell.is-selected { }
.uif-button.ghost { }
.uif-input-field { }

/* Example: invalid */
.calendar__header { }        /* no double-underscore */
.calendar-cell--selected { } /* no BEM modifier */
.ui-calendar { }             /* no non-Vault namespace */
.uif-button--ghost { }       /* use multi-class */
```

## Why This Convention

- **Readability**: `.uif-calendar-cell.is-selected` reads as plain English
- **Flat specificity**: all selectors stay at one or two class levels
- **Composable**: `.uif-button.ghost.uif-calendar-cell` — stack classes freely
- **Scannable**: in DevTools you see the full state without decoding
- **Aligned with tokens**: tokens use the same public prefix (`--uif-calendar-cell-background-hover`)

## Migration

Some runtime artifacts still use bare classes such as `.input` and
`.calendar-cell`. Button emitters now use `.uif-button`; `.button` remains a
deprecated CSS-only compatibility selector through v1.x. Runtime validation
warns with migration guidance while the migration is in progress.
