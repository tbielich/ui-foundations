// Kiro Plugin — Token Validator + Exporter

figma.showUI(__html__, { width: 480, height: 600, title: 'Token Foundry' });

figma.ui.onmessage = async (msg) => {

  if (msg.type === 'validate') {
    const selection = figma.currentPage.selection;
    if (!selection.length) {
      figma.ui.postMessage({ type: 'error', text: 'No selection. Please select a component or frame.' });
      return;
    }
    const activeModes = getActiveModes(selection[0]);
    const prefix = msg.prefix || '';
    const results = [];
    for (const node of selection) collectResults(node, msg.tokens, results, 0, activeModes, prefix);
    figma.ui.postMessage({ type: 'results', results });
  }

  if (msg.type === 'fix') {
    try {
      await applyFix(msg.fix);
      figma.ui.postMessage({ type: 'fix_ok', fixId: msg.fix.id });
    } catch (err) {
      figma.ui.postMessage({ type: 'fix_error', fixId: msg.fix.id, error: err.message });
    }
  }

  if (msg.type === 'fix_all') {
    const errors = [];
    for (const fix of msg.fixes) {
      try { await applyFix(fix); }
      catch (err) { errors.push({ id: fix.id, error: err.message }); }
    }
    figma.ui.postMessage({ type: 'fix_all_done', errors });
  }

  if (msg.type === 'export') {
    const exports = buildExports();
    figma.ui.postMessage({ type: 'export_data', exports });
  }
};

// ─── FIX ─────────────────────────────────────────────────────────────────────

async function applyFix(fix) {
  // wrong-binding: rebind the node property to the correct variable
  if (fix.fixType === 'rebind') {
    const node = figma.currentPage.findOne(n => n.id === fix.nodeId);
    if (!node) throw new Error('Node not found: ' + fix.nodeId);

    // find the correct variable by matching codeSyntax.WEB against the expected CSS var name
    const expectedCssVar = fix.expectedCssVar;
    const allVars = figma.variables.getLocalVariables();
    const targetVar = allVars.find(v => {
      if (v.codeSyntax && v.codeSyntax.WEB) {
        const web = v.codeSyntax.WEB.replace(/^var\(/, '').replace(/\)$/, '');
        return web === '--' + expectedCssVar || web === expectedCssVar;
      }
      return false;
    });
    if (!targetVar) throw new Error('No variable with WEB syntax: --' + expectedCssVar);

    node.setBoundVariable(fix.property, targetVar);
    return;
  }

  // mismatch: change the variable value
  const variable = figma.variables.getVariableById(fix.variableId);
  if (!variable) throw new Error('Variable not found: ' + fix.variableId);

  const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);
  if (!collection) throw new Error('Collection not found');

  const modeId = fix.modeId || collection.defaultModeId;
  const newValue = parseFixValue(fix.expectedValue, variable.resolvedType);
  variable.setValueForMode(modeId, newValue);
}

function parseFixValue(value, resolvedType) {
  if (resolvedType === 'COLOR') {
    const hex = String(value).replace(/^#/, '');
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    }
    // try rgb(r g b) format
    const m = String(value).match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    if (m) return { r: parseFloat(m[1]) / 255, g: parseFloat(m[2]) / 255, b: parseFloat(m[3]) / 255, a: 1 };
  }
  if (resolvedType === 'FLOAT') {
    // handle rem → px conversion
    const remMatch = String(value).match(/^(-?[\d.]+)rem$/);
    if (remMatch) return parseFloat(remMatch[1]) * 16;
    return parseFloat(value);
  }
  return value;
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────

function buildExports() {
  const collections = figma.variables.getLocalVariableCollections();
  const variables = figma.variables.getLocalVariables();
  const result = {};

  for (const col of collections) {
    const colTokens = {};
    const colVars = variables.filter(v => v.variableCollectionId === col.id);
    for (const variable of colVars) {
      const segments = variable.name.split('/').map(s => s.trim());
      const defaultValue = variable.valuesByMode[col.defaultModeId];
      const modeValues = {};
      for (const mode of col.modes) {
        modeValues[mode.name] = formatExportValue(variable.resolvedType, variable.valuesByMode[mode.modeId]);
      }
      const node = buildTokenNode(variable, defaultValue, modeValues, col);
      setNested(colTokens, segments, node);
    }
    result[col.name] = colTokens;
  }
  return result;
}

function buildTokenNode(variable, defaultValue, modeValues, collection) {
  const $type = figmaTypeToW3C(variable.resolvedType);
  const $value = formatExportValue(variable.resolvedType, defaultValue);
  const extensions = { 'com.figma.variableId': variable.id, 'com.figma.scopes': variable.scopes || [] };
  if (variable.codeSyntax && variable.codeSyntax.WEB) {
    extensions['com.figma.codeSyntax'] = { WEB: variable.codeSyntax.WEB };
  }
  if (defaultValue && typeof defaultValue === 'object' && defaultValue.type === 'VARIABLE_ALIAS') {
    const ref = figma.variables.getVariableById(defaultValue.id);
    extensions['com.figma.aliasData'] = {
      targetVariableId: defaultValue.id,
      targetVariableName: ref ? ref.name : defaultValue.id,
      targetVariableSetId: ref ? ref.variableCollectionId : null,
      targetVariableSetName: ref ? (figma.variables.getVariableCollectionById(ref.variableCollectionId) || {}).name : null,
    };
    extensions['com.figma.isOverride'] = true;
  }
  if (collection.modes.length > 1) extensions['com.figma.modeValues'] = modeValues;
  return { $type, $value, $extensions: extensions };
}

function figmaTypeToW3C(t) { return { COLOR:'color', FLOAT:'number', STRING:'string', BOOLEAN:'boolean' }[t] || 'string'; }

function formatExportValue(resolvedType, value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
    const ref = figma.variables.getVariableById(value.id);
    return { $ref: ref ? ref.name : value.id };
  }
  if (resolvedType === 'COLOR' && typeof value === 'object' && 'r' in value) {
    return { colorSpace:'srgb', components:[value.r,value.g,value.b], alpha:value.a!==undefined?value.a:1, hex:rgbaToHex(value).toUpperCase() };
  }
  return value;
}

function rgbaToHex({ r, g, b, a }) {
  const h = c => Math.round(c * 255).toString(16).padStart(2, '0');
  return '#' + h(r) + h(g) + h(b) + ((a !== undefined && a < 1) ? h(a) : '');
}

function setNested(obj, segments, value) {
  let cur = obj;
  for (let i = 0; i < segments.length - 1; i++) { if (!cur[segments[i]]) cur[segments[i]] = {}; cur = cur[segments[i]]; }
  cur[segments[segments.length - 1]] = value;
}

// ─── VALIDATE ────────────────────────────────────────────────────────────────

function getActiveModes(node) {
  const modes = new Map();
  let current = node;
  while (current) {
    if (current.explicitVariableModes) {
      for (const [colId, modeId] of Object.entries(current.explicitVariableModes)) {
        if (!modes.has(colId)) modes.set(colId, modeId);
      }
    }
    current = current.parent;
  }
  return modes;
}

function resolveModeId(variable, activeModes) {
  const col = figma.variables.getVariableCollectionById(variable.variableCollectionId);
  if (!col) return null;
  return activeModes.get(variable.variableCollectionId) || col.defaultModeId;
}

function collectResults(node, tokens, results, depth, activeModes, prefix) {
  const bindings = getBoundVariables(node, activeModes);
  for (const b of bindings) {
    const normalized = b.name.replace(/^var\(--/, '').replace(/\)$/, '').replace(/^--/, '');
    const tokenValue = findToken(tokens, normalized, prefix);

    var expectedToken = findExpectedToken(tokens, node.name, b.property, prefix);

    let status, expected, expectedName, expectedCssVar;
    if (expectedToken) {
      // compare with prefix stripped from both sides
      var pfxStr = prefix ? normalizeKey(prefix) + '-' : '';
      var expNorm = normalizeKey(expectedToken.cssVar);
      if (pfxStr && expNorm.startsWith(pfxStr)) expNorm = expNorm.slice(pfxStr.length);
      var boundNorm = normalizeKey(b.name);
      if (pfxStr && boundNorm.startsWith(pfxStr)) boundNorm = boundNorm.slice(pfxStr.length);

      if (expNorm !== boundNorm) {
        status = 'wrong-binding';
        expected = expectedToken.value;
        expectedName = expectedToken.cssVar;
        expectedCssVar = expectedToken.rawKey;
      } else {
        expected = tokenValue !== undefined ? tokenValue : expectedToken.value;
        expectedName = null;
        expectedCssVar = null;
        status = valuesMatch(b.value, expected) ? 'match' : 'mismatch';
      }
    } else if (tokenValue === undefined) {
      status = 'unknown';
      expected = null;
      expectedName = null;
      expectedCssVar = null;
    } else {
      expected = tokenValue;
      expectedName = null;
      expectedCssVar = null;
      status = valuesMatch(b.value, tokenValue) ? 'match' : 'mismatch';
    }

    results.push({
      nodeName: node.name, nodeType: node.type, depth,
      nodeId: node.id,
      property: b.property, tokenName: b.name,
      figmaValue: b.value, expectedValue: expected, status,
      expectedVarName: expectedName,
      expectedCssVar: expectedCssVar,
      variableId: b.variableId, modeId: b.modeId,
    });
  }
  if ('children' in node) {
    for (const child of node.children) collectResults(child, tokens, results, depth + 1, activeModes, prefix);
  }
}

// Find the expected variable name for a component property from the token map
// Find the expected token for a component property from the token map
// Returns { cssVar: display name, rawKey: CSS var key, value } or null
function findExpectedToken(tokens, nodeName, property, prefix) {
  const pfx = prefix ? normalizeKey(prefix) + '-' : '';
  const componentSlug = normalizeKey(nodeName);
  const propMap = {
    'fills': ['container-background-default', 'background-default', 'background'],
    'strokes': ['border-color-default', 'border-color', 'color-default'],
    'topLeftRadius': ['border-radius', 'radius'],
    'topRightRadius': ['border-radius', 'radius'],
    'bottomLeftRadius': ['border-radius', 'radius'],
    'bottomRightRadius': ['border-radius', 'radius'],
    'strokeTopWeight': ['border-size-default', 'border-size'],
    'strokeBottomWeight': ['border-size-default', 'border-size'],
    'strokeLeftWeight': ['border-size-default', 'border-size'],
    'strokeRightWeight': ['border-size-default', 'border-size'],
    'maxHeight': ['height-min', 'height-max', 'height'],
    'minHeight': ['height-min', 'height-max', 'height'],
    'itemSpacing': ['gap'],
    'paddingLeft': ['padding-inline'],
    'paddingRight': ['padding-inline'],
    'paddingTop': ['padding-block'],
    'paddingBottom': ['padding-block'],
    'fontSize': ['font-size'],
    'fontFamily': ['font-family'],
    'fontStyle': ['font-weight'],
    'lineHeight': ['line-height'],
  };

  const suffixes = propMap[property];
  if (!suffixes) return null;

  for (var key in tokens) {
    var cleanKey = key.replace(/^--/, '');
    var keyNorm = normalizeKey(cleanKey);
    // strip prefix if present
    if (pfx && keyNorm.startsWith(pfx)) keyNorm = keyNorm.slice(pfx.length);
    if (!keyNorm.startsWith(componentSlug + '-')) continue;
    // get the part after the component slug
    var rest = keyNorm.slice(componentSlug.length + 1);
    for (var i = 0; i < suffixes.length; i++) {
      // exact match on the remaining part, or ends with the suffix
      // but only if the suffix matches a complete segment (after a dash)
      if (rest === suffixes[i] || rest.endsWith('-' + suffixes[i])) {
        return { cssVar: '--' + cleanKey, rawKey: cleanKey, value: tokens[key] };
      }
    }
  }
  return null;
}

function normalizeKey(s) {
  return s.toLowerCase().replace(/[\s/\\]+/g, '-').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
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
      result.push({ property, name: variable.name, value, variableId: variable.id, modeId });
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
      if (modeId && ref.valuesByMode[modeId] !== undefined) return resolveValue(ref.valuesByMode[modeId], activeModes);
    }
    return null;
  }
  return val;
}

function findToken(tokens, name, prefix) {
  function normalize(s) {
    return s.toLowerCase().replace(/[\s/\\]+/g, '-').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
  var pfx = prefix ? normalize(prefix) + '-' : '';
  var needle = normalize(name);
  // strip prefix from needle if present
  if (pfx && needle.startsWith(pfx)) needle = needle.slice(pfx.length);
  for (const [key, val] of Object.entries(tokens)) {
    var cleanKey = normalize(key.replace(/^--/, ''));
    // strip prefix from token key if present
    if (pfx && cleanKey.startsWith(pfx)) cleanKey = cleanKey.slice(pfx.length);
    if (cleanKey === needle) return val;
  }
  return undefined;
}

function valuesMatch(figmaVal, tokenVal) {
  if (figmaVal === null || tokenVal === null) return false;
  const a = String(figmaVal).toLowerCase().trim();
  const b = String(tokenVal).toLowerCase().trim();
  if (a === b) return true;
  const hexA = toHex(a), hexB = toHex(b);
  if (hexA && hexB) return hexA === hexB;
  const pxA = toPx(a), pxB = toPx(b);
  if (pxA !== null && pxB !== null) return Math.abs(pxA - pxB) < 0.5;
  const fwA = toFontWeight(a), fwB = toFontWeight(b);
  if (fwA !== null && fwB !== null) return fwA === fwB;
  return false;
}

function toHex(val) {
  if (/^#[0-9a-f]{3,8}$/.test(val)) return val.slice(0, 7);
  const m = val.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (m) return '#' + [m[1], m[2], m[3]].map(v => Math.round(parseFloat(v)).toString(16).padStart(2, '0')).join('');
  return null;
}

function toPx(val) {
  if (/^[\d.]+$/.test(val)) return parseFloat(val);
  if (/^[\d.]+px$/.test(val)) return parseFloat(val);
  const r = val.match(/^(-?[\d.]+)rem$/);
  if (r) return parseFloat(r[1]) * 16;
  return null;
}

function toFontWeight(val) {
  if (/^\d{1,4}$/.test(val)) return parseInt(val, 10);
  const map = { 'thin':100,'extra-light':200,'extralight':200,'light':300,'normal':400,'regular':400,'medium':500,'semi-bold':600,'semibold':600,'bold':700,'extra-bold':800,'extrabold':800,'black':900 };
  return map[val.replace(/[\s_]+/g, '-')] !== undefined ? map[val.replace(/[\s_]+/g, '-')] : null;
}
