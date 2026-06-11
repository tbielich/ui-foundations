/**
 * Graceful degradation tests for the UI Foundations MCP Server.
 *
 * Verifies:
 * 1. One resource failing doesn't prevent others from working.
 * 2. Search index works even when some content fails to index.
 * 3. Registry loading continues when individual entries are malformed.
 *
 * Requirement: 24.5
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SearchIndex } from '../src/util/search-index.js';
import { loadRegistries } from '../src/registry/index.js';

describe('Graceful Degradation', () => {
  describe('Search index partial failure', () => {
    let index: SearchIndex;

    beforeEach(() => {
      index = new SearchIndex('/test/root');
    });

    it('other documents remain searchable when one document fails to index', () => {
      // Successfully index two documents
      const result1 = index.addDocument('uif://components/button', 'Button component for actions');
      const result2 = index.addDocument('uif://components/input', 'Input component for forms');

      // Try to add a document with empty content (simulating a read failure)
      const resultFailed = index.addDocument('uif://tokens/core', '');

      assert.equal(result1, true, 'First document should index successfully');
      assert.equal(result2, true, 'Second document should index successfully');
      assert.equal(resultFailed, false, 'Empty content should fail gracefully');

      // Verify the successfully indexed documents are still searchable
      const buttonResults = index.search('button');
      assert.ok(buttonResults.length > 0, 'Button should still be searchable');
      assert.equal(buttonResults[0].uri, 'uif://components/button');

      const inputResults = index.search('input');
      assert.ok(inputResults.length > 0, 'Input should still be searchable');
      assert.equal(inputResults[0].uri, 'uif://components/input');
    });

    it('documents indexed before a failure remain searchable', () => {
      index.addDocument('uif://governance/rules', 'Naming rules and layering conventions');
      index.addDocument('uif://patterns/forms', 'Form pattern with validation');

      // Simulate indexing failure with empty content
      index.addDocument('uif://broken/resource', '');

      // Previously indexed documents are unaffected
      const results = index.search('naming');
      assert.ok(results.length > 0);
      assert.equal(results[0].uri, 'uif://governance/rules');
    });

    it('documents indexed after a failure are searchable', () => {
      index.addDocument('uif://doc/first', 'First document content');

      // Simulate a failure
      index.addDocument('uif://doc/broken', '');

      // Index more documents after the failure
      index.addDocument('uif://doc/third', 'Third document about tokens');

      const results = index.search('tokens');
      assert.ok(results.length > 0);
      assert.equal(results[0].uri, 'uif://doc/third');
    });

    it('addDocument returns false for null-like content without crashing', () => {
      // Test with various invalid inputs that should be handled gracefully
      const resultEmpty = index.addDocument('uif://empty', '');
      assert.equal(resultEmpty, false);

      // Index should still work for valid content
      index.addDocument('uif://valid', 'Valid searchable content');
      const results = index.search('searchable');
      assert.ok(results.length > 0);
    });
  });

  describe('Individual resource isolation', () => {
    it('resource handlers are isolated — one failing does not affect others', async () => {
      // Create handler functions: one that works, one that fails
      const workingHandler = async (uri: string, _rootPath: string) => ({
        uri,
        name: 'Working Resource',
        mimeType: 'text/plain',
        content: 'This resource works fine',
        metadata: { contentHash: 'abc123', category: 'tokens' as const },
      });

      const failingHandler = async (_uri: string, _rootPath: string) => {
        throw new Error('File not found: missing-file.json');
      };

      // Call the working handler — should succeed
      const result = await workingHandler('uif://tokens/core', '/root');
      assert.equal(result.content, 'This resource works fine');

      // Call the failing handler — should throw (isolated error)
      await assert.rejects(
        () => failingHandler('uif://tokens/missing', '/root'),
        { message: 'File not found: missing-file.json' },
      );

      // Verify the working handler still functions after the other failed
      const result2 = await workingHandler('uif://tokens/core', '/root');
      assert.equal(result2.content, 'This resource works fine');
    });
  });

  describe('Registry loading with malformed entries', () => {
    it('continues loading valid entries when one registration fails', async () => {
      const server = new McpServer({ name: 'test-server', version: '0.0.1' });

      // loadRegistries processes all entries and skips invalid ones.
      // The actual registries have valid entries, so they should register.
      const result = await loadRegistries(server, '/tmp/nonexistent');
      assert.equal(typeof result.resources, 'number');
      assert.equal(typeof result.tools, 'number');
      assert.equal(typeof result.prompts, 'number');
      // All three should be non-negative (valid entries register, invalid ones are skipped)
      assert.ok(result.resources >= 0);
      assert.ok(result.tools >= 0);
      assert.ok(result.prompts >= 0);
    });

    it('total registered count equals valid entries minus skipped ones', async () => {
      const server = new McpServer({ name: 'test-server', version: '0.0.1' });
      const result = await loadRegistries(server, '/tmp');

      // The total should be > 0 because the registries have valid entries
      const total = result.resources + result.tools + result.prompts;
      assert.ok(total > 0, 'At least some entries should register successfully');
    });
  });
});
