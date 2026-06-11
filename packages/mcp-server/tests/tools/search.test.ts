/**
 * Unit tests for search_foundations tool handler.
 *
 * Tests query validation, result formatting, empty results, and integration
 * with the SearchIndex.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { SearchIndex } from '../../src/util/search-index.js';
import {
  searchFoundationsHandler,
  createSearchHandler,
  setSearchIndex,
  getSearchIndex,
} from '../../src/tools/search.js';

describe('search_foundations tool', () => {
  let index: SearchIndex;

  beforeEach(() => {
    index = new SearchIndex('/tmp/test');
    index.addDocument('uif://components/button', 'Button component with solid, outline, and ghost variants for user actions.');
    index.addDocument('uif://components/input', 'Input component for text entry with label and validation states.');
    index.addDocument('uif://tokens/core', 'Core primitives including spacing, radii, and typography tokens.');
    index.addDocument('uif://patterns/forms', 'Form patterns describing how labels, inputs, and buttons compose together.');
    index.addDocument('uif://governance/naming', 'Naming rules for token and component identifiers in the design system.');
    setSearchIndex(index);
  });

  describe('query validation', () => {
    it('rejects empty query with error', async () => {
      const result = await searchFoundationsHandler({ query: '' }, '/tmp/test');
      assert.equal(result.isError, true);
      const body = JSON.parse(result.content[0].text);
      assert.ok(body.error.includes('at least 2 characters'));
    });

    it('rejects single character query with error', async () => {
      const result = await searchFoundationsHandler({ query: 'a' }, '/tmp/test');
      assert.equal(result.isError, true);
      const body = JSON.parse(result.content[0].text);
      assert.ok(body.error.includes('at least 2 characters'));
    });

    it('accepts query of exactly 2 characters', async () => {
      const result = await searchFoundationsHandler({ query: 'bu' }, '/tmp/test');
      assert.notEqual(result.isError, true);
    });
  });

  describe('search results', () => {
    it('returns matching results with URI, excerpt, and score', async () => {
      const result = await searchFoundationsHandler({ query: 'button' }, '/tmp/test');
      assert.equal(result.isError, undefined);
      const body = JSON.parse(result.content[0].text);
      assert.equal(body.query, 'button');
      assert.ok(body.results.length > 0);

      const first = body.results[0];
      assert.ok(first.uri);
      assert.ok(typeof first.excerpt === 'string');
      assert.ok(typeof first.score === 'number');
      assert.ok(first.score >= 0.0 && first.score <= 1.0);
    });

    it('returns excerpts of at most 200 characters', async () => {
      const result = await searchFoundationsHandler({ query: 'button' }, '/tmp/test');
      const body = JSON.parse(result.content[0].text);
      for (const r of body.results) {
        assert.ok(r.excerpt.length <= 200, `Excerpt too long: ${r.excerpt.length} chars`);
      }
    });

    it('returns results sorted by descending score', async () => {
      const result = await searchFoundationsHandler({ query: 'component' }, '/tmp/test');
      const body = JSON.parse(result.content[0].text);
      assert.ok(body.results.length > 1);

      for (let i = 1; i < body.results.length; i++) {
        assert.ok(
          body.results[i - 1].score >= body.results[i].score,
          `Results not sorted: ${body.results[i - 1].score} < ${body.results[i].score}`,
        );
      }
    });

    it('returns at most 20 results', async () => {
      // Add many documents to ensure we can exceed 20
      const bigIndex = new SearchIndex('/tmp/test');
      for (let i = 0; i < 30; i++) {
        bigIndex.addDocument(`uif://test/doc-${i}`, `Design system token documentation item ${i} with common keywords.`);
      }
      setSearchIndex(bigIndex);

      const result = await searchFoundationsHandler({ query: 'design system' }, '/tmp/test');
      const body = JSON.parse(result.content[0].text);
      assert.ok(body.results.length <= 20);
    });

    it('includes count field in response', async () => {
      const result = await searchFoundationsHandler({ query: 'button' }, '/tmp/test');
      const body = JSON.parse(result.content[0].text);
      assert.equal(body.count, body.results.length);
    });
  });

  describe('no matches', () => {
    it('returns empty results with message when no matches found', async () => {
      const result = await searchFoundationsHandler({ query: 'zzzznonexistent' }, '/tmp/test');
      assert.equal(result.isError, undefined);
      const body = JSON.parse(result.content[0].text);
      assert.deepEqual(body.results, []);
      assert.ok(body.message.includes('No matches found'));
      assert.ok(body.message.includes('zzzznonexistent'));
    });
  });

  describe('index not available', () => {
    it('returns error when search index is not set', async () => {
      setSearchIndex(null as unknown as SearchIndex);
      // Force the module-level index to null by calling with a handler
      // that doesn't have an index — use the module-level handler
      const origIndex = getSearchIndex();
      setSearchIndex(null as unknown as SearchIndex);

      const result = await searchFoundationsHandler({ query: 'button' }, '/tmp/test');
      assert.equal(result.isError, true);
      const body = JSON.parse(result.content[0].text);
      assert.ok(body.error.includes('not available'));

      // Restore
      if (origIndex) setSearchIndex(origIndex);
    });
  });

  describe('createSearchHandler factory', () => {
    it('creates a handler bound to a specific index', async () => {
      const customIndex = new SearchIndex('/tmp/custom');
      customIndex.addDocument('uif://custom/doc', 'Custom content for factory test.');

      const handler = createSearchHandler(customIndex);
      const result = await handler({ query: 'custom content' }, '/tmp/custom');
      assert.equal(result.isError, undefined);
      const body = JSON.parse(result.content[0].text);
      assert.ok(body.results.length > 0);
      assert.equal(body.results[0].uri, 'uif://custom/doc');
    });

    it('factory handler rejects short queries', async () => {
      const customIndex = new SearchIndex('/tmp/custom');
      const handler = createSearchHandler(customIndex);
      const result = await handler({ query: 'x' }, '/tmp/custom');
      assert.equal(result.isError, true);
    });
  });
});
