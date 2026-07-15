---
layout: layouts/docs.njk
title: Class Naming
description: CSS class naming convention for ui-foundations components and patterns.
navTitle: Class Naming
order: 13
permalink: /foundations/class-naming/
---

## Convention

ui-foundations consumes the Vault Naming Contract for public pattern classes.
The canonical source is
`.uif/packs/governance/contracts/naming-contract.json`; runtime generates its
local contract module from that artifact.

The examples below illustrate the consumed contract. They are not source rules.
At the time of this consumed pack, public component classes use the generated
class prefix and flat class chains: no BEM double-underscores and no non-Vault
namespace prefixes.

### Structure

```
.uif-component                 → root element
.uif-component-part            → structural child (compound with hyphen)
.uif-component-part.variant    → variant as modifier class (multi-class)
.uif-component.variant         → root-level variant
.uif-component.is-state        → state class (always .is- prefix)
```

### Rules

1. **Root class = `uif-` + component name**: `.uif-calendar`, `.uif-button`, `.uif-checkbox`
2. **Parts use hyphen-compound under the same prefix**: `.uif-calendar-header`, `.uif-calendar-cell`, `.uif-input-field`
3. **Variants are additional classes**: `.uif-button.ghost`, `.uif-badge.brand`, `.uif-divider.subtle`
4. **States use `.is-` prefix**: `.is-hover`, `.is-selected`, `.is-disabled`, `.is-today`
5. **No double-underscores** (`__`): use hyphen-compound instead
6. **No non-Vault namespace prefixes**: never `.ui-calendar`
7. **No BEM modifiers** (`--`): use multi-class instead (`.uif-button.ghost` not `.uif-button--ghost`)

### Examples

```css
/* Example: canonical */
.uif-calendar { }
.uif-calendar-header { }
.uif-calendar-cell { }
.uif-calendar-cell.is-selected { }
.uif-calendar-cell.is-today { }
.uif-button.ghost { }
.uif-input-field { }
.uif-form-field { }

/* Example: invalid */
.calendar__header { }       /* no double-underscore */
.calendar-cell--selected { } /* no BEM modifier */
.ui-calendar { }            /* no non-Vault namespace */
.uif-button--ghost { }      /* use multi-class */
```

### Why

- **Readability**: `.uif-calendar-cell.is-selected` reads as plain English
- **Flat specificity**: all selectors stay at one or two class levels
- **Composable**: `.uif-button.ghost.uif-calendar-cell` works — stack as needed
- **Scannable**: in DevTools you see the full state without decoding BEM conventions
- **Consistent with token naming**: tokens use the same public prefix (`--uif-calendar-cell-background-hover`)

### Migration Note

Some runtime artifacts still use bare classes such as `.input` and
`.calendar-cell`. Button emitters now use `.uif-button`; `.button` remains a
deprecated CSS-only compatibility selector through v1.x. Runtime validation
should warn with migration guidance rather than fail existing artifacts without
context.
