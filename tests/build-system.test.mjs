import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { normalizeLine, aggregatePages } from '../build-system/normalizer.mjs';
import { createInitialState, reduceEvent } from '../build-system/state.mjs';
import { STAGES, STAGE_STATUS, EVENT_TYPES } from '../build-system/events.mjs';
import * as events from '../build-system/events.mjs';
import { detectEnvironment, selectMode, MODES, getBoxChars } from '../build-system/environment.mjs';
import { PlainReporter } from '../build-system/reporters/plain.mjs';

// ─── Event Normalizer Tests ──────────────────────────────────────────────────

describe('Event Normalizer', () => {
  it('recognizes successful icon generation', () => {
    const result = normalizeLine(
      '✅ Generated schemas/icon-names.ts (289 icons)',
      STAGES.ICONS
    );
    assert.ok(result.length >= 1);
    const metricEvent = result.find((e) => e.type === EVENT_TYPES.METRIC_UPDATE);
    assert.ok(metricEvent);
    assert.equal(metricEvent.metrics.icons, 289);
  });

  it('recognizes token metrics — missing codeSyntax', () => {
    const result = normalizeLine(
      '   • missing codeSyntax.WEB: 3',
      STAGES.TOKENS
    );
    const metricEvent = result.find((e) => e.type === EVENT_TYPES.METRIC_UPDATE);
    assert.ok(metricEvent);
    assert.equal(metricEvent.metrics.missingCodeSyntax, 3);
  });

  it('recognizes token metrics — unparseable codeSyntax', () => {
    const result = normalizeLine(
      '   • unparseable codeSyntax.WEB: 2',
      STAGES.TOKENS
    );
    const metricEvent = result.find((e) => e.type === EVENT_TYPES.METRIC_UPDATE);
    assert.ok(metricEvent);
    assert.equal(metricEvent.metrics.unparseableCodeSyntax, 2);
  });

  it('recognizes token metrics — duplicate CSS variables', () => {
    const result = normalizeLine(
      '   • duplicate css var names (same scope): 1',
      STAGES.TOKENS
    );
    const metricEvent = result.find((e) => e.type === EVENT_TYPES.METRIC_UPDATE);
    assert.ok(metricEvent);
    assert.equal(metricEvent.metrics.duplicateCssVariables, 1);
  });

  it('recognizes Eleventy summary line', () => {
    const result = normalizeLine(
      '[11ty] Copied 311 Wrote 54 files in 0.37 seconds (v3.1.6)',
      STAGES.SITE
    );
    const metricEvent = result.find((e) => e.type === EVENT_TYPES.METRIC_UPDATE);
    assert.ok(metricEvent);
    assert.equal(metricEvent.metrics.assets, 311);
    assert.equal(metricEvent.metrics.pages, 54);
    assert.equal(metricEvent.metrics.buildTime, 0.37);
  });

  it('recognizes Eleventy page writing', () => {
    const result = normalizeLine(
      '[11ty] Writing ./_site/components/button/index.html from ./site/components/button.md (njk)',
      STAGES.SITE
    );
    const progress = result.find((e) => e.type === EVENT_TYPES.STAGE_PROGRESS);
    assert.ok(progress);
    assert.ok(progress.detail.includes('Components'));
  });

  it('recognizes copied assets count from Eleventy', () => {
    const result = normalizeLine(
      '[11ty] Copied 311 Wrote 54 files in 0.42 seconds (v3.1.6)',
      STAGES.SITE
    );
    const metricEvent = result.find((e) => e.type === EVENT_TYPES.METRIC_UPDATE);
    assert.ok(metricEvent);
    assert.equal(metricEvent.metrics.assets, 311);
  });

  it('recognizes server URL', () => {
    const result = normalizeLine(
      '[11ty] Server at http://localhost:8080/',
      STAGES.SITE
    );
    const serviceReady = result.find((e) => e.type === EVENT_TYPES.SERVICE_READY);
    assert.ok(serviceReady);
    assert.equal(serviceReady.url, 'http://localhost:8080/');
  });

  it('recognizes error marker', () => {
    const result = normalizeLine(
      '❌ Error building CSS bundles: missing file',
      STAGES.CSS,
      'stderr'
    );
    const logEvent = result.find((e) => e.type === EVENT_TYPES.LOG_MESSAGE && e.level === 'error');
    assert.ok(logEvent);
  });

  it('recognizes token file count in CSS stage', () => {
    const result = normalizeLine(
      '   • 8 files',
      STAGES.CSS
    );
    const metricEvent = result.find((e) => e.type === EVENT_TYPES.METRIC_UPDATE);
    assert.ok(metricEvent);
    assert.equal(metricEvent.metrics.tokenFiles, 8);
  });

  it('returns empty array for blank lines', () => {
    const result = normalizeLine('', STAGES.ICONS);
    assert.equal(result.length, 0);
  });

  it('returns empty array for whitespace-only lines', () => {
    const result = normalizeLine('   \t  ', STAGES.TOKENS);
    assert.equal(result.length, 0);
  });
});

// ─── State Reducer Tests ─────────────────────────────────────────────────────

describe('State Reducer', () => {
  it('creates initial state with correct defaults', () => {
    const state = createInitialState();
    assert.equal(state.status, 'idle');
    assert.equal(state.startedAt, null);
    assert.ok(state.stages.icons);
    assert.equal(state.stages.icons.status, STAGE_STATUS.WAIT);
  });

  it('transitions to running on build:start', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.buildStart());
    assert.equal(state.status, 'running');
    assert.ok(state.startedAt);
  });

  it('transitions to success on build:complete', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.buildStart());
    state = reduceEvent(state, events.buildComplete(500));
    assert.equal(state.status, 'success');
    assert.equal(state.durationMs, 500);
  });

  it('transitions to failed on build:fail', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.buildStart());
    state = reduceEvent(state, events.buildFail('test error', 200));
    assert.equal(state.status, 'failed');
    assert.equal(state.error, 'test error');
  });

  it('never overwrites failed with complete', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.buildStart());
    state = reduceEvent(state, events.buildFail('error', 100));
    state = reduceEvent(state, events.buildComplete(200));
    assert.equal(state.status, 'failed');
    assert.equal(state.error, 'error');
  });

  it('updates stage status on stage:start', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.stageStart(STAGES.ICONS));
    assert.equal(state.stages.icons.status, STAGE_STATUS.RUN);
    assert.equal(state.activeStage, STAGES.ICONS);
  });

  it('updates stage status on stage:complete', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.stageStart(STAGES.ICONS));
    state = reduceEvent(state, events.stageComplete(STAGES.ICONS, 100));
    assert.equal(state.stages.icons.status, STAGE_STATUS.OK);
    assert.equal(state.stages.icons.durationMs, 100);
  });

  it('marks stage and build as failed on stage:fail', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.buildStart());
    state = reduceEvent(state, events.stageStart(STAGES.TOKENS));
    state = reduceEvent(state, events.stageFail(STAGES.TOKENS, 'parse error', 50));
    assert.equal(state.stages.tokens.status, STAGE_STATUS.FAIL);
    assert.equal(state.stages.tokens.error, 'parse error');
    assert.equal(state.status, 'failed');
  });

  it('updates metrics on metric:update', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    assert.equal(state.metrics.icons, 289);
  });

  it('merges multiple metric updates', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    state = reduceEvent(state, events.metricUpdate(STAGES.TOKENS, { missingCodeSyntax: 0 }));
    assert.equal(state.metrics.icons, 289);
    assert.equal(state.metrics.missingCodeSyntax, 0);
  });

  it('updates artifacts on artifact:created', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.artifactCreated(STAGES.TOKENS, 'css'));
    assert.equal(state.artifacts.css, true);
    assert.equal(state.artifacts.json, false);
  });

  it('appends log messages', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.logMessage(STAGES.ICONS, 'info', 'test message'));
    assert.equal(state.log.length, 1);
    assert.equal(state.log[0].message, 'test message');
  });

  it('limits log to MAX_LOG_ENTRIES', () => {
    let state = createInitialState();
    for (let i = 0; i < 60; i++) {
      state = reduceEvent(state, events.logMessage(STAGES.ICONS, 'info', `msg ${i}`));
    }
    assert.equal(state.log.length, 50);
    assert.equal(state.log[49].message, 'msg 59');
  });

  it('calculates build duration correctly', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.buildStart());
    state = reduceEvent(state, events.buildComplete(1234));
    assert.equal(state.durationMs, 1234);
  });

  it('handles service:ready', () => {
    let state = createInitialState();
    state = reduceEvent(state, events.serviceReady(STAGES.SERVER, 'http://localhost:8080/'));
    assert.equal(state.metrics.serverUrl, 'http://localhost:8080/');
    assert.equal(state.stages.server.status, STAGE_STATUS.OK);
  });
});

// ─── Environment Detection Tests ────────────────────────────────────────────

describe('Environment Detection', () => {
  it('detects basic environment', () => {
    const env = detectEnvironment({ isTTY: true, columns: 120 });
    assert.equal(env.isTTY, true);
    assert.equal(env.columns, 120);
  });

  it('selects full mode for wide TTY', () => {
    const env = detectEnvironment({ isTTY: true, columns: 120, isCI: false, noColor: false });
    assert.equal(selectMode(env, null), MODES.FULL);
  });

  it('selects compact mode for medium TTY', () => {
    const env = detectEnvironment({ isTTY: true, columns: 80, isCI: false, noColor: false });
    assert.equal(selectMode(env, null), MODES.COMPACT);
  });

  it('selects plain mode for CI', () => {
    const env = detectEnvironment({ isTTY: true, columns: 120, isCI: true, noColor: false });
    assert.equal(selectMode(env, null), MODES.PLAIN);
  });

  it('selects plain mode for NO_COLOR', () => {
    const env = detectEnvironment({ isTTY: true, columns: 120, isCI: false, noColor: true });
    assert.equal(selectMode(env, null), MODES.PLAIN);
  });

  it('selects plain mode for non-TTY', () => {
    const env = detectEnvironment({ isTTY: false, columns: 120, isCI: false, noColor: false });
    assert.equal(selectMode(env, null), MODES.PLAIN);
  });

  it('CLI mode override takes priority', () => {
    const env = detectEnvironment({ isTTY: true, columns: 120, isCI: false, noColor: false });
    assert.equal(selectMode(env, 'plain'), MODES.PLAIN);
    assert.equal(selectMode(env, 'compact'), MODES.COMPACT);
  });

  it('provides unicode box chars by default on macOS', () => {
    const env = detectEnvironment({ unicodeSupport: true });
    const box = getBoxChars(env);
    assert.equal(box.topLeft, '╔');
  });

  it('provides ASCII fallback when unicode not supported', () => {
    const env = detectEnvironment({ unicodeSupport: false });
    const box = getBoxChars(env);
    assert.equal(box.topLeft, '+');
  });
});

// ─── Plain Reporter Tests ────────────────────────────────────────────────────

describe('Plain Reporter', () => {
  it('emits no ANSI escape sequences', () => {
    const output = [];
    const reporter = new PlainReporter({
      write: (s) => output.push(s),
      version: '0.7.0',
    });

    let state = createInitialState([STAGES.ICONS]);
    const ev = events.buildStart({ version: '0.7.0' });
    state = reduceEvent(state, ev);
    reporter.onEvent(ev, state);

    const combined = output.join('');
    assert.ok(!combined.includes('\x1b'));
    assert.ok(combined.includes('UI Foundations 0.7.0'));
  });

  it('reports stage completion with metrics', () => {
    const output = [];
    const reporter = new PlainReporter({
      write: (s) => output.push(s),
    });

    let state = createInitialState([STAGES.ICONS]);
    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));

    const ev = events.stageComplete(STAGES.ICONS, 100);
    state = reduceEvent(state, ev);
    reporter.onEvent(ev, state);

    const combined = output.join('');
    assert.ok(combined.includes('[ok]'));
    assert.ok(combined.includes('289'));
  });

  it('reports build failure', () => {
    const output = [];
    const reporter = new PlainReporter({
      write: (s) => output.push(s),
    });

    let state = createInitialState([STAGES.ICONS]);
    state = reduceEvent(state, events.buildStart());

    const ev = events.buildFail('test failure', 100);
    state = reduceEvent(state, ev);
    reporter.onEvent(ev, state);

    const combined = output.join('');
    assert.ok(combined.includes('[FAIL]'));
    assert.ok(combined.includes('test failure'));
  });

  it('reports build complete with summary', () => {
    const output = [];
    const reporter = new PlainReporter({
      write: (s) => output.push(s),
    });

    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS]);
    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    state = reduceEvent(state, events.metricUpdate(STAGES.TOKENS, { tokenFiles: 8 }));

    const ev = events.buildComplete(500);
    state = reduceEvent(state, ev);
    reporter.onEvent(ev, state);

    const combined = output.join('');
    assert.ok(combined.includes('[done]'));
    assert.ok(combined.includes('500ms'));
    assert.ok(combined.includes('289 icons'));
  });
});

// ─── Page Aggregation Tests ──────────────────────────────────────────────────

describe('Page Aggregation', () => {
  it('categorizes component pages', () => {
    const progressEvents = [
      { detail: 'Components: components/button/index.html' },
      { detail: 'Components: components/input/index.html' },
      { detail: 'Playgrounds: components/button-playground/index.html' },
      { detail: 'Foundations: foundations/color/index.html' },
      { detail: 'System: index.html' },
    ];
    const counts = aggregatePages(progressEvents);
    assert.equal(counts.Components, 2);
    assert.equal(counts.Playgrounds, 1);
    assert.equal(counts.Foundations, 1);
    assert.equal(counts.System, 1);
  });
});
