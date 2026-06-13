import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { MdaReporter } from '../build-system/reporters/mda.mjs';
import { PlainReporter } from '../build-system/reporters/plain.mjs';
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

// ─── Format Utilities ────────────────────────

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
    assert.equal(replaceEmojis('\u2705 Done'), '[OK] Done');
    assert.equal(replaceEmojis('\u274C Error'), '[FAIL] Error');
    assert.equal(replaceEmojis('\u26A0\uFE0F Warning'), '[WARN] Warning');
  });

  it('replaceEmojis leaves plain text unchanged', () => {
    assert.equal(replaceEmojis('plain text'), 'plain text');
  });
});

// ─── Format Output ───────────────────────────

describe('Format Output', () => {
  const env = { unicodeSupport: true };

  it('formatHeader contains version and rounded box', () => {
    const result = formatHeader('0.7.0', env);
    assert.ok(result.includes('\u256D')); // ╭
    assert.ok(result.includes('\u256E')); // ╮ or ╯
    assert.ok(result.includes('FOUNDATIONS'));
    assert.ok(result.includes('BUILD 0.7.0'));
  });

  it('formatHeader fits within 40 chars per line', () => {
    const result = formatHeader('0.7.0', env);
    const lines = result.split('\n').filter(l => l.length > 0);
    for (const line of lines) {
      assert.ok(line.length <= 40, `Line too long (${line.length}): "${line}"`);
    }
  });

  it('formatSectionTitle uses block char', () => {
    const result = formatSectionTitle(null, 'ICONS');
    assert.ok(result.includes('\u2588')); // █
    assert.ok(result.includes('ICONS'));
  });

  it('formatSectionTitle includes status on same line', () => {
    const result = formatSectionTitle(null, 'ICONS', 'OK');
    assert.ok(result.includes('\u2588'));
    assert.ok(result.includes('ICONS'));
    assert.ok(result.includes('[OK]'));
    const lines = result.split('\n').filter(l => l.trim());
    assert.equal(lines.length, 1);
  });

  it('formatMetricRow uses tree connector', () => {
    const result = formatMetricRow('Entries', 289, false);
    assert.ok(result.includes('\u251C')); // ├
    assert.ok(result.includes('Entries'));
    assert.ok(result.includes('0289'));
  });

  it('formatMetricRow uses last connector', () => {
    const result = formatMetricRow('Output', 'icon-names.ts', true);
    assert.ok(result.includes('\u2514')); // └
    assert.ok(result.includes('Output'));
    assert.ok(result.includes('icon-names.ts'));
  });

  it('formatMetricRow zero-pads numeric values', () => {
    const result = formatMetricRow('Count', 8, false);
    assert.ok(result.includes('0008'));
  });

  it('formatMetricRow preserves string values', () => {
    const result = formatMetricRow('Status', 'READY', true);
    assert.ok(result.includes('READY'));
    assert.ok(!result.includes('0'));
  });

  it('formatSeparator renders horizontal line', () => {
    const result = formatSeparator();
    assert.ok(result.includes('\u2500')); // ─
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

// ─── MDA Reporter — Linear Output ───────────

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
    reporter.onEvent(ev, state);

    const combined = output.join('');
    const headerCount = (combined.match(/FOUNDATIONS/g) || []).length;
    assert.equal(headerCount, 1);
  });

  it('contains no cursor control sequences', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    const iconComplete = events.stageComplete(STAGES.ICONS, 50);
    state = reduceEvent(state, iconComplete);
    reporter.onEvent(iconComplete, state);

    const combined = output.join('');
    assert.ok(!combined.includes('\x1b[?25l'), 'no cursor hide');
    assert.ok(!combined.includes('\x1b[?25h'), 'no cursor show');
    assert.ok(!combined.match(/\x1b\[\d+A/), 'no cursor up');
    assert.ok(!combined.match(/\x1b\[\d+B/), 'no cursor down');
  });

  it('prints each section exactly once', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    const iconComplete = events.stageComplete(STAGES.ICONS, 50);
    state = reduceEvent(state, iconComplete);
    reporter.onEvent(iconComplete, state);
    reporter.onEvent(iconComplete, state);

    const combined = output.join('');
    const iconSections = (combined.match(/\u2588 ICONS/g) || []).length;
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

  it('outputs BUILD OK with duration on success', () => {
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

  it('outputs BUILD FAILED on error', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    state = reduceEvent(state, events.stageStart(STAGES.TOKENS));
    const tokenFail = events.stageFail(STAGES.TOKENS, 'Duplicate vars', 100);
    state = reduceEvent(state, tokenFail);
    reporter.onEvent(tokenFail, state);

    const buildFail = events.buildFail('Stage failed', 200);
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
    assert.ok(!combined.match(/[\u{1F600}-\u{1F9FF}]/u));
    assert.ok(!combined.includes('\u2705'));
    assert.ok(!combined.includes('\u274C'));
  });

  it('uses tree connectors in metric rows', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    const iconComplete = events.stageComplete(STAGES.ICONS, 50);
    state = reduceEvent(state, iconComplete);
    reporter.onEvent(iconComplete, state);

    const combined = output.join('');
    assert.ok(combined.includes('\u251C'), 'should have ├ connector');
    assert.ok(combined.includes('\u2514'), 'should have └ connector');
  });

  it('separates sections with horizontal lines', () => {
    const { reporter, output } = createTestReporter();
    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS]);

    state = reduceEvent(state, events.buildStart({ version: '0.7.0' }));
    reporter.onEvent(events.buildStart({ version: '0.7.0' }), state);

    state = reduceEvent(state, events.metricUpdate(STAGES.ICONS, { icons: 289 }));
    const ic = events.stageComplete(STAGES.ICONS, 50);
    state = reduceEvent(state, ic);
    reporter.onEvent(ic, state);

    state = reduceEvent(state, events.metricUpdate(STAGES.TOKENS, { missingCodeSyntax: 0, unparseableCodeSyntax: 0, duplicateCssVariables: 0 }));
    state = reduceEvent(state, events.artifactCreated(STAGES.TOKENS, 'css'));
    state = reduceEvent(state, events.artifactCreated(STAGES.TOKENS, 'json'));
    state = reduceEvent(state, events.artifactCreated(STAGES.TOKENS, 'typescript'));
    state = reduceEvent(state, events.artifactCreated(STAGES.TOKENS, 'yaml'));
    const tc = events.stageComplete(STAGES.TOKENS, 100);
    state = reduceEvent(state, tc);
    reporter.onEvent(tc, state);

    const combined = output.join('');
    // Should have separator lines (─) between sections
    const sepCount = (combined.match(/\u2500{10,}/g) || []).length;
    assert.ok(sepCount >= 2, `Expected at least 2 separators, got ${sepCount}`);
  });
});

// ─── MDA Reporter — Dev Mode ─────────────────

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

    const beforeReady = output.join('');
    assert.ok(!beforeReady.includes('ONLINE'));

    const serviceReady = events.serviceReady(STAGES.SERVER, 'http://localhost:8080/');
    state = reduceEvent(state, serviceReady);
    reporter.onEvent(serviceReady, state);

    const combined = output.join('');
    assert.ok(combined.includes('ONLINE'));
    assert.ok(combined.includes('http://localhost:8080/'));
    assert.ok(combined.includes('Watch'));
    assert.ok(combined.includes('ACTIVE'));
  });

  it('aggregates page categories in docs section', () => {
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

    state = reduceEvent(state, events.metricUpdate(STAGES.SITE, { pages: 54, assets: 311, buildTime: 0.58 }));
    const siteComplete = events.stageComplete(STAGES.SITE, 580);
    state = reduceEvent(state, siteComplete);
    reporter.onEvent(siteComplete, state);

    const combined = output.join('');
    assert.ok(combined.includes('Foundations'));
    assert.ok(combined.includes('Components'));
    assert.ok(combined.includes('Pages'));
    assert.ok(combined.includes('Assets'));
  });
});

// ─── CI / Plain Mode ─────────────────────────

describe('CI / Plain Mode — no ANSI cursor sequences', () => {
  it('PlainReporter emits no cursor sequences', () => {
    const output = [];
    const reporter = new PlainReporter({
      write: (s) => output.push(s),
      version: '0.7.0',
    });

    let state = createInitialState([STAGES.ICONS, STAGES.TOKENS, STAGES.CSS]);

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
    assert.ok(!combined.includes('\x1b'), 'plain mode has no ANSI');
    assert.ok(!combined.includes('\x1b[?25'), 'no cursor hide/show');
  });
});
