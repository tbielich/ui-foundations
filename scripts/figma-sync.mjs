#!/usr/bin/env node
/**
 * figma-sync.mjs
 * Fetches variables from Figma REST API and writes them to figma/exports/
 * as the same JSON format produced by the Figma "Export Variables" plugin.
 *
 * Usage: node scripts/figma-sync.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(ROOT, 'figma', 'exports');

// Load env
const envPath = path.join(ROOT, '.env');
const env = fs.existsSync(envPath)
  ? Object.fromEntries(
      fs.readFileSync(envPath, 'utf8')
        .split('\n')
        .filter(l => l.includes('='))
        .map(l => l.split('=').map(s => s.trim()))
    )
  : {};

const TOKEN = env.FIGMA_TOKEN || process.env.FIGMA_TOKEN;
const FILE_KEY = env.FIGMA_FILE_KEY || process.env.FIGMA_FILE_KEY;

if (!TOKEN || !FILE_KEY) {
  console.error('[figma-sync] Missing FIGMA_TOKEN or FIGMA_FILE_KEY in .env');
  process.exit(1);
}

async function figmaFetch(endpoint) {
  const res = await fetch(`https://api.figma.com/v1${endpoint}`, {
    headers: { 'X-Figma-Token': TOKEN }
  });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log('[figma-sync] Fetching variables from Figma...');

  const data = await figmaFetch(`/files/${FILE_KEY}/variables/local`);
  const { variables, variableCollections } = data.meta;

  // group variables by collection
  const collectionMap = {};
  for (const col of Object.values(variableCollections)) {
    collectionMap[col.id] = col;
  }

  // build one export file per collection
  const exports = {}; // collectionName → nested token object

  for (const variable of Object.values(variables)) {
    const collection = collectionMap[variable.variableCollectionId];
    if (!collection) continue;

    const colName = collection.name;
    if (!exports[colName]) exports[colName] = {};

    // build nested path from variable name (e.g. "Brand/Color/Primary" → Brand.Color.Primary)
    const segments = variable.name.split('/').map(s => s.trim());

    // build value per mode
    const modeValues = {};
    for (const mode of collection.modes) {
      const raw = variable.valuesByMode[mode.modeId];
      if (raw !== undefined) modeValues[mode.name] = raw;
    }

    // use default mode value as $value
    const defaultMode = collection.modes.find(m => m.modeId === collection.defaultModeId);
    const defaultValue = defaultMode ? variable.valuesByMode[defaultMode.modeId] : null;

    const tokenNode = buildTokenNode(variable, defaultValue, modeValues, collection);

    // set nested in exports[colName]
    setNested(exports[colName], segments, tokenNode);
  }

  // write files
  if (!fs.existsSync(EXPORTS_DIR)) fs.mkdirSync(EXPORTS_DIR, { recursive: true });

  for (const [colName, tokens] of Object.entries(exports)) {
    const fileName = `${colName}.tokens.json`;
    const filePath = path.join(EXPORTS_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2) + '\n');
    console.log(`[figma-sync] ✓ ${fileName}`);
  }

  console.log(`[figma-sync] Done — ${Object.keys(exports).length} collections written to figma/exports/`);
}

function buildTokenNode(variable, value, modeValues, collection) {
  const type = figmaTypeToW3C(variable.resolvedType, value);
  const $value = formatValue(variable.resolvedType, value);

  const node = { $type: type, $value };

  // add extensions (codeSyntax, variableId, scopes)
  const extensions = {
    'com.figma.variableId': variable.id,
    'com.figma.scopes': variable.scopes || [],
  };

  if (variable.codeSyntax && variable.codeSyntax.WEB) {
    extensions['com.figma.codeSyntax'] = { WEB: variable.codeSyntax.WEB };
  }

  // alias data if value is a variable alias
  if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
    extensions['com.figma.aliasData'] = {
      targetVariableId: value.id,
    };
  }

  node.$extensions = extensions;

  // add per-mode values if collection has multiple modes
  if (collection.modes.length > 1) {
    node.$extensions['com.figma.modeValues'] = Object.fromEntries(
      Object.entries(modeValues).map(([mode, val]) => [mode, formatValue(variable.resolvedType, val)])
    );
  }

  return node;
}

function figmaTypeToW3C(resolvedType, value) {
  if (resolvedType === 'COLOR') return 'color';
  if (resolvedType === 'FLOAT') return 'number';
  if (resolvedType === 'STRING') return 'string';
  if (resolvedType === 'BOOLEAN') return 'boolean';
  return 'string';
}

function formatValue(resolvedType, value) {
  if (value === null || value === undefined) return null;

  // alias reference
  if (typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
    return { $ref: value.id };
  }

  if (resolvedType === 'COLOR' && typeof value === 'object' && 'r' in value) {
    const hex = rgbaToHex(value);
    return {
      colorSpace: 'srgb',
      components: [value.r, value.g, value.b],
      alpha: value.a !== undefined ? value.a : 1,
      hex: hex.toUpperCase()
    };
  }

  return value;
}

function rgbaToHex({ r, g, b, a }) {
  const toHex = c => Math.round(c * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return (a !== undefined && a < 1) ? hex + toHex(a) : hex;
}

function setNested(obj, segments, value) {
  let cur = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    if (!cur[segments[i]]) cur[segments[i]] = {};
    cur = cur[segments[i]];
  }
  cur[segments[segments.length - 1]] = value;
}

main().catch(err => {
  console.error('[figma-sync] Error:', err.message);
  process.exit(1);
});
