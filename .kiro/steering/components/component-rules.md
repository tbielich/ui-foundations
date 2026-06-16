---
inclusion: manual
---

# Component Rules (Molecules)

Components are the "molecule" layer — they combine one or more patterns (atoms)
with vanilla JavaScript to add state, interactivity, or orchestration.

## Definition

A component exists when a UI unit:
- requires JavaScript to function
- manages internal state (open/closed, selected, focused item)
- orchestrates multiple patterns together
- handles user interaction beyond CSS pseudo-states

If it works with pure CSS → it's a pattern, not a component.

## Architecture

```
src/components/{name}/
  ├── {name}.js          — vanilla JS class/module
  ├── {name}.css         — additional styles (if pattern CSS isn't enough)
  └── {name}.test.js     — unit tests
```

## Rules

1. **Reuse patterns** — never rewrite pattern CSS inside a component.
   Import and compose existing atoms.
2. **Vanilla JS only** — no frameworks, no build-time transforms.
   Must work with a `<script>` tag.
3. **Progressive enhancement** — the component must render meaningful
   content without JS. JS enhances, not enables.
4. **Token-only styling** — any additional CSS uses component tokens
   from `figma/exports/Components (UI).tokens.json`.
5. **ARIA-first** — state is communicated via ARIA attributes
   (`aria-expanded`, `aria-selected`, etc.), not custom classes.
6. **Event-driven** — components emit custom events for parent
   communication, not callbacks or global state.

## Interaction Pattern

```js
class MyComponent {
  constructor(el) {
    this.el = el;
    this.init();
  }

  init() {
    // Query pattern elements within
    // Attach event listeners
    // Set initial ARIA state
  }

  destroy() {
    // Remove listeners, clean up
  }
}
```

## Component ↔ Pattern Relationship

| Component | Uses Patterns | Adds |
|-----------|--------------|------|
| Calendar | Button, Icon | Date navigation, selection state, grid keyboard nav |
| Dialog | Button, Icon | Open/close, focus trap, backdrop, ESC dismiss |
| ComboBox | Input, Icon | Filtering, listbox, keyboard selection |
| Table | Button, Icon, Checkbox | Sort, select rows, pagination |
| DatePicker | Input, Calendar | Calendar trigger, date formatting, validation |

## When to Create a Component vs. Extend a Pattern

- Need `:hover`/`:focus`/`:checked` only → stay in pattern
- Need `click` handler to toggle visibility → component
- Need keyboard navigation across items → component
- Need to sync state between multiple elements → component

## Planned Components

Calendar, DatePicker, ComboBox, Dialog, Table

Location: `src/components/` (not yet created)
