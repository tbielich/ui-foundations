# Build Dashboard — Terminal Control System

The UI Foundations build pipeline includes a terminal dashboard that visualizes
build progress, metrics, and system diagnostics in real time.

## Quick Start

```bash
# Standard build (auto-selects mode based on terminal)
npm run build:all

# With site generation + dev server (stays active)
npm run docs:dev

# Raw/verbose output (no dashboard)
npm run build:verbose

# Verbose dev mode (no dashboard)
npm run docs:dev:verbose
```

## CLI Options

The dashboard script accepts a command and flags:

```bash
node scripts/build-dashboard.mjs <command> [options]
```

| Command | Description |
|---------|-------------|
| `build` | Foundation build only (default) |
| `dev` | Foundation build + Eleventy serve + watch |

| Option | Description |
|--------|-------------|
| `--plain` | Force plain text output (no ANSI, no box drawing) |
| `--compact` | Force compact single-line-per-stage mode |
| `--full` | Force full MDA dashboard mode |
| `--theme=NAME` | Theme: `mda` (default), `amber`, `phosphor` |
| `--report` | Write JSON build report to `dist/reports/` |
| `--verbose` | Show all log messages |

## Rendering Modes

The dashboard auto-selects the rendering mode based on terminal capabilities:

### Full Mode (≥ 96 columns, TTY, color)

```text
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║ UI FOUNDATIONS CONTROL SYSTEM                                         BUILD 0.7.0 / SUCCESS ║
║ DESIGN SYSTEM COMPILER                                                          NODE 22     ║
╠═══════════════════════════════════════════════╦═══════════════════════════════════════════════╣
║ PIPELINE                                     ║ SYSTEM DIAGNOSTICS                            ║
║ 01 ICON REGISTRY         [██████████] OK     ║ ICONS REGISTERED                    289      ║
║ 02 TOKEN EXTRACTION      [██████████] OK     ║ TOKEN FILES                           8      ║
║ 03 CSS COMPILATION       [██████████] OK     ║ MISSING CODESYNTAX                    0      ║
╠══════════════════════════════════════════════════════════════════════════════════════════════╣
║ ACTIVITY STREAM                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝
```

### Compact Mode (60–95 columns, TTY)

```text
┌─ UI FOUNDATIONS 0.7.0 ──────────────────────────────────┐
│ [OK] ICON REGISTRY   289                                │
│ [OK] TOKENS          0 errors                           │
│ [OK] CSS             8 bundles                          │
│ BUILD COMPLETE  289 icons · 550ms                       │
└─────────────────────────────────────────────────────────┘
```

### Plain Mode (CI, NO_COLOR, non-TTY)

```text
[build] UI Foundations 0.7.0
[ok] Icon Registry: 289 icons (112ms)
[ok] Token Extraction: 0 missing, 0 duplicates (209ms)
[ok] CSS Compilation: 8 bundles (240ms)
[done] Build complete in 594ms (289 icons, 8 token files)
```

## Automatic Mode Selection

| Condition | Mode |
|-----------|------|
| `CI=true` | Plain |
| `NO_COLOR` set | Plain |
| Non-TTY (piped output) | Plain |
| Terminal width < 60 | Plain |
| Terminal width 60–95, TTY | Compact |
| Terminal width ≥ 96, TTY | Full |

## Build Stages

### Build mode (`npm run build:all`)

| # | Stage | Source |
|---|-------|--------|
| 01 | Icon Registry | `scripts/generate-icon-list.mjs` |
| 02 | Token Extraction | `scripts/extract-tokens.js` |
| 03 | CSS Compilation | `scripts/build-css.mjs` |

Final state: `BUILD COMPLETE / ARTIFACTS READY`

### Dev mode (`npm run docs:dev`)

| # | Stage | Source |
|---|-------|--------|
| 01 | Icon Registry | `scripts/generate-icon-list.mjs` |
| 02 | Token Extraction | `scripts/extract-tokens.js` |
| 03 | CSS Compilation | `scripts/build-css.mjs` |
| 04 | Site Generation | `eleventy` |
| 05 | Development Server | `eleventy --serve` (long-running) |

Final state: `UI FOUNDATIONS ONLINE / WATCH MODE ACTIVE`

## Architecture

```text
┌──────────────────────────┐
│ BUILD ORCHESTRATOR       │  scripts/build-dashboard.mjs (entry)
│ spawns child processes   │  build-system/orchestrator.mjs
└────────────┬─────────────┘
             │ stdout / stderr / exit codes
             ▼
┌──────────────────────────┐
│ EVENT NORMALIZER         │  build-system/normalizer.mjs
│ text → structured events │
└────────────┬─────────────┘
             │ event objects
             ▼
┌──────────────────────────┐
│ STATE MODEL              │  build-system/state.mjs
│ deterministic reducer    │  build-system/events.mjs
└────────────┬─────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌────────────┐ ┌─────────────┐
│ REPORTERS  │ │ JSON REPORT │
│ terminal   │ │ exporter    │
│ compact    │ └─────────────┘
│ plain      │   build-system/reporters/json-report.mjs
└────────────┘
  build-system/reporters/{terminal,compact,plain}.mjs
```

## Event Model

Events follow a stable schema. Example:

```json
{
  "type": "stage:complete",
  "timestamp": "2026-06-12T18:14:03.420Z",
  "stage": "tokens",
  "durationMs": 300,
  "status": "success"
}
```

### Event Types

| Type | Purpose |
|------|---------|
| `build:start` | Build pipeline begins |
| `build:complete` | All stages finished successfully |
| `build:fail` | Build aborted due to error |
| `stage:start` | Individual stage begins |
| `stage:progress` | Stage progress update |
| `stage:complete` | Stage finished |
| `stage:fail` | Stage encountered error |
| `metric:update` | Numeric metric extracted |
| `artifact:created` | Output artifact generated |
| `log:message` | Log line captured |
| `service:start` | Long-running service starting |
| `service:ready` | Service accepting connections |
| `service:stop` | Service shut down |

## Status Semantics

Status is always communicated with both symbol and text label:

| Status | Label | Meaning |
|--------|-------|---------|
| `wait` | [WAIT] | Not yet started |
| `run` | [RUN] | Currently executing |
| `ok` | [OK] | Completed successfully |
| `warn` | [WARN] | Completed with warnings |
| `fail` | [FAIL] | Failed |

## Themes

Themes are defined via semantic terminal tokens:

```js
{
  foreground, muted, emphasis,
  success, warning, error, info, brand,
  reset, dim, bold
}
```

Available: `mda` (default monochrome), `amber`, `phosphor`

## JSON Build Report

With `--report`, a machine-readable report is written to:

```
dist/reports/build-report.json
```

Schema:

```json
{
  "version": "0.7.0",
  "status": "success",
  "startedAt": "...",
  "completedAt": "...",
  "durationMs": 580,
  "environment": { "mode": "local", "node": "v22.x", "ci": false },
  "metrics": { "icons": 289, "tokenFiles": 8, ... },
  "artifacts": { "css": true, "json": true, ... },
  "stages": { "icons": { "status": "ok", "durationMs": 112 }, ... }
}
```

## CI Behavior

In CI environments (`CI=true` or `GITHUB_ACTIONS=true`):

- Plain mode is always used
- No ANSI escape sequences
- No cursor manipulation
- Exit codes propagate correctly (0 = success, 1 = failure)
- All output goes to stdout in a linear format

## Unicode / ASCII Fallback

On terminals without Unicode support:

- Box-drawing characters degrade to `+`, `-`, `|`, `=`
- Progress blocks degrade to `#`, `:`, `.`
- All information remains readable

## Extending with New Stages

1. Add stage ID to `build-system/events.mjs` (STAGES, STAGE_ORDER, STAGE_LABELS)
2. Add command definition to `build-system/orchestrator.mjs` (BUILD_STAGES)
3. Add parser patterns to `build-system/normalizer.mjs` if the stage has parseable output
4. Tests should cover the new normalizer patterns

## File Inventory

```text
scripts/build-dashboard.mjs          Entry point, CLI parsing, signal handling
build-system/
  events.mjs                         Event types, stage IDs, factory functions
  state.mjs                          State reducer (deterministic)
  environment.mjs                    Terminal detection, box chars, mode selection
  grid.mjs                           Width-safe layout primitives (string-width)
  orchestrator.mjs                   Child process management
  normalizer.mjs                     stdout → structured events
  themes/mda.mjs                     Theme definitions (MDA, amber, phosphor)
  reporters/
    plain.mjs                        CI-safe linear output
    compact.mjs                      Medium-width status lines
    terminal.mjs                     Full MDA dashboard with box drawing
    json-report.mjs                  Machine-readable report exporter
tests/build-system.test.mjs          Unit tests (normalizer, state, reporter)
tests/build-grid.test.mjs            Grid width integrity tests
```
