/**
 * Property 21: Error logging completeness
 *
 * For any request that produces a JSON-RPC error response, the server SHALL
 * write a JSON log entry to stderr containing an ISO 8601 timestamp, the
 * request ID, the error code, the resource URI or tool name, response time
 * in milliseconds, and an error category string.
 *
 * Feature: mcp-server, Property 21: Error logging completeness
 * Validates: Requirements 19.4, 22.4
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';

import { logError } from '../../src/util/logger.js';
import { ERROR_CATEGORIES } from '../../src/util/errors.js';

/** ISO 8601 datetime regex (UTC or offset). */
const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/** Valid error codes from the MCP server specification. */
const VALID_ERROR_CODES = [-32600, -32601, -32602, -32002, -32603] as const;

/** Valid error category strings corresponding to error codes. */
const VALID_CATEGORIES = Object.values(ERROR_CATEGORIES);

describe('Feature: mcp-server, Property 21: Error logging completeness', () => {
  let stderrOutput: string[];
  let originalWrite: typeof process.stderr.write;

  beforeEach(() => {
    stderrOutput = [];
    originalWrite = process.stderr.write;
    process.stderr.write = ((chunk: string | Uint8Array) => {
      stderrOutput.push(chunk.toString());
      return true;
    }) as typeof process.stderr.write;
  });

  afterEach(() => {
    process.stderr.write = originalWrite;
  });

  // -------------------------------------------------------------------------
  // Arbitraries
  // -------------------------------------------------------------------------

  /** Arbitrary JSON-RPC method names (resources/read, tools/call, etc.) */
  const arbMethod = fc.constantFrom(
    'resources/read',
    'resources/list',
    'tools/call',
    'prompts/get',
    'initialize'
  );

  /** Arbitrary target URI or tool name */
  const arbTarget = fc.oneof(
    fc.constant('uif://tokens/core'),
    fc.constant('uif://components/button'),
    fc.constant('uif://agents/rules'),
    fc.constant('uif://patterns/forms'),
    fc.constant('uif://governance/rules'),
    fc.constant('uif://foundations/001'),
    fc.constant('search_foundations'),
    fc.constant('get_component'),
    fc.constant('get_token'),
    fc.constant('get_pattern'),
    fc.constant('get_rule'),
    fc.constant('validate_token_name'),
    // Also test arbitrary string targets
    fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0)
  );

  /** Arbitrary response time in milliseconds (0–10000) */
  const arbResponseMs = fc.nat({ max: 10000 });

  /** Arbitrary request IDs (string or number, or undefined) */
  const arbRequestId = fc.oneof(
    fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
    fc.integer({ min: 1, max: 999999 })
  );

  /** Arbitrary error code from the valid set */
  const arbErrorCode = fc.constantFrom(...VALID_ERROR_CODES);

  /** Arbitrary error category from the valid set */
  const arbErrorCategory = fc.constantFrom(...VALID_CATEGORIES);

  // -------------------------------------------------------------------------
  // Property: stderr output is valid single-line JSON
  // -------------------------------------------------------------------------

  it('logError output is valid JSON on a single line', () => {
    fc.assert(
      fc.property(
        arbMethod,
        arbTarget,
        arbResponseMs,
        arbRequestId,
        arbErrorCode,
        arbErrorCategory,
        (method, target, responseMs, requestId, code, category) => {
          stderrOutput = [];
          logError({ method, target, responseMs, requestId, error: { code, category } });

          assert.equal(stderrOutput.length, 1, 'Expected exactly one write to stderr');
          const raw = stderrOutput[0];

          // Must be a single line (ends with \n, no internal newlines)
          assert.ok(raw.endsWith('\n'), 'Log entry must end with newline');
          const lines = raw.trim().split('\n');
          assert.equal(lines.length, 1, 'Log entry must be a single line');

          // Must be valid JSON
          const parsed = JSON.parse(raw);
          assert.equal(typeof parsed, 'object');
          assert.ok(parsed !== null);
        }
      ),
      { numRuns: 100 }
    );
  });

  // -------------------------------------------------------------------------
  // Property: log entry contains ISO 8601 timestamp
  // -------------------------------------------------------------------------

  it('logError output contains an ISO 8601 timestamp', () => {
    fc.assert(
      fc.property(
        arbMethod,
        arbTarget,
        arbResponseMs,
        arbRequestId,
        arbErrorCode,
        arbErrorCategory,
        (method, target, responseMs, requestId, code, category) => {
          stderrOutput = [];
          logError({ method, target, responseMs, requestId, error: { code, category } });

          const entry = JSON.parse(stderrOutput[0]);
          assert.ok('timestamp' in entry, 'Log entry must contain timestamp field');
          assert.ok(
            ISO_8601_REGEX.test(entry.timestamp),
            `Timestamp "${entry.timestamp}" must be ISO 8601 format`
          );

          // Verify it's a valid parseable date
          const date = new Date(entry.timestamp);
          assert.ok(!isNaN(date.getTime()), 'Timestamp must be a valid date');
        }
      ),
      { numRuns: 100 }
    );
  });

  // -------------------------------------------------------------------------
  // Property: log entry contains request ID when provided
  // -------------------------------------------------------------------------

  it('logError output contains the request ID when provided', () => {
    fc.assert(
      fc.property(
        arbMethod,
        arbTarget,
        arbResponseMs,
        arbRequestId,
        arbErrorCode,
        arbErrorCategory,
        (method, target, responseMs, requestId, code, category) => {
          stderrOutput = [];
          logError({ method, target, responseMs, requestId, error: { code, category } });

          const entry = JSON.parse(stderrOutput[0]);
          assert.ok('requestId' in entry, 'Log entry must contain requestId when provided');
          assert.equal(entry.requestId, requestId);
        }
      ),
      { numRuns: 100 }
    );
  });

  // -------------------------------------------------------------------------
  // Property: log entry contains error code (number)
  // -------------------------------------------------------------------------

  it('logError output contains the error code as a number', () => {
    fc.assert(
      fc.property(
        arbMethod,
        arbTarget,
        arbResponseMs,
        arbRequestId,
        arbErrorCode,
        arbErrorCategory,
        (method, target, responseMs, requestId, code, category) => {
          stderrOutput = [];
          logError({ method, target, responseMs, requestId, error: { code, category } });

          const entry = JSON.parse(stderrOutput[0]);
          assert.ok('error' in entry, 'Log entry must contain error field');
          assert.ok('code' in entry.error, 'Error field must contain code');
          assert.equal(typeof entry.error.code, 'number');
          assert.equal(entry.error.code, code);
        }
      ),
      { numRuns: 100 }
    );
  });

  // -------------------------------------------------------------------------
  // Property: log entry contains target (URI/tool name)
  // -------------------------------------------------------------------------

  it('logError output contains the target URI or tool name', () => {
    fc.assert(
      fc.property(
        arbMethod,
        arbTarget,
        arbResponseMs,
        arbRequestId,
        arbErrorCode,
        arbErrorCategory,
        (method, target, responseMs, requestId, code, category) => {
          stderrOutput = [];
          logError({ method, target, responseMs, requestId, error: { code, category } });

          const entry = JSON.parse(stderrOutput[0]);
          assert.ok('target' in entry, 'Log entry must contain target field');
          assert.equal(entry.target, target);
        }
      ),
      { numRuns: 100 }
    );
  });

  // -------------------------------------------------------------------------
  // Property: log entry contains responseMs (number)
  // -------------------------------------------------------------------------

  it('logError output contains response time in milliseconds', () => {
    fc.assert(
      fc.property(
        arbMethod,
        arbTarget,
        arbResponseMs,
        arbRequestId,
        arbErrorCode,
        arbErrorCategory,
        (method, target, responseMs, requestId, code, category) => {
          stderrOutput = [];
          logError({ method, target, responseMs, requestId, error: { code, category } });

          const entry = JSON.parse(stderrOutput[0]);
          assert.ok('responseMs' in entry, 'Log entry must contain responseMs field');
          assert.equal(typeof entry.responseMs, 'number');
          assert.equal(entry.responseMs, responseMs);
        }
      ),
      { numRuns: 100 }
    );
  });

  // -------------------------------------------------------------------------
  // Property: log entry contains error category string
  // -------------------------------------------------------------------------

  it('logError output contains an error category string', () => {
    fc.assert(
      fc.property(
        arbMethod,
        arbTarget,
        arbResponseMs,
        arbRequestId,
        arbErrorCode,
        arbErrorCategory,
        (method, target, responseMs, requestId, code, category) => {
          stderrOutput = [];
          logError({ method, target, responseMs, requestId, error: { code, category } });

          const entry = JSON.parse(stderrOutput[0]);
          assert.ok('error' in entry, 'Log entry must contain error field');
          assert.ok('category' in entry.error, 'Error field must contain category');
          assert.equal(typeof entry.error.category, 'string');
          assert.ok(entry.error.category.length > 0, 'Category must be non-empty');
          assert.equal(entry.error.category, category);
        }
      ),
      { numRuns: 100 }
    );
  });

  // -------------------------------------------------------------------------
  // Property: log entry has success: false
  // -------------------------------------------------------------------------

  it('logError output always has success: false', () => {
    fc.assert(
      fc.property(
        arbMethod,
        arbTarget,
        arbResponseMs,
        arbRequestId,
        arbErrorCode,
        arbErrorCategory,
        (method, target, responseMs, requestId, code, category) => {
          stderrOutput = [];
          logError({ method, target, responseMs, requestId, error: { code, category } });

          const entry = JSON.parse(stderrOutput[0]);
          assert.ok('success' in entry, 'Log entry must contain success field');
          assert.equal(entry.success, false, 'Error log entries must have success: false');
        }
      ),
      { numRuns: 100 }
    );
  });

  // -------------------------------------------------------------------------
  // Property: combined completeness (all fields present in every error log)
  // -------------------------------------------------------------------------

  it('logError output contains ALL required fields simultaneously for any error', () => {
    fc.assert(
      fc.property(
        arbMethod,
        arbTarget,
        arbResponseMs,
        arbRequestId,
        arbErrorCode,
        arbErrorCategory,
        (method, target, responseMs, requestId, code, category) => {
          stderrOutput = [];
          logError({ method, target, responseMs, requestId, error: { code, category } });

          const raw = stderrOutput[0];
          const entry = JSON.parse(raw);

          // All required fields present
          assert.ok(ISO_8601_REGEX.test(entry.timestamp), 'Must have ISO 8601 timestamp');
          assert.equal(entry.requestId, requestId, 'Must contain request ID');
          assert.equal(entry.error.code, code, 'Must contain error code');
          assert.equal(entry.target, target, 'Must contain target URI/tool name');
          assert.equal(entry.responseMs, responseMs, 'Must contain responseMs');
          assert.equal(entry.error.category, category, 'Must contain error category');
          assert.equal(entry.success, false, 'Must have success: false');

          // Single line JSON
          assert.ok(raw.endsWith('\n'));
          assert.equal(raw.trim().split('\n').length, 1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
