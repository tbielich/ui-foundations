# Kiro Token Validator & Exporter

Figma plugin for the UI Foundations design system. Validates components against token files and exports variables as JSON.

## Setup

1. Figma Desktop → Plugins → Development → "Import plugin from manifest"
2. Select `figma/plugin/manifest.json`
3. Run the plugin

## Features

### 🔍 Validate

Compares variable bindings of a selected component against a token source.

- Drop `dist/main.css` or a token JSON file
- Select a component on the canvas
- Click "Validate Selection"

The plugin:
- Traverses all nodes including children
- Reads bound variables and their values for the active mode
- Normalizes units (px ↔ rem), colors (hex ↔ rgb), and font weights (string ↔ number)
- Shows match / mismatch / unknown per binding

The light/dark toggle switches both the plugin UI and the CSS parsing context.

### 📦 Export

Reads all local variable collections directly from the Figma file.

- Click "Load Collections"
- Per collection: token count, individual download as `.tokens.json`
- "Download All" bundles everything as `tokens.zip`

The JSON format is compatible with `figma/exports/` and can be processed directly by `npm run tokens:generate`.

## Workflow

```
Figma → Plugin Export → figma/exports/*.tokens.json → npm run build:all → dist/
```

## Limitations

- No network access (plugin runs entirely locally)
- No write access to Figma (read and export only)
- Font weight aliases are resolved via ref path (e.g. `Font/Weight/700` → `700`)
