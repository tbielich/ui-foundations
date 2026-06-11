import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { handlePatterns } from '../../src/resources/patterns.js';

describe('handlePatterns', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `patterns-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, 'docs', 'patterns'), { recursive: true });

    // Create test pattern files
    await writeFile(
      join(testDir, 'docs', 'patterns', 'forms.md'),
      '# Forms\n\n## Purpose\n\nForm guidance.\n\n## Related docs\n\n- `docs/components/input.md`\n- `docs/components/button.md`\n',
      'utf8',
    );
    await writeFile(
      join(testDir, 'docs', 'patterns', 'navigation.md'),
      '# Navigation\n\n## Purpose\n\nNavigation guidance.\n\n## Related docs\n\n- `docs/components/button.md`\n',
      'utf8',
    );
    await writeFile(
      join(testDir, 'docs', 'patterns', 'cards.md'),
      '# Cards\n\n## Purpose\n\nCard guidance with --color-text-default token.\n\n## Related docs\n\n- `docs/components/button.md`\n',
      'utf8',
    );
    await writeFile(
      join(testDir, 'docs', 'patterns', 'layout.md'),
      '# Layout\n\n## Purpose\n\nLayout guidance.\n',
      'utf8',
    );
    await writeFile(
      join(testDir, 'docs', 'patterns', 'feedback.md'),
      '# Feedback\n\n## Purpose\n\nFeedback guidance.\n\n## Related docs\n\n- `docs/components/button.md`\n',
      'utf8',
    );
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('listing (uif://patterns)', () => {
    it('returns all five patterns with name, description, and URI', async () => {
      const result = await handlePatterns('uif://patterns', testDir);

      assert.equal(result.uri, 'uif://patterns');
      assert.equal(result.name, 'Pattern Listing');
      assert.equal(result.mimeType, 'application/json');
      assert.equal(result.metadata.category, 'patterns');

      const content = result.content as Array<{ name: string; description: string; uri: string }>;
      assert.equal(content.length, 5);

      const names = content.map((p) => p.name);
      assert.ok(names.includes('forms'));
      assert.ok(names.includes('navigation'));
      assert.ok(names.includes('cards'));
      assert.ok(names.includes('layout'));
      assert.ok(names.includes('feedback'));

      // Each entry has required fields
      for (const entry of content) {
        assert.ok(entry.name.length > 0);
        assert.ok(entry.description.length > 0);
        assert.ok(entry.uri.startsWith('uif://patterns/'));
      }
    });
  });

  describe('individual pattern (uif://patterns/{name})', () => {
    it('returns full pattern data for forms', async () => {
      const result = await handlePatterns('uif://patterns/forms', testDir);

      assert.equal(result.uri, 'uif://patterns/forms');
      assert.equal(result.mimeType, 'application/json');
      assert.equal(result.metadata.category, 'patterns');
      assert.ok(result.metadata.contentHash.length > 0);

      const content = result.content as {
        name: string;
        description: string;
        documentation: string;
        relatedComponents: string[];
        relatedTokens: string[];
        uri: string;
      };

      assert.equal(content.name, 'forms');
      assert.ok(content.description.length > 0);
      assert.ok(content.documentation.includes('# Forms'));
      assert.equal(content.uri, 'uif://patterns/forms');
    });

    it('extracts related components from documentation', async () => {
      const result = await handlePatterns('uif://patterns/forms', testDir);
      const content = result.content as { relatedComponents: string[] };

      assert.ok(content.relatedComponents.includes('input'));
      assert.ok(content.relatedComponents.includes('button'));
    });

    it('extracts related tokens from documentation', async () => {
      const result = await handlePatterns('uif://patterns/cards', testDir);
      const content = result.content as { relatedTokens: string[] };

      assert.ok(content.relatedTokens.includes('--color-text-default'));
    });

    it('resolves pattern names case-insensitively', async () => {
      const result = await handlePatterns('uif://patterns/FORMS', testDir);
      const content = result.content as { name: string };

      assert.equal(content.name, 'forms');
    });

    it('resolves mixed-case pattern names', async () => {
      const result = await handlePatterns('uif://patterns/Navigation', testDir);
      const content = result.content as { name: string };

      assert.equal(content.name, 'navigation');
    });

    it('returns a valid SHA-256 content hash', async () => {
      const result = await handlePatterns('uif://patterns/forms', testDir);

      assert.equal(result.metadata.contentHash.length, 64);
      assert.match(result.metadata.contentHash, /^[0-9a-f]{64}$/);
    });
  });

  describe('error handling', () => {
    it('throws error with valid pattern names for unrecognized identifier', async () => {
      await assert.rejects(
        () => handlePatterns('uif://patterns/unknown', testDir),
        (err: Error) => {
          assert.ok(err.message.includes('Resource not found: uif://patterns/unknown'));
          assert.ok(err.message.includes('forms'));
          assert.ok(err.message.includes('navigation'));
          assert.ok(err.message.includes('cards'));
          assert.ok(err.message.includes('layout'));
          assert.ok(err.message.includes('feedback'));
          return true;
        },
      );
    });

    it('throws error when the backing file is missing', async () => {
      await rm(join(testDir, 'docs', 'patterns', 'forms.md'));

      await assert.rejects(
        () => handlePatterns('uif://patterns/forms', testDir),
        (err: NodeJS.ErrnoException) => {
          assert.equal(err.code, 'ENOENT');
          return true;
        },
      );
    });
  });
});
