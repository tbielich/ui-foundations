#!/usr/bin/env node

/**
 * Figma Variable Rewire Script — Semantic Size Tokens
 *
 * Run this code via MCP `use_figma` to:
 * 1. Create 10 new Semantic Size tokens in the Semantics (Roles) collection
 * 2. Rewire 54 Component variable aliases from Core Size/* to Semantic Size/*
 *
 * Context: Week 2 token hygiene — semantic Size role indirection
 */

console.log(`
Run the following code via the MCP use_figma tool:

------- COPY BELOW -------

// === STEP 1: Find collections ===
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const semanticsCol = collections.find(c => c.name === "Semantics (Roles)");
const componentsCol = collections.find(c => c.name === "Components (UI)");
const coreCol = collections.find(c => c.name === "Core (Primitives)");

if (!semanticsCol || !componentsCol || !coreCol) {
  return JSON.stringify({ error: "Required collections not found", found: collections.map(c => c.name) });
}

const semMode = semanticsCol.modes[0].modeId;
const compMode = componentsCol.modes[0].modeId;

// === STEP 2: Find Core Size tokens we need to reference ===
async function findVar(col, name) {
  for (const id of col.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (v && v.name === name) return v;
  }
  return null;
}

const coreBorder000 = await findVar(coreCol, "Size/Border/000");
const coreBorder100 = await findVar(coreCol, "Size/Border/100");
const coreBorder200 = await findVar(coreCol, "Size/Border/200");
const coreRadiusFull = await findVar(coreCol, "Size/Radius/full");
const coreRadius300 = await findVar(coreCol, "Size/Radius/300");
const coreRadius400 = await findVar(coreCol, "Size/Radius/400");
const coreSpacing100 = await findVar(coreCol, "Size/Spacing/100");
const coreSpacing200 = await findVar(coreCol, "Size/Spacing/200");
const coreSpacing300 = await findVar(coreCol, "Size/Spacing/300");
const coreSpacing400 = await findVar(coreCol, "Size/Spacing/400");

if (!coreBorder000 || !coreBorder100 || !coreBorder200 ||
    !coreRadiusFull || !coreRadius300 || !coreRadius400 ||
    !coreSpacing100 || !coreSpacing200 || !coreSpacing300 || !coreSpacing400) {
  return JSON.stringify({ error: "Some Core Size tokens not found" });
}

// === STEP 3: Create or find Semantic Size tokens ===
const semanticDefs = [
  { name: "Size/Border None", coreVar: coreBorder000, scopes: ["STROKE_FLOAT"], web: "var(--size-border-none)" },
  { name: "Size/Border Default", coreVar: coreBorder100, scopes: ["STROKE_FLOAT"], web: "var(--size-border-default)" },
  { name: "Size/Border Emphasis", coreVar: coreBorder200, scopes: ["STROKE_FLOAT"], web: "var(--size-border-emphasis)" },
  { name: "Corner/Pill Radius", coreVar: coreRadiusFull, scopes: ["CORNER_RADIUS"], web: "var(--corner-pill-radius)" },
  { name: "Corner/Content Radius", coreVar: coreRadius300, scopes: ["CORNER_RADIUS"], web: "var(--corner-content-radius)" },
  { name: "Corner/Container Radius", coreVar: coreRadius400, scopes: ["CORNER_RADIUS"], web: "var(--corner-container-radius)" },
  { name: "Size/Spacing Tight", coreVar: coreSpacing100, scopes: ["GAP", "WIDTH_HEIGHT"], web: "var(--size-spacing-tight)" },
  { name: "Size/Spacing Component", coreVar: coreSpacing200, scopes: ["GAP", "WIDTH_HEIGHT"], web: "var(--size-spacing-component)" },
  { name: "Size/Spacing Comfortable", coreVar: coreSpacing300, scopes: ["GAP", "WIDTH_HEIGHT"], web: "var(--size-spacing-comfortable)" },
  { name: "Size/Spacing Spacious", coreVar: coreSpacing400, scopes: ["GAP", "WIDTH_HEIGHT"], web: "var(--size-spacing-spacious)" },
];

const semanticVars = {};
const created = [];

for (const def of semanticDefs) {
  // Check if already exists
  let existing = await findVar(semanticsCol, def.name);
  
  if (!existing) {
    existing = figma.variables.createVariable(def.name, semanticsCol, "FLOAT");
    existing.scopes = def.scopes;
    existing.codeSyntax = { WEB: def.web };
    existing.setValueForMode(semMode, {
      type: "VARIABLE_ALIAS",
      id: def.coreVar.id
    });
    created.push(def.name);
  }
  
  semanticVars[def.name] = existing;
}

// === STEP 4: Rewire Component variables ===
// Map: Core variable ID → Semantic variable to use instead
const rewireMap = {};
rewireMap[coreBorder000.id] = semanticVars["Size/Border None"];
rewireMap[coreBorder100.id] = semanticVars["Size/Border Default"];
rewireMap[coreBorder200.id] = semanticVars["Size/Border Emphasis"];
rewireMap[coreRadiusFull.id] = semanticVars["Corner/Pill Radius"];
rewireMap[coreRadius300.id] = semanticVars["Corner/Content Radius"];
rewireMap[coreRadius400.id] = semanticVars["Corner/Container Radius"];
rewireMap[coreSpacing100.id] = semanticVars["Size/Spacing Tight"];
rewireMap[coreSpacing200.id] = semanticVars["Size/Spacing Component"];
rewireMap[coreSpacing300.id] = semanticVars["Size/Spacing Comfortable"];
rewireMap[coreSpacing400.id] = semanticVars["Size/Spacing Spacious"];

const rewired = [];

for (const varId of componentsCol.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(varId);
  if (!v) continue;
  
  const value = v.valuesByMode[compMode];
  if (value && value.type === "VARIABLE_ALIAS" && rewireMap[value.id]) {
    v.setValueForMode(compMode, {
      type: "VARIABLE_ALIAS",
      id: rewireMap[value.id].id
    });
    rewired.push(v.name);
  }
}

return JSON.stringify({
  created: created,
  rewired: rewired,
  summary: created.length + " semantic vars created, " + rewired.length + " component refs rewired"
}, null, 2);

------- END -------

After running, verify with a roundtrip sync:
  1. Run the Figma dump code via MCP
  2. Save to .figma-token-dump.json
  3. npm run tokens:sync
  4. npm run ci:check
`);
