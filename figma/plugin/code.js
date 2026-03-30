// Kiro Token Validator — Plugin Main Thread

figma.showUI(__html__, { width: 420, height: 560, title: 'Kiro Token Validator' });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'validate') {
    const tokens = msg.tokens;
    const selection = figma.currentPage.selection;

    if (!selection.length) {
      figma.ui.postMessage({ type: 'error', text: 'No selection. Please select a component or frame.' });
      return;
    }

    // build a map of collectionId → active modeId based on the top-level selected node
    const activeModes = getActiveModes(selection[0]);

    const results = [];
    for (const node of selection) {
      collectResults(node, tokens, results, 0, activeModes);
    }

    figma.ui.postMessage({ type: 'results', results });
  }
};

// Read explicit mode overrides set on a node (and its ancestors)
function getActiveModes(node) {
  const modes = new Map(); // collectionId → modeId

  // walk up the tree to collect all explicit mode assignments
  let current = node;
  while (current) {
    if (current.explicitVariableModes) {
      for (const [collectionId, modeId] of Object.entries(current.explicitVariableModes)) {
        if (!modes.has(collectionId)) modes.set(collectionId, modeId);
      }
    }
    current = current.parent;
  }

  return modes;
}

function resolveModeId(variable, activeModes) {
  const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);
  if (!collection) return null;
  // use explicit mode if set, otherwise fall back to collection default
  return activeModes.get(variable.variableCollectionId) || collection.defaultModeId;
}

function collectResults(node, tokens, results, depth, activeModes) {
  const bindings = getBoundVariables(node, activeModes);

  for (const binding of bindings) {
    const varName = binding.name;       // e.g. "color/brand/primary"
    const varValue = binding.value;     // resolved value from Figma
    const property = binding.property; // e.g. "fills", "strokes"

    // normalize token name: strip leading "--" or "var(--...)" if present
    const normalized = varName
      .replace(/^var\(--/, '')
      .replace(/\)$/, '')
      .replace(/^--/, '');

    const tokenValue = findToken(tokens, normalized);

    let status, expected;
    if (tokenValue === undefined) {
      status = 'unknown'; // token not in JSON
      expected = null;
    } else {
      expected = tokenValue;
      status = valuesMatch(varValue, tokenValue) ? 'match' : 'mismatch';
    }

    results.push({
      nodeName: node.name,
      nodeType: node.type,
      depth,
      property,
      tokenName: varName,
      figmaValue: varValue,
      expectedValue: expected,
      status
    });
  }

  if ('children' in node) {
    for (const child of node.children) {
      collectResults(child, tokens, results, depth + 1, activeModes);
    }
  }
}

function getBoundVariables(node, activeModes) {
  const result = [];
  if (!node.boundVariables) return result;

  for (const [property, binding] of Object.entries(node.boundVariables)) {
    const entries = Array.isArray(binding) ? binding : [binding];
    for (const entry of entries) {
      if (!entry || !entry.id) continue;
      const variable = figma.variables.getVariableById(entry.id);
      if (!variable) continue;

      const modeId = resolveModeId(variable, activeModes);
      let value = null;
      if (modeId && variable.valuesByMode[modeId] !== undefined) {
        value = resolveValue(variable.valuesByMode[modeId], activeModes);
      }

      result.push({ property, name: variable.name, value });
    }
  }
  return result;
}

function resolveValue(val, activeModes) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'object' && 'r' in val) return rgbaToHex(val);
  if (typeof val === 'object' && 'value' in val && 'unit' in val) return val.value;
  if (typeof val === 'object' && 'type' in val && val.type === 'VARIABLE_ALIAS') {
    const ref = figma.variables.getVariableById(val.id);
    if (ref) {
      const modeId = resolveModeId(ref, activeModes);
      if (modeId && ref.valuesByMode[modeId] !== undefined) {
        return resolveValue(ref.valuesByMode[modeId], activeModes);
      }
    }
    return null;
  }
  return val;
}

function rgbaToHex(rgba) {
  const r = Math.round(rgba.r * 255);
  const g = Math.round(rgba.g * 255);
  const b = Math.round(rgba.b * 255);
  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  return rgba.a !== undefined && rgba.a < 1
    ? hex + Math.round(rgba.a * 255).toString(16).padStart(2, '0')
    : hex;
}

function findToken(tokens, name) {
  // normalize a token name to a comparable key
  function normalize(s) {
    return s
      .toLowerCase()
      .replace(/[\s/\\]+/g, '-')   // slash, backslash, spaces → dash
      .replace(/[^a-z0-9-]/g, '-') // anything else → dash
      .replace(/-+/g, '-')         // collapse multiple dashes
      .replace(/^-|-$/g, '');      // trim leading/trailing dashes
  }

  const needle = normalize(name);

  for (const [key, val] of Object.entries(tokens)) {
    // strip CSS var prefix before normalizing
    const cleaned = key.replace(/^--/, '');
    if (normalize(cleaned) === needle) return val;
  }
  return undefined;
}

function valuesMatch(figmaVal, tokenVal) {
  if (figmaVal === null || tokenVal === null) return false;

  const a = String(figmaVal).toLowerCase().trim();
  const b = String(tokenVal).toLowerCase().trim();
  if (a === b) return true;

  // normalize colors: hex ↔ rgb(r g b)
  const hexA = toHex(a), hexB = toHex(b);
  if (hexA && hexB) return hexA === hexB;

  // normalize units: px number ↔ rem (base 16, matches formatLength in extract-tokens.utils.js)
  const pxA = toPx(a), pxB = toPx(b);
  if (pxA !== null && pxB !== null) return Math.abs(pxA - pxB) < 0.5;

  // normalize font weights: "Semi Bold" ↔ 600
  const fwA = toFontWeight(a), fwB = toFontWeight(b);
  if (fwA !== null && fwB !== null) return fwA === fwB;

  return false;
}

function toHex(val) {
  if (/^#[0-9a-f]{3,8}$/.test(val)) return val.slice(0, 7);
  const m = val.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (m) {
    return '#' + [m[1], m[2], m[3]]
      .map(v => Math.round(parseFloat(v)).toString(16).padStart(2, '0'))
      .join('');
  }
  return null;
}

function toPx(val) {
  if (/^[\d.]+$/.test(val)) return parseFloat(val);
  if (/^[\d.]+px$/.test(val)) return parseFloat(val);
  const remMatch = val.match(/^(-?[\d.]+)rem$/);
  if (remMatch) return parseFloat(remMatch[1]) * 16;
  return null;
}

function toFontWeight(val) {
  if (/^\d{1,4}$/.test(val)) return parseInt(val, 10);
  const map = {
    'thin': 100, 'extra-light': 200, 'extralight': 200,
    'light': 300, 'normal': 400, 'regular': 400,
    'medium': 500, 'semi-bold': 600, 'semibold': 600,
    'bold': 700, 'extra-bold': 800, 'extrabold': 800, 'black': 900
  };
  return map[val.replace(/[\s_]+/g, '-')] !== undefined
    ? map[val.replace(/[\s_]+/g, '-')]
    : null;
}
