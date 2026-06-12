#!/usr/bin/env node

/**
 * UI Foundations — Build Runner
 *
 * Linear MDA build log for the design system compiler.
 * Outputs a structured, one-time build protocol — no live dashboard,
 * no cursor movement, no frame redraws.
 *
 * Commands:
 *   node scripts/build-dashboard.mjs build   (default — foundation build only)
 *   node scripts/build-dashboard.mjs dev     (build + Eleventy serve + watch)
 *
 * Options:
 *   --verbose      Show all log messages from child processes
 *   --report       Write JSON build report to dist/reports/
 *   --no-color     Disable ANSI colors
 */

import { createInitialState, reduceEvent } from '../build-system/state.mjs';
import { STAGES } from '../build-system/events.mjs';
import { detectEnvironment, MODES } from '../build-system/environment.mjs';
import { runBuild } from '../build-system/orchestrator.mjs';
import { PlainReporter } from '../build-system/reporters/plain.mjs';
import { MdaReporter } from '../build-system/reporters/mda.mjs';
import { writeReport } from '../build-system/reporters/json-report.mjs';

// ─── CLI Parsing ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function hasFlag(name) {
  return args.includes(`--${name}`);
}

// Determine command: first positional arg that isn't a flag
const positional = args.filter((a) => !a.startsWith('--'));
const command = positional[0] || 'build';

const generateReport = hasFlag('report');
const verbose = hasFlag('verbose');

// Command semantics
const isDev = command === 'dev';
const includeSite = isDev;
const serve = isDev;

// ─── Environment ─────────────────────────────────────────────────────────────

const env = detectEnvironment();

// Determine output mode: MDA (structured box-drawing) or PLAIN (CI-safe)
function selectReporterMode(env) {
  if (env.noColor || env.isCI || !env.isTTY) return 'plain';
  return 'mda';
}

const mode = selectReporterMode(env);

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
  const options = {
    env,
    themeName: 'mda',
    version: '0.0.0',
    buildMode: isDev ? 'dev' : 'build',
    verbose,
  };

  if (mode === 'plain') {
    return new PlainReporter(options);
  }
  return new MdaReporter(options);
}

const reporter = createReporter();

// ─── Event Loop ──────────────────────────────────────────────────────────────

function emit(event) {
  state = reduceEvent(state, event);
  reporter.onEvent(event, state);
}

// ─── Signal Handling ─────────────────────────────────────────────────────────

const abortController = new AbortController();

process.on('SIGINT', () => {
  abortController.abort();
  process.exit(130);
});

process.on('SIGTERM', () => {
  abortController.abort();
  process.exit(143);
});

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
    if (mode === 'plain') {
      process.stdout.write(`[report] ${reportPath}\n`);
    }
  }

  process.exit(exitCode);
} catch (err) {
  process.stderr.write(`[fatal] ${err.message}\n`);
  process.exit(1);
}
