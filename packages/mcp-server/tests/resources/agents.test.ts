import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { handleAgentResource } from '../../src/resources/agents.js';

describe('handleAgentResource', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `agents-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(testDir, { recursive: true });
    await mkdir(join(testDir, 'docs', 'agentic'), { recursive: true });

    // Create test files matching the expected paths
    await writeFile(join(testDir, 'AGENTS.md'), '# Agent Rules\nBe good.', 'utf8');
    await writeFile(join(testDir, 'docs', 'agentic', 'assistant-behavior-rules.md'), '# Behavior\nFollow rules.', 'utf8');
    await writeFile(join(testDir, 'DESIGN.md'), '# Design Contract\nArchitecture here.', 'utf8');
    await writeFile(join(testDir, 'IMPLEMENTATION.md'), '# Implementation\nExecution guidance.', 'utf8');
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('returns AGENTS.md for uif://agents/rules', async () => {
    const result = await handleAgentResource('uif://agents/rules', testDir);

    assert.equal(result.uri, 'uif://agents/rules');
    assert.equal(result.name, 'Agent Rules');
    assert.equal(result.mimeType, 'text/markdown');
    assert.equal(result.content, '# Agent Rules\nBe good.');
    assert.equal(result.metadata.category, 'agents');
    assert.ok(result.metadata.contentHash.length > 0);
  });

  it('returns assistant-behavior-rules.md for uif://agents/behavior', async () => {
    const result = await handleAgentResource('uif://agents/behavior', testDir);

    assert.equal(result.uri, 'uif://agents/behavior');
    assert.equal(result.name, 'Assistant Behavior Rules');
    assert.equal(result.mimeType, 'text/markdown');
    assert.equal(result.content, '# Behavior\nFollow rules.');
    assert.equal(result.metadata.category, 'agents');
  });

  it('returns DESIGN.md for uif://agents/design-contract', async () => {
    const result = await handleAgentResource('uif://agents/design-contract', testDir);

    assert.equal(result.uri, 'uif://agents/design-contract');
    assert.equal(result.name, 'Design Contract');
    assert.equal(result.mimeType, 'text/markdown');
    assert.equal(result.content, '# Design Contract\nArchitecture here.');
    assert.equal(result.metadata.category, 'agents');
  });

  it('returns IMPLEMENTATION.md for uif://agents/implementation', async () => {
    const result = await handleAgentResource('uif://agents/implementation', testDir);

    assert.equal(result.uri, 'uif://agents/implementation');
    assert.equal(result.name, 'Implementation Guide');
    assert.equal(result.mimeType, 'text/markdown');
    assert.equal(result.content, '# Implementation\nExecution guidance.');
    assert.equal(result.metadata.category, 'agents');
  });

  it('throws error with valid URIs for unrecognized identifier', async () => {
    await assert.rejects(
      () => handleAgentResource('uif://agents/unknown', testDir),
      (err: Error) => {
        assert.ok(err.message.includes('Resource not found: uif://agents/unknown'));
        assert.ok(err.message.includes('uif://agents/rules'));
        assert.ok(err.message.includes('uif://agents/behavior'));
        assert.ok(err.message.includes('uif://agents/design-contract'));
        assert.ok(err.message.includes('uif://agents/implementation'));
        return true;
      },
    );
  });

  it('throws error when the backing file is missing', async () => {
    await rm(join(testDir, 'AGENTS.md'));

    await assert.rejects(
      () => handleAgentResource('uif://agents/rules', testDir),
      (err: NodeJS.ErrnoException) => {
        assert.equal(err.code, 'ENOENT');
        return true;
      },
    );
  });

  it('returns a valid SHA-256 content hash', async () => {
    const result = await handleAgentResource('uif://agents/rules', testDir);

    // SHA-256 hex digest is 64 characters
    assert.equal(result.metadata.contentHash.length, 64);
    assert.match(result.metadata.contentHash, /^[0-9a-f]{64}$/);
  });
});
