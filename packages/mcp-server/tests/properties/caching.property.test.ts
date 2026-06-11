/**
 * Property 20: Content hash consistency
 *
 * For any resource read, `contentHash` equals SHA-256 hex of the content body;
 * identical content produces identical hash; different content produces different hash.
 *
 * Feature: mcp-server, Property 20: Content hash consistency
 * Validates: Requirements 21.2
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fc from 'fast-check';

import { contentHash } from '../../src/util/content-hash.js';
import { FileReader } from '../../src/util/file-reader.js';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('Feature: mcp-server, Property 20: Content hash consistency', () => {
  describe('contentHash: SHA-256 hex digest correctness', () => {
    it('for any arbitrary string, contentHash(s) equals SHA-256 hex digest of s', () => {
      fc.assert(
        fc.property(fc.string(), (content) => {
          const expected = createHash('sha256').update(content, 'utf8').digest('hex');
          const actual = contentHash(content);
          assert.equal(actual, expected);
        }),
        { numRuns: 100 }
      );
    });

    it('handles unicode and special characters correctly', () => {
      fc.assert(
        fc.property(
          fc.string({ unit: 'grapheme-ascii', minLength: 0, maxLength: 200 }),
          (content) => {
            const expected = createHash('sha256').update(content, 'utf8').digest('hex');
            const actual = contentHash(content);
            assert.equal(actual, expected);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('contentHash: determinism (identical content produces identical hash)', () => {
    it('calling contentHash twice on the same string always produces the same result', () => {
      fc.assert(
        fc.property(fc.string(), (content) => {
          const hash1 = contentHash(content);
          const hash2 = contentHash(content);
          assert.equal(hash1, hash2);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('contentHash: collision resistance (different content produces different hash)', () => {
    it('two different strings produce different hashes', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 }),
          (a, b) => {
            fc.pre(a !== b);
            const hashA = contentHash(a);
            const hashB = contentHash(b);
            assert.notEqual(hashA, hashB);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('FileReader: content hash consistency via file reads', () => {
    let tempDir: string;

    it('FileReader.read() returns contentHash equal to SHA-256 hex of file content', async () => {
      tempDir = join(tmpdir(), `mcp-test-caching-${Date.now()}`);
      await mkdir(tempDir, { recursive: true });

      try {
        await fc.assert(
          fc.asyncProperty(
            fc.string({ minLength: 1, maxLength: 500 }),
            async (content) => {
              const filename = 'test-file.txt';
              const filePath = join(tempDir, filename);
              await writeFile(filePath, content, 'utf8');

              const reader = new FileReader(tempDir);
              const result = await reader.read(filename);

              const expected = createHash('sha256').update(content, 'utf8').digest('hex');
              assert.equal(result.contentHash, expected);
              assert.equal(result.content, content);
            }
          ),
          { numRuns: 100 }
        );
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('FileReader returns identical hash for identical file content across reads', async () => {
      tempDir = join(tmpdir(), `mcp-test-determinism-${Date.now()}`);
      await mkdir(tempDir, { recursive: true });

      try {
        await fc.assert(
          fc.asyncProperty(
            fc.string({ minLength: 1, maxLength: 500 }),
            async (content) => {
              const filename = 'test-file.txt';
              const filePath = join(tempDir, filename);
              await writeFile(filePath, content, 'utf8');

              const reader = new FileReader(tempDir);
              const result1 = await reader.read(filename);
              const result2 = await reader.read(filename);

              assert.equal(result1.contentHash, result2.contentHash);
            }
          ),
          { numRuns: 100 }
        );
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('FileReader returns different hash when file content changes', async () => {
      tempDir = join(tmpdir(), `mcp-test-change-${Date.now()}`);
      await mkdir(tempDir, { recursive: true });

      try {
        await fc.assert(
          fc.asyncProperty(
            fc.string({ minLength: 1, maxLength: 500 }),
            fc.string({ minLength: 1, maxLength: 500 }),
            async (contentA, contentB) => {
              fc.pre(contentA !== contentB);

              const filename = 'test-file.txt';
              const filePath = join(tempDir, filename);

              await writeFile(filePath, contentA, 'utf8');
              const reader = new FileReader(tempDir);
              const result1 = await reader.read(filename);

              await writeFile(filePath, contentB, 'utf8');
              const result2 = await reader.read(filename);

              assert.notEqual(result1.contentHash, result2.contentHash);
            }
          ),
          { numRuns: 100 }
        );
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });
});
