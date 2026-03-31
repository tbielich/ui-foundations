// Token Foundry — Figma Plugin (dynamic-page compatible)

figma.showUI(__html__, { width: 480, height: 600, title: 'Token Foundry' });

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'validate') {
      var selection = figma.currentPage.selection;
      if (!selection.length) {
        figma.ui.postMessage({ type: 'error', text: 'No selection. Please select a component or frame.' });
        return;
      }
      var activeModes = getActiveModes(selection[0]);
      var prefix = msg.prefix || '';
      var results = [];
      for (var i = 0; i < selection.length; i++) await collectResults(selection[i], msg.tokens, results, 0, activeModes, prefix);
      figma.ui.postMessage({ type: 'results', results });
    }

    if (msg.type === 'fix') {
      await applyFix(msg.fix, null);
      figma.ui.postMessage({ type: 'fix_ok', fixId: msg.fix.id });
    }

    if (msg.type === 'fix_all') {
      var errors = [];
      var varCache = await figma.variables.getLocalVariablesAsync();
      for (var j = 0; j < msg.fixes.length; j++) {
        try { await applyFix(msg.fixes[j], varCache); }
        catch (err) { errors.push({ id: msg.fixes[j].id, error: err.message }); }
      }
      figma.ui.postMessage({ type: 'fix_all_done', errors: errors });
    }

    if (msg.type === 'export') {
      var exports = await buildExports();
      figma.ui.postMessage({ type: 'export_data', exports: exports });
    }
  } catch (err) {
    figma.ui.postMessage({ type: 'fix_error', fixId: msg.fix && msg.fix.id, error: err.message });
  }
};

// ─── FIX ─────────────────────────────────────────────────────────────────────

async function applyFix(fix, varCache) {
  if (fix.fixType === 'rebind') {
    var node = figma.currentPage.findOne(function(n) { return n.id === fix.nodeId; });
    if (!node) throw new Error('Node not found: ' + fix.nodeId);
    var allVars = varCache || await figma.variables.getLocalVariablesAsync();
    var targetVar = allVars.find(function(v) {
      if (v.codeSyntax && v.codeSyntax.WEB) {
        var web = v.codeSyntax.WEB.replace(/^var\(/, '').replace(/\)$/, '');
        return web === '--' + fix.expectedCssVar || web === fix.expectedCssVar;
      }
      return false;
    });
    if (!targetVar) throw new Error('No variable with WEB syntax: --' + fix.expectedCssVar);
    node.setBoundVariable(fix.property, targetVar);
    return;
  }
  var variable = await figma.variables.getVariableByIdAsync(fix.variableId);
  if (!variable) throw new Error('Variable not found: ' + fix.variableId);
  var collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
  if (!collection) throw new Error('Collection not found');
  variable.setValueForMode(fix.modeId || collection.defaultModeId, parseFixValue(fix.expectedValue, variable.resolvedType));
}

function parseFixValue(value, resolvedType) {
  if (resolvedType === 'COLOR') {
    var hex = String(value).replace(/^#/, '');
    if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) {
      return { r: parseInt(hex.slice(0,2),16)/255, g: parseInt(hex.slice(2,4),16)/255, b: parseInt(hex.slice(4,6),16)/255, a: hex.length===8 ? parseInt(hex.slice(6,8),16)/255 : 1 };
    }
    var m = String(value).match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    if (m) return { r: parseFloat(m[1])/255, g: parseFloat(m[2])/255, b: parseFloat(m[3])/255, a: 1 };
  }
  if (resolvedType === 'FLOAT') {
    var remMatch = String(value).match(/^(-?[\d.]+)rem$/);
    if (remMatch) return parseFloat(remMatch[1]) * 16;
    return parseFloat(value);
  }
  return value;
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────

async function buildExports() {
  var collections = await figma.variables.getLocalVariableCollectionsAsync();
  var variables = await figma.variables.getLocalVariablesAsync();
  var result = {}, byCol = {};
  for (var i = 0; i < variables.length; i++) {
    var v = variables[i];
    if (!byCol[v.variableCollectionId]) byCol[v.variableCollectionId] = [];
    byCol[v.variableCollectionId].push(v);
  }
  for (var c = 0; c < collections.length; c++) {
    var col = collections[c], colTokens = {}, colVars = byCol[col.id] || [];
    for (var j = 0; j < colVars.length; j++) {
      var variable = colVars[j];
      var segments = variable.name.split('/').map(function(s) { return s.trim(); });
      var defaultValue = variable.valuesByMode[col.defaultModeId];
      var modeValues = {};
      for (var k = 0; k < col.modes.length; k++) {
        modeValues[col.modes[k].name] = await formatExportValue(variable.resolvedType, variable.valuesByMode[col.modes[k].modeId]);
      }
      setNested(colTokens, segments, await buildTokenNode(variable, defaultValue, modeValues, col));
    }
    result[col.name] = colTokens;
  }
  return result;
}

async function buildTokenNode(variable, defaultValue, modeValues, collection) {
  var $type = ({ COLOR:'color', FLOAT:'number', STRING:'string', BOOLEAN:'boolean' })[variable.resolvedType] || 'string';
  var $value = await formatExportValue(variable.resolvedType, defaultValue);
  var ext = { 'com.figma.variableId': variable.id, 'com.figma.scopes': variable.scopes || [] };
  if (variable.codeSyntax && variable.codeSyntax.WEB) ext['com.figma.codeSyntax'] = { WEB: variable.codeSyntax.WEB };
  if (defaultValue && typeof defaultValue === 'object' && defaultValue.type === 'VARIABLE_ALIAS') {
    var ref = await figma.variables.getVariableByIdAsync(defaultValue.id);
    var refCol = ref ? await figma.variables.getVariableCollectionByIdAsync(ref.variableCollectionId) : null;
    ext['com.figma.aliasData'] = { targetVariableId: defaultValue.id, targetVariableName: ref ? ref.name : defaultValue.id, targetVariableSetId: ref ? ref.variableCollectionId : null, targetVariableSetName: refCol ? refCol.name : null };
    ext['com.figma.isOverride'] = true;
  }
  if (collection.modes.length > 1) ext['com.figma.modeValues'] = modeValues;
  return { $type: $type, $value: $value, $extensions: ext };
}

async function formatExportValue(resolvedType, value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
    var ref = await figma.variables.getVariableByIdAsync(value.id);
    return { $ref: ref ? ref.name : value.id };
  }
  if (resolvedType === 'COLOR' && typeof value === 'object' && 'r' in value) {
    return { colorSpace:'srgb', components:[value.r,value.g,value.b], alpha:value.a!==undefined?value.a:1, hex:rgbaToHex(value).toUpperCase() };
  }
  return value;
}

function rgbaToHex(c) {
  var h = function(v) { return Math.round(v*255).toString(16).padStart(2,'0'); };
  return '#' + h(c.r) + h(c.g) + h(c.b) + ((c.a !== undefined && c.a < 1) ? h(c.a) : '');
}

function setNested(obj, segments, value) {
  var cur = obj;
  for (var i = 0; i < segments.length - 1; i++) { if (!cur[segments[i]]) cur[segments[i]] = {}; cur = cur[segments[i]]; }
  cur[segments[segments.length - 1]] = value;
}

// ─── VALIDATE ────────────────────────────────────────────────────────────────

function getActiveModes(node) {
  var modes = new Map(), current = node;
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

async function resolveModeId(variable, activeModes) {
  var col = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
  if (!col) return null;
  return activeModes.get(variable.variableCollectionId) || col.defaultModeId;
}

async function collectResults(node, tokens, results, depth, activeModes, prefix) {
  var bindings = await getBoundVariables(node, activeModes);
  for (var i = 0; i < bindings.length; i++) {
    var b = bindings[i];
    var normalized = b.name.replace(/^var\(--/, '').replace(/\)$/, '').replace(/^--/, '');
    var tokenValue = findToken(tokens, normalized, prefix);
    var expectedToken = findExpectedToken(tokens, node.name, b.property, prefix);
    var status, expected, expectedName = null, expectedCssVar = null;
    if (expectedToken) {
      var pfxStr = prefix ? normalizeKey(prefix) + '-' : '';
      var expNorm = normalizeKey(expectedToken.cssVar);
      if (pfxStr && expNorm.startsWith(pfxStr)) expNorm = expNorm.slice(pfxStr.length);
      var boundNorm = normalizeKey(b.name);
      if (pfxStr && boundNorm.startsWith(pfxStr)) boundNorm = boundNorm.slice(pfxStr.length);
      if (expNorm !== boundNorm) {
        status = 'wrong-binding'; expected = expectedToken.value; expectedName = expectedToken.cssVar; expectedCssVar = expectedToken.rawKey;
      } else {
        expected = tokenValue !== undefined ? tokenValue : expectedToken.value; status = valuesMatch(b.value, expected) ? 'match' : 'mismatch';
      }
    } else if (tokenValue === undefined) { status = 'unknown'; expected = null; }
    else { expected = tokenValue; status = valuesMatch(b.value, tokenValue) ? 'match' : 'mismatch'; }
    results.push({ nodeName: node.name, nodeType: node.type, depth: depth, nodeId: node.id, property: b.property, tokenName: b.name, figmaValue: b.value, expectedValue: expected, status: status, expectedVarName: expectedName, expectedCssVar: expectedCssVar, variableId: b.variableId, modeId: b.modeId });
  }
  if ('children' in node) {
    for (var j = 0; j < node.children.length; j++) await collectResults(node.children[j], tokens, results, depth + 1, activeModes, prefix);
  }
}

async function getBoundVariables(node, activeModes) {
  var result = [];
  if (!node.boundVariables) return result;
  var props = Object.keys(node.boundVariables);
  for (var i = 0; i < props.length; i++) {
    var property = props[i], binding = node.boundVariables[property];
    var entries = Array.isArray(binding) ? binding : [binding];
    for (var j = 0; j < entries.length; j++) {
      if (!entries[j] || !entries[j].id) continue;
      var variable = await figma.variables.getVariableByIdAsync(entries[j].id);
      if (!variable) continue;
      var modeId = await resolveModeId(variable, activeModes);
      var value = null;
      if (modeId && variable.valuesByMode[modeId] !== undefined) value = await resolveValue(variable.valuesByMode[modeId], activeModes, 0);
      result.push({ property: property, name: variable.name, value: value, variableId: variable.id, modeId: modeId });
    }
  }
  return result;
}

async function resolveValue(val, activeModes, depth) {
  if (depth > 20 || val === null || val === undefined) return null;
  if (typeof val === 'object' && 'r' in val) return rgbaToHex(val);
  if (typeof val === 'object' && 'value' in val && 'unit' in val) return val.value;
  if (typeof val === 'object' && 'type' in val && val.type === 'VARIABLE_ALIAS') {
    var ref = await figma.variables.getVariableByIdAsync(val.id);
    if (ref) {
      var modeId = await resolveModeId(ref, activeModes);
      if (modeId && ref.valuesByMode[modeId] !== undefined) return resolveValue(ref.valuesByMode[modeId], activeModes, depth + 1);
    }
    return null;
  }
  return val;
}

function findExpectedToken(tokens, nodeName, property, prefix) {
  var pfx = prefix ? normalizeKey(prefix) + '-' : '';
  var componentSlug = normalizeKey(nodeName);
  var propMap = { 'fills':['container-background-default','background-default','background'], 'strokes':['border-color-default','border-color','color-default'], 'topLeftRadius':['border-radius','radius'], 'topRightRadius':['border-radius','radius'], 'bottomLeftRadius':['border-radius','radius'], 'bottomRightRadius':['border-radius','radius'], 'strokeTopWeight':['border-size-default','border-size'], 'strokeBottomWeight':['border-size-default','border-size'], 'strokeLeftWeight':['border-size-default','border-size'], 'strokeRightWeight':['border-size-default','border-size'], 'maxHeight':['height-min','height-max','height'], 'minHeight':['height-min','height-max','height'], 'itemSpacing':['gap'], 'paddingLeft':['padding-inline'], 'paddingRight':['padding-inline'], 'paddingTop':['padding-block'], 'paddingBottom':['padding-block'], 'fontSize':['font-size'], 'fontFamily':['font-family'], 'fontStyle':['font-weight'], 'lineHeight':['line-height'] };
  var suffixes = propMap[property];
  if (!suffixes) return null;
  for (var key in tokens) {
    var cleanKey = key.replace(/^--/, ''), keyNorm = normalizeKey(cleanKey);
    if (pfx && keyNorm.startsWith(pfx)) keyNorm = keyNorm.slice(pfx.length);
    if (!keyNorm.startsWith(componentSlug + '-')) continue;
    var rest = keyNorm.slice(componentSlug.length + 1);
    for (var i = 0; i < suffixes.length; i++) {
      if (rest === suffixes[i] || rest.endsWith('-' + suffixes[i])) return { cssVar: '--' + cleanKey, rawKey: cleanKey, value: tokens[key] };
    }
  }
  return null;
}

function normalizeKey(s) { return s.toLowerCase().replace(/[\s/\\]+/g,'-').replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,''); }

function findToken(tokens, name, prefix) {
  var pfx = prefix ? normalizeKey(prefix) + '-' : '', needle = normalizeKey(name);
  if (pfx && needle.startsWith(pfx)) needle = needle.slice(pfx.length);
  for (var key in tokens) {
    var ck = normalizeKey(key.replace(/^--/, ''));
    if (pfx && ck.startsWith(pfx)) ck = ck.slice(pfx.length);
    if (ck === needle) return tokens[key];
  }
  return undefined;
}

function valuesMatch(a, b) {
  if (a === null || b === null) return false;
  var sa = String(a).toLowerCase().trim(), sb = String(b).toLowerCase().trim();
  if (sa === sb) return true;
  var ha = toHex(sa), hb = toHex(sb); if (ha && hb) return ha === hb;
  var pa = toPx(sa), pb = toPx(sb); if (pa !== null && pb !== null) return Math.abs(pa-pb) < 0.5;
  var fa = toFW(sa), fb = toFW(sb); if (fa !== null && fb !== null) return fa === fb;
  return false;
}
function toHex(v) { if (/^#[0-9a-f]{3,8}$/.test(v)) return v.slice(0,7); var m=v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/); return m ? '#'+[m[1],m[2],m[3]].map(function(x){return Math.round(parseFloat(x)).toString(16).padStart(2,'0')}).join('') : null; }
function toPx(v) { if (/^[\d.]+$/.test(v)) return parseFloat(v); if (/^[\d.]+px$/.test(v)) return parseFloat(v); var r=v.match(/^(-?[\d.]+)rem$/); return r ? parseFloat(r[1])*16 : null; }
function toFW(v) { if (/^\d{1,4}$/.test(v)) return parseInt(v,10); var map={'thin':100,'extra-light':200,'extralight':200,'light':300,'normal':400,'regular':400,'medium':500,'semi-bold':600,'semibold':600,'bold':700,'extra-bold':800,'extrabold':800,'black':900}; var k=v.replace(/[\s_]+/g,'-'); return map[k]!==undefined?map[k]:null; }
