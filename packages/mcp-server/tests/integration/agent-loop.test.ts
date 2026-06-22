/**
 * Integration test: Agent Loop convergence.
 *
 * Proves that the diagnose → fix → validate loop resolves drift
 * within a bounded number of iterations.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { diagnoseDriftHandler } from '../../src/tools/diagnose-drift.js';
import { applyTokenFixHandler } from '../../src/tools/apply-token-fix.js';
import { validateSystemHandler } from '../../src/tools/validate-system.js';

describe('Agent Loop Integration', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `agent-loop-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, 'figma/exports'), { recursive: true });
    await mkdir(join(testDir, 'dist/tokens/json'), { recursive: true });

    // Create a package.json so validate_system can run npm commands
    await writeFile(join(testDir, 'package.json'), JSON.stringify({
      name: 'loop-test',
      scripts: { 'tokens:validate': 'echo ok' },
    }));
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('diagnose → fix → validate loop resolves a value mismatch within 3 iterations', async () => {
    // Setup: Figma says #ff0000, code says #0000ff → drift
    await writeFile(
      join(testDir, 'figma/exports/Semantics (Roles).tokens.json'),
      JSON.stringify({
        Color: {
          Brand: {
            Primary: {
              $type: 'color',
              $value: '#ff0000',
              $extensions: { 'com.figma.codeSyntax': { WEB: 'var(--color-brand-primary)' } },
            },
          },
        },
      }, null, 2),
    );
    await writeFile(
      join(testDir, 'dist/tokens/json/semantics-roles.tokens.json'),
      JSON.stringify({
        Color: { Brand: { Primary: { $type: 'color', $value: '#0000ff' } } },
      }),
    );

    const MAX_ITERATIONS = 3;
    let resolved = false;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      // 1. Diagnose
      const driftResult = await diagnoseDriftHandler({}, testDir);
      const report = JSON.parse(driftResult.content[0].text);

      if (report.summary.driftCount === 0) {
        resolved = true;
        break;
      }

      // 2. Fix: update the Figma export value to match code
      const firstDrift = report.drift[0];
      if (firstDrift.type === 'value_mismatch') {
        await applyTokenFixHandler(
          { token: firstDrift.token, action: 'update_value', newValue: firstDrift.codeValue },
          testDir,
        );
      }

      // 3. Validate
      const validation = await validateSystemHandler(
        { command: 'echo validation-pass' },
        testDir,
      );
      const valResult = JSON.parse(validation.content[0].text);
      assert.equal(valResult.pass, true, `Validation failed on iteration ${i + 1}`);
    }

    // After fix, re-diagnose to confirm convergence
    const finalDrift = await diagnoseDriftHandler({}, testDir);
    const finalReport = JSON.parse(finalDrift.content[0].text);
    assert.equal(finalReport.summary.driftCount, 0, 'Loop did not converge — drift remains');

    // Verify file was actually modified
    const fileContent = JSON.parse(
      await readFile(join(testDir, 'figma/exports/Semantics (Roles).tokens.json'), 'utf8'),
    );
    assert.equal(fileContent.Color.Brand.Primary.$value, '#0000ff');
  });

  it('loop resolves multiple drifts sequentially', async () => {
    await writeFile(
      join(testDir, 'figma/exports/Semantics (Roles).tokens.json'),
      JSON.stringify({
        Color: {
          Text: {
            Default: {
              $type: 'color',
              $value: '#111',
              $extensions: { 'com.figma.codeSyntax': { WEB: 'var(--color-text-default)' } },
            },
            Muted: {
              $type: 'color',
              $value: '#999',
              $extensions: { 'com.figma.codeSyntax': { WEB: 'var(--color-text-muted)' } },
            },
          },
        },
      }, null, 2),
    );
    await writeFile(
      join(testDir, 'dist/tokens/json/semantics-roles.tokens.json'),
      JSON.stringify({
        Color: {
          Text: {
            Default: { $type: 'color', $value: '#000' },
            Muted: { $type: 'color', $value: '#666' },
          },
        },
      }),
    );

    const MAX_ITERATIONS = 5;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const driftResult = await diagnoseDriftHandler({}, testDir);
      const report = JSON.parse(driftResult.content[0].text);

      if (report.summary.driftCount === 0) break;

      // Fix one drift per iteration (like an agent would)
      const firstDrift = report.drift[0];
      if (firstDrift.type === 'value_mismatch') {
        await applyTokenFixHandler(
          { token: firstDrift.token, action: 'update_value', newValue: firstDrift.codeValue },
          testDir,
        );
      }
    }

    const finalDrift = await diagnoseDriftHandler({}, testDir);
    const finalReport = JSON.parse(finalDrift.content[0].text);
    assert.equal(finalReport.summary.driftCount, 0, 'Multi-drift loop did not converge');
  });

  it('loop terminates when drift is not fixable (missing_in_code)', async () => {
    await writeFile(
      join(testDir, 'figma/exports/Semantics (Roles).tokens.json'),
      JSON.stringify({
        Color: {
          New: {
            Token: {
              $type: 'color',
              $value: '#abc',
              $extensions: { 'com.figma.codeSyntax': { WEB: 'var(--color-new-token)' } },
            },
          },
        },
      }, null, 2),
    );
    await writeFile(
      join(testDir, 'dist/tokens/json/semantics-roles.tokens.json'),
      JSON.stringify({ Color: { Existing: { $type: 'color', $value: '#000' } } }),
    );

    // Diagnose detects drift
    const driftResult = await diagnoseDriftHandler({}, testDir);
    const report = JSON.parse(driftResult.content[0].text);

    assert.ok(report.summary.driftCount > 0);
    assert.equal(report.drift[0].type, 'missing_in_code');

    // Agent sees "missing_in_code" → knows it can't fix via apply_token_fix alone
    // This proves the loop gives enough info for the agent to decide next action
  });
});
