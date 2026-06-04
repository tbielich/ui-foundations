import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { handleManifest } from '../../src/resources/manifest.js';

describe('handleManifest', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `manifest-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, 'docs'), { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('uif://manifest/context', () => {
    it('returns parsed manifest JSON with correct metadata', async () => {
      const manifest = {
        contextFiles: { design: { path: 'DESIGN.md', priority: 1 } },
        contextDirectories: { foundations: { path: 'docs/foundations/' } },
        tokenSources: { distJson: 'dist/tokens/json/*.json' },
      };
      await writeFile(join(testDir, 'docs/context-manifest.json'), JSON.stringify(manifest), 'utf8');

      const result = await handleManifest('uif://manifest/context', testDir);

      assert.equal(result.uri, 'uif://manifest/context');
      assert.equal(result.name, 'Context Manifest');
      assert.equal(result.mimeType, 'application/json');
      assert.deepEqual(result.content, manifest);
      assert.equal(result.metadata.category, 'manifest');
      assert.equal(typeof result.metadata.contentHash, 'string');
      assert.ok(result.metadata.contentHash.length > 0);
    });

    it('throws when manifest file is missing', async () => {
      await assert.rejects(
        () => handleManifest('uif://manifest/context', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('missing or unreadable'));
          return true;
        },
      );
    });

    it('throws when manifest contains invalid JSON', async () => {
      await writeFile(join(testDir, 'docs/context-manifest.json'), '{ invalid json', 'utf8');

      await assert.rejects(
        () => handleManifest('uif://manifest/context', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('invalid JSON'));
          return true;
        },
      );
    });

    it('throws when manifest is missing required keys', async () => {
      const incomplete = { contextFiles: {} };
      await writeFile(join(testDir, 'docs/context-manifest.json'), JSON.stringify(incomplete), 'utf8');

      await assert.rejects(
        () => handleManifest('uif://manifest/context', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('contextDirectories'));
          assert.ok(err.message.includes('tokenSources'));
          return true;
        },
      );
    });

    it('validates all three required top-level keys', async () => {
      const valid = {
        contextFiles: {},
        contextDirectories: {},
        tokenSources: {},
      };
      await writeFile(join(testDir, 'docs/context-manifest.json'), JSON.stringify(valid), 'utf8');

      const result = await handleManifest('uif://manifest/context', testDir);
      assert.deepEqual(result.content, valid);
    });
  });

  describe('uif://manifest/version', () => {
    it('returns version from package.json', async () => {
      const pkg = { name: 'test-pkg', version: '1.2.3' };
      await writeFile(join(testDir, 'package.json'), JSON.stringify(pkg), 'utf8');

      const result = await handleManifest('uif://manifest/version', testDir);

      assert.equal(result.uri, 'uif://manifest/version');
      assert.equal(result.name, 'Package Version');
      assert.equal(result.mimeType, 'application/json');
      assert.deepEqual(result.content, { version: '1.2.3' });
      assert.equal(result.metadata.category, 'manifest');
      assert.equal(typeof result.metadata.contentHash, 'string');
      assert.ok(result.metadata.contentHash.length > 0);
    });

    it('throws when package.json is missing', async () => {
      await assert.rejects(
        () => handleManifest('uif://manifest/version', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('missing or unreadable'));
          return true;
        },
      );
    });

    it('throws when package.json contains invalid JSON', async () => {
      await writeFile(join(testDir, 'package.json'), 'not json', 'utf8');

      await assert.rejects(
        () => handleManifest('uif://manifest/version', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('invalid JSON'));
          return true;
        },
      );
    });

    it('throws when package.json has no version field', async () => {
      const pkg = { name: 'test-pkg' };
      await writeFile(join(testDir, 'package.json'), JSON.stringify(pkg), 'utf8');

      await assert.rejects(
        () => handleManifest('uif://manifest/version', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('valid version field'));
          return true;
        },
      );
    });
  });

  describe('unknown manifest URI', () => {
    it('throws for unrecognized manifest URIs', async () => {
      await assert.rejects(
        () => handleManifest('uif://manifest/unknown', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('Unknown manifest resource'));
          assert.ok(err.message.includes('uif://manifest/context'));
          assert.ok(err.message.includes('uif://manifest/version'));
          return true;
        },
      );
    });
  });
});
