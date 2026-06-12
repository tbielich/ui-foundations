# Build Pipeline Architecture

## CSS Layer Order

The final `dist/main.css` bundle applies CSS in this layer cascade:

```
@layer reset;    → src/core/base/reset.css
@layer base;     → src/core/base/fonts.css, base.css, typography.css
@layer tokens;   → dist/tokens/css/*.tokens.css (generated — never edit)
@layer themes;   → src/core/themes/mode.css (color-scheme declaration)
@layer components; → src/ui/patterns/*.css (all component styles)
```

Later layers override earlier ones. Components always win over tokens in the
cascade, which is intentional — component styles apply token values.

## Build Flow

```
npm run build:all
  ├── npm run icons:generate-list    → src/assets/icons/ → icon list
  ├── npm run tokens:generate        → figma/exports/ → dist/tokens/
  └── npm run build:css              → scripts/build-css.mjs
        ├── copies src/core/ → dist/core/
        ├── rewrites dist/core/index.css with all token imports
        ├── copies src/ui/ → dist/ui/
        ├── copies src/react/ → dist/react/
        ├── copies src/assets/ → dist/assets/
        ├── copies site/_includes/macros/ui.njk → dist/macros/ui.njk
        └── inlines all @import statements → dist/main.css
```

## Key: `scripts/build-css.mjs`

This script:
1. Reads all `*.tokens.css` files from `dist/tokens/css/`
2. Sorts them by priority: core → brands → semantics → components → modes
3. Copies `src/core/` to `dist/core/` and rewrites `index.css` with correct
   token imports
4. Copies `src/ui/` to `dist/ui/`
5. Inlines all `@import url(...)` statements recursively into one flat file
6. Hoists any remote `@import` (Google Fonts) to the top
7. Writes final result to `dist/main.css`

## Important: Circular Reference

`src/core/index.css` references files in `dist/tokens/css/`. This means
`tokens:generate` must run BEFORE `build:css`. The `build:all` script handles
this ordering automatically.

## Source Directories

| Directory | Contents | Layer |
|-----------|----------|-------|
| `src/core/base/reset.css` | CSS reset (margins, box-sizing) | reset |
| `src/core/base/fonts.css` | @font-face declarations | base |
| `src/core/base/base.css` | Body defaults, root variables | base |
| `src/core/base/typography.css` | Heading/body type defaults | base |
| `src/core/themes/mode.css` | `color-scheme: light dark` declaration | themes |
| `src/core/recipes/layout.css` | Reusable layout utilities (not imported into main bundle) | — |
| `src/ui/patterns/*.css` | All component CSS patterns | components |

## `dist/` Is Generated — Never Edit

Everything in `dist/` is overwritten by `build:css`. Edit only in `src/` and
`figma/exports/`.

## Docs Site Build

```
npm run docs:site
  ├── npm run build:all     → generates dist/
  └── eleventy              → builds site/ → _site/
```

Eleventy copies `dist/main.css` to `_site/vendor/ui-foundations/main.css` via
passthrough copy configured in `.eleventy.js`.

## Token File Naming in `dist/tokens/css/`

| File | Scope | Priority |
|------|-------|----------|
| `core.tokens.css` | Primitives | 0 (first) |
| `brand-*.tokens.css` | Brand overrides | 1 |
| `semantic.tokens.css` | Role-based aliases | 2 |
| `component.tokens.css` | Component-specific | 3 |
| `color.light.tokens.css` | Light mode colors | 4 |
| `color.dark.tokens.css` | Dark mode colors | 5 |
