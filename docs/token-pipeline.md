# Token Pipeline

## Overview

Figma is the single source of truth. Tokens flow through a generation pipeline
that transforms Figma Variable exports into DTCG-compliant dist files consumed
by CSS, TypeScript, and JSON tooling.

```
figma/exports/*.tokens.json
        │
        ▼
  npm run tokens:generate
  (scripts/extract-tokens.js)
        │
        ├─► dist/tokens/json/*.json   (DTCG 2025.10 format)
        ├─► dist/tokens/css/*.css     (CSS custom properties)
        ├─► dist/tokens/ts/*.ts       (TypeScript constants)
        └─► dist/tokens/tokens.yaml   (flat index)
```

## Source Format (Figma Exports)

Files in `figma/exports/` are direct Figma Variables REST API exports.

- `$type` uses Figma types: `color`, `number`, `string`
- `$value` aliases use Figma object syntax: `{"$ref": "Path/To/Token"}`
- Color values are Figma objects: `{colorSpace, components, alpha, hex}`
- `$extensions` contains `com.figma.*` metadata (variable IDs, scopes, code syntax, mode values)
- Multi-mode tokens store per-mode values in `$extensions.com.figma.modeValues`

These files are never edited manually. They are replaced on each Figma export.

## Source Files

| File | Layer | Content |
|---|---|---|
| `Core (Primitives).tokens.json` | Core | Raw values: spacing, radii, borders, typography, colors |
| `Appearance (Modes).tokens.json` | Modes | Light/dark color assignments (references Core + Themes) |
| `Semantics (Roles).tokens.json` | Semantic | Intent-based aliases: typography roles, corner radii |
| `Themes (Brands).tokens.json` | Themes | Brand-specific overrides (references Core) |
| `Patterns (UI).tokens.json` | Patterns | Pattern-specific tokens (references Semantic + Core) |

## Pipeline Transforms

The generation script applies these transforms in order:

1. **Flatten & scope** — Tokens are extracted with path segments, CSS variable
   names (from `com.figma.codeSyntax.WEB`), and alias metadata.
2. **Mode expansion** — Files with `com.figma.modeValues` are split into
   separate token sets per mode/brand (e.g., light, dark, brand-a, brand-b).
3. **W3C type mapping** — Figma types are converted to DTCG types:
   - `number` → `dimension` (with `{value, unit}`) for spatial values
   - `string` → `fontFamily` for font family paths
   - `string` → `fontWeight` with numeric mapping for weight paths
   - `number` stays `number` for unitless values (z-index, columns)
4. **DTCG alias conversion** — `{"$ref": "Path/To/Token"}` → `"{Path.To.Token}"`
5. **Color normalization** — Figma color objects → hex strings (`#rrggbb` or `#rrggbbaa`)
6. **Extension cleanup** — All `com.figma.*` keys are stripped from `$extensions`
7. **Schema injection** — `$schema` pointing to DTCG 2025.10 is added to each file

## Dist Format (DTCG 2025.10)

Files in `dist/tokens/json/` follow the DTCG Design Tokens Format Module:

- `$schema` declares `https://www.designtokens.org/schemas/2025.10/format.json`
- `$type` uses DTCG types: `color`, `dimension`, `fontFamily`, `fontWeight`, `number`
- `$value` aliases use DTCG syntax: `"{Group.Path.Token}"`
- Color values are hex strings: `"#333333"`, `"#0000004d"`
- No Figma-specific metadata

## Dist Files

| File | Scope |
|---|---|
| `core-primitives.tokens.json` | All primitives |
| `semantics-roles.tokens.json` | Semantic aliases |
| `appearance-modes.tokens.mode-light.json` | Light mode colors |
| `appearance-modes.tokens.mode-dark.json` | Dark mode colors |
| `patterns-ui.tokens.json` | Pattern tokens |
| `themes-brands.tokens.brand-a.json` | Brand A overrides |
| `themes-brands.tokens.brand-b.json` | Brand B overrides |
| `themes-brands.tokens.brand-c.json` | Brand C overrides |

## Validation

| Command | What it checks |
|---|---|
| `npm run tokens:validate` | Token file structure, alias resolution, CSS variable consistency |
| `npm run dtcg:validate` | DTCG compliance: alias syntax, color format, type vocabulary, schema |
| `npm run ci:check` | Full pipeline including both validators |
