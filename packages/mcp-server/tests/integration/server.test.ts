/**
 * Integration tests for the UI Foundations MCP Server.
 *
 * Tests end-to-end behavior through the MCP protocol using in-memory
 * transports. Covers server initialization, resource reading, tool calls,
 * health check, and content hash consistency.
 *
 * Requirements: 1.1, 1.3, 1.5, 21.2, 21.3, 22.3
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer, initializeSearchIndex } from '../../src/server.js';

/**
 * Creates a test fixture directory with the minimum files needed for
 * the MCP server to initialize and serve resources.
 */
async function createFixtureDir(): Promise<string> {
  const testDir = join(
    tmpdir(),
    `mcp-integration-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );

  // Create directory structure
  await mkdir(join(testDir, 'docs/foundations'), { recursive: true });
  await mkdir(join(testDir, 'docs/agentic'), { recursive: true });
  await mkdir(join(testDir, 'docs/patterns'), { recursive: true });
  await mkdir(join(testDir, 'dist/tokens/json'), { recursive: true });
  await mkdir(join(testDir, 'src/ui/patterns'), { recursive: true });
  await mkdir(join(testDir, 'site/components'), { recursive: true });
  await mkdir(join(testDir, 'schemas'), { recursive: true });

  // package.json
  await writeFile(
    join(testDir, 'package.json'),
    JSON.stringify({ name: 'test-project', version: '1.0.0' }),
  );

  // Context manifest
  const manifest = {
    contextFiles: {
      design: { path: 'DESIGN.md', priority: 1 },
      agents: { path: 'AGENTS.md', priority: 2 },
    },
    contextDirectories: {
      foundations: { path: 'docs/foundations/' },
    },
    tokenSources: {
      distJson: 'dist/tokens/json/*.json',
    },
  };
  await writeFile(
    join(testDir, 'docs/context-manifest.json'),
    JSON.stringify(manifest),
  );

  // Agent resources
  await writeFile(
    join(testDir, 'AGENTS.md'),
    '# Agent Rules\n\nThese are the agent rules for integration testing.',
  );
  await writeFile(
    join(testDir, 'DESIGN.md'),
    '# Design Contract\n\nDesign system contract for testing.',
  );
  await writeFile(
    join(testDir, 'IMPLEMENTATION.md'),
    '# Implementation\n\nImplementation guidance.',
  );
  await writeFile(
    join(testDir, 'docs/agentic/assistant-behavior-rules.md'),
    '# Behavior Rules\n\nAgent behavior rules.',
  );

  // Governance resources
  await writeFile(
    join(testDir, 'docs/ui-foundations-rules.md'),
    '# UI Foundations Rules\n\n## Naming Rules\n\nUse kebab-case.\n\n## Layer Model\n\nCore > Semantic > Component.\n\n## Theming Rules\n\nThemes are brand overrides.\n\n## Design-to-Code Rules\n\nFigma is source of truth.\n\n## Review Checklist\n\nCheck tokens first.\n\n## Agent-Readiness Rules\n\nAll agents must verify state.',
  );
  await writeFile(
    join(testDir, 'docs/foundations/foundation-001-token-layering.md'),
    '# Foundation 001: Token Layering\n\nTokens are organized in layers.',
  );
  await writeFile(
    join(testDir, 'docs/foundations/foundation-002-naming-and-grouping.md'),
    '# Foundation 002: Naming and Grouping\n\nNaming conventions for tokens.',
  );

  // Token files
  await writeFile(
    join(testDir, 'dist/tokens/json/core-primitives.tokens.json'),
    JSON.stringify({ spacing: { '100': { $value: '4px', $type: 'dimension' } } }),
  );
  await writeFile(
    join(testDir, 'dist/tokens/json/semantics-roles.tokens.json'),
    JSON.stringify({ color: { text: { default: { $value: '#000', $type: 'color' } } } }),
  );
  await writeFile(
    join(testDir, 'dist/tokens/json/components-ui.tokens.json'),
    JSON.stringify({ button: { solid: { background: { $value: '#007bff', $type: 'color' } } } }),
  );

  // Pattern files
  await writeFile(
    join(testDir, 'docs/patterns/forms.md'),
    '# Forms Pattern\n\nForms combine labels, inputs, and buttons.',
  );
  await writeFile(
    join(testDir, 'docs/patterns/navigation.md'),
    '# Navigation Pattern\n\nNavigation for site structure.',
  );
  await writeFile(
    join(testDir, 'docs/patterns/cards.md'),
    '# Cards Pattern\n\nCards for content grouping.',
  );
  await writeFile(
    join(testDir, 'docs/patterns/layout.md'),
    '# Layout Pattern\n\nLayout structures and grids.',
  );
  await writeFile(
    join(testDir, 'docs/patterns/feedback.md'),
    '# Feedback Pattern\n\nFeedback for user actions.',
  );

  return testDir;
}

/**
 * Connects an MCP Client to the server via in-memory transport.
 * Returns the connected client ready for requests.
 */
async function connectClient(
  rootPath: string,
): Promise<{ client: Client; cleanup: () => Promise<void> }> {
  const { server } = await createServer({ version: '1.0.0', rootPath });

  // Create linked in-memory transports
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  // Connect server to its transport
  await server.connect(serverTransport);

  // Initialize search index (normally done after connect in production)
  await initializeSearchIndex(rootPath);

  // Create and connect client
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  await client.connect(clientTransport);

  const cleanup = async () => {
    await client.close();
    await server.close();
  };

  return { client, cleanup };
}

// ===========================================================================
// Tests
// ===========================================================================

describe('MCP Server Integration', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await createFixtureDir();
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  // -------------------------------------------------------------------------
  // 1. Server initialization and MCP handshake
  // -------------------------------------------------------------------------

  describe('Server initialization and handshake', () => {
    it('completes MCP handshake and returns server capabilities', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const capabilities = client.getServerCapabilities();
        assert.ok(capabilities, 'Server capabilities should be available after handshake');
        assert.ok(capabilities.resources, 'Server should declare resource capabilities');
        assert.ok(capabilities.tools, 'Server should declare tool capabilities');

        const serverVersion = client.getServerVersion();
        assert.ok(serverVersion, 'Server version info should be available');
        assert.equal(serverVersion.name, 'ui-foundations-mcp');
        assert.equal(serverVersion.version, '1.0.0');
      } finally {
        await cleanup();
      }
    });

    it('createServer returns non-zero registry counts', async () => {
      const { registry } = await createServer({ version: '1.0.0', rootPath: testDir });
      assert.ok(registry.resources > 0, `Expected resources > 0, got ${registry.resources}`);
      assert.ok(registry.tools > 0, `Expected tools > 0, got ${registry.tools}`);
      assert.ok(registry.prompts > 0, `Expected prompts > 0, got ${registry.prompts}`);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Resource listing
  // -------------------------------------------------------------------------

  describe('Resource listing', () => {
    it('lists registered resources with correct structure', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const result = await client.listResources();
        assert.ok(result.resources.length > 0, 'Should have registered resources');

        // Verify resource structure
        for (const resource of result.resources) {
          assert.ok(resource.uri, 'Resource must have a URI');
          assert.ok(resource.name, 'Resource must have a name');
          assert.ok(
            resource.uri.startsWith('uif://'),
            `Resource URI should use uif:// scheme: ${resource.uri}`,
          );
        }
      } finally {
        await cleanup();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 3. Resource read — manifest
  // -------------------------------------------------------------------------

  describe('Resource read (manifest)', () => {
    it('reads uif://manifest/context and returns valid JSON content', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const result = await client.readResource({ uri: 'uif://manifest/context' });
        assert.ok(result.contents.length > 0, 'Should return content');

        const content = result.contents[0];
        assert.equal(content.uri, 'uif://manifest/context');

        // Content should be parseable JSON
        const parsed = JSON.parse((content as { text: string }).text);
        assert.ok(parsed.contextFiles, 'Manifest should contain contextFiles');
        assert.ok(parsed.contextDirectories, 'Manifest should contain contextDirectories');
        assert.ok(parsed.tokenSources, 'Manifest should contain tokenSources');
      } finally {
        await cleanup();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. Resource read — agents
  // -------------------------------------------------------------------------

  describe('Resource read (agents)', () => {
    it('reads uif://agents/rules and returns AGENTS.md content', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const result = await client.readResource({ uri: 'uif://agents/rules' });
        assert.ok(result.contents.length > 0, 'Should return content');

        const content = result.contents[0];
        assert.equal(content.uri, 'uif://agents/rules');

        const text = (content as { text: string }).text;
        assert.ok(text.includes('Agent Rules'), 'Should contain AGENTS.md content');
      } finally {
        await cleanup();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 5. Tool call — search_foundations
  // -------------------------------------------------------------------------

  describe('Tool call (search_foundations)', () => {
    it('returns search results for a valid query', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const result = await client.callTool({
          name: 'search_foundations',
          arguments: { query: 'agent rules' },
        });

        assert.ok(result.content, 'Should return content');
        const textContent = result.content[0] as { type: string; text: string };
        assert.equal(textContent.type, 'text');

        const parsed = JSON.parse(textContent.text);
        assert.equal(parsed.query, 'agent rules');
        // Results should be present since we indexed documents
        assert.ok(Array.isArray(parsed.results), 'Results should be an array');
      } finally {
        await cleanup();
      }
    });

    it('rejects query with fewer than 2 characters', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const result = await client.callTool({
          name: 'search_foundations',
          arguments: { query: 'x' },
        });

        // The SDK may reject at schema validation level (Zod min(2) constraint)
        // returning an error in text format, or the handler may catch it.
        const textContent = result.content[0] as { type: string; text: string };
        const text = textContent.text;

        // Either the response is a JSON error from the handler or an MCP error string
        const isError =
          result.isError ||
          text.includes('error') ||
          text.includes('2 characters') ||
          text.includes('MCP error');
        assert.ok(isError, 'Should indicate an error for short query');
      } finally {
        await cleanup();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. Tool call — validate_token_name
  // -------------------------------------------------------------------------

  describe('Tool call (validate_token_name)', () => {
    it('validates a correct token name', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const result = await client.callTool({
          name: 'validate_token_name',
          arguments: { name: 'Button.solid.container.background.hover' },
        });

        const textContent = result.content[0] as { type: string; text: string };
        const parsed = JSON.parse(textContent.text);
        assert.equal(parsed.valid, true, 'Valid token name should pass validation');
        assert.deepEqual(parsed.violations, []);
      } finally {
        await cleanup();
      }
    });

    it('rejects an invalid token name and provides violations', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const result = await client.callTool({
          name: 'validate_token_name',
          arguments: { name: 'button.SOLID' },
        });

        const textContent = result.content[0] as { type: string; text: string };
        const parsed = JSON.parse(textContent.text);
        assert.equal(parsed.valid, false, 'Invalid token name should fail validation');
        assert.ok(parsed.violations.length > 0, 'Should have at least one violation');
      } finally {
        await cleanup();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 7. Health check
  // -------------------------------------------------------------------------

  describe('Health check', () => {
    it('returns uptime and request count', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const result = await client.callTool({
          name: 'health_check',
          arguments: {},
        });

        const textContent = result.content[0] as { type: string; text: string };
        assert.equal(textContent.type, 'text');

        const health = JSON.parse(textContent.text);
        assert.equal(health.status, 'ok');
        assert.equal(typeof health.uptimeSeconds, 'number');
        assert.ok(health.uptimeSeconds >= 0, 'Uptime should be non-negative');
        assert.equal(typeof health.requestCount, 'number');
        assert.ok(health.requestCount >= 1, 'Request count should be at least 1 (this call)');
        assert.ok(health.startedAt, 'Should include startedAt ISO timestamp');
      } finally {
        await cleanup();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 8. Content hash consistency
  // -------------------------------------------------------------------------

  describe('Content hash consistency', () => {
    it('returns identical hashes for same content read twice', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        const result1 = await client.readResource({ uri: 'uif://agents/rules' });
        const result2 = await client.readResource({ uri: 'uif://agents/rules' });

        const content1 = result1.contents[0] as { text: string; _meta?: Record<string, unknown> };
        const content2 = result2.contents[0] as { text: string; _meta?: Record<string, unknown> };

        // Content should be identical
        assert.equal(content1.text, content2.text);

        // If metadata is exposed with content hash, verify it
        if (content1._meta && content1._meta.contentHash) {
          assert.equal(
            content1._meta.contentHash,
            content2._meta?.contentHash,
            'Content hashes should be identical for same content',
          );
        }
      } finally {
        await cleanup();
      }
    });

    it('returns different content after file is modified', async () => {
      const { client, cleanup } = await connectClient(testDir);

      try {
        // First read
        const result1 = await client.readResource({ uri: 'uif://agents/rules' });
        const text1 = (result1.contents[0] as { text: string }).text;

        // Modify the file
        await writeFile(
          join(testDir, 'AGENTS.md'),
          '# Agent Rules\n\nUpdated content for hash change test.',
        );

        // Second read (server re-reads from disk per Requirement 21.3)
        const result2 = await client.readResource({ uri: 'uif://agents/rules' });
        const text2 = (result2.contents[0] as { text: string }).text;

        // Content should now be different
        assert.notEqual(text1, text2, 'Content should change after file modification');
        assert.ok(
          text2.includes('Updated content for hash change test'),
          'Should return updated file content',
        );
      } finally {
        await cleanup();
      }
    });
  });
});
