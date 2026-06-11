import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { SearchIndex } from '../../src/util/search-index.js';

describe('SearchIndex', () => {
  let index: SearchIndex;

  beforeEach(() => {
    index = new SearchIndex('/test/root');
  });

  describe('constructor and build', () => {
    it('creates an empty index', () => {
      const results = index.search('anything');
      assert.deepEqual(results, []);
    });

    it('build() resolves without error on empty index', async () => {
      await assert.doesNotReject(() => index.build());
    });
  });

  describe('addDocument', () => {
    it('indexes a document so it is searchable', () => {
      index.addDocument('uif://components/button', 'The button component is used for actions');
      const results = index.search('button');
      assert.equal(results.length, 1);
      assert.equal(results[0].uri, 'uif://components/button');
    });

    it('indexes multiple documents', () => {
      index.addDocument('uif://components/button', 'Button component for actions');
      index.addDocument('uif://components/input', 'Input component for form fields');
      const results = index.search('component');
      assert.equal(results.length, 2);
    });

    it('re-indexing a URI updates the document content', () => {
      index.addDocument('uif://tokens/core', 'old token content');
      index.addDocument('uif://tokens/core', 'new spacing values');
      const results = index.search('spacing');
      assert.equal(results.length, 1);
      assert.equal(results[0].uri, 'uif://tokens/core');
    });
  });

  describe('search', () => {
    beforeEach(() => {
      index.addDocument('uif://components/button', 'The button component provides solid, outline, and ghost variants for user actions.');
      index.addDocument('uif://components/input', 'The input component handles text entry in forms with validation states.');
      index.addDocument('uif://tokens/core', 'Core primitives include spacing values like 4px, 8px, 16px and border radius tokens.');
      index.addDocument('uif://patterns/forms', 'Form patterns describe how to compose input, label, and button components together for data entry.');
    });

    it('returns results sorted by descending score', () => {
      const results = index.search('button');
      assert.ok(results.length > 0);
      for (let i = 1; i < results.length; i++) {
        assert.ok(results[i - 1].score >= results[i].score);
      }
    });

    it('returns scores in the range [0.0, 1.0]', () => {
      const results = index.search('component');
      for (const result of results) {
        assert.ok(result.score >= 0.0);
        assert.ok(result.score <= 1.0);
      }
    });

    it('returns excerpts of at most 200 characters', () => {
      index.addDocument('uif://governance/rules', 'A'.repeat(500) + ' button ' + 'B'.repeat(500));
      const results = index.search('button');
      for (const result of results) {
        assert.ok(result.excerpt.length <= 200);
      }
    });

    it('returns empty array for no matches', () => {
      const results = index.search('zzzznonexistent');
      assert.deepEqual(results, []);
    });

    it('returns empty array for empty index', () => {
      const emptyIndex = new SearchIndex('/test');
      const results = emptyIndex.search('query');
      assert.deepEqual(results, []);
    });

    it('respects the limit parameter', () => {
      for (let i = 0; i < 30; i++) {
        index.addDocument(`uif://doc/${i}`, `Document ${i} about tokens and components`);
      }
      const results = index.search('tokens', 5);
      assert.ok(results.length <= 5);
    });

    it('defaults to a limit of 20', () => {
      for (let i = 0; i < 30; i++) {
        index.addDocument(`uif://doc/${i}`, `Document ${i} about tokens and components`);
      }
      const results = index.search('tokens');
      assert.ok(results.length <= 20);
    });

    it('supports substring matching', () => {
      index.addDocument('uif://tokens/semantic', 'color-text-default is the primary text color token');
      const results = index.search('color-text');
      assert.ok(results.length > 0);
      const found = results.find((r) => r.uri === 'uif://tokens/semantic');
      assert.ok(found);
    });

    it('ranks documents with more query term occurrences higher', () => {
      index.addDocument('uif://doc/many', 'button button button button button');
      index.addDocument('uif://doc/few', 'the button is nice');
      const results = index.search('button');
      const manyIdx = results.findIndex((r) => r.uri === 'uif://doc/many');
      const fewIdx = results.findIndex((r) => r.uri === 'uif://doc/few');
      assert.ok(manyIdx < fewIdx, 'Document with more occurrences should rank higher');
    });

    it('handles multi-word queries', () => {
      const results = index.search('input validation');
      assert.ok(results.length > 0);
      const inputResult = results.find((r) => r.uri === 'uif://components/input');
      assert.ok(inputResult);
    });

    it('is case-insensitive', () => {
      index.addDocument('uif://test/case', 'Button Component');
      const lower = index.search('button component');
      const upper = index.search('BUTTON COMPONENT');
      assert.ok(lower.length > 0);
      assert.ok(upper.length > 0);
      assert.equal(lower[0].uri, upper[0].uri);
    });

    it('generates contextual excerpts around the match', () => {
      const content = 'Start of document. ' + 'filler content. '.repeat(20) + 'The important button information is here. ' + 'more content. '.repeat(20);
      index.addDocument('uif://test/excerpt', content);
      const results = index.search('important button');
      const result = results.find((r) => r.uri === 'uif://test/excerpt');
      assert.ok(result);
      assert.ok(result.excerpt.toLowerCase().includes('button') || result.excerpt.toLowerCase().includes('important'));
    });

    it('each result includes a non-empty URI', () => {
      const results = index.search('component');
      for (const result of results) {
        assert.ok(result.uri.length > 0);
      }
    });
  });
});
