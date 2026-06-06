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

## Code Syntax Naming (codeSyntax.WEB)

The CSS variable name is derived from `codeSyntax.WEB` in Figma, NOT from the
JSON key structure. Common pitfalls:

- **Double segments**: If a Figma variable path is `Input/Border/Border Color Default`,
  the auto-generated syntax becomes `--input-border-border-color-default` (doubled).
  Fix: manually set codeSyntax to `var(--input-border-color-default)`.
- **Title Case duplicates**: Figma allows both `Badge/font-size/sm` and
  `Badge/Font Size Sm` — they produce the same CSS var name and cause duplicates.
  Fix: delete the redundant variable in Figma.
- **Validation**: `npm run tokens:generate` reports duplicates. Zero duplicates
  is required for CI to pass.

## On-Color Token Pattern

For text on colored surfaces, use `--color-text-on-*` tokens (not `--color-text-inverse`):

| Token | Use on |
|-------|--------|
| `--color-text-on-brand` | `--color-fill-brand` |
| `--color-text-on-danger` | `--color-fill-danger` |
| `--color-text-on-success` | `--color-fill-success` |
| `--color-text-on-subtle` | `--color-fill-subtle` |
| `--color-text-on-active` | `--color-fill-active` |
| `--color-text-on-disabled` | `--color-fill-disabled` |

These resolve per brand and mode. Prefer them over generic `--color-text-inverse`
in component tokens. Example: `--button-solid-text-color-default` references
`--color-text-on-brand`, not `--color-text-inverse`.
