import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { handleGovernanceResource } from '../../src/resources/governance.js';

describe('handleGovernanceResource', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `governance-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(testDir, { recursive: true });
    await mkdir(join(testDir, 'docs', 'foundations'), { recursive: true });

    // Create test files matching the expected paths
    await writeFile(join(testDir, 'docs', 'ui-foundations-rules.md'), '# UI Foundations Rules\nNaming and layering standards.', 'utf8');
    await writeFile(join(testDir, 'docs', 'foundations', 'foundation-002-naming-and-grouping.md'), '# Naming and Grouping\nToken naming conventions.', 'utf8');
    await writeFile(join(testDir, 'docs', 'foundations', 'foundation-001-token-layering.md'), '# Token Layering\nCore → Semantic → Component.', 'utf8');
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('returns ui-foundations-rules.md for uif://governance/rules', async () => {
    const result = await handleGovernanceResource('uif://governance/rules', testDir);

    assert.equal(result.uri, 'uif://governance/rules');
    assert.equal(result.name, 'Governance Rules');
    assert.equal(result.mimeType, 'text/markdown');
    assert.equal(result.content, '# UI Foundations Rules\nNaming and layering standards.');
    assert.equal(result.metadata.category, 'governance');
    assert.ok(result.metadata.contentHash.length > 0);
  });

  it('returns foundation-002-naming-and-grouping.md for uif://governance/naming', async () => {
    const result = await handleGovernanceResource('uif://governance/naming', testDir);

    assert.equal(result.uri, 'uif://governance/naming');
    assert.equal(result.name, 'Naming Conventions');
    assert.equal(result.mimeType, 'text/markdown');
    assert.equal(result.content, '# Naming and Grouping\nToken naming conventions.');
    assert.equal(result.metadata.category, 'governance');
  });

  it('returns foundation-001-token-layering.md for uif://governance/layering', async () => {
    const result = await handleGovernanceResource('uif://governance/layering', testDir);

    assert.equal(result.uri, 'uif://governance/layering');
    assert.equal(result.name, 'Token Layering');
    assert.equal(result.mimeType, 'text/markdown');
    assert.equal(result.content, '# Token Layering\nCore → Semantic → Component.');
    assert.equal(result.metadata.category, 'governance');
  });

  it('throws error with valid URIs for unrecognized identifier', async () => {
    await assert.rejects(
      () => handleGovernanceResource('uif://governance/unknown', testDir),
      (err: Error) => {
        assert.ok(err.message.includes('Resource not found: uif://governance/unknown'));
        assert.ok(err.message.includes('uif://governance/rules'));
        assert.ok(err.message.includes('uif://governance/naming'));
        assert.ok(err.message.includes('uif://governance/layering'));
        return true;
      },
    );
  });

  it('throws error indicating unavailable file when backing file is missing', async () => {
    await rm(join(testDir, 'docs', 'ui-foundations-rules.md'));

    await assert.rejects(
      () => handleGovernanceResource('uif://governance/rules', testDir),
      (err: Error) => {
        assert.ok(err.message.includes('Governance resource unavailable'));
        assert.ok(err.message.includes('docs/ui-foundations-rules.md'));
        return true;
      },
    );
  });

  it('throws descriptive error when naming file is unreadable', async () => {
    await rm(join(testDir, 'docs', 'foundations', 'foundation-002-naming-and-grouping.md'));

    await assert.rejects(
      () => handleGovernanceResource('uif://governance/naming', testDir),
      (err: Error) => {
        assert.ok(err.message.includes('Governance resource unavailable'));
        assert.ok(err.message.includes('foundation-002-naming-and-grouping.md'));
        return true;
      },
    );
  });

  it('returns a valid SHA-256 content hash', async () => {
    const result = await handleGovernanceResource('uif://governance/rules', testDir);

    // SHA-256 hex digest is 64 characters
    assert.equal(result.metadata.contentHash.length, 64);
    assert.match(result.metadata.contentHash, /^[0-9a-f]{64}$/);
  });
});
