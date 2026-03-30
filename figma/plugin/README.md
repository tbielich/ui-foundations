# Kiro Token Validator & Exporter

Figma Plugin für das UI Foundations Design System. Validiert Komponenten gegen Token-Dateien und exportiert Variablen als JSON.

## Setup

1. Figma Desktop → Plugins → Development → "Import plugin from manifest"
2. `figma/plugin/manifest.json` auswählen
3. Plugin starten

## Features

### 🔍 Validate

Vergleicht die Variablen-Bindings einer selektierten Komponente gegen eine Token-Quelle.

- `dist/main.css` oder eine Token-JSON droppen
- Komponente auf dem Canvas selektieren
- "Validate Selection" klicken

Das Plugin:
- traversiert alle Nodes inkl. Kinder
- liest gebundene Variablen und deren Werte für den aktiven Mode
- normalisiert Einheiten (px ↔ rem), Farben (hex ↔ rgb) und Font Weights (String ↔ Number)
- zeigt Match / Mismatch / Unknown pro Binding

Der Light/Dark Toggle wechselt sowohl das Plugin-UI als auch den CSS-Parsing-Kontext.

### 📦 Export

Liest alle lokalen Variable Collections direkt aus der Figma-Datei.

- "Load Collections" klicken
- Pro Collection: Anzahl Tokens, einzelner Download als `.tokens.json`
- "Download All" packt alles als `tokens.zip`

Das JSON-Format ist kompatibel mit `figma/exports/` und kann direkt von `npm run tokens:generate` verarbeitet werden.

## Workflow

```
Figma → Plugin Export → figma/exports/*.tokens.json → npm run build:all → dist/
```

## Einschränkungen

- Kein Netzwerkzugriff (Plugin läuft komplett lokal)
- Kein Write-Zugriff auf Figma (nur lesen und exportieren)
- Font Weight Aliases werden über den Ref-Pfad aufgelöst (z.B. `Font/Weight/700` → `700`)
