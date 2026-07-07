# Token Sync Workflow

Syncs Figma variables to local export files via the MCP Plugin API, then
regenerates the token pipeline.

## Overview

```
Figma Variables
      ↓  (Agent runs plugin code via MCP use_figma)
.figma-token-dump.json  (temporary, gitignored)
      ↓  (npm run tokens:sync)
figma/exports/*.tokens.json  (persistent, committed)
      ↓  (npm run tokens:generate)
dist/tokens/  (generated CSS, JSON, TS, YAML)
```

## Commands

| Command | Purpose |
|---|---|
| `npm run tokens:dump` | Prints the Figma plugin code to run via MCP |
| `npm run tokens:sync` | Reads dump file, writes exports, runs pipeline |
| `npm run tokens:generate` | Regenerates dist/ from existing exports |
| `npm run build:all` | Icons + tokens + CSS (full rebuild) |

## Step-by-Step (Agent Workflow)

1. Agent executes the dump code from `scripts/dump-figma-variables.mjs` via
   the MCP `use_figma` tool (one call per collection if response is too large).

2. Agent saves the returned JSON to `.figma-token-dump.json` at the repo root.
   The file maps collection names to arrays of variable objects:

   ```json
   {
     "Components (UI)": [ { "id": "...", "name": "Button/...", ... } ],
     "Core (Primitives)": [ ... ],
     ...
   }
   ```

3. Agent runs `npm run tokens:sync`. The script:
   - Reads `.figma-token-dump.json`
   - Writes DTCG-formatted JSON to `figma/exports/` (one file per collection)
   - Runs `npm run tokens:generate` to rebuild `dist/`

4. Agent verifies with `npm run ci:check`.

## Partial Sync

Only collections present in the dump file are updated. Missing collections
keep their existing export file untouched. This means you can sync just
`Components (UI)` without affecting `Core (Primitives)`.

## Variable Dump Format

Each variable object in the dump has this shape:

```json
{
  "id": "VariableID:1:269",
  "name": "Button/Solid/Text Color Default",
  "resolvedType": "COLOR",
  "scopes": ["ALL_SCOPES"],
  "webSyntax": "var(--button-solid-text-color-default)",
  "value": null,
  "alias": {
    "targetId": "VariableID:2616:2",
    "targetName": "Color/Text/On/Brand",
    "targetCollectionId": "VariableCollectionId:2007:325",
    "targetCollectionName": "Appearance (Modes)"
  }
}
```

- `value` is set for raw values (numbers, strings, color objects)
- `alias` is set for variable aliases (references to other tokens)
- `modeValues` is added for multi-mode collections such as Semantics (Brands),
  Appearance, and Typography (Fluid)

## Safety Guarantees

1. **Git diff** — export files are committed; bad syncs are visible and revertable
2. **Pipeline validation** — `tokens:generate` reports missing aliases, duplicates,
   and invalid web syntax (all must be zero)
3. **CI gatekeeper** — `ci:check` validates token usage, DTCG compliance, and
   ensures all CSS references resolve to defined tokens
4. **Partial sync** — collections not in the dump are never modified

## MCP Response Size Limit

The MCP tool response is capped at ~20KB. For large collections (Core has 232
variables), the agent must export collection-by-collection. The sync script
handles this gracefully since it only overwrites collections present in the dump.

## Files

| File | Role |
|---|---|
| `scripts/sync-figma-tokens.mjs` | Reads dump → writes exports → runs pipeline |
| `scripts/dump-figma-variables.mjs` | Prints the Figma plugin code for the agent |
| `.figma-token-dump.json` | Temporary dump file (gitignored) |
| `figma/exports/*.tokens.json` | Persistent DTCG exports (committed) |

## When to Use

- After renaming variables in Figma
- After adding new component tokens
- After changing alias targets
- After any Figma variable cleanup
- As a replacement for the manual Figma plugin export
