---
inclusion: fileMatch
fileMatchPattern: "src/ui/patterns/**"
---

# Pattern CSS Rules

When working with files in `src/ui/patterns/`, these rules apply:

## CSS Conventions (Rule 11)
- Class name = bare pattern name: `.slider`, `.radio`, `.checkbox`
- Never use prefixes like `.ui-slider` or namespaces
- Always wrap in `@layer components { }`
- Use logical properties: `inline-size`/`block-size`, not `width`/`height`
- Use `var(--token-name)` for all values — never hardcode colors, spacing, or typography

## State Classes
- Pseudo-classes: `:hover`, `:active`, `:focus-visible`, `:disabled`, `:checked`
- Fallback classes: `.is-hover`, `.is-active`, `.is-focus-visible`, `.is-disabled`, `.is-checked`
- Always implement both for playground compatibility

## Token Ownership (Rule 9)
- Every pattern uses its own `--pattern-*` tokens
- Never reference another pattern's tokens (e.g. don't use `--input-checkbox-*` in radio)
- Pattern tokens are defined in `figma/exports/Components (UI).tokens.json`

## Focus Pattern
```css
.pattern:focus-visible,
.pattern.is-focus-visible {
  border-color: var(--pattern-border-color-focus);
  outline: none;
  box-shadow: 0 0 0 var(--shadow-focus, 0) var(--color-focus, transparent);
}
```

## Required: After creating a new pattern file
- Add import to `src/ui/index.css`
- See `docs/agentic/assistant-behavior-rules.md` rule 8 for the full 10-surface checklist
