---
inclusion: fileMatch
fileMatchPattern: "site/assets/playground/**,site/components/*-playground.md"
---

# Playground System Architecture

## Overview

The playground is a client-side system that renders interactive component
previews with live code output. It runs entirely in the browser — no server-side
rendering.

## File Structure

| File | Role |
|------|------|
| `site/assets/playground/shared.js` | Utility functions (`quoteAttr`, `normalizeHexColorForPicker`, `normalizeIconName`) |
| `site/assets/playground/state.js` | Control state management (read form inputs, sync to URL params, conditional visibility) |
| `site/assets/playground/code.js` | HTML formatting + Prism.js syntax highlighting |
| `site/assets/playground/renderers.js` | Component render functions → returns `{ element, code }` |
| `site/assets/playground/code-generators.js` | Nunjucks/React code snippet generators per component |

Load order matters: `shared.js` → `state.js` → `code.js` → `renderers.js` →
`code-generators.js`

## Adding a New Playground

### 1. Create a renderer in `renderers.js`

```js
const renderVanillaMyComponent = ({ props, children, meta }) => {
  // props = control values from the form
  // children = text content (if applicable)
  // meta = { state } for preview state simulation

  const element = document.createElement("div");
  // ... build DOM element ...

  const code = `<div class="my-component">...</div>`;
  return { element, code };
};
```

Register it in the `renderers` map at the bottom of the file:

```js
global.UIPlaygroundRenderers = {
  // ... existing entries ...
  "my-component": renderVanillaMyComponent,
};
```

### 2. Add code generators in `code-generators.js`

```js
function njkMyComponent(state) {
  var p = state.props;
  return '{{ ui.myComponent("' + quoteAttr(p.label) + '") }}';
}

function reactMyComponent(state) {
  var p = state.props;
  return '<MyComponent label="' + quoteAttr(p.label) + '" />';
}
```

Register in both `njk` and `react` maps:

```js
global.UIPlaygroundCodeGenerators = {
  njk: { ..., "my-component": njkMyComponent },
  react: { ..., "my-component": reactMyComponent },
};
```

### 3. Create playground page

`site/components/my-component-playground.md`:

```yaml
---
title: My Component Playground
layout: layouts/docs.njk
isPlayground: true
playground:
  renderer: my-component        # must match key in renderers map
  tokenCssPath: src/ui/patterns/my-component.css
  controls:
    - name: label
      label: Label text
      type: text
      default: "Hello"
      source: prop
    - name: disabled
      label: Disabled
      type: checkbox
      default: false
      valueType: boolean
      source: meta
---
```

## Control Schema

Each control in the `controls` array:

| Property | Required | Description |
|----------|----------|-------------|
| `name` | yes | Form input name and prop key |
| `label` | yes | UI label shown in the control panel |
| `type` | yes | `text`, `select`, `checkbox`, `number`, `color` |
| `default` | yes | Initial value |
| `source` | no | `prop` (default), `meta`, or `children` |
| `valueType` | no | `string` (default), `boolean`, `number` |
| `options` | for select | Array of `{ label, value }` objects |
| `visibleWhen` | no | Conditional: `"otherControl=value"` syntax |

## State Flow

1. Page loads → `state.js` reads URL query params → applies to form controls
2. User changes a control → `state.js` reads all controls into a state object
3. State object `{ props, children, meta }` is passed to the renderer
4. Renderer returns `{ element, code }` — element goes to preview, code to
   code panel
5. Code generators produce Nunjucks/React tabs from the same state
6. URL params update via `replaceState` for shareable links

## Renderer Contract

```ts
type RendererInput = {
  props: Record<string, string | boolean | number>;
  children: string | undefined;
  meta: { state?: string };
};

type RendererOutput = {
  element: HTMLElement;   // live DOM node for preview
  code: string;          // HTML source code for code panel
};
```

## Token Table

The code panel includes a "Used Tokens" table generated from the CSS file
specified in `tokenCssPath`. This uses the `componentTokenTable` Eleventy
shortcode (defined in `site/lib/component-token-table.js`).
