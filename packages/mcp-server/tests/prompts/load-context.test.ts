import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadContextHandler } from '../../src/prompts/load-context.js';

describe('loadContextHandler', () => {
  let testDir: string;

  const validManifest = {
    version: 2,
    description: 'Agent context loading manifest',
    contextFiles: {
      design: { path: 'DESIGN.md', purpose: 'Executive design contract', priority: 1 },
      agentRules: { path: 'AGENTS.md', purpose: 'Agent behavior rules', priority: 2 },
      playbook: { path: 'docs/playbook.md', purpose: 'Doc hierarchy', priority: 3 },
      workingContext: { path: 'docs/working-context.md', purpose: 'Current priorities', priority: 4 },
      operatingRules: { path: 'docs/ui-foundations-rules.md', purpose: 'Operating rules', priority: 5 },
      agentBehavior: { path: 'docs/agentic/assistant-behavior-rules.md', purpose: 'Agent behavior', priority: 6 },
      implementation: { path: 'IMPLEMENTATION.md', purpose: 'Execution guidance', priority: 7 },
      tokenPipeline: { path: 'docs/token-pipeline.md', purpose: 'Token pipeline', priority: 8 },
    },
    contextDirectories: {
      foundations: { path: 'docs/foundations/', purpose: 'Architecture decisions' },
      principles: { path: 'docs/principles/', purpose: 'Perception and heuristics' },
      patterns: { path: 'docs/patterns/', purpose: 'Pattern guidance' },
      components: { path: 'docs/components/', purpose: 'Component docs' },
      agentic: { path: 'docs/agentic/', purpose: 'Agent workflows' },
      validation: { path: 'docs/validation/', purpose: 'Validation metadata' },
      steering: { path: '.kiro/steering/', purpose: 'Design principles and rules' },
    },
    tokenSources: {
      figmaExports: 'figma/exports/*.tokens.json',
    },
  };

  beforeEach(async () => {
    testDir = join(tmpdir(), `load-context-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, 'docs'), { recursive: true });
    await writeFile(
      join(testDir, 'docs', 'context-manifest.json'),
      JSON.stringify(validManifest, null, 2),
      'utf8',
    );
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  // ---------------------------------------------------------------------------
  // Successful cases
  // ---------------------------------------------------------------------------

  it('returns prompt with files ordered by ascending priority for "implementation"', async () => {
    const result = await loadContextHandler({ task_type: 'implementation' }, testDir);

    assert.equal(result.messages.length, 1);
    assert.equal(result.messages[0].role, 'user');
    assert.equal(result.messages[0].content.type, 'text');

    const text = result.messages[0].content.text;

    // Verify files are listed in priority order
    const designIdx = text.indexOf('DESIGN.md');
    const agentsIdx = text.indexOf('AGENTS.md');
    const implIdx = text.indexOf('IMPLEMENTATION.md');
    const tokenIdx = text.indexOf('docs/token-pipeline.md');

    assert.ok(designIdx < agentsIdx, 'DESIGN.md should appear before AGENTS.md');
    assert.ok(agentsIdx < implIdx, 'AGENTS.md should appear before IMPLEMENTATION.md');
    assert.ok(implIdx < tokenIdx, 'IMPLEMENTATION.md should appear before token-pipeline.md');
  });

  it('includes task-type-specific directories for "implementation"', async () => {
    const result = await loadContextHandler({ task_type: 'implementation' }, testDir);
    const text = result.messages[0].content.text;

    assert.ok(text.includes('docs/foundations/'), 'Should include foundations directory');
    assert.ok(text.includes('docs/components/'), 'Should include components directory');
    assert.ok(text.includes('docs/patterns/'), 'Should include patterns directory');
    assert.ok(text.includes('docs/agentic/'), 'Should include agentic directory');
    assert.ok(text.includes('.kiro/steering/'), 'Should include steering directory');
    // Should NOT include validation for implementation
    assert.ok(!text.includes('docs/validation/'), 'Should not include validation directory');
  });

  it('includes task-type-specific directories for "audit"', async () => {
    const result = await loadContextHandler({ task_type: 'audit' }, testDir);
    const text = result.messages[0].content.text;

    assert.ok(text.includes('docs/foundations/'), 'Should include foundations');
    assert.ok(text.includes('docs/validation/'), 'Should include validation');
    assert.ok(text.includes('docs/agentic/'), 'Should include agentic');
    assert.ok(text.includes('.kiro/steering/'), 'Should include steering');
    // Should NOT include components for audit
    assert.ok(!text.includes('docs/components/'), 'Should not include components');
  });

  it('includes task-type-specific directories for "token-proposal"', async () => {
    const result = await loadContextHandler({ task_type: 'token-proposal' }, testDir);
    const text = result.messages[0].content.text;

    assert.ok(text.includes('docs/foundations/'), 'Should include foundations');
    assert.ok(text.includes('docs/principles/'), 'Should include principles');
    assert.ok(text.includes('docs/validation/'), 'Should include validation');
    // Should NOT include patterns for token-proposal
    assert.ok(!text.includes('docs/patterns/'), 'Should not include patterns');
  });

  it('includes task-type-specific directories for "pattern-discovery"', async () => {
    const result = await loadContextHandler({ task_type: 'pattern-discovery' }, testDir);
    const text = result.messages[0].content.text;

    assert.ok(text.includes('docs/foundations/'), 'Should include foundations');
    assert.ok(text.includes('docs/principles/'), 'Should include principles');
    assert.ok(text.includes('docs/patterns/'), 'Should include patterns');
    assert.ok(text.includes('docs/components/'), 'Should include components');
    assert.ok(text.includes('.kiro/steering/'), 'Should include steering');
  });

  it('includes the task type in the response', async () => {
    const result = await loadContextHandler({ task_type: 'audit' }, testDir);
    const text = result.messages[0].content.text;

    assert.ok(text.includes('audit'), 'Should mention the task type');
  });

  it('lists all 8 context files regardless of task type', async () => {
    const result = await loadContextHandler({ task_type: 'implementation' }, testDir);
    const text = result.messages[0].content.text;

    assert.ok(text.includes('DESIGN.md'));
    assert.ok(text.includes('AGENTS.md'));
    assert.ok(text.includes('docs/playbook.md'));
    assert.ok(text.includes('docs/working-context.md'));
    assert.ok(text.includes('docs/ui-foundations-rules.md'));
    assert.ok(text.includes('docs/agentic/assistant-behavior-rules.md'));
    assert.ok(text.includes('IMPLEMENTATION.md'));
    assert.ok(text.includes('docs/token-pipeline.md'));
  });

  // ---------------------------------------------------------------------------
  // Error cases: invalid task_type (Requirement 16.3)
  // ---------------------------------------------------------------------------

  it('rejects invalid task_type with error listing valid values', async () => {
    await assert.rejects(
      () => loadContextHandler({ task_type: 'invalid-type' }, testDir),
      (err: Error) => {
        assert.ok(err.message.includes('Invalid task_type'));
        assert.ok(err.message.includes('invalid-type'));
        assert.ok(err.message.includes('implementation'));
        assert.ok(err.message.includes('audit'));
        assert.ok(err.message.includes('token-proposal'));
        assert.ok(err.message.includes('pattern-discovery'));
        return true;
      },
    );
  });

  it('rejects empty task_type', async () => {
    await assert.rejects(
      () => loadContextHandler({ task_type: '' }, testDir),
      (err: Error) => {
        assert.ok(err.message.includes('Invalid task_type'));
        return true;
      },
    );
  });

  it('rejects missing task_type argument', async () => {
    await assert.rejects(
      () => loadContextHandler({}, testDir),
      (err: Error) => {
        assert.ok(err.message.includes('Invalid task_type'));
        return true;
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Error cases: manifest unavailable (Requirement 16.4)
  // ---------------------------------------------------------------------------

  it('throws error when manifest file is missing', async () => {
    const emptyDir = join(tmpdir(), `load-context-empty-${Date.now()}`);
    await mkdir(emptyDir, { recursive: true });

    await assert.rejects(
      () => loadContextHandler({ task_type: 'implementation' }, emptyDir),
      (err: Error) => {
        assert.ok(err.message.includes('manifest unavailable'));
        return true;
      },
    );

    await rm(emptyDir, { recursive: true, force: true });
  });

  it('throws error when manifest contains invalid JSON', async () => {
    await writeFile(
      join(testDir, 'docs', 'context-manifest.json'),
      'not valid json {{{',
      'utf8',
    );

    await assert.rejects(
      () => loadContextHandler({ task_type: 'implementation' }, testDir),
      (err: Error) => {
        assert.ok(err.message.includes('manifest unavailable'));
        return true;
      },
    );
  });

  it('throws error when manifest is missing contextFiles key', async () => {
    await writeFile(
      join(testDir, 'docs', 'context-manifest.json'),
      JSON.stringify({ contextDirectories: {} }),
      'utf8',
    );

    await assert.rejects(
      () => loadContextHandler({ task_type: 'implementation' }, testDir),
      (err: Error) => {
        assert.ok(err.message.includes('manifest unavailable'));
        return true;
      },
    );
  });

  it('throws error when manifest is missing contextDirectories key', async () => {
    await writeFile(
      join(testDir, 'docs', 'context-manifest.json'),
      JSON.stringify({ contextFiles: {} }),
      'utf8',
    );

    await assert.rejects(
      () => loadContextHandler({ task_type: 'implementation' }, testDir),
      (err: Error) => {
        assert.ok(err.message.includes('manifest unavailable'));
        return true;
      },
    );
  });
});
