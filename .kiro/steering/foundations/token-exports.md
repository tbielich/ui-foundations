---
inclusion: fileMatch
fileMatchPattern: "figma/exports/**"
---

# Token Export Rules

When working with files in `figma/exports/`, these rules apply:

## Structure
- Each file follows DTCG-like schema: `$type`, `$value`, `$extensions`
- `$extensions.com.figma.codeSyntax.WEB` defines the CSS variable name
- `$value.$ref` creates an alias to another token

## Alias Validation (Rule 10)
- Every `$ref` must point to a token that exists in Core, Modes, or Semantics
- Check `dist/tokens/css/core-primitives.tokens.css` for available Core tokens
- Check `dist/tokens/css/appearance-modes.tokens.mode-*.css` for available Semantic color tokens
- Never invent token names that don't exist (e.g. `Color/Fill/Muted`, `Size/Spacing/50`)
- If a needed Semantic token doesn't exist, flag it for Figma creation — don't fake it

## Layer Rules (Foundation-001)
- Component tokens (`Components (UI).tokens.json`) reference only Semantic or Core
- Semantic tokens reference only Core or Mode primitives
- Never create cross-component references (e.g. Radio referencing Checkbox tokens)

## After Changes
- Run `npm run tokens:generate` and verify zero "missing alias targets"
- Run `npm run ci:check` to validate the full pipeline
