#!/usr/bin/env node

/**
 * Dump Figma variables to .figma-token-dump.json
 *
 * This script is meant to be run via the Figma Plugin API (MCP use_figma tool).
 * It outputs a Figma plugin code snippet that, when executed, returns the
 * variable data needed by sync-figma-tokens.mjs.
 *
 * Usage:
 *   1. Copy the generated plugin code
 *   2. Run it via MCP use_figma tool
 *   3. Save the output to .figma-token-dump.json
 *
 * Or use the integrated npm script:
 *   npm run tokens:sync
 *   (requires Figma desktop + MCP connection)
 */

console.log(`
To dump Figma variables, run the following code via the MCP use_figma tool
(fileKey = your Figma file key):

------- COPY BELOW -------

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const dump = {};

for (const col of collections) {
  const variables = [];
  
  for (const varId of col.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(varId);
    if (!variable) continue;
    
    const defaultModeId = col.modes[0].modeId;
    const value = variable.valuesByMode[defaultModeId];
    const codeSyntax = variable.codeSyntax || {};
    const webSyntax = codeSyntax.WEB || "";
    
    var entry = {
      id: variable.id,
      name: variable.name,
      resolvedType: variable.resolvedType,
      scopes: variable.scopes,
      hiddenFromPublishing: variable.hiddenFromPublishing === true,
      webSyntax: webSyntax,
      value: null,
      alias: null
    };
    
    if (value && value.type === "VARIABLE_ALIAS") {
      var target = await figma.variables.getVariableByIdAsync(value.id);
      if (target) {
        var targetCol = await figma.variables.getVariableCollectionByIdAsync(target.variableCollectionId);
        entry.alias = {
          targetId: value.id,
          targetName: target.name,
          targetCollectionId: target.variableCollectionId,
          targetCollectionName: targetCol ? targetCol.name : ""
        };
      }
    } else {
      entry.value = value;
    }
    
    // For multi-mode collections, capture all mode values
    if (col.modes.length > 1) {
      var modeValues = {};
      for (var mode of col.modes) {
        var mv = variable.valuesByMode[mode.modeId];
        if (mv && mv.type === "VARIABLE_ALIAS") {
          var mvTarget = await figma.variables.getVariableByIdAsync(mv.id);
          modeValues[mode.name] = mvTarget ? { "$ref": mvTarget.name } : null;
        } else {
          modeValues[mode.name] = mv;
        }
      }
      entry.modeValues = modeValues;
    }
    
    variables.push(entry);
  }
  
  dump[col.name] = variables;
}

return JSON.stringify(dump);

------- END -------

Save the returned JSON string to: .figma-token-dump.json
Then run: node scripts/sync-figma-tokens.mjs
`);
