import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { contentHash } from '../../src/util/content-hash.js';

describe('contentHash', () => {
  it('returns SHA-256 hex digest of a string', () => {
    const input = 'hello world';
    const expected = createHash('sha256').update(input, 'utf8').digest('hex');
    assert.equal(contentHash(input), expected);
  });

  it('returns a 64-character lowercase hex string', () => {
    const result = contentHash('test content');
    assert.equal(result.length, 64);
    assert.match(result, /^[0-9a-f]{64}$/);
  });

  it('produces identical hashes for identical inputs', () => {
    const input = 'identical content';
    assert.equal(contentHash(input), contentHash(input));
  });

  it('produces different hashes for different inputs', () => {
    assert.notEqual(contentHash('content A'), contentHash('content B'));
  });

  it('handles empty string input', () => {
    const expected = createHash('sha256').update('', 'utf8').digest('hex');
    assert.equal(contentHash(''), expected);
  });

  it('handles unicode content', () => {
    const input = '日本語テスト 🎨';
    const expected = createHash('sha256').update(input, 'utf8').digest('hex');
    assert.equal(contentHash(input), expected);
  });
});
