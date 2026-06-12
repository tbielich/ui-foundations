import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { MdaReporter } from '../build-system/reporters/mda.mjs';
import { createInitialState, reduceEvent } from '../build-system/state.mjs';
import { STAGES, EVENT_TYPES } from '../build-system/events.mjs';
import * as events from '../build-system/events.mjs';
import {
  formatHeader,
  formatSectionTitle,
  formatMetricRow,
  formatStatus,
  formatSeparator,
  formatBuildComplete,
  formatBuildFailed,
  formatOnline,
  replaceEmojis,
  visibleWidth,
  padRight,
  padLeft,
} from '../build-system/format.mjs';
import { PlainReporter } from '../build-system/reporters/plain.mjs';

// ─── Format Utilities ────────────────────────────────────────────────────────

describe('Format Utilities', () => {
  it('visibleWidth ignores ANSI codes', () => {
    assert.equal(visibleWidth('\x1b[32mhello\x1b[0m'), 5);
    assert.equal(visibleWidth('plain'), 5);
  });

  it('padRight pads to correct width', () => {
    const result = padRight('hello', 10);
    assert.equal(visibleWidth(result), 10);
  });

  it('padRight handles ANSI-colored strings', () => {
    const colored = '\x1b[32mOK\x1b[0m';
    const result = padRight(colored, 10);
    assert.equal(visibleWidth(result), 10);
    assert.ok(result.includes('\x1b[32m'));
  });

  it('padLeft pads to correct width', () => {
    const result = padLeft('42', 6);
    assert.equal(visibleWidth(result), 6);
    assert.ok(result.endsWith('42'));
  });

  it('replaceEmojis replaces known emojis', () => {
    assert.equal(replaceEmojis('✅ Done'), '[OK] Done');
    assert.equal(replaceEmojis('❌ Error'), '[FAIL] Error');
    assert.equal(replaceEmojis('⚠️ Warning'), '[WARN] Warning');
  });

  it('replaceEmojis leaves plain text unchanged', () => {
    assert.equal(replaceEmojis('plain text'), 'plain text');
  });
});

// ─── Format Output ───────────────────────────────────────────────────────────

describe('Format Output', () => {
  const env = { unicodeSupport: true };

  it('formatHeader contains version and box drawing', () => {
    const result = formatHeader('0.7.0', env);
    assert.ok(result.includes('╔'));
    assert.ok(result.includes('╚'));
    assert.ok(result.includes('UI FOUNDATIONS'));
    assert.ok(result.includes('BUILD 0.7.0'));
  });

  it('formatHeader ASCII fallback works', () => {
    const result = formatHeader('0.7.0', { unicodeSupport: false });
    assert.ok(result.includes('+'));
    assert.ok(result.includes('UI FOUNDATIONS'));
    assert.ok(!result.includes('╔'));
  });

  it('formatHeader fits within 48 chars', () => {
    const result = formatHeader('0.7.0', env);
    const lines = result.split('\n').filter(l => l.length > 0);
    for (const line of lines) {
      assert.ok(line.length <= 48, `Line too long (${line.length}): "${line}"`);
    }
  });

  it('formatSectionTitle formats numbered section', () => {
    const result = formatSectionTitle(1, 'ICONS');
    assert.ok(result.includes('[01]'));
    assert.ok(result.includes('ICONS'));
  });

  it('formatSectionTitle includes status on same line', () => {
    const result = formatSectionTitle(1, 'ICONS', 'OK');
    assert.ok(result.includes('[01]'));
    assert.ok(result.includes('ICONS'));
    assert.ok(result.includes('[OK]'));
    // Status and title on same line
    const lines = result.split('\n').filter(l => l.trim());
    assert.equal(lines.length, 1);
    assert.ok(lines[0].includes('ICONS'));
    assert.ok(lines[0].includes('[OK]'));
  });

  it('formatMetricRow right-aligns values', () => {
    const result = formatMetricRow('Entries', 289);
    assert.ok(result.includes('Entries'));
    assert.ok(result.includes('289'));
    const labelIdx = result.indexOf('Entries');
    const valueIdx = result.indexOf('289');
    assert.ok(valueIdx > labelIdx);
  });

  it('formatStatus renders status tag', () => {
    const result = formatStatus('OK');
    assert.ok(result.includes('[OK]'));
  });

  it('formatSeparator uses box drawing', () => {
    const result = formatSeparator(env);
    assert.ok(result.includes('─'));
  });

  it('formatBuildComplete contains duration', () => {
    const result = formatBuildComplete(510);
    assert.ok(result.includes('BUILD OK'));
    assert.ok(result.includes('READY'));
    assert.ok(result.includes('510ms'));
  });

  it('formatBuildFailed contains stage and reason', () => {
    const result = formatBuildFailed('INTEGRITY', 1, 'Duplicate vars');
    assert.ok(result.includes('BUILD FAILED'));
    assert.ok(result.includes('INTEGRITY'));
    assert.ok(result.includes('Duplicate vars'));
    assert.ok(result.includes('npm run build:verbose'));
  });

  it('formatOnline contains server status', () => {
    const result = formatOnline();
    assert.ok(result.includes('ONLINE'));
    assert.ok(result.includes('SERVER'));
    assert.ok(result.includes('WATCH'));
  });
});

// ─── MDA Reporter — Linear Output ───────────────────────────────────────────

describe('MDA Reporter — Linear Output', () => {
  function createTestReporter() {
    const output = [];
    const env = { isTTY: true, columns: 96, isCI: false, noColor: false, colorSupport: true, unicodeSupport: true };
    const reporter = new MdaReporter({
      write: (s) => output.push(s),
      env,
      themeName: 'mda',
      version: '0.7.0',
      buildMode: 'build',
    });
    return { reporter, output, env };
  }

  it('prints header exactly once on build:start', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS]);

    const ev = events.buildStart({ version: '0.7.0' });
    state = reduceEvent(state, ev);
    reporter.onEvent(ev, state);
    reporter.onEvent(ev, state); // second call should be ignored

    const combined = output.join('');
    const headerCount = (combined.match(/UI FOUNDATIONS/g) || []).length;
    assert.equal(headerCount, 1);
  });

  it('contains no cursor control sequences', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS]);

    // Run a complete build cycle
    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    const iconComplete = events.stageComplete(STAGES.ICONS, 50);
    state = reduceEvent(state, iconComplete);
    reporter.onEvent(iconComplete, state);

    const combined = output.join('');
    // No cursor hide/show
    assert.ok(!combined.includes('\x1b[?25l'), 'no cursor hide');
    assert.ok(!combined.includes('\x1b[?25h'), 'no cursor show');
    // No cursor movement
    assert.ok(!combined.match(/\x1b\[\d+A/), 'no cursor up');
    assert.ok(!combined.match(/\x1b\[\d+B/), 'no cursor down');
    assert.ok(!combined.match(/\x1b\[\d+;\d+H/), 'no cursor pos');
  });

  it('prints each section exactly once', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    // Icons
    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    const iconComplete = events.stageComplete(STAGES.ICONS, 50);
    state = reduceEvent(state, iconComplete);
    reporter.onEvent(iconComplete, state);
    reporter.onEvent(iconComplete, state); // duplicate call should be ignored

    const combined = output.join('');
    const iconSections = (combined.match(/\[01\] ICONS/g) || []).length;
    assert.equal(iconSections, 1);
  });

  it('never outputs ONLINE in build mode', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    const iconComplete = events.stageComplete(STAGES.ICONS, 50);
    state = reduceEvent(state, iconComplete);
    reporter.onEvent(iconComplete, state);

    const buildComplete = events.buildComplete(500);
    state = reduceEvent(state, buildComplete);
    reporter.onEvent(buildComplete, state);

    const combined = output.join('');
    assert.ok(!combined.includes('ONLINE'));
    assert.ok(combined.includes('BUILD OK'));
  });

  it('outputs BUILD COMPLETE with duration on success', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    const iconComplete = events.stageComplete(STAGES.ICONS, 50);
    state = reduceEvent(state, iconComplete);
    reporter.onEvent(iconComplete, state);

    const buildComplete = events.buildComplete(510);
    state = reduceEvent(state, buildComplete);
    reporter.onEvent(buildComplete, state);

    const combined = output.join('');
    assert.ok(combined.includes('BUILD OK'));
    assert.ok(combined.includes('510ms'));
  });

  it('outputs BUILD FAILED on error without BUILD COMPLETE', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    // Tokens fail
    state = reduceEvent(state, events.stageStart(STAGES.TOKENS));
    const tokenFail = events.stageFail(STAGES.TOKENS, 'Duplicate CSS variable names', 100);
    state = reduceEvent(state, tokenFail);
    reporter.onEvent(tokenFail, state);

    const buildFail = events.buildFail('Stage "tokens" failed', 200);
    state = reduceEvent(state, buildFail);
    reporter.onEvent(buildFail, state);

    const combined = output.join('');
    assert.ok(combined.includes('BUILD FAILED'));
    assert.ok(!combined.includes('BUILD OK'));
    assert.ok(combined.includes('TOKENS'));
  });

  it('contains no emojis in output', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    const combined = output.join('');
    assert.ok(!combined.match(/[\u{1F600}-\u{1F9FF}]/u), 'should not contain emojis');
    assert.ok(!combined.includes('✅'));
    assert.ok(!combined.includes('❌'));
    assert.ok(!combined.includes('📁'));
  });

  it('does not contain raw Eleventy writing lines', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS, STAGES.SITE]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    // Simulate eleventy writing events (these become stage:progress)
    const progressEv = events.stageProgress(STAGES.SITE, 1, null, 'Components: components/button/index.html');
    state = reduceEvent(state, progressEv);
    reporter.onEvent(progressEv, state);

    const combined = output.join('');
    assert.ok(!combined.includes('[11ty] Writing'));
    assert.ok(!combined.includes('./_site/components'));
  });
});

// ─── MDA Reporter — Dev Mode ────────────────────────────────────────────────

describe('MDA Reporter — Dev Mode', () => {
  it('outputs ONLINE only after service:ready', () => {
    const output = [];
    const env = { isTTY: true, columns: 96, isCI: false, noColor: false, colorSupport: true, unicodeSupport: true };
    const reporter = new MdaReporter({
      write: (s) => output.push(s),
      env,
      themeName: 'mda',
      version: '0.7.0',
      buildMode: 'dev',
    });

    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS, STAGES.SITE, STAGES.SERVER]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    // Before server ready — no ONLINE
    const beforeReady = output.join('');
    assert.ok(!beforeReady.includes('ONLINE'));

    // Server ready
    const serviceReady = events.serviceReady(STAGES.SERVER, 'http://localhost:8080/');
    state = reduceEvent(state, serviceReady);
    reporter.onEvent(serviceReady, state);

    const combined = output.join('');
    assert.ok(combined.includes('ONLINE'));
    assert.ok(combined.includes('http://localhost:8080/'));
    assert.ok(combined.includes('Watch'));
    assert.ok(combined.includes('ACTIVE'));
  });

  it('aggregates page categories in documentation section', () => {
    const output = [];
    const env = { isTTY: true, columns: 96, isCI: false, noColor: false, colorSupport: true, unicodeSupport: true };
    const reporter = new MdaReporter({
      write: (s) => output.push(s),
      env,
      themeName: 'mda',
      version: '0.7.0',
      buildMode: 'dev',
    });

    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS, STAGES.SITE]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    // Simulate page progress events
    for (let i = 0; i < 8; i++) {
      const ev = events.stageProgress(STAGES.SITE, i, null, 'Foundations: foundations/page.html');
      state = reduceEvent(state, ev);
      reporter.onEvent(ev, state);
    }
    for (let i = 0; i < 18; i++) {
      const ev = events.stageProgress(STAGES.SITE, i, null, 'Components: components/page.html');
      state = reduceEvent(state, ev);
      reporter.onEvent(ev, state);
    }

    // Complete the site stage with metrics
    state = reduceEvent(state, events.metricUpdate(STAGES.SITE, { pages: 54, assets: 311, buildTime: 0.58 }));
    const siteComplete = events.stageComplete(STAGES.SITE, 580);
    state = reduceEvent(state, siteComplete);
    reporter.onEvent(siteComplete, state);

    const combined = output.join('');
    assert.ok(combined.includes('Foundations'));
    assert.ok(combined.includes('8'));
    assert.ok(combined.includes('Components'));
    assert.ok(combined.includes('18'));
    assert.ok(combined.includes('Pages'));
    assert.ok(combined.includes('54'));
    assert.ok(combined.includes('Assets'));
    assert.ok(combined.includes('311'));
  });
});

// ─── CI / Plain Mode ─────────────────────────────────────────────────────────

describe('CI / Plain Mode — no ANSI cursor sequences', () => {
  it('PlainReporter emits no cursor sequences', () => {
    const output = [];
    const reporter = new PlainReporter({
      write: (s) => output.push(s),
      version: '0.7.0',
    });

    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS]);

    // Full build cycle
    const startEv = events.buildStart({ version: '0.7.0' });
    state = reduceEvent(state, startEv);
    reporter.onEvent(startEv, state);

    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    const iconComplete = events.stageComplete(STAGES.ICONS, 50);
    state = reduceEvent(state, iconComplete);
    reporter.onEvent(iconComplete, state);

    const buildComplete = events.buildComplete(500);
    state = reduceEvent(state, buildComplete);
    reporter.onEvent(buildComplete, state);

    const combined = output.join('');
    // No ANSI at all
    assert.ok(!combined.includes('\x1b'), 'plain mode should not contain ANSI');
    // No cursor manipulation
    assert.ok(!combined.includes('\x1b[?25'), 'no cursor hide/show');
  });
});
