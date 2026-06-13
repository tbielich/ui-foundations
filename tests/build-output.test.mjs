import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUILD_SCRIPT = resolve(ROOT, 'scripts/build.mjs');

function runBuild(env = {}) {
  const output = execFileSync('node', [BUILD_SCRIPT], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env, FORCE_COLOR: '0', NO_COLOR: '1' },
    timeout: 30000,
  });
  return output;
}

describe('Build Output', () => {
  let output;

  it('runs successfully', () => {
    output = runBuild();
    assert.ok(output.includes('BUILD OK'));
  });

  it('prints header with version', () => {
    assert.ok(output.includes('FOUNDATIONS'));
    assert.ok(output.includes('BUILD 0.'));
  });

  it('prints ICONS section with count', () => {
    assert.ok(output.includes('ICONS'));
    assert.ok(output.includes('[OK]'));
    assert.ok(output.match(/Entries\s+\d{4}/));
  });

  it('prints TOKENS section', () => {
    assert.ok(output.includes('TOKENS'));
    assert.ok(output.includes('READY'));
  });

  it('prints INTEGRITY section', () => {
    assert.ok(output.includes('INTEGRITY'));
    assert.ok(output.includes('Missing WEB'));
    assert.ok(output.includes('Duplicate vars'));
  });

  it('prints DIST section', () => {
    assert.ok(output.includes('DIST'));
    assert.ok(output.includes('Token CSS'));
    assert.ok(output.includes('Macros'));
  });

  it('does not print ONLINE in build mode', () => {
    assert.ok(!output.includes('ONLINE'));
  });

  it('does not contain cursor sequences', () => {
    assert.ok(!output.includes('\x1b[?25'));
    assert.ok(!output.match(/\x1b\[\d+A/));
  });

  it('does not contain emojis', () => {
    assert.ok(!output.includes('\u2705'));
    assert.ok(!output.includes('\u274C'));
    assert.ok(!output.match(/[\u{1F600}-\u{1F9FF}]/u));
  });

  it('uses tree connectors', () => {
    assert.ok(output.includes('\u251C')); // ├
    assert.ok(output.includes('\u2514')); // └
  });

  it('uses section separators', () => {
    const sepCount = (output.match(/\u2500{10,}/g) || []).length;
    assert.ok(sepCount >= 4, `Expected >=4 separators, got ${sepCount}`);
  });

  it('exits with code 0', () => {
    // If we got here without execFileSync throwing, exit code was 0
    assert.ok(true);
  });
});
