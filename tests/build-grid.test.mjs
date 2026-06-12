import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import stringWidth from 'string-width';
import stripAnsi from 'strip-ansi';

import {
  createLayout,
  visibleWidth,
  truncateVisible,
  padRightVisible,
  padLeftVisible,
  centerVisible,
  renderFullRow,
  renderSplitRow,
  renderTopBorder,
  renderBottomBorder,
  renderMidSplit,
  renderMidFull,
  replaceEmojis,
} from '../build-system/grid.mjs';
import { BOX_UNICODE } from '../build-system/environment.mjs';
import { mda } from '../build-system/themes/mda.mjs';

const layout = createLayout(96);
const box = BOX_UNICODE;
const theme = mda;

// ─── Width Utility Tests ─────────────────────────────────────────────────────

describe('Grid Width Utilities', () => {
  it('visibleWidth ignores ANSI codes', () => {
    assert.equal(visibleWidth('\x1b[32mhello\x1b[0m'), 5);
    assert.equal(visibleWidth('plain'), 5);
  });

  it('visibleWidth handles emojis as 2-wide', () => {
    assert.equal(visibleWidth('📁'), 2);
    assert.equal(visibleWidth('test 📁'), 7);
  });

  it('padRightVisible pads to correct width', () => {
    const result = padRightVisible('hello', 10);
    assert.equal(visibleWidth(result), 10);
  });

  it('padRightVisible handles ANSI-colored strings', () => {
    const colored = '\x1b[32mOK\x1b[0m';
    const result = padRightVisible(colored, 10);
    assert.equal(visibleWidth(result), 10);
    assert.ok(result.includes('\x1b[32m'));
  });

  it('padLeftVisible pads to correct width', () => {
    const result = padLeftVisible('42', 6);
    assert.equal(visibleWidth(result), 6);
    assert.ok(result.endsWith('42'));
  });

  it('centerVisible centers content', () => {
    const result = centerVisible('OK', 10);
    assert.equal(visibleWidth(result), 10);
    assert.ok(result.startsWith('    '));
  });

  it('truncateVisible shortens long strings', () => {
    const result = truncateVisible('abcdefghijklmnop', 10);
    assert.ok(visibleWidth(result) <= 10);
  });

  it('truncateVisible preserves short strings', () => {
    const result = truncateVisible('short', 10);
    assert.equal(result, 'short');
  });
});

// ─── Row Width Tests ─────────────────────────────────────────────────────────

describe('Grid Row Width Integrity', () => {
  it('renderTopBorder has exact layout width', () => {
    const row = renderTopBorder(layout, box, theme);
    assert.equal(visibleWidth(row), layout.width);
  });

  it('renderBottomBorder has exact layout width', () => {
    const row = renderBottomBorder(layout, box, theme);
    assert.equal(visibleWidth(row), layout.width);
  });

  it('renderMidFull has exact layout width', () => {
    const row = renderMidFull(layout, box, theme);
    assert.equal(visibleWidth(row), layout.width);
  });

  it('renderMidSplit has exact layout width', () => {
    const row = renderMidSplit(layout, box, theme);
    assert.equal(visibleWidth(row), layout.width);
  });

  it('renderFullRow has exact layout width', () => {
    const content = padRightVisible('test content', layout.innerWidth);
    const row = renderFullRow(content, layout, box, theme);
    assert.equal(visibleWidth(row), layout.width);
  });

  it('renderFullRow with empty content has exact layout width', () => {
    const content = padRightVisible('', layout.innerWidth);
    const row = renderFullRow(content, layout, box, theme);
    assert.equal(visibleWidth(row), layout.width);
  });

  it('renderSplitRow has exact layout width', () => {
    const row = renderSplitRow('left', 'right', layout, box, theme);
    assert.equal(visibleWidth(row), layout.width);
  });

  it('renderSplitRow with colored content has exact layout width', () => {
    const left = '\x1b[32mICONS REGISTERED\x1b[0m';
    const right = '\x1b[97m289\x1b[0m';
    const row = renderSplitRow(left, right, layout, box, theme);
    assert.equal(visibleWidth(row), layout.width);
  });

  it('renderSplitRow with long content gets padded correctly', () => {
    const left = padRightVisible('A very long stage name here that fills', layout.leftColumnWidth);
    const right = padRightVisible('Diagnostic data here', layout.rightColumnWidth);
    const row = renderSplitRow(left, right, layout, box, theme);
    assert.equal(visibleWidth(row), layout.width);
  });
});

// ─── Emoji Replacement Tests ─────────────────────────────────────────────────

describe('Emoji Replacement', () => {
  it('replaces known emojis with text labels', () => {
    assert.equal(replaceEmojis('📁 Files created'), '[OUT] Files created');
    assert.equal(replaceEmojis('✅ Done'), '[OK] Done');
    assert.equal(replaceEmojis('❌ Error'), '[FAIL] Error');
    assert.equal(replaceEmojis('⚠️ Warning'), '[WARN] Warning');
    assert.equal(replaceEmojis('♻️ Cached'), '[CACHE] Cached');
  });

  it('leaves text without emojis unchanged', () => {
    assert.equal(replaceEmojis('plain text'), 'plain text');
  });

  it('produces consistent visible width', () => {
    // After replacement, result should have predictable column width
    const replaced = replaceEmojis('📁 test');
    // '📁' is 2 cols, '[OUT]' is 5 cols — width changes but predictably
    assert.equal(visibleWidth(replaced), visibleWidth('[OUT] test'));
  });
});

// ─── Layout Invariant Tests ──────────────────────────────────────────────────

describe('Layout Invariants', () => {
  it('split row columns + borders + spaces = width', () => {
    // Structure: ║ + SP + left + SP + ║ + SP + right + SP + ║
    // = 3 borders + 4 spaces + leftColumnWidth + rightColumnWidth = width
    assert.equal(
      3 + 4 + layout.leftColumnWidth + layout.rightColumnWidth,
      layout.width
    );
  });

  it('innerWidth equals width - 2', () => {
    assert.equal(layout.innerWidth, layout.width - 2);
  });
});
