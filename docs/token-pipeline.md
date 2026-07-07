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
| `Appearance (Modes).tokens.json` | Appearance | Mode-dependent decisions such as light/dark color assignments |
| `Semantics (Brands).tokens.json` | Brand semantics | Brand-scoped semantic roles (references Core and Appearance) |
| `Patterns (UI).tokens.json` | Patterns | Pattern-specific tokens (references Semantics (Brands), Appearance, or Core) |
| `Typography (Fluid).tokens.json` | Typography | Fluid typography mode values |

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
| `appearance-modes.tokens.mode-light.json` | Light mode colors |
| `appearance-modes.tokens.mode-dark.json` | Dark mode colors |
| `patterns-ui.tokens.json` | Pattern tokens |
| `semantics-brands.tokens.brand-a.json` | Brand A semantic roles |
| `semantics-brands.tokens.brand-b.json` | Brand B semantic roles |
| `semantics-brands.tokens.brand-c.json` | Brand C semantic roles |
| `typography-fluid.tokens.mode-min.json` | Minimum fluid typography values |
| `typography-fluid.tokens.mode-max.json` | Maximum fluid typography values |

## Naming Migration And Compatibility

`Semantics (Brands)` replaces the former `Themes (Brands)` collection concept.
This is a naming migration for the collection and generated internal filenames,
not a token-name migration.

Compatibility decisions:

- **Internal rename**: `Themes (Brands).tokens.json` moved to
  `Semantics (Brands).tokens.json`.
- **Generated rename**: `themes-brands.tokens.*` moved to
  `semantics-brands.tokens.*`.
- **Backwards-compatible package API**: existing package exports such as
  `ui-foundations/tokens/brand-a.css` and `ui-foundations/tokens/brand-a.json`
  remain available and now point to the `semantics-brands` files.
- **New explicit aliases**: `ui-foundations/tokens/brand-semantics-a.css` and
  matching JSON exports are available for code that wants the new terminology.
- **Sync compatibility**: `scripts/sync-figma-tokens.mjs` still accepts an old
  dump key named `Themes (Brands)` and writes it to the new
  `Semantics (Brands).tokens.json` file.
- **Deferred**: CSS custom property names such as `--brand-*` remain stable to
  avoid unnecessary downstream breakage.

## Validation

| Command | What it checks |
|---|---|
| `npm run tokens:validate` | Token file structure, alias resolution, CSS variable consistency |
| `npm run dtcg:validate` | DTCG compliance: alias syntax, color format, type vocabulary, schema |
| `npm run ci:check` | Full pipeline including both validators |
