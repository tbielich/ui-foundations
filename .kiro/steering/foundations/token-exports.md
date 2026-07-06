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
- Every `$ref` must point to a token that exists in Core, Themes, or Modes
- Check `dist/tokens/css/core-primitives.tokens.css` for available Core tokens
- Check `dist/tokens/css/themes-brands.tokens.brand-*.css` for available Theme tokens
- Check `dist/tokens/css/appearance-modes.tokens.mode-*.css` for available Mode tokens
- Never invent token names that don't exist
- If a needed token doesn't exist, flag it for Figma creation — don't fake it

## Layer Rules

Pattern tokens (`Patterns (UI).tokens.json`) may reference:
- **Core (Primitives)** — raw values (font sizes, radii, spacing primitives)
- **Themes (Brands)** — brand-controlled decisions (corners, spacing semantics, border weights, fonts)
- **Appearance (Modes)** — mode-switched colors (text, fill, border, overlay)

Pattern tokens must **NEVER**:
- Reference other Pattern tokens (no cross-component coupling)
- Reference the Typography (Liquid) collection directly (use Core font-size tokens which get overridden by fluid output)
- Contain hardcoded raw values (every number/color must be an alias)

### No Cross-Pattern References (STRICT)

A pattern token must never alias another pattern's token. Each component owns
its tokens independently and references only downstream layers.

| ✅ Correct | ❌ Wrong |
|---|---|
| `Calendar/Cell/Border Radius` → `Brand/Corner/Button` | `Calendar/Cell/Border Radius` → `Button/Border Radius` |
| `Calendar/Container/Border Size` → `Brand/Size/Border/Default` | `Calendar/Container/Border Size` → `Button/Border/Size Default` |
| `Select/Border Radius` → `Brand/Corner/Input` | `Select/Border Radius` → `Input/Border Radius` |

If two components need the same value, they both reference the same
Brand/Core/Modes source independently.

### Corner Radius References

Reference Brand/Corner tokens directly:

| `$ref` | Use for |
|---|---|
| `Brand/Corner/Button` | Buttons, calendar cells, pill-shaped controls |
| `Brand/Corner/Input` | Inputs, selects, checkboxes |
| `Brand/Corner/Card` | Cards, forms, elevated surfaces |
| `Brand/Corner/Modal` | Modals, dialogs |
| `Size/Radius/full` | Badges, avatars (always pill) |
| `Size/Radius/300` | Textareas, tooltips (content containers) |
| `Size/Radius/400` | Accordions (large containers) |
### Size References (Border Width, Spacing)

Patterns reference **Theme Size tokens** for brand-controlled sizing:

| `$ref` | CSS output | Use for |
|---|---|---|
| `Brand/Size/Border/None` | `--brand-size-border-none` | Disabled borders (invisible) |
| `Brand/Size/Border/Default` | `--brand-size-border-default` | Standard border width |
| `Brand/Size/Border/Thick` | `--brand-size-border-thick` | Active/hover/focus emphasis |
| `Brand/Size/Spacing/Tight` | `--brand-size-spacing-tight` | Small gaps (badge, link) |
| `Brand/Size/Spacing/Component` | `--brand-size-spacing-component` | Internal padding/gaps |
| `Brand/Size/Spacing/Comfortable` | `--brand-size-spacing-comfortable` | Medium padding |
| `Brand/Size/Spacing/Spacious` | `--brand-size-spacing-spacious` | Large padding/gaps |

For target sizes (min-height/width), use Core directly:

| `$ref` | Use for |
|---|---|
| `Size/Target/Default` | Standard touch target (40px) |
| `Size/Target/Compact` | Small variant (32px) |
| `Size/Target/Large` | Large variant (48px) |

## After Changes
- Run `npm run tokens:generate` and verify zero "missing alias targets"
- Run `npm run ci:check` to validate the full pipeline

## Creating New Pattern Tokens (CRITICAL)

When adding new tokens to `figma/exports/Patterns (UI).tokens.json`:

- **NEVER invent `targetVariableId` values.** The pipeline resolves aliases
  ID-first. A fake ID that collides with an existing token causes silent
  mis-resolution (e.g. spacing resolving to font-size).
- **Omit `targetVariableId`** from `com.figma.aliasData` if you don't know the
  real Figma variable ID. The pipeline will fall back to path-based resolution
  using the `$ref` value, which is always correct.
- Only use real IDs from Figma dumps or the Figma Plugin API.
- Keep `targetVariableName`, `targetVariableSetId`, and `targetVariableSetName`
  for documentation, but they are not used for resolution.

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
