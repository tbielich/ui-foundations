#!/usr/bin/env node

/**
 * Figma Variable Rewire Script
 *
 * Run this code via MCP `use_figma` to rewire 5 Component token aliases
 * from Brand/Corner/* (Themes) to Corner/* (Semantics).
 *
 * Context: ADR adr-semantic-corner-indirection.md
 * This script makes Figma match the local export file changes.
 */

console.log(`
Run the following code via the MCP use_figma tool:

------- COPY BELOW -------

// Rewire Component corner-radius variables to reference Semantic Corner tokens
// instead of Brand/Corner tokens from Themes.

const rewireMap = [
  {
    // Button/Border/Radius → Corner/Button Radius
    sourceId: "VariableID:3:14",
    targetName: "Corner/Button Radius",
    targetCollection: "Semantics (Roles)"
  },
  {
    // Modal/Surface/Border Radius → Corner/Modal Radius
    sourceId: "VariableID:77:79",
    targetName: "Corner/Modal Radius",
    targetCollection: "Semantics (Roles)"
  },
  {
    // Input/Border/Radius → Corner/Input Radius
    sourceId: "VariableID:2028:310",
    targetName: "Corner/Input Radius",
    targetCollection: "Semantics (Roles)"
  },
  {
    // Form/Border/Radius → Corner/Form Radius
    sourceId: "VariableID:2070:531",
    targetName: "Corner/Form Radius",
    targetCollection: "Semantics (Roles)"
  },
  {
    // Select/Border/Radius → Corner/Input Radius
    sourceId: "VariableID:2773:45",
    targetName: "Corner/Input Radius",
    targetCollection: "Semantics (Roles)"
  }
];

// First, we need to create Corner/Input Radius in Semantics if it doesn't exist.
// Find the Semantics collection
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const semanticsCol = collections.find(c => c.name === "Semantics (Roles)");
const componentsCol = collections.find(c => c.name === "Components (UI)");
const themesCol = collections.find(c => c.name === "Themes (Brands)");

if (!semanticsCol || !componentsCol || !themesCol) {
  return JSON.stringify({ error: "Required collections not found" });
}

// Check if Corner/Input Radius already exists in Semantics
let inputRadiusVar = null;
for (const varId of semanticsCol.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(varId);
  if (v && v.name === "Corner/Input Radius") {
    inputRadiusVar = v;
    break;
  }
}

// If it doesn't exist, create it (alias to Brand/Corner/Input in Themes)
if (!inputRadiusVar) {
  // Find Brand/Corner/Input in Themes
  let brandCornerInput = null;
  for (const varId of themesCol.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(varId);
    if (v && v.name === "Brand/Corner/Input") {
      brandCornerInput = v;
      break;
    }
  }

  if (!brandCornerInput) {
    return JSON.stringify({ error: "Brand/Corner/Input not found in Themes" });
  }

  inputRadiusVar = figma.variables.createVariable(
    "Corner/Input Radius",
    semanticsCol,
    "FLOAT"
  );
  inputRadiusVar.scopes = ["CORNER_RADIUS"];
  inputRadiusVar.codeSyntax = { WEB: "var(--corner-input-radius)" };

  const semanticsDefaultMode = semanticsCol.modes[0].modeId;
  inputRadiusVar.setValueForMode(semanticsDefaultMode, {
    type: "VARIABLE_ALIAS",
    id: brandCornerInput.id
  });
}

// Now rewire the 5 Component variables
const results = [];

for (const mapping of rewireMap) {
  // Find source variable in Components
  const sourceVar = await figma.variables.getVariableByIdAsync(mapping.sourceId);
  if (!sourceVar) {
    results.push({ source: mapping.sourceId, status: "NOT_FOUND" });
    continue;
  }

  // Find target variable in Semantics
  let targetVar = null;
  for (const varId of semanticsCol.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(varId);
    if (v && v.name === mapping.targetName) {
      targetVar = v;
      break;
    }
  }

  if (!targetVar) {
    results.push({ source: sourceVar.name, target: mapping.targetName, status: "TARGET_NOT_FOUND" });
    continue;
  }

  // Set the alias for the default mode of the Components collection
  const compDefaultMode = componentsCol.modes[0].modeId;
  sourceVar.setValueForMode(compDefaultMode, {
    type: "VARIABLE_ALIAS",
    id: targetVar.id
  });

  results.push({
    source: sourceVar.name,
    target: targetVar.name,
    status: "REWIRED"
  });
}

return JSON.stringify({ created: inputRadiusVar ? "Corner/Input Radius" : null, rewired: results }, null, 2);

------- END -------

After running this, do a full token sync to verify roundtrip:
  1. Run the dump code (npm run tokens:dump) via MCP
  2. Save to .figma-token-dump.json
  3. npm run tokens:sync
  4. npm run ci:check
`);
