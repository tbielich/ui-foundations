# Figma Plugin API Reference for Agents

Rules and patterns for working with the Figma Plugin API in this repo's Token Foundry plugin (`figma/plugin/`).

## Critical Rules

1. All variable API calls must use async versions (`getVariableByIdAsync`, `getLocalVariablesAsync`, `getVariableCollectionByIdAsync`, `getLocalVariableCollectionsAsync`). Sync versions throw when `documentAccess: "dynamic-page"` is set.
2. Colors use 0-1 range, not 0-255: `{ r: 1, g: 0, b: 0 }` = red.
3. Fills and strokes are read-only arrays — clone, modify, reassign.
4. Fonts must be loaded before any text operation: `await figma.loadFontAsync({ family, style })`.
5. Pages load incrementally — use `await figma.setCurrentPageAsync(page)` to switch.
6. `layoutSizingHorizontal/Vertical = 'FILL'` must be set after `parent.appendChild(child)`.
7. `figma.notify()` is not available in all contexts — use `figma.ui.postMessage()` instead.
8. `console.log()` output is not visible to the user — communicate via `postMessage`.
9. Always set `variable.scopes` explicitly when creating variables. Default `ALL_SCOPES` pollutes every property picker.

## Async API Migration

All these sync calls are deprecated and throw with `documentAccess: "dynamic-page"`:

| Deprecated (sync) | Replacement (async) |
|---|---|
| `figma.variables.getVariableById()` | `figma.variables.getVariableByIdAsync()` |
| `figma.variables.getVariableCollectionById()` | `figma.variables.getVariableCollectionByIdAsync()` |
| `figma.variables.getLocalVariables()` | `figma.variables.getLocalVariablesAsync()` |
| `figma.variables.getLocalVariableCollections()` | `figma.variables.getLocalVariableCollectionsAsync()` |
| `figma.getNodeById()` | `figma.getNodeByIdAsync()` |
| `figma.getStyleById()` | `figma.getStyleByIdAsync()` |
| `figma.currentPage = page` | `await figma.setCurrentPageAsync(page)` |

## Variable Patterns

### Reading variables

```js
var collections = await figma.variables.getLocalVariableCollectionsAsync();
var variables = await figma.variables.getLocalVariablesAsync();
```

### Resolving aliases

```js
async function resolveValue(val, depth) {
  if (depth > 20 || !val) return null;
  if (typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
    var ref = await figma.variables.getVariableByIdAsync(val.id);
    if (ref) {
      var col = await figma.variables.getVariableCollectionByIdAsync(ref.variableCollectionId);
      var modeId = col ? col.defaultModeId : null;
      if (modeId && ref.valuesByMode[modeId] !== undefined)
        return resolveValue(ref.valuesByMode[modeId], depth + 1);
    }
    return null;
  }
  return val;
}
```

### Binding variables to nodes

```js
// setBoundVariable takes a Variable object, not an ID
var variable = await figma.variables.getVariableByIdAsync(variableId);
node.setBoundVariable('fills', variable);
```

### Reading bound variables

```js
if (node.boundVariables) {
  for (var [property, binding] of Object.entries(node.boundVariables)) {
    var entries = Array.isArray(binding) ? binding : [binding];
    for (var entry of entries) {
      var variable = await figma.variables.getVariableByIdAsync(entry.id);
      // variable.name, variable.resolvedType, variable.valuesByMode
    }
  }
}
```

## Mode Handling

### Reading active modes from node hierarchy

```js
function getActiveModes(node) {
  var modes = new Map();
  var current = node;
  while (current) {
    if (current.explicitVariableModes) {
      for (var colId in current.explicitVariableModes) {
        if (!modes.has(colId)) modes.set(colId, current.explicitVariableModes[colId]);
      }
    }
    current = current.parent;
  }
  return modes;
}
```

### Resolving mode-specific values

```js
async function resolveModeId(variable, activeModes) {
  var col = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
  if (!col) return null;
  return activeModes.get(variable.variableCollectionId) || col.defaultModeId;
}
```

## Common Gotchas

- `figma.currentPage.findOne()` only searches the current page, not the whole document.
- Optional chaining (`?.`) is not supported in the Figma plugin sandbox — use `(obj || {}).prop` instead.
- `for...of` with `Object.entries()` works, but `const` in loops may cause issues in older sandbox versions — prefer `var`.
- Large files: cache `getLocalVariablesAsync()` results when doing bulk operations instead of calling per-variable.
- Color values from Figma are 0-1 floats. CSS expects 0-255 integers or hex. Always convert.

## Plugin Structure in This Repo

```
figma/plugin/
  manifest.json   — plugin config (id, documentAccess, networkAccess)
  code.js         — main thread (Plugin API access, no DOM)
  ui.html         — UI thread (DOM, user interaction, no Plugin API)
```

Communication between threads:
- `code.js` → `ui.html`: `figma.ui.postMessage({ type, data })`
- `ui.html` → `code.js`: `parent.postMessage({ pluginMessage: { type, data } }, '*')`

## References

- [Figma Plugin API docs](https://www.figma.com/plugin-docs/)
- [Dynamic page loading migration](https://developers.figma.com/docs/plugins/migrating-to-dynamic-loading)
- [Plugin manifest reference](https://www.figma.com/plugin-docs/manifest/)
