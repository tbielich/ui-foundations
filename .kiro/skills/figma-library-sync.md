# Skill: Figma Library Sync

Sync the UI Foundations design system from code tokens into a Figma library file.
Creates and updates variable collections, components, code syntax, and code snippets.

## When to Use

Activate this skill when the user asks to:
- Sync tokens to Figma
- Create or update a Figma component library from code
- Push design tokens to a Figma file
- Add code syntax to Figma variables
- Rebuild Figma components from CSS patterns

## Prerequisites

- Figma power must be activated (`kiroPowers` → activate `figma`)
- Target Figma file URL with a page node ID must be provided
- The file key is extracted from the URL: `figma.com/design/:fileKey/...`

## Token Architecture (4 layers)

The system uses a strict 4-layer token hierarchy. Never mix layers.

| Layer | Figma Collection | Source File | Modes |
|---|---|---|---|
| Core Primitives | `Core Primitives` | `dist/tokens/css/core-primitives.tokens.css` | Default |
| Brand Themes | `Brand Themes` | `dist/tokens/css/themes-brands.tokens.*.css` | Brand A, Brand B |
| Appearance Modes | `Appearance Modes` | `dist/tokens/css/appearance-modes.tokens.mode-*.css` | Light, Dark |
| Semantics Roles | `Semantics Roles` | `dist/tokens/css/semantics-roles.tokens.css` | Default |
| Components UI | `Components UI` | `dist/tokens/css/components-ui.tokens.css` | Default |

## Workflow

### Step 1: Parse Token CSS Files

Read each CSS file from `dist/tokens/css/`. Extract variable names and values.
Token names use `/` separators in Figma (e.g. `color/neutral/100`), converted from
CSS `--color-neutral-100`.

### Step 2: Create Variable Collections

For each layer, create a Figma variable collection using `figma.variables.createVariableCollection()`.
Add modes where needed (Brand A/B, Light/Dark).

Variable types:
- Color tokens → `'COLOR'` variables with `{ r, g, b, a }` values (0–1 range)
- Spacing, radius, border, font-size, line-height, font-weight → `'FLOAT'` variables

For alias tokens (e.g. `--color-text-default: var(--color-neutral-800)`), use
`{ type: 'VARIABLE_ALIAS', id: targetVar.id }` as the value.

### Step 3: Add Code Syntax to Variables

Every variable must have code syntax for three platforms using `v.setVariableCodeSyntax()`:

| Platform | Key | Format | Example |
|---|---|---|---|
| Web | `'WEB'` | CSS custom property | `--color-text-default` |
| iOS | `'iOS'` | Swift dot notation | `Color.textDefault` |
| Android | `'ANDROID'` | Snake case | `color_text_default` |

Naming rules:
- **WEB**: `--` prefix, `/` → `-`
- **iOS**: First segment becomes type (`Color.`, `Button.`, `Typography.`), rest is camelCase
- **Android**: `/` → `_`, `-` → `_`

### Step 4: Create Components

Components live on a dedicated page. Each component is a `COMPONENT_SET` with variants.

Current components and their variant properties:

| Component | Variants |
|---|---|
| Icon | Single component, `Name` text property |
| Label Content | `Has Text` (True/False) |
| Button | `Variant` (■ Solid/□ Outline/◇ Ghost), `State` (◻ Default/◼ Hover/▣ Active), `Disabled`, `Icon Only` |
| Input | `State` (◻ Default/◼ Hover/▣ Active/◎ Readonly/◌ Placeholder), `Disabled` |
| Checkbox | `Checked` (☐ Unchecked/☑ Checked/▣ Indeterminate), `State` (◻ Default/◼ Hover), `Disabled` |
| Radio | `Checked` (boolean), `State` (◻ Default/◼ Hover), `Disabled` |
| Switch | `Checked` (boolean), `State` (◻ Default/◼ Hover/▣ Active), `Disabled` |
| Badge | `Variant` (○ Default/● Brand/✓ Success/✕ Danger), `Size` (▬ Md/▪ Sm) |
| Button Group | `Orientation` (→ Horizontal/↓ Vertical), `Attached` (⊞ true/⊟ false) |
| Link | `State` (◻ Default/◼ Hover/▣ Active) |
| Field Label | `Required` (boolean) |
| Checkbox Field | `Checked` (☐/☑/▣ enum), `Is Disabled` — nests Checkbox instance |
| Radio Field | `Checked` (boolean), `Is Disabled` — nests Radio instance |
| Switch Field | `Checked` (boolean), `Is Disabled` — nests Switch instance |

Variant naming rules:
- Enum values get leading unicode symbols (→ ↓ ■ □ ◇ ☐ ☑ etc.)
- Two-state properties (only checked/unchecked) use boolean `true`/`false`
- Three-state properties (unchecked/checked/indeterminate) use enum with symbols

### Step 5: Bind Tokens to Components

Use `figma.variables.setBoundVariableForPaint()` for fills and strokes.
Use `node.setBoundVariable()` for `strokeWeight`, `topLeftRadius`, `paddingLeft`, `itemSpacing`, etc.

Each component variant must bind to its own component-layer tokens, never to
semantic or core tokens directly.

### Step 6: Add Code Snippets

Store code snippets on each component set and its variant children using:
```js
node.setSharedPluginData('code_snippets', 'snippets', JSON.stringify([
  { title: 'Web (HTML/CSS)', language: 'HTML', code: '...' },
  { title: 'SwiftUI', language: 'SWIFT', code: '...' },
  { title: 'Jetpack Compose', language: 'KOTLIN', code: '...' }
]));
```

Also set the component `description` field with inline code examples for all three platforms.

### Step 7: Nest Component Instances in Field Components

Field components (Checkbox Field, Radio Field, Switch Field) must use actual
instances of their control component — never plain shapes. This allows users to
swap the nested instance variant to change checked/disabled state directly on the
field component.

## Figma Plugin API Patterns

### Creating a color variable with alias
```js
const v = figma.variables.createVariable('color/text/default', collection, 'COLOR');
v.setValueForMode(modeId, { type: 'VARIABLE_ALIAS', id: sourceVar.id });
```

### Binding a fill to a variable
```js
const paint = figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } },
  'color',
  variable
);
node.fills = [paint];
```

### Binding a float to a variable
```js
node.setBoundVariable('strokeWeight', variable);
node.setBoundVariable('topLeftRadius', variable);
node.setBoundVariable('paddingLeft', variable);
node.setBoundVariable('itemSpacing', variable);
```

### Setting code syntax
```js
variable.setVariableCodeSyntax('WEB', '--color-text-default');
variable.setVariableCodeSyntax('iOS', 'Color.textDefault');
variable.setVariableCodeSyntax('ANDROID', 'color_text_default');
```

### Fixed-size auto-layout component (checkbox, radio)
```js
comp.layoutMode = 'HORIZONTAL';
comp.primaryAxisAlignItems = 'CENTER';
comp.counterAxisAlignItems = 'CENTER';
comp.layoutSizingHorizontal = 'FIXED';
comp.layoutSizingVertical = 'FIXED';
comp.resize(24, 24);
```

### Combining variants into a component set
```js
const set = figma.combineAsVariants(componentArray, parentPage);
set.name = 'Button';
set.layoutMode = 'HORIZONTAL';
set.layoutWrap = 'WRAP';
```

## Gotchas

- `setBoundVariable('fills', ...)` does NOT work — use `setBoundVariableForPaint()` on the paint object instead
- `layoutSizingHorizontal = 'FILL'` can only be set AFTER the node is appended to an auto-layout parent
- `layoutWrap = 'WRAP'` only works on `layoutMode = 'HORIZONTAL'` frames
- `figma.setCurrentPageAsync(page)` is required — `figma.currentPage = page` is not supported
- Font must be loaded before setting text: `await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })`
- For "Inter" font, the style is "Semi Bold" (with space), not "SemiBold"
- Code Connect API mappings require components to be published to a team library first
- `currentColor` in SVGs renders as black in Figma (no CSS cascade) — this is fine for icons

## Source Files Reference

| Surface | Path |
|---|---|
| Token CSS (core) | `dist/tokens/css/core-primitives.tokens.css` |
| Token CSS (modes) | `dist/tokens/css/appearance-modes.tokens.mode-*.css` |
| Token CSS (semantics) | `dist/tokens/css/semantics-roles.tokens.css` |
| Token CSS (components) | `dist/tokens/css/components-ui.tokens.css` |
| Token CSS (brands) | `dist/tokens/css/themes-brands.tokens.*.css` |
| CSS patterns | `src/ui/patterns/*.css` |
| CSS index | `src/ui/index.css` |
| Icons | `src/assets/icons/*.svg` |
| Code Connect schemas | `schemas/web-*.figma.ts` |
