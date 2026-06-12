#!/usr/bin/env node

/**
 * UI Foundations — Build Dashboard
 *
 * Terminal control system for the design system compiler.
 * Orchestrates build stages and renders status in real time.
 *
 * Commands:
 *   node scripts/build-dashboard.mjs build   (default — foundation build only)
 *   node scripts/build-dashboard.mjs dev     (build + Eleventy serve + watch)
 *
 * Options:
 *   --plain        Force plain output (no ANSI, no box drawing)
 *   --compact      Force compact mode
 *   --full         Force full dashboard mode
 *   --theme=NAME   Theme: mda (default), amber, phosphor
 *   --report       Write JSON build report to dist/reports/
 *   --verbose      Show all log messages
 */

import { createInitialState, reduceEvent } from '../build-system/state.mjs';
import { STAGES } from '../build-system/events.mjs';
import { detectEnvironment, selectMode, MODES } from '../build-system/environment.mjs';
import { runBuild } from '../build-system/orchestrator.mjs';
import { PlainReporter } from '../build-system/reporters/plain.mjs';
import { CompactReporter } from '../build-system/reporters/compact.mjs';
import { TerminalReporter } from '../build-system/reporters/terminal.mjs';
import { writeReport } from '../build-system/reporters/json-report.mjs';

// ─── CLI Parsing ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function getFlagValue(name) {
  const prefix = `--${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}

// Determine command: first positional arg that isn't a flag
const positional = args.filter((a) => !a.startsWith('--'));
const command = positional[0] || 'build'; // 'build' | 'dev'

const cliMode = hasFlag('plain') ? 'plain'
  : hasFlag('compact') ? 'compact'
    : hasFlag('full') ? 'full'
      : null;

const themeName = getFlagValue('theme') || 'mda';
const generateReport = hasFlag('report');
const verbose = hasFlag('verbose');

// Command semantics
const isDev = command === 'dev';
const includeSite = isDev;
const serve = isDev;

// ─── Environment ─────────────────────────────────────────────────────────────

const env = detectEnvironment();
if (cliMode === 'full' && env.columns < 96) {
  env.columns = 96;
}
const mode = selectMode(env, cliMode);

// ─── Active Stages ───────────────────────────────────────────────────────────

const activeStages = [STAGES.ICONS, STAGES.TOKENS, STAGES.CSS];
if (isDev) {
  activeStages.push(STAGES.SITE);
  activeStages.push(STAGES.SERVER);
}

// ─── State ───────────────────────────────────────────────────────────────────

let state = createInitialState(activeStages);

// ─── Reporter ────────────────────────────────────────────────────────────────

function createReporter() {
  const options = { env, themeName, version: '0.0.0', buildMode: isDev ? 'dev' : 'build' };

  switch (mode) {
    case MODES.FULL:
      return new TerminalReporter(options);
    case MODES.COMPACT:
      return new CompactReporter(options);
    case MODES.PLAIN:
    default:
      return new PlainReporter(options);
  }
}

const reporter = createReporter();

// ─── Event Loop ──────────────────────────────────────────────────────────────

function emit(event) {
  state = reduceEvent(state, event);
  reporter.onEvent(event, state);
}

// ─── Signal Handling ─────────────────────────────────────────────────────────

const abortController = new AbortController();

function cleanup() {
  if (env.isTTY && mode !== MODES.PLAIN) {
    process.stdout.write('\x1b[?25h'); // show cursor
  }
}

process.on('SIGINT', () => {
  abortController.abort();
  cleanup();
  process.exit(130);
});

process.on('SIGTERM', () => {
  abortController.abort();
  cleanup();
  process.exit(143);
});

process.on('exit', () => {
  cleanup();
});

// ─── Hide cursor during interactive rendering ────────────────────────────────

if (env.isTTY && mode !== MODES.PLAIN) {
  process.stdout.write('\x1b[?25l');
}

// ─── Run ─────────────────────────────────────────────────────────────────────

try {
  const { exitCode } = await runBuild(emit, {
    includeSite,
    serve,
    signal: abortController.signal,
  });

  if (generateReport) {
    const reportPath = writeReport(state, {
      version: state.metrics?.version || '0.7.0',
      isCI: env.isCI,
      serve,
    });
    if (mode === MODES.PLAIN) {
      process.stdout.write(`[report] ${reportPath}\n`);
    }
  }

  cleanup();
  process.exit(exitCode);
} catch (err) {
  cleanup();
  process.stderr.write(`[fatal] ${err.message}\n`);
  process.exit(1);
}
