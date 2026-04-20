---
inclusion: fileMatch
fileMatchPattern: "src/react/**"
---

# React Wrapper Rules

When working with files in `src/react/`, these rules apply:

## Pattern (Rule 12)
- Named `export function` — never `export const` with arrow
- Use `React.createElement` — never JSX
- No CSS imports in React files
- Class array pattern:
  ```js
  const classes = ["component"];
  if (className) classes.push(className);
  ```

## Accessibility
- Warn in dev when interactive components lack `aria-label` or `aria-labelledby`
- Use `warnDev()` helper (see `checkbox.js` or `radio.js` for pattern)

## Label Composition
- If component has a label, wrap in `<label>` with `<span class="component-field__text">`
- Wrapper class: `component-field`, disabled class: `is-disabled`
- Check `hasLabelContent()` before rendering wrapper

## After creating a new wrapper
- Add export to `src/react/index.js`
- See `docs/agentic/assistant-behavior-rules.md` rule 8 for the full surface checklist
