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

## Shared Context

This skill relies on shared facts defined in steering files. Do NOT duplicate
those facts here — reference them instead:

- **Token architecture (4 layers), file locations, component list:**
  See `#design-system-context` steering (`foundations/design-system-context.md`)
- **Component variants, naming, Figma structure:**
  See `#figma-components` steering (`figma/figma-components.md`)

## Workflow

### Step 1: Parse Token CSS Files

Read each CSS file from `dist/tokens/css/`. Extract variable names and values.
Token names use `/` separators in Figma (e.g. `color/neutral/100`), converted from
CSS `--color-neutral-100`.

Collections and modes by layer:

| Layer | Figma Collection | Modes |
|---|---|---|
| Core | `Core (Primitives)` | Default |
| Appearance | `Appearance (Modes)` | Light Mode, Dark Mode |
| Semantics (Brands) | `Semantics (Brands)` | Brand A, Brand B, Brand C |
| Typography | `Typography (Fluid)` | Min, Max |
| Patterns | `Patterns (UI)` | Default |

### Step 2: Create Variable Collections

For each layer, create a Figma variable collection using
`figma.variables.createVariableCollection()`. Add modes where needed.

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

Components live on a dedicated page. Each component is a `COMPONENT_SET` with
variants. Refer to the `#figma-components` steering for the full variant table
and naming conventions (unicode-prefixed enum values, boolean properties, etc.).

### Step 5: Bind Tokens to Components

Use `figma.variables.setBoundVariableForPaint()` for fills and strokes.
Use `node.setBoundVariable()` for `strokeWeight`, `topLeftRadius`, `paddingLeft`,
`itemSpacing`, etc.

Each component variant must bind to its own pattern-layer tokens, never to
another pattern's tokens directly.

### Step 6: Add Code Snippets

Store code snippets on each component set and its variant children using:
```js
node.setSharedPluginData('code_snippets', 'snippets', JSON.stringify([
  { title: 'Web (HTML/CSS)', language: 'HTML', code: '...' },
  { title: 'SwiftUI', language: 'SWIFT', code: '...' },
  { title: 'Jetpack Compose', language: 'KOTLIN', code: '...' }
]));
```

Also set the component `description` field with inline code examples for all
three platforms.

### Step 7: Nest Component Instances in Field Components

Field components (Checkbox Field, Radio Field, Switch Field) must use actual
instances of their control component — never plain shapes.

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

- `setBoundVariable('fills', ...)` does NOT work — use `setBoundVariableForPaint()`
- `layoutSizingHorizontal = 'FILL'` can only be set AFTER appending to auto-layout parent
- `layoutWrap = 'WRAP'` only works on `layoutMode = 'HORIZONTAL'` frames
- `figma.setCurrentPageAsync(page)` is required — assignment is not supported
- Font must be loaded before setting text: `await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })`
- For "Inter" font, the style is "Semi Bold" (with space), not "SemiBold"
- Code Connect API mappings require components to be published first
- `currentColor` in SVGs renders as black in Figma — this is fine for icons
