import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { handleFoundations } from '../../src/resources/foundations.js';

describe('handleFoundations', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `foundations-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, 'docs', 'foundations'), { recursive: true });

    // Create test foundation files with frontmatter
    await writeFile(
      join(testDir, 'docs', 'foundations', 'foundation-001-token-layering.md'),
      '---\ntitle: Foundation-001 – Token Layering Principles\nstatus: active\ntype: foundation-decision\n---\n\n# Token Layering\n\nContent here.',
      'utf8',
    );
    await writeFile(
      join(testDir, 'docs', 'foundations', 'foundation-002-naming-and-grouping.md'),
      '---\ntitle: Foundation-002 – Naming and Grouping\nstatus: active\ntype: foundation-decision\n---\n\n# Naming\n\nNaming content.',
      'utf8',
    );
    await writeFile(
      join(testDir, 'docs', 'foundations', 'foundation-003-color-semantics.md'),
      '---\ntitle: Foundation-003 – Color Semantics and Status\nstatus: active\ntype: foundation-decision\n---\n\n# Color\n\nColor content.',
      'utf8',
    );
    // Non-foundation file should be ignored
    await writeFile(
      join(testDir, 'docs', 'foundations', 'README.md'),
      '# Foundations README',
      'utf8',
    );
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('listing (uif://foundations)', () => {
    it('returns JSON array of all foundation documents', async () => {
      const result = await handleFoundations('uif://foundations', testDir);

      assert.equal(result.uri, 'uif://foundations');
      assert.equal(result.name, 'Foundation Document Listing');
      assert.equal(result.mimeType, 'application/json');
      assert.equal(result.metadata.category, 'foundations');

      const listing = JSON.parse(result.content as string);
      assert.equal(listing.length, 3);
    });

    it('includes id, title, and uri for each entry', async () => {
      const result = await handleFoundations('uif://foundations', testDir);
      const listing = JSON.parse(result.content as string);

      assert.deepEqual(listing[0], {
        id: '001',
        title: 'Foundation-001 – Token Layering Principles',
        uri: 'uif://foundations/001',
      });
      assert.deepEqual(listing[1], {
        id: '002',
        title: 'Foundation-002 – Naming and Grouping',
        uri: 'uif://foundations/002',
      });
    });

    it('sorts entries by ID ascending', async () => {
      const result = await handleFoundations('uif://foundations', testDir);
      const listing = JSON.parse(result.content as string);

      const ids = listing.map((e: { id: string }) => e.id);
      assert.deepEqual(ids, ['001', '002', '003']);
    });

    it('excludes non-foundation files (README.md)', async () => {
      const result = await handleFoundations('uif://foundations', testDir);
      const listing = JSON.parse(result.content as string);

      const ids = listing.map((e: { id: string }) => e.id);
      assert.ok(!ids.includes('README'));
    });

    it('returns a valid SHA-256 content hash', async () => {
      const result = await handleFoundations('uif://foundations', testDir);

      assert.equal(result.metadata.contentHash.length, 64);
      assert.match(result.metadata.contentHash, /^[0-9a-f]{64}$/);
    });
  });

  describe('individual document (uif://foundations/{id})', () => {
    it('returns markdown content for a valid ID', async () => {
      const result = await handleFoundations('uif://foundations/001', testDir);

      assert.equal(result.uri, 'uif://foundations/001');
      assert.equal(result.name, 'Foundation-001 – Token Layering Principles');
      assert.equal(result.mimeType, 'text/markdown');
      assert.equal(result.metadata.category, 'foundations');
      assert.ok((result.content as string).includes('# Token Layering'));
    });

    it('returns full file content including frontmatter', async () => {
      const result = await handleFoundations('uif://foundations/002', testDir);

      assert.ok((result.content as string).includes('---'));
      assert.ok((result.content as string).includes('title: Foundation-002'));
      assert.ok((result.content as string).includes('# Naming'));
    });

    it('returns a valid SHA-256 content hash', async () => {
      const result = await handleFoundations('uif://foundations/001', testDir);

      assert.equal(result.metadata.contentHash.length, 64);
      assert.match(result.metadata.contentHash, /^[0-9a-f]{64}$/);
    });

    it('throws not-found error with valid identifiers for unknown ID', async () => {
      await assert.rejects(
        () => handleFoundations('uif://foundations/999', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('Resource not found: uif://foundations/999'));
          assert.ok(err.message.includes('001'));
          assert.ok(err.message.includes('002'));
          assert.ok(err.message.includes('003'));
          return true;
        },
      );
    });
  });

  describe('title extraction', () => {
    it('extracts title from frontmatter', async () => {
      const result = await handleFoundations('uif://foundations', testDir);
      const listing = JSON.parse(result.content as string);

      assert.equal(listing[0].title, 'Foundation-001 – Token Layering Principles');
    });

    it('falls back to slug-based title when no frontmatter', async () => {
      // Create a file without frontmatter
      await writeFile(
        join(testDir, 'docs', 'foundations', 'foundation-004-test-slug.md'),
        '# No Frontmatter\n\nJust content.',
        'utf8',
      );

      const result = await handleFoundations('uif://foundations', testDir);
      const listing = JSON.parse(result.content as string);
      const entry = listing.find((e: { id: string }) => e.id === '004');

      assert.equal(entry.title, 'Test Slug');
    });
  });
});
