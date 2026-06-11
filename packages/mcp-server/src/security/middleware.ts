/**
 * Security middleware for the UI Foundations MCP Server.
 *
 * Provides pre-dispatch validation functions that check incoming requests
 * against security rules before they reach resource/tool handlers.
 *
 * - Resource URI validation: path traversal detection, sandbox enforcement,
 *   sensitive file blocking.
 * - Tool input validation: total input size limits, individual string
 *   parameter length limits.
 *
 * Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6
 *
 * @module security/middleware
 */

import { validatePath } from './path-validator.js';
import { validateStringLength, validateToolInput } from './input-validator.js';

/**
 * Validates a resource URI through the security layer.
 *
 * Checks for path traversal, sandbox violations, and sensitive file access.
 * Called by the registry loader's handler wrapper before dispatching to the
 * actual resource handler.
 *
 * @param uri - The resource URI to validate.
 * @param rootPath - The configured root path for sandbox enforcement.
 * @returns null if valid, or an error message string if rejected.
 */
export function validateResourceUri(uri: string, rootPath: string): string | null {
  // Extract path portion from URI (after the uif:// scheme)
  const uriPath = uri.replace(/^uif:\/\//, '');

  // Validate path for traversal and sensitive file patterns
  const result = validatePath(uriPath, rootPath);
  if (!result.valid) {
    return result.error ?? 'Access denied';
  }

  return null;
}

/**
 * Validates tool input arguments through the security layer.
 *
 * Checks total serialized input size against the 10,000 char limit,
 * and validates individual string parameters against the 1,000 char limit.
 *
 * @param args - The tool arguments object.
 * @returns null if valid, or an error message string if rejected.
 */
export function validateToolArgs(args: unknown): string | null {
  // Check total serialized input size
  const serialized = JSON.stringify(args);
  const toolResult = validateToolInput(serialized);
  if (!toolResult.valid) {
    return toolResult.error ?? 'Input too large';
  }

  // Check individual string parameters
  if (args !== null && typeof args === 'object') {
    for (const [, value] of Object.entries(args as Record<string, unknown>)) {
      if (typeof value === 'string') {
        const strResult = validateStringLength(value);
        if (!strResult.valid) {
          return strResult.error ?? 'Parameter too long';
        }
      }
    }
  }

  return null;
}
