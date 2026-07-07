---
layout: layouts/docs.njk
title: Class Naming
description: CSS class naming convention for ui-foundations components and patterns.
navTitle: Class Naming
order: 13
permalink: /foundations/class-naming/
---

## Convention

ui-foundations uses **flat compound classes** — no BEM double-underscores, no namespace prefixes.

### Structure

```
.component                     → root element
.component-part                → structural child (compound with hyphen)
.component-part.variant        → variant as modifier class (multi-class)
.component.variant             → root-level variant
.component.is-state            → state class (always .is- prefix)
```

### Rules

1. **Root class = bare component name**: `.calendar`, `.button`, `.checkbox`
2. **Parts use hyphen-compound**: `.calendar-header`, `.calendar-cell`, `.input-field`
3. **Variants are additional classes**: `.button.ghost`, `.badge.brand`, `.divider.subtle`
4. **States use `.is-` prefix**: `.is-hover`, `.is-selected`, `.is-disabled`, `.is-today`
5. **No double-underscores** (`__`): use hyphen-compound instead
6. **No namespace prefixes**: never `.ui-calendar` or `.uif-button`
7. **No BEM modifiers** (`--`): use multi-class instead (`.button.ghost` not `.button--ghost`)

### Examples

```css
/* ✓ Correct */
.calendar { }
.calendar-header { }
.calendar-cell { }
.calendar-cell.is-selected { }
.calendar-cell.is-today { }
.button.ghost { }
.input-field { }
.form-field { }

/* ✗ Incorrect */
.calendar__header { }       /* no double-underscore */
.calendar-cell--selected { } /* no BEM modifier */
.ui-calendar { }            /* no namespace */
.button--ghost { }          /* use multi-class */
```

### Why

- **Readability**: `.calendar-cell.is-selected` reads as plain English
- **Flat specificity**: all selectors stay at one or two class levels
- **Composable**: `.button.ghost.calendar-cell` works — stack as needed
- **Scannable**: in DevTools you see the full state without decoding BEM conventions
- **Consistent with token naming**: tokens use hyphen-compound too (`--calendar-cell-background-hover`)

### Migration Note

Some older components still use `__` (e.g. `.accordion-item__content`, `.form-field__helper`). New components must use hyphen-compound. Existing components will be migrated incrementally.
