# UI Foundations — Figma Library

This Figma file is the single source of truth for the UI Foundations design system.

## Structure

| Page | Content |
|---|---|
| README | This overview |
| Tokens | Variable collections (Primitives, Appearance, Semantics (Brands), Typography, Patterns) |
| Components | Button, Input, Checkbox, Switch, Icon, Label, Link |
| Examples | Composed layouts and usage patterns |
| Assets | Icons and other exportable assets |

## Variable Collections

| Collection | Purpose | Modes |
|---|---|---|
| Core (Primitives) | Raw color, spacing, typography, radius values | — |
| Appearance (Modes) | Mode-dependent rendering decisions such as light/dark color mappings | Light Mode, Dark Mode |
| Semantics (Brands) | Brand-scoped semantic token roles | Brand A, Brand B, Brand C |
| Typography (Fluid) | Fluid typography min/max values | Min, Max |
| Patterns (UI) | Pattern-specific tokens (button, input, etc.) | — |

## Token Naming

Tokens follow the pattern: `Component/Variant/Part/Property/State`

Examples:
- `Button/Solid/Container/Background Default`
- `Button/Border Radius`
- `Color/Text/Default`
- `Typography/Label/Font Size`

## Code Syntax (WEB)

Every variable should have a `codeSyntax.WEB` value set (e.g. `var(--uif-button-border-radius)`). This is how the token pipeline maps Figma variables to CSS Custom Properties.

## Token Foundry Plugin

Token Foundry is the companion plugin for this library. Install it from the organization plugin list.

### Validate

1. Select a component on the canvas
2. Open Token Foundry → Validate tab
3. Drop the project's `dist/main.css` or a token JSON file
4. Click "Validate Selection"

The plugin checks every variable binding against the CSS tokens and shows matches, mismatches, and wrong bindings. Use the Fix button to correct issues directly.

### Export

1. Open Token Foundry → Export tab
2. Click "Load Collections"
3. Download individual collections or all as ZIP

Place the exported JSON files in `figma/exports/` in the code repo, then run `npm run build:all`.

## Workflow

```
Design in Figma → Export via Token Foundry → figma/exports/*.json → npm run build:all → dist/
```

1. Design components using variables from the collections above
2. Set `codeSyntax.WEB` on every new variable
3. Export tokens via Token Foundry plugin
4. Hand off JSON files to the code repo
5. Code repo generates CSS, JSON, TypeScript, and docs automatically

## Links

- Documentation: https://ui-foundations.netlify.app/
- npm package: https://www.npmjs.com/package/ui-foundations
- Starter template: https://github.com/tbielich/ui-foundations-starter
- Code repo: https://github.com/tbielich/ui-foundations
