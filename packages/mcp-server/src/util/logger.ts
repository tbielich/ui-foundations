/**
 * Structured JSON logger for the UI Foundations MCP Server.
 *
 * Writes one JSON object per line to stderr. Used for request logging,
 * error logging, and startup diagnostics.
 *
 * @module util/logger
 */

import type { LogEntry } from '../types.js';

/**
 * Writes a single JSON log entry to stderr followed by a newline.
 */
function writeLog(entry: Record<string, unknown> | LogEntry): void {
  process.stderr.write(JSON.stringify(entry) + '\n');
}

/**
 * Logs a completed request (success or failure) as a structured JSON entry.
 *
 * Each entry includes an ISO 8601 timestamp, JSON-RPC method, target
 * (resource URI or tool name), elapsed time, and success indicator.
 * Optionally includes requestId and error details.
 */
export function logRequest(entry: LogEntry): void {
  writeLog({
    timestamp: entry.timestamp,
    method: entry.method,
    target: entry.target,
    responseMs: entry.responseMs,
    success: entry.success,
    ...(entry.requestId !== undefined && { requestId: entry.requestId }),
    ...(entry.error !== undefined && { error: entry.error }),
  });
}

/**
 * Logs an error that produced a JSON-RPC error response.
 *
 * Includes all fields from a standard request log plus the error code
 * and category for diagnostics.
 */
export function logError(params: {
  method: string;
  target: string;
  responseMs: number;
  requestId?: string | number;
  error: { code: number; category: string };
}): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    method: params.method,
    target: params.target,
    responseMs: params.responseMs,
    success: false,
    ...(params.requestId !== undefined && { requestId: params.requestId }),
    error: params.error,
  };
  writeLog(entry);
}

/**
 * Logs server startup information.
 *
 * Includes server version, transport type, and the number of registered
 * resources and tools.
 */
export function logStartup(params: {
  version: string;
  transport: string;
  resourceCount: number;
  toolCount: number;
}): void {
  writeLog({
    timestamp: new Date().toISOString(),
    event: 'startup',
    version: params.version,
    transport: params.transport,
    resourceCount: params.resourceCount,
    toolCount: params.toolCount,
  });
}
