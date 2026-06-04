import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { FileReader } from '../../src/util/file-reader.js';

describe('FileReader', () => {
  let testDir: string;
  let reader: FileReader;

  beforeEach(async () => {
    testDir = join(tmpdir(), `file-reader-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(testDir, { recursive: true });
    reader = new FileReader(testDir);
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('read()', () => {
    it('reads a file and returns its content', async () => {
      const content = 'hello world';
      await writeFile(join(testDir, 'test.txt'), content, 'utf8');

      const result = await reader.read('test.txt');
      assert.equal(result.content, content);
    });

    it('computes correct SHA-256 content hash', async () => {
      const content = '{"key": "value"}';
      await writeFile(join(testDir, 'data.json'), content, 'utf8');

      const expected = createHash('sha256').update(content, 'utf8').digest('hex');
      const result = await reader.read('data.json');
      assert.equal(result.contentHash, expected);
    });

    it('returns application/json MIME type for .json files', async () => {
      await writeFile(join(testDir, 'data.json'), '{}', 'utf8');

      const result = await reader.read('data.json');
      assert.equal(result.mimeType, 'application/json');
    });

    it('returns text/markdown MIME type for .md files', async () => {
      await writeFile(join(testDir, 'readme.md'), '# Hello', 'utf8');

      const result = await reader.read('readme.md');
      assert.equal(result.mimeType, 'text/markdown');
    });

    it('returns text/css MIME type for .css files', async () => {
      await writeFile(join(testDir, 'styles.css'), 'body {}', 'utf8');

      const result = await reader.read('styles.css');
      assert.equal(result.mimeType, 'text/css');
    });

    it('returns text/plain MIME type for unknown extensions', async () => {
      await writeFile(join(testDir, 'file.xyz'), 'content', 'utf8');

      const result = await reader.read('file.xyz');
      assert.equal(result.mimeType, 'text/plain');
    });

    it('includes a lastRead timestamp', async () => {
      await writeFile(join(testDir, 'test.txt'), 'content', 'utf8');

      const before = Date.now();
      const result = await reader.read('test.txt');
      const after = Date.now();

      assert.ok(result.lastRead >= before);
      assert.ok(result.lastRead <= after);
    });

    it('re-reads from disk on each call to get fresh content', async () => {
      await writeFile(join(testDir, 'changing.txt'), 'version 1', 'utf8');
      const first = await reader.read('changing.txt');
      assert.equal(first.content, 'version 1');

      await writeFile(join(testDir, 'changing.txt'), 'version 2', 'utf8');
      const second = await reader.read('changing.txt');
      assert.equal(second.content, 'version 2');
    });

    it('produces different hashes when file content changes', async () => {
      await writeFile(join(testDir, 'changing.txt'), 'original', 'utf8');
      const first = await reader.read('changing.txt');

      await writeFile(join(testDir, 'changing.txt'), 'modified', 'utf8');
      const second = await reader.read('changing.txt');

      assert.notEqual(first.contentHash, second.contentHash);
    });

    it('reads files in subdirectories', async () => {
      const subDir = join(testDir, 'sub', 'dir');
      await mkdir(subDir, { recursive: true });
      await writeFile(join(subDir, 'nested.md'), '# Nested', 'utf8');

      const result = await reader.read('sub/dir/nested.md');
      assert.equal(result.content, '# Nested');
      assert.equal(result.mimeType, 'text/markdown');
    });

    it('throws when the file does not exist', async () => {
      await assert.rejects(
        () => reader.read('nonexistent.txt'),
        (err: NodeJS.ErrnoException) => {
          assert.equal(err.code, 'ENOENT');
          return true;
        }
      );
    });
  });

  describe('invalidate()', () => {
    it('removes a specific file from the cache', async () => {
      await writeFile(join(testDir, 'cached.txt'), 'content', 'utf8');
      await reader.read('cached.txt');

      reader.invalidate('cached.txt');

      // After invalidation, a new read still works (re-reads from disk)
      await writeFile(join(testDir, 'cached.txt'), 'new content', 'utf8');
      const result = await reader.read('cached.txt');
      assert.equal(result.content, 'new content');
    });

    it('does not throw when invalidating a path not in cache', () => {
      assert.doesNotThrow(() => reader.invalidate('not-cached.txt'));
    });
  });

  describe('invalidateAll()', () => {
    it('clears all cached results', async () => {
      await writeFile(join(testDir, 'a.txt'), 'aaa', 'utf8');
      await writeFile(join(testDir, 'b.txt'), 'bbb', 'utf8');
      await reader.read('a.txt');
      await reader.read('b.txt');

      reader.invalidateAll();

      // After invalidation, reads still work (re-reads from disk)
      await writeFile(join(testDir, 'a.txt'), 'new aaa', 'utf8');
      await writeFile(join(testDir, 'b.txt'), 'new bbb', 'utf8');
      const resultA = await reader.read('a.txt');
      const resultB = await reader.read('b.txt');
      assert.equal(resultA.content, 'new aaa');
      assert.equal(resultB.content, 'new bbb');
    });

    it('does not throw when cache is already empty', () => {
      assert.doesNotThrow(() => reader.invalidateAll());
    });
  });
});
