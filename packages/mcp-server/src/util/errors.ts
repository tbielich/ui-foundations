/**
 * Structured error handling utilities for the UI Foundations MCP Server.
 *
 * Provides:
 * - McpError class with standard JSON-RPC error codes
 * - Error message sanitization (strips paths, stack traces, env values)
 * - Error response construction helpers
 *
 * All errors returned to clients are sanitized to never expose:
 * - Absolute file system paths
 * - Stack traces
 * - Environment variable values
 *
 * Requirements: 1.4, 1.6, 19.1, 19.2, 19.3, 19.4, 19.5, 20.6
 *
 * @module util/errors
 */

import type { ToolResponse } from '../types.js';

// ---------------------------------------------------------------------------
// JSON-RPC error codes
// ---------------------------------------------------------------------------

/** Standard JSON-RPC and MCP error codes. */
export const ErrorCode = {
  /** Malformed JSON-RPC envelope. */
  INVALID_REQUEST: -32600,
  /** Unknown method name. */
  METHOD_NOT_FOUND: -32601,
  /** Missing or invalid parameters. */
  INVALID_PARAMS: -32602,
  /** Resource URI not found in registry. */
  RESOURCE_NOT_FOUND: -32002,
  /** File read failure or unexpected internal error. */
  INTERNAL_ERROR: -32603,
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Maps error codes to human-readable category strings for logging. */
export const ERROR_CATEGORIES: Record<number, string> = {
  [-32600]: 'invalid_request',
  [-32601]: 'method_not_found',
  [-32602]: 'invalid_params',
  [-32002]: 'resource_not_found',
  [-32603]: 'internal_error',
};

// ---------------------------------------------------------------------------
// McpError class
// ---------------------------------------------------------------------------

/**
 * Structured MCP error with a JSON-RPC error code.
 *
 * Handlers can throw this to signal a specific error category. The registry
 * error wrapper will catch it and return the appropriate JSON-RPC error
 * response to the client.
 */
export class McpError extends Error {
  public readonly code: ErrorCodeValue;

  constructor(code: ErrorCodeValue, message: string) {
    super(message);
    this.name = 'McpError';
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// Error message sanitization
// ---------------------------------------------------------------------------

/**
 * Patterns that match absolute file system paths in error messages.
 * Covers Unix (/Users/..., /home/..., /var/...) and Windows (C:\..., D:\...)
 */
const ABSOLUTE_PATH_PATTERNS: RegExp[] = [
  // Unix absolute paths: /Users/..., /home/..., /var/..., etc.
  /\/(?:Users|home|var|tmp|opt|etc|usr|root|mnt|srv|private)\/[^\s,;:'")\]}>]+/g,
  // Windows absolute paths: C:\..., D:\...
  /[A-Z]:\\[^\s,;:'")\]}>]+/gi,
  // Generic paths starting with /: only strip if they look like deep file paths
  /(?<!\w)\/(?:\w+\/){3,}[^\s,;:'")\]}>]+/g,
];

/** Patterns that match stack traces in error messages. */
const STACK_TRACE_PATTERNS: RegExp[] = [
  // "at Function.name (file:line:col)" style
  /\s+at\s+[\w.<>]+\s*\([^)]+\)/g,
  // "at file:line:col" style
  /\s+at\s+[^\s]+:\d+:\d+/g,
  // Full stack trace blocks starting with Error: ...
  /(?:\n\s+at\s+.+)+/g,
];

/** Patterns that match environment variable exposures. */
const ENV_PATTERNS: RegExp[] = [
  // KEY=value patterns (common in env dumps)
  /\b[A-Z][A-Z0-9_]{2,}=[^\s,;]+/g,
  // process.env.KEY references with values
  /process\.env\.\w+\s*(?:=|:)\s*['"][^'"]*['"]/g,
];

/**
 * Sanitizes an error message to remove sensitive information.
 *
 * Strips:
 * - Absolute file system paths (replaced with relative or generic reference)
 * - Stack traces
 * - Environment variable values
 *
 * @param message - The raw error message to sanitize.
 * @returns A safe error message suitable for client responses.
 */
export function sanitizeErrorMessage(message: string): string {
  let sanitized = message;

  // Remove stack traces first (they contain paths)
  for (const pattern of STACK_TRACE_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Remove absolute paths
  for (const pattern of ABSOLUTE_PATH_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[path]');
  }

  // Remove environment variable values
  for (const pattern of ENV_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[redacted]');
  }

  // Clean up any double spaces or trailing whitespace from removals
  sanitized = sanitized.replace(/\s{2,}/g, ' ').trim();

  return sanitized;
}

// ---------------------------------------------------------------------------
// Error response helpers
// ---------------------------------------------------------------------------

/**
 * Creates a ToolResponse representing an error.
 *
 * The message is sanitized before being included in the response.
 *
 * @param code - JSON-RPC error code.
 * @param message - Error message (will be sanitized).
 * @returns A ToolResponse with isError: true.
 */
export function createToolErrorResponse(code: ErrorCodeValue, message: string): ToolResponse {
  const safeMessage = sanitizeErrorMessage(message);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: safeMessage, code }),
      },
    ],
    isError: true,
  };
}

/**
 * Extracts the error code from an error object.
 *
 * Checks for McpError instances first, then looks for a `code` property
 * on generic Error objects (set by handlers like token resources).
 *
 * @param error - The caught error.
 * @returns The error code, defaulting to -32603 (internal error).
 */
export function getErrorCode(error: unknown): ErrorCodeValue {
  if (error instanceof McpError) {
    return error.code;
  }
  if (error instanceof Error) {
    const code = (error as Error & { code?: number }).code;
    if (code && code in ERROR_CATEGORIES) {
      return code as ErrorCodeValue;
    }
  }
  return ErrorCode.INTERNAL_ERROR;
}

/**
 * Extracts a safe error message from an error object.
 *
 * @param error - The caught error.
 * @returns A sanitized error message string.
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return sanitizeErrorMessage(error.message);
  }
  return 'An internal error occurred';
}
