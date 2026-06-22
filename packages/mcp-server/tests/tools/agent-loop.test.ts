import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { diagnoseDriftHandler } from '../../src/tools/diagnose-drift.js';
import { applyTokenFixHandler } from '../../src/tools/apply-token-fix.js';
import { validateSystemHandler } from '../../src/tools/validate-system.js';

describe('diagnoseDriftHandler', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `drift-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, 'figma/exports'), { recursive: true });
    await mkdir(join(testDir, 'dist/tokens/json'), { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('reports no drift when tokens match', async () => {
    await writeFile(
      join(testDir, 'figma/exports/Semantics (Roles).tokens.json'),
      JSON.stringify({
        Color: {
          Text: {
            Default: {
              $type: 'color',
              $value: '#000000',
              $extensions: { 'com.figma.codeSyntax': { WEB: 'var(--color-text-default)' } },
            },
          },
        },
      }),
    );
    await writeFile(
      join(testDir, 'dist/tokens/json/semantics-roles.tokens.json'),
      JSON.stringify({
        Color: { Text: { Default: { $type: 'color', $value: '#000000' } } },
      }),
    );

    const result = await diagnoseDriftHandler({}, testDir);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.summary.driftCount, 0);
  });

  it('detects missing token in code', async () => {
    await writeFile(
      join(testDir, 'figma/exports/Semantics (Roles).tokens.json'),
      JSON.stringify({
        Color: {
          Text: {
            New: {
              $type: 'color',
              $value: '#ff0000',
              $extensions: { 'com.figma.codeSyntax': { WEB: 'var(--color-text-new)' } },
            },
          },
        },
      }),
    );
    await writeFile(
      join(testDir, 'dist/tokens/json/semantics-roles.tokens.json'),
      JSON.stringify({ Color: { Other: { $type: 'color', $value: '#aaa' } } }),
    );

    const result = await diagnoseDriftHandler({}, testDir);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.summary.missingInCode, 1);
    assert.equal(parsed.drift[0].token, 'color-text-new');
  });

  it('detects value mismatch', async () => {
    await writeFile(
      join(testDir, 'figma/exports/Semantics (Roles).tokens.json'),
      JSON.stringify({
        Color: {
          Fill: {
            Brand: {
              $type: 'color',
              $value: '#ff0000',
              $extensions: { 'com.figma.codeSyntax': { WEB: 'var(--color-fill-brand)' } },
            },
          },
        },
      }),
    );
    await writeFile(
      join(testDir, 'dist/tokens/json/semantics-roles.tokens.json'),
      JSON.stringify({
        Color: { Fill: { Brand: { $type: 'color', $value: '#0000ff' } } },
      }),
    );

    const result = await diagnoseDriftHandler({}, testDir);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.summary.valueMismatches, 1);
  });

  it('returns error if dist/tokens/json is empty', async () => {
    await writeFile(
      join(testDir, 'figma/exports/Semantics (Roles).tokens.json'),
      JSON.stringify({ Color: { X: { $type: 'color', $value: '#000', $extensions: { 'com.figma.codeSyntax': { WEB: 'var(--x)' } } } } }),
    );

    const result = await diagnoseDriftHandler({}, testDir);
    assert.equal(result.isError, true);
  });
});

describe('applyTokenFixHandler', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `fix-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, 'figma/exports'), { recursive: true });

    await writeFile(
      join(testDir, 'figma/exports/Semantics (Roles).tokens.json'),
      JSON.stringify({
        Color: {
          Text: {
            Default: {
              $type: 'color',
              $value: '#000000',
              $extensions: { 'com.figma.codeSyntax': { WEB: 'var(--color-text-default)' } },
            },
          },
        },
      }, null, 2),
    );
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('updates a token value', async () => {
    const result = await applyTokenFixHandler(
      { token: 'color-text-default', action: 'update_value', newValue: '#111111' },
      testDir,
    );
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.success, true);

    const file = JSON.parse(await readFile(join(testDir, 'figma/exports/Semantics (Roles).tokens.json'), 'utf8'));
    assert.equal(file.Color.Text.Default.$value, '#111111');
  });

  it('renames a token', async () => {
    const result = await applyTokenFixHandler(
      { token: 'color-text-default', action: 'rename', newName: 'color-text-primary' },
      testDir,
    );
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.success, true);

    const file = JSON.parse(await readFile(join(testDir, 'figma/exports/Semantics (Roles).tokens.json'), 'utf8'));
    assert.equal(file.Color.Text.Default.$extensions['com.figma.codeSyntax'].WEB, 'var(--color-text-primary)');
  });

  it('removes a token', async () => {
    const result = await applyTokenFixHandler(
      { token: 'color-text-default', action: 'remove' },
      testDir,
    );
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.success, true);

    const file = JSON.parse(await readFile(join(testDir, 'figma/exports/Semantics (Roles).tokens.json'), 'utf8'));
    assert.equal(file.Color.Text.Default, undefined);
  });

  it('returns error for unknown token', async () => {
    const result = await applyTokenFixHandler(
      { token: 'nonexistent', action: 'update_value', newValue: 'x' },
      testDir,
    );
    assert.equal(result.isError, true);
  });
});

describe('validateSystemHandler', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `validate-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('returns pass:true for a successful command', async () => {
    const result = await validateSystemHandler({ command: 'echo ok' }, testDir);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.pass, true);
    assert.ok(parsed.stdout.includes('ok'));
  });

  it('returns pass:false for a failing command', async () => {
    const result = await validateSystemHandler({ command: 'exit 1' }, testDir);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.pass, false);
  });
});
