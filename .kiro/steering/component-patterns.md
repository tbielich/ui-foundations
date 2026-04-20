---
inclusion: fileMatch
fileMatchPattern: "src/ui/patterns/**"
---

# Component CSS Pattern Rules

When working with files in `src/ui/patterns/`, these rules apply:

## CSS Conventions (Rule 11)
- Class name = bare component name: `.slider`, `.radio`, `.checkbox`
- Never use prefixes like `.ui-slider` or namespaces
- Always wrap in `@layer components { }`
- Use logical properties: `inline-size`/`block-size`, not `width`/`height`
- Use `var(--token-name)` for all values — never hardcode colors, spacing, or typography

## State Classes
- Pseudo-classes: `:hover`, `:active`, `:focus-visible`, `:disabled`, `:checked`
- Fallback classes: `.is-hover`, `.is-active`, `.is-focus-visible`, `.is-disabled`, `.is-checked`
- Always implement both for playground compatibility

## Token Ownership (Rule 9)
- Every component uses its own `--component-*` tokens
- Never reference another component's tokens (e.g. don't use `--input-checkbox-*` in radio)
- Component tokens are defined in `figma/exports/Components (UI).tokens.json`

## Focus Pattern
```css
.component:focus-visible,
.component.is-focus-visible {
  border-color: var(--component-border-color-focus);
  outline: none;
  box-shadow: 0 0 0 var(--shadow-focus, 0) var(--color-focus, transparent);
}
```

## Required: After creating a new pattern file
- Add import to `src/ui/index.css`
- See `docs/agentic/assistant-behavior-rules.md` rule 8 for the full 10-surface checklist
