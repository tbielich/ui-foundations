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
- Pattern tokens (`Patterns (UI).tokens.json`) reference only Semantic or Core
- Semantic tokens reference only Core, Themes (Brands), or Appearance (Modes)
- Never create cross-component references (e.g. Radio referencing Checkbox tokens)
- **Patterns must NEVER reference Themes (Brands) or Appearance (Modes) directly**

### Corner Radius References (Common Mistake)

When a new component needs a border-radius, reference the **Semantic Corner
token**, not the Brand/Corner source:

| ✅ Correct `$ref` | ❌ Wrong `$ref` |
|---|---|
| `Corner/Button Radius` | `Brand/Corner/Button` |
| `Corner/Input Radius` | `Brand/Corner/Input` |
| `Corner/Card Radius` | `Brand/Corner/Card` |
| `Corner/Modal Radius` | `Brand/Corner/Modal` |
| `Corner/Form Radius` | `Brand/Corner/Card` |
| `Corner/Checkbox Radius` | `Brand/Corner/Input` |

Available Semantic Corner tokens (`--corner-*-radius`):
- `Corner/Button Radius` → for buttons and pill-shaped controls
- `Corner/Input Radius` → for inputs, selects, textareas
- `Corner/Card Radius` → for cards and elevated surfaces
- `Corner/Modal Radius` → for modals and dialogs
- `Corner/Form Radius` → for form group containers
- `Corner/Checkbox Radius` → for checkboxes

If no suitable Semantic Corner token exists, **flag it for creation** in the
Semantics collection — do not bypass to Themes.

### Size References (Border Width, Spacing)

Patterns must reference **Semantic Size tokens**, not Core `Size/*` directly:

| ✅ Correct `$ref` | ❌ Wrong `$ref` | Use for |
|---|---|---|
| `Size/Border None` | `Size/Border/000` | Disabled borders (invisible) |
| `Size/Border Default` | `Size/Border/100` | Standard border width |
| `Size/Border Emphasis` | `Size/Border/200` | Active/hover/focus emphasis |
| `Size/Spacing Tight` | `Size/Spacing/100` | Small gaps (badge, link) |
| `Size/Spacing Component` | `Size/Spacing/200` | Internal padding/gaps |
| `Size/Spacing Comfortable` | `Size/Spacing/300` | Medium padding |
| `Size/Spacing Spacious` | `Size/Spacing/400` | Large padding/gaps |
| `Corner/Pill Radius` | `Size/Radius/full` | Pill shapes (badge, avatar) |
| `Corner/Content Radius` | `Size/Radius/300` | Content containers (textarea, tooltip) |
| `Corner/Container Radius` | `Size/Radius/400` | Large containers (accordion) |

If a component needs a size value not covered above, **flag it for Semantic
creation** — do not reference `Size/*` Core tokens directly.

## After Changes
- Run `npm run tokens:generate` and verify zero "missing alias targets"
- Run `npm run ci:check` to validate the full pipeline

## Creating New Semantic Tokens (CRITICAL)

When adding new tokens to `figma/exports/Semantics (Roles).tokens.json`:

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
