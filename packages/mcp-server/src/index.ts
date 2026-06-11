#!/usr/bin/env node
/**
 * UI Foundations MCP Server — Entry Point
 *
 * Parses CLI arguments, validates the root path, reads the package version,
 * creates the MCP server, connects to the selected transport, and logs
 * startup diagnostics to stderr.
 *
 * Usage:
 *   ui-foundations-mcp [--root <path>] [--transport stdio|http] [--port <number>]
 *
 * @module index
 */

import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer, initializeSearchIndex } from './server.js';
import { logStartup } from './util/logger.js';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

interface CliArgs {
  root: string;
  transport: 'stdio' | 'http';
  port: number;
}

/**
 * Parses process.argv into structured CLI arguments.
 *
 * Supported flags:
 * - --root <path>       Repository root path (default: cwd)
 * - --transport <type>  Transport type: stdio or http (default: stdio)
 * - --port <number>     HTTP port (default: 3100, used with --transport http)
 */
function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    root: process.cwd(),
    transport: 'stdio',
    port: 3100,
  };

  for (let i = 2; i < argv.length; i++) {
    const flag = argv[i];
    const value = argv[i + 1];

    switch (flag) {
      case '--root':
        if (value) {
          args.root = resolve(value);
          i++;
        }
        break;
      case '--transport':
        if (value === 'stdio' || value === 'http') {
          args.transport = value;
          i++;
        }
        break;
      case '--port':
        if (value && !Number.isNaN(Number(value))) {
          args.port = Number(value);
          i++;
        }
        break;
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Package version reader
// ---------------------------------------------------------------------------

/**
 * Reads the package.json version from the mcp-server package directory.
 * The compiled output lives at dist/mcp/index.js, so we go up two levels
 * to reach the package root where package.json lives.
 */
async function readPackageVersion(): Promise<string> {
  // Resolve from the compiled output location (dist/mcp/) back to the package root
  const currentFile = fileURLToPath(import.meta.url);
  const packageDir = resolve(dirname(currentFile), '..', '..');
  const packageJsonPath = join(packageDir, 'package.json');

  try {
    const content = await readFile(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(content) as { version?: string };
    if (!pkg.version) {
      throw new Error('Missing "version" field in package.json');
    }
    return pkg.version;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `Error: Unable to read package.json version: ${message}\n`,
    );
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Root path validation
// ---------------------------------------------------------------------------

/**
 * Validates that the root path exists and is a directory.
 */
async function validateRootPath(rootPath: string): Promise<void> {
  try {
    const stats = await stat(rootPath);
    if (!stats.isDirectory()) {
      process.stderr.write(
        `Error: Root path is not a directory: ${rootPath}\n`,
      );
      process.exit(1);
    }
  } catch {
    process.stderr.write(
      `Error: Root path does not exist: ${rootPath}\n`,
    );
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  // Validate root path exists
  await validateRootPath(args.root);

  // Read package version
  const version = await readPackageVersion();

  // Create server with registries loaded
  const { server, registry } = await createServer({ version, rootPath: args.root });

  // Create transport based on CLI flag
  if (args.transport === 'http') {
    // HTTP transport requires an HTTP server wrapping the StreamableHTTPServerTransport.
    // Dynamically import to avoid loading http modules when using stdio.
    const { createServer: createHttpServer } = await import('node:http');
    const { StreamableHTTPServerTransport } = await import(
      '@modelcontextprotocol/sdk/server/streamableHttp.js'
    );
    const { randomUUID } = await import('node:crypto');

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
    });

    const httpServer = createHttpServer(async (req, res) => {
      await transport.handleRequest(req, res);
    });

    httpServer.listen(args.port, () => {
      logStartup({
        version,
        transport: `http (port ${args.port})`,
        resourceCount: registry.resources,
        toolCount: registry.tools,
      });
    });

    await server.connect(transport);

    // Build search index after transport is connected (does not block handshake)
    await initializeSearchIndex(args.root);
  } else {
    // stdio transport (default)
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logStartup({
      version,
      transport: 'stdio',
      resourceCount: registry.resources,
      toolCount: registry.tools,
    });

    // Build search index after transport is connected (does not block handshake)
    await initializeSearchIndex(args.root);
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Fatal: ${message}\n`);
  process.exit(1);
});
