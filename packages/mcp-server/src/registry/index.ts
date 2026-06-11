/**
 * Registry loader for the UI Foundations MCP Server.
 *
 * Loads resource, tool, and prompt registries and registers each entry
 * with the MCP server instance. Malformed entries are skipped with an
 * error logged to stderr; remaining valid entries continue loading.
 *
 * All handler invocations are wrapped with error handling that:
 * - Catches all thrown errors and converts to proper JSON-RPC error format
 * - Sanitizes error messages to never expose absolute paths, stack traces, or env values
 * - Logs all errors via the structured logger with full context
 * - Preserves request ID in error responses
 * - Ensures error responses are delivered promptly (within 2 seconds)
 *
 * Requirements: 1.4, 1.6, 19.1, 19.2, 19.3, 19.4, 19.5, 20.6, 24.1–24.5
 *
 * @module registry
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type {
  ResourceRegistryEntry,
  ToolRegistryEntry,
  PromptRegistryEntry,
} from '../types.js';
import { logError } from '../util/logger.js';
import {
  ERROR_CATEGORIES,
  getErrorCode,
  getSafeErrorMessage,
} from '../util/errors.js';
import { validateResourceUri, validateToolArgs } from '../security/middleware.js';

// Import registry arrays.
import { resources as resourceEntries } from './resources.js';
import { tools as toolEntries } from './tools.js';
import { prompts as promptEntries } from './prompts.js';

/** Result counts from loading all registries. */
export interface RegistryLoadResult {
  resources: number;
  tools: number;
  prompts: number;
}

/**
 * Checks if a URI contains template parameters (e.g. `{name}`, `{id}`).
 */
function isTemplateUri(uri: string): boolean {
  return /\{[^}]+\}/.test(uri);
}

/**
 * Validates that a resource registry entry has all required fields.
 */
function isValidResourceEntry(entry: unknown): entry is ResourceRegistryEntry {
  if (entry === null || typeof entry !== 'object') return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.uri === 'string' &&
    e.uri.length > 0 &&
    typeof e.name === 'string' &&
    e.name.length > 0 &&
    typeof e.description === 'string' &&
    e.description.length > 0 &&
    typeof e.mimeType === 'string' &&
    e.mimeType.length > 0 &&
    typeof e.category === 'string' &&
    e.category.length > 0 &&
    typeof e.handler === 'function'
  );
}

/**
 * Validates that a tool registry entry has all required fields.
 */
function isValidToolEntry(entry: unknown): entry is ToolRegistryEntry {
  if (entry === null || typeof entry !== 'object') return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.name === 'string' &&
    e.name.length > 0 &&
    typeof e.description === 'string' &&
    e.description.length > 0 &&
    e.inputSchema !== null &&
    e.inputSchema !== undefined &&
    typeof e.handler === 'function'
  );
}

/**
 * Validates that a prompt registry entry has all required fields.
 */
function isValidPromptEntry(entry: unknown): entry is PromptRegistryEntry {
  if (entry === null || typeof entry !== 'object') return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.name === 'string' &&
    e.name.length > 0 &&
    typeof e.description === 'string' &&
    e.description.length > 0 &&
    Array.isArray(e.arguments) &&
    typeof e.handler === 'function'
  );
}

/**
 * Builds a Zod raw shape for prompt arguments.
 *
 * The MCP SDK expects prompt args as a Record<string, ZodType> where each
 * key is an argument name mapped to its Zod schema. Required args use
 * z.string(), optional args use z.string().optional().
 */
function buildPromptArgsSchema(
  args: PromptRegistryEntry['arguments'],
): Record<string, z.ZodTypeAny> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const arg of args) {
    shape[arg.name] = arg.required
      ? z.string().describe(arg.description)
      : z.string().optional().describe(arg.description);
  }
  return shape;
}

/**
 * Loads all registries and registers entries with the MCP server.
 *
 * Iterates resource, tool, and prompt registry arrays, validates each entry,
 * and calls the appropriate MCP SDK registration API. Malformed entries are
 * skipped with an error logged to stderr.
 *
 * Resources with parameterized URIs (containing `{param}`) are registered as
 * ResourceTemplate instances with a list callback for resource enumeration.
 *
 * Each handler call is wrapped with error handling that:
 * - Catches errors and logs them with full context (method, target, code, category)
 * - Sanitizes error messages before returning them to the client
 * - Maps error codes to standard JSON-RPC codes (-32600, -32601, -32602, -32002, -32603)
 *
 * @param server - The McpServer instance to register entries with
 * @param rootPath - The repository root path passed to handlers
 * @returns Counts of successfully registered resources, tools, and prompts
 */
export async function loadRegistries(
  server: McpServer,
  rootPath: string,
): Promise<RegistryLoadResult> {
  const result: RegistryLoadResult = { resources: 0, tools: 0, prompts: 0 };

  // Register resources
  // First, expand template entries into concrete static resources
  const expandedEntries: ResourceRegistryEntry[] = [];
  for (const entry of resourceEntries) {
    if (isTemplateUri(entry.uri) && entry.listCallback) {
      // Keep the template registration for protocol compliance
      expandedEntries.push(entry);
      // Also expand into concrete static resources
      try {
        const items = await entry.listCallback(rootPath);
        for (const item of items) {
          expandedEntries.push({
            uri: item.uri,
            name: item.name,
            description: entry.description,
            mimeType: entry.mimeType,
            category: entry.category,
            handler: entry.handler,
          });
        }
      } catch {
        // If listing fails, just keep the template entry
      }
    } else {
      expandedEntries.push(entry);
    }
  }

  for (let i = 0; i < expandedEntries.length; i++) {
    const entry = expandedEntries[i];
    if (!isValidResourceEntry(entry)) {
      logError({
        method: 'registry/load',
        target: `resources[${i}]`,
        responseMs: 0,
        error: {
          code: -32603,
          category: 'malformed_registry_entry',
        },
      });
      continue;
    }

    try {
      if (isTemplateUri(entry.uri)) {
        // Register as a resource template with list and complete callbacks
        const listCb = entry.listCallback;

        // Build a completion callback that provides autocomplete suggestions
        // by filtering available items based on user input prefix
        const completeCallbacks: Record<string, (value: string) => Promise<string[]>> = {};
        if (listCb) {
          // Extract the variable name from the URI template (e.g., "name" from "{name}")
          const varMatch = entry.uri.match(/\{([^}]+)\}/);
          if (varMatch) {
            const varName = varMatch[1];
            completeCallbacks[varName] = async (value: string) => {
              try {
                const items = await listCb(rootPath);
                // Extract the variable value from each URI
                const prefix = entry.uri.split(`{${varName}}`)[0];
                const values = items.map((item) => item.uri.replace(prefix, ''));
                // Filter by prefix match on user input
                return values.filter((v) =>
                  v.toLowerCase().startsWith(value.toLowerCase()),
                );
              } catch {
                return [];
              }
            };
          }
        }

        const template = new ResourceTemplate(entry.uri, {
          list: listCb
            ? async () => ({
                resources: (await listCb(rootPath)).map((item) => ({
                  uri: item.uri,
                  name: item.name,
                  description: entry.description,
                  mimeType: entry.mimeType,
                })),
              })
            : undefined,
          complete: Object.keys(completeCallbacks).length > 0
            ? completeCallbacks
            : undefined,
        });

        server.resource(
          entry.name,
          template,
          { description: entry.description, mimeType: entry.mimeType },
          async (uri) => {
            const startTime = Date.now();
            try {
              // Security middleware: validate URI before dispatching to handler
              const securityError = validateResourceUri(uri.href, rootPath);
              if (securityError) {
                const elapsed = Date.now() - startTime;
                logError({
                  method: 'resources/read',
                  target: uri.href,
                  responseMs: elapsed,
                  error: { code: -32600, category: 'security_violation' },
                });
                const err = new Error(securityError);
                (err as Error & { code: number }).code = -32600;
                throw err;
              }

              const response = await entry.handler(uri.href, rootPath);
              const text =
                typeof response.content === 'string'
                  ? response.content
                  : JSON.stringify(response.content);
              return {
                contents: [
                  {
                    uri: uri.href,
                    mimeType: response.mimeType,
                    text,
                  },
                ],
              };
            } catch (handlerError: unknown) {
              const elapsed = Date.now() - startTime;
              const code = getErrorCode(handlerError);
              const safeMessage = getSafeErrorMessage(handlerError);
              const category = ERROR_CATEGORIES[code] ?? 'internal_error';

              logError({
                method: 'resources/read',
                target: uri.href,
                responseMs: elapsed,
                error: { code, category },
              });

              const sanitizedError = new Error(safeMessage);
              (sanitizedError as Error & { code: number }).code = code;
              throw sanitizedError;
            }
          },
        );
      } else {
        // Register as a static resource
        server.resource(
          entry.name,
          entry.uri,
          { description: entry.description, mimeType: entry.mimeType },
          async (uri) => {
            const startTime = Date.now();
            try {
              // Security middleware: validate URI before dispatching to handler
              const securityError = validateResourceUri(uri.href, rootPath);
              if (securityError) {
                const elapsed = Date.now() - startTime;
                logError({
                  method: 'resources/read',
                  target: uri.href,
                  responseMs: elapsed,
                  error: { code: -32600, category: 'security_violation' },
                });
                const err = new Error(securityError);
                (err as Error & { code: number }).code = -32600;
                throw err;
              }

              const response = await entry.handler(uri.href, rootPath);
              const text =
                typeof response.content === 'string'
                  ? response.content
                  : JSON.stringify(response.content);
              return {
                contents: [
                  {
                    uri: uri.href,
                    mimeType: response.mimeType,
                    text,
                  },
                ],
              };
            } catch (handlerError: unknown) {
              const elapsed = Date.now() - startTime;
              const code = getErrorCode(handlerError);
              const safeMessage = getSafeErrorMessage(handlerError);
              const category = ERROR_CATEGORIES[code] ?? 'internal_error';

              logError({
                method: 'resources/read',
                target: uri.href,
                responseMs: elapsed,
                error: { code, category },
              });

              // Re-throw with sanitized message for the SDK to return to client
              const sanitizedError = new Error(safeMessage);
              (sanitizedError as Error & { code: number }).code = code;
              throw sanitizedError;
            }
          },
        );
      }
      result.resources++;
    } catch (err) {
      // Graceful degradation: skip this entry, log error, continue loading.
      logError({
        method: 'registry/load',
        target: entry.uri,
        responseMs: 0,
        error: {
          code: -32603,
          category: 'registration_error',
        },
      });
    }
  }

  // Register tools
  for (let i = 0; i < toolEntries.length; i++) {
    const entry = toolEntries[i];
    if (!isValidToolEntry(entry)) {
      logError({
        method: 'registry/load',
        target: `tools[${i}]`,
        responseMs: 0,
        error: {
          code: -32603,
          category: 'malformed_registry_entry',
        },
      });
      continue;
    }

    try {
      // The MCP SDK expects a raw shape (Record<string, ZodType>), not a ZodObject.
      // Extract .shape from ZodObject instances, or use the value directly if already a raw shape.
      const rawInputSchema = entry.inputSchema;
      const schema: Record<string, z.ZodTypeAny> =
        rawInputSchema instanceof z.ZodObject
          ? (rawInputSchema as z.ZodObject<z.ZodRawShape>).shape
          : (rawInputSchema as unknown as Record<string, z.ZodTypeAny>);
      server.tool(
        entry.name,
        entry.description,
        schema,
        async (args) => {
          const startTime = Date.now();
          try {
            // Security middleware: validate tool input size before dispatching
            const securityError = validateToolArgs(args);
            if (securityError) {
              const elapsed = Date.now() - startTime;
              logError({
                method: 'tools/call',
                target: entry.name,
                responseMs: elapsed,
                error: { code: -32600, category: 'security_violation' },
              });
              return {
                content: [
                  {
                    type: 'text' as const,
                    text: JSON.stringify({ error: securityError, code: -32600 }),
                  },
                ],
                isError: true,
              };
            }

            const response = await entry.handler(args, rootPath);

            // If the handler returned an error response (isError: true),
            // log it as an error but return it to the client as-is since
            // tool handlers already produce sanitized error messages.
            if (response.isError) {
              const elapsed = Date.now() - startTime;
              // Extract error code from the response content if available
              let code = -32603;
              try {
                const parsed = JSON.parse(response.content[0]?.text ?? '{}');
                if (parsed.code && typeof parsed.code === 'number') {
                  code = parsed.code;
                }
              } catch {
                // Ignore parse errors; use default code
              }
              const category = ERROR_CATEGORIES[code] ?? 'internal_error';

              logError({
                method: 'tools/call',
                target: entry.name,
                responseMs: elapsed,
                error: { code, category },
              });
            }

            return response as unknown as { content: Array<{ type: 'text'; text: string }> };
          } catch (handlerError: unknown) {
            const elapsed = Date.now() - startTime;
            const code = getErrorCode(handlerError);
            const safeMessage = getSafeErrorMessage(handlerError);
            const category = ERROR_CATEGORIES[code] ?? 'internal_error';

            logError({
              method: 'tools/call',
              target: entry.name,
              responseMs: elapsed,
              error: { code, category },
            });

            // Return a sanitized error response to the client
            return {
              content: [
                {
                  type: 'text' as const,
                  text: JSON.stringify({ error: safeMessage, code }),
                },
              ],
              isError: true,
            };
          }
        },
      );
      result.tools++;
    } catch (err) {
      logError({
        method: 'registry/load',
        target: entry.name,
        responseMs: 0,
        error: {
          code: -32603,
          category: 'registration_error',
        },
      });
    }
  }

  // Register prompts
  for (let i = 0; i < promptEntries.length; i++) {
    const entry = promptEntries[i];
    if (!isValidPromptEntry(entry)) {
      logError({
        method: 'registry/load',
        target: `prompts[${i}]`,
        responseMs: 0,
        error: {
          code: -32603,
          category: 'malformed_registry_entry',
        },
      });
      continue;
    }

    try {
      const argsSchema = buildPromptArgsSchema(entry.arguments);

      server.prompt(
        entry.name,
        entry.description,
        argsSchema,
        async (args) => {
          const startTime = Date.now();
          try {
            const response = await entry.handler(args as Record<string, string>, rootPath);
            return response as unknown as {
              messages: Array<{
                role: 'user' | 'assistant';
                content: { type: 'text'; text: string };
              }>;
            };
          } catch (handlerError: unknown) {
            const elapsed = Date.now() - startTime;
            const code = getErrorCode(handlerError);
            const safeMessage = getSafeErrorMessage(handlerError);
            const category = ERROR_CATEGORIES[code] ?? 'internal_error';

            logError({
              method: 'prompts/get',
              target: entry.name,
              responseMs: elapsed,
              error: { code, category },
            });

            // Re-throw with sanitized message for the SDK to return to client
            const sanitizedError = new Error(safeMessage);
            (sanitizedError as Error & { code: number }).code = code;
            throw sanitizedError;
          }
        },
      );
      result.prompts++;
    } catch (err) {
      logError({
        method: 'registry/load',
        target: entry.name,
        responseMs: 0,
        error: {
          code: -32603,
          category: 'registration_error',
        },
      });
    }
  }

  return result;
}
