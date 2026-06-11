/**
 * MCP Server setup for the UI Foundations MCP Server.
 *
 * Creates and configures the McpServer instance, registers all resources,
 * tools, and prompts from the registries, implements cursor-based pagination
 * for resource listing, provides a health check endpoint, wires security
 * middleware, and builds the search index on startup.
 *
 * @module server
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ListResourcesRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadRegistries, type RegistryLoadResult } from './registry/index.js';
import { logError } from './util/logger.js';
import { SearchIndex } from './util/search-index.js';
import { setSearchIndex } from './tools/search.js';
import { FileReader } from './util/file-reader.js';
import { validatePath, containsPemPrivateKey } from './security/path-validator.js';

// ---------------------------------------------------------------------------
// Configuration and result interfaces
// ---------------------------------------------------------------------------

/** Configuration for creating the MCP server. */
export interface ServerConfig {
  /** Semantic version string for the server (from package.json). */
  version: string;
  /** Absolute path to the repository root for file system reads. */
  rootPath: string;
}

/** Result returned by createServer. */
export interface CreateServerResult {
  /** The configured McpServer instance ready for transport connection. */
  server: McpServer;
  /** Counts of successfully registered resources, tools, and prompts. */
  registry: RegistryLoadResult;
}

// ---------------------------------------------------------------------------
// Pagination constants
// ---------------------------------------------------------------------------

/** Maximum number of resource entries per page. */
const PAGE_SIZE = 50;

/** Prefix for cursor tokens to detect server-issued cursors. */
const CURSOR_PREFIX = 'uif-cursor:';

// ---------------------------------------------------------------------------
// Health tracking
// ---------------------------------------------------------------------------

/** Server start time for uptime calculation. */
let startTime: number;

/** Total request count for health reporting. */
let requestCount = 0;

/**
 * Increments the request counter. Called by the health check and
 * can be used externally to track requests.
 */
export function incrementRequestCount(): void {
  requestCount++;
}

/**
 * Returns the current request count.
 */
export function getRequestCount(): number {
  return requestCount;
}

/**
 * Returns server uptime in seconds.
 */
export function getUptime(): number {
  return Math.floor((Date.now() - startTime) / 1000);
}

// ---------------------------------------------------------------------------
// Server creation
// ---------------------------------------------------------------------------

/**
 * Creates and configures the MCP server instance.
 *
 * 1. Instantiates McpServer with name "ui-foundations-mcp" and the provided version.
 * 2. Calls loadRegistries to register all resources, tools, and prompts.
 * 3. Overrides the default resources/list handler to implement pagination
 *    (max 50 entries per page, cursor-based).
 * 4. Registers a health check tool returning uptime and request count.
 * 5. Returns the server instance and registry counts.
 *
 * @param config - Server configuration with version and root path
 * @returns The configured server and registry counts
 */
export async function createServer(config: ServerConfig): Promise<CreateServerResult> {
  startTime = Date.now();

  // Create the McpServer instance
  const server = new McpServer(
    { name: 'ui-foundations-mcp', version: config.version },
    {
      capabilities: {
        resources: { listChanged: true },
        tools: {},
        prompts: { listChanged: true },
      },
    },
  );

  // Load all registries (resources, tools, prompts)
  const registryCounts = await loadRegistries(server, config.rootPath);

  // Override the default resources/list handler with paginated version.
  // The SDK sets up a handler that returns ALL resources at once.
  // We replace it with cursor-based pagination (max 50 per page).
  setupPaginatedResourceList(server);

  // Register health check tool
  registerHealthCheck(server);

  return { server, registry: registryCounts };
}

// ---------------------------------------------------------------------------
// Search index initialization
// ---------------------------------------------------------------------------

/**
 * Documents to index for full-text search at startup.
 * Maps resource URIs to their relative file paths within the repository root.
 */
const INDEXABLE_DOCUMENTS: Array<{ uri: string; path: string }> = [
  // Agent resources
  { uri: 'uif://agents/rules', path: 'AGENTS.md' },
  { uri: 'uif://agents/design-contract', path: 'DESIGN.md' },
  { uri: 'uif://agents/implementation', path: 'IMPLEMENTATION.md' },
  // Governance
  { uri: 'uif://governance/rules', path: 'docs/ui-foundations-rules.md' },
  { uri: 'uif://governance/naming', path: 'docs/foundations/foundation-002-naming-and-grouping.md' },
  { uri: 'uif://governance/layering', path: 'docs/foundations/foundation-001-token-layering.md' },
  // Foundation documents
  { uri: 'uif://foundations/001', path: 'docs/foundations/foundation-001-token-layering.md' },
  { uri: 'uif://foundations/002', path: 'docs/foundations/foundation-002-naming-and-grouping.md' },
  { uri: 'uif://foundations/003', path: 'docs/foundations/foundation-003-color-semantics-and-status.md' },
  { uri: 'uif://foundations/004', path: 'docs/foundations/foundation-004-typography-scale-and-line-height.md' },
  { uri: 'uif://foundations/005', path: 'docs/foundations/foundation-005-responsive-breakpoints-and-containers.md' },
  { uri: 'uif://foundations/006', path: 'docs/foundations/foundation-006-z-index-layering.md' },
  { uri: 'uif://foundations/007', path: 'docs/foundations/foundation-007-typography-selectors-and-specificity.md' },
  { uri: 'uif://foundations/008', path: 'docs/foundations/foundation-008-mode-activation-and-consumer-control.md' },
  { uri: 'uif://foundations/009', path: 'docs/foundations/foundation-009-component-boundaries-and-utility.md' },
  { uri: 'uif://foundations/010', path: 'docs/foundations/foundation-010-implementation-and-pipeline-workflow.md' },
  { uri: 'uif://foundations/011', path: 'docs/foundations/foundation-011-branching-and-release-governance.md' },
  { uri: 'uif://foundations/012', path: 'docs/foundations/foundation-012-minimal-markup-and-composition.md' },
  // Patterns
  { uri: 'uif://patterns/forms', path: 'docs/patterns/forms.md' },
  { uri: 'uif://patterns/navigation', path: 'docs/patterns/navigation.md' },
  { uri: 'uif://patterns/cards', path: 'docs/patterns/cards.md' },
  { uri: 'uif://patterns/layout', path: 'docs/patterns/layout.md' },
  { uri: 'uif://patterns/feedback', path: 'docs/patterns/feedback.md' },
];

/**
 * Builds the search index asynchronously from all indexable resource content.
 *
 * Reads each document file, validates it with the security layer (path
 * traversal, PEM key checks), and adds valid content to the search index.
 * Documents that fail to read or are blocked by security are skipped
 * gracefully — the index degrades but remains functional.
 *
 * This runs asynchronously after server creation so it does not block
 * the MCP handshake (which must complete within 2s for stdio).
 *
 * @param rootPath - Absolute path to the repository root.
 * @returns The built SearchIndex instance.
 */
export async function buildSearchIndex(rootPath: string): Promise<SearchIndex> {
  const index = new SearchIndex(rootPath);
  const reader = new FileReader(rootPath);

  for (const doc of INDEXABLE_DOCUMENTS) {
    try {
      // Security check: validate path before reading
      const pathResult = validatePath(doc.path, rootPath);
      if (!pathResult.valid) {
        continue;
      }

      const result = await reader.read(doc.path);

      // Content-level security: block PEM private key content
      if (containsPemPrivateKey(result.content)) {
        continue;
      }

      index.addDocument(doc.uri, result.content);
    } catch {
      // Graceful degradation: skip this document, others remain searchable.
      // This follows the design spec: "if indexing fails for one resource,
      // others remain searchable."
    }
  }

  await index.build();
  return index;
}

/**
 * Initializes the server by building the search index and wiring it into
 * the search tool. Called after server.connect() to avoid blocking the
 * MCP handshake.
 *
 * @param rootPath - Absolute path to the repository root.
 */
export async function initializeSearchIndex(rootPath: string): Promise<void> {
  const index = await buildSearchIndex(rootPath);
  setSearchIndex(index);
}

// ---------------------------------------------------------------------------
// Pagination implementation
// ---------------------------------------------------------------------------

/**
 * Overrides the default resources/list handler to support cursor-based
 * pagination with a maximum of 50 entries per page.
 *
 * Cursor format: "uif-cursor:{offset}" where offset is the zero-based index
 * into the full list of resources.
 */
function setupPaginatedResourceList(server: McpServer): void {
  // Access the underlying Server instance to override the request handler
  const lowLevelServer = server.server;

  // Override the resources/list handler with pagination
  lowLevelServer.setRequestHandler(ListResourcesRequestSchema, async (request) => {
    incrementRequestCount();

    // Collect all registered resources from the McpServer internals.
    // We access _registeredResources and _registeredResourceTemplates via
    // the McpServer's internal state. Since the SDK doesn't expose a public
    // method to list resources without the handler, we replicate the logic.
    const allResources = getRegisteredResources(server);

    // Determine pagination offset from cursor
    let offset = 0;
    const cursor = request.params?.cursor;

    if (cursor !== undefined) {
      // Validate cursor format
      if (typeof cursor !== 'string' || !cursor.startsWith(CURSOR_PREFIX)) {
        logError({
          method: 'resources/list',
          target: 'pagination',
          responseMs: 0,
          error: { code: -32602, category: 'invalid_cursor' },
        });
        throw Object.assign(new Error('Invalid or unrecognized cursor'), {
          code: -32602,
        });
      }

      const offsetStr = cursor.slice(CURSOR_PREFIX.length);
      const parsedOffset = parseInt(offsetStr, 10);

      if (isNaN(parsedOffset) || parsedOffset < 0 || parsedOffset >= allResources.length) {
        logError({
          method: 'resources/list',
          target: 'pagination',
          responseMs: 0,
          error: { code: -32602, category: 'invalid_cursor' },
        });
        throw Object.assign(new Error('Invalid or unrecognized cursor'), {
          code: -32602,
        });
      }

      offset = parsedOffset;
    }

    // Slice the page
    const page = allResources.slice(offset, offset + PAGE_SIZE);

    // Determine next cursor
    const nextOffset = offset + PAGE_SIZE;
    const nextCursor = nextOffset < allResources.length
      ? `${CURSOR_PREFIX}${nextOffset}`
      : undefined;

    return {
      resources: page,
      ...(nextCursor !== undefined && { nextCursor }),
    };
  });
}

/**
 * Collects all registered resources from the McpServer by accessing
 * its internal registered resources and resource templates.
 *
 * This replicates the SDK's internal logic for listing resources,
 * using the private fields via type assertion.
 */
function getRegisteredResources(
  server: McpServer,
): Array<{ uri: string; name: string; description?: string; mimeType?: string }> {
  // Access internal state — the SDK stores resources in _registeredResources
  // as a Record<string, RegisteredResource>
  const internal = server as unknown as {
    _registeredResources: Record<string, { name: string; enabled: boolean; metadata?: Record<string, unknown> }>;
    _registeredResourceTemplates: Record<string, {
      resourceTemplate: { listCallback?: () => Promise<{ resources: Array<Record<string, unknown>> }> };
      enabled: boolean;
      metadata?: Record<string, unknown>;
    }>;
  };

  const resources: Array<{ uri: string; name: string; description?: string; mimeType?: string }> = [];

  // Collect static resources
  if (internal._registeredResources) {
    for (const [uri, resource] of Object.entries(internal._registeredResources)) {
      if (resource.enabled) {
        resources.push({
          uri,
          name: resource.name,
          ...(resource.metadata as { description?: string; mimeType?: string }),
        });
      }
    }
  }

  return resources;
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

/**
 * Registers a health check tool that returns server uptime and request count.
 */
function registerHealthCheck(server: McpServer): void {
  server.tool(
    'health_check',
    'Returns server health information including uptime in seconds and total request count.',
    {},
    async () => {
      incrementRequestCount();
      const health = {
        status: 'ok',
        uptimeSeconds: getUptime(),
        requestCount: getRequestCount(),
        startedAt: new Date(startTime).toISOString(),
      };
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(health, null, 2) }],
      };
    },
  );
}
