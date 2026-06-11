/**
 * Unit tests for the error handling utilities.
 *
 * Tests the sanitization of error messages, error code extraction,
 * and error response creation.
 *
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 20.6
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  sanitizeErrorMessage,
  McpError,
  ErrorCode,
  getErrorCode,
  getSafeErrorMessage,
  createToolErrorResponse,
  ERROR_CATEGORIES,
} from '../../src/util/errors.js';

// ---------------------------------------------------------------------------
// sanitizeErrorMessage
// ---------------------------------------------------------------------------

describe('sanitizeErrorMessage', () => {
  it('passes through safe messages unchanged', () => {
    const msg = 'Resource not found: uif://tokens/core';
    assert.equal(sanitizeErrorMessage(msg), msg);
  });

  it('strips Unix absolute paths starting with /Users/', () => {
    const msg = 'File not found: /Users/john/projects/ui-foundations/dist/tokens.json';
    const result = sanitizeErrorMessage(msg);
    assert.ok(!result.includes('/Users/'), `Should not contain /Users/, got: ${result}`);
    assert.ok(result.includes('[path]'), `Should contain [path], got: ${result}`);
  });

  it('strips Unix absolute paths starting with /home/', () => {
    const msg = 'Cannot read /home/deploy/app/config.json';
    const result = sanitizeErrorMessage(msg);
    assert.ok(!result.includes('/home/'), `Should not contain /home/, got: ${result}`);
  });

  it('strips Windows absolute paths', () => {
    const msg = 'File error at C:\\Users\\Dev\\project\\file.ts';
    const result = sanitizeErrorMessage(msg);
    assert.ok(!result.includes('C:\\Users'), `Should not contain C:\\Users, got: ${result}`);
  });

  it('strips stack traces with at Function()', () => {
    const msg = 'Error occurred\n    at Function.read (/Users/x/file.ts:10:5)\n    at Object.handler (/Users/x/other.ts:20:10)';
    const result = sanitizeErrorMessage(msg);
    assert.ok(!result.includes('at Function'), `Should not contain stack trace, got: ${result}`);
    assert.ok(!result.includes(':10:5'), `Should not contain line numbers, got: ${result}`);
  });

  it('strips environment variable patterns (KEY=value)', () => {
    const msg = 'Config error: DATABASE_URL=postgres://user:pass@host:5432/db';
    const result = sanitizeErrorMessage(msg);
    assert.ok(!result.includes('postgres://'), `Should not contain env value, got: ${result}`);
  });

  it('handles empty strings', () => {
    assert.equal(sanitizeErrorMessage(''), '');
  });

  it('preserves relative paths', () => {
    const msg = 'Token file not found: dist/tokens/json/core-primitives.tokens.json';
    const result = sanitizeErrorMessage(msg);
    assert.ok(
      result.includes('dist/tokens/json/core-primitives.tokens.json'),
      `Should preserve relative path, got: ${result}`,
    );
  });

  it('preserves URI-style paths', () => {
    const msg = 'Unknown resource: uif://components/button';
    const result = sanitizeErrorMessage(msg);
    assert.ok(
      result.includes('uif://components/button'),
      `Should preserve URI, got: ${result}`,
    );
  });

  it('strips deep generic paths that look like file system paths', () => {
    const msg = 'Error reading /var/data/app/config/settings.json';
    const result = sanitizeErrorMessage(msg);
    assert.ok(!result.includes('/var/data'), `Should not contain deep path, got: ${result}`);
  });
});

// ---------------------------------------------------------------------------
// McpError
// ---------------------------------------------------------------------------

describe('McpError', () => {
  it('creates an error with code and message', () => {
    const error = new McpError(ErrorCode.RESOURCE_NOT_FOUND, 'Not found');
    assert.equal(error.code, -32002);
    assert.equal(error.message, 'Not found');
    assert.equal(error.name, 'McpError');
  });

  it('is an instance of Error', () => {
    const error = new McpError(ErrorCode.INTERNAL_ERROR, 'Test');
    assert.ok(error instanceof Error);
  });
});

// ---------------------------------------------------------------------------
// getErrorCode
// ---------------------------------------------------------------------------

describe('getErrorCode', () => {
  it('extracts code from McpError', () => {
    const error = new McpError(ErrorCode.INVALID_PARAMS, 'Bad params');
    assert.equal(getErrorCode(error), -32602);
  });

  it('extracts code from Error with code property', () => {
    const error = new Error('File not found');
    (error as Error & { code: number }).code = -32603;
    assert.equal(getErrorCode(error), -32603);
  });

  it('defaults to -32603 for plain errors without code', () => {
    const error = new Error('Something went wrong');
    assert.equal(getErrorCode(error), -32603);
  });

  it('defaults to -32603 for non-Error values', () => {
    assert.equal(getErrorCode('string error'), -32603);
    assert.equal(getErrorCode(42), -32603);
    assert.equal(getErrorCode(null), -32603);
    assert.equal(getErrorCode(undefined), -32603);
  });

  it('ignores non-standard error codes', () => {
    const error = new Error('Custom error');
    (error as Error & { code: number }).code = 999;
    assert.equal(getErrorCode(error), -32603);
  });
});

// ---------------------------------------------------------------------------
// getSafeErrorMessage
// ---------------------------------------------------------------------------

describe('getSafeErrorMessage', () => {
  it('sanitizes error message from Error instances', () => {
    const error = new Error('Cannot read /Users/john/file.ts');
    const result = getSafeErrorMessage(error);
    assert.ok(!result.includes('/Users/john'), `Should not contain path, got: ${result}`);
  });

  it('returns generic message for non-Error values', () => {
    assert.equal(getSafeErrorMessage('string'), 'An internal error occurred');
    assert.equal(getSafeErrorMessage(null), 'An internal error occurred');
    assert.equal(getSafeErrorMessage(42), 'An internal error occurred');
  });

  it('sanitizes McpError messages', () => {
    const error = new McpError(
      ErrorCode.INTERNAL_ERROR,
      'Failed at /home/user/project/src/handler.ts:42:10',
    );
    const result = getSafeErrorMessage(error);
    assert.ok(!result.includes('/home/user'), `Should not contain path, got: ${result}`);
  });
});

// ---------------------------------------------------------------------------
// createToolErrorResponse
// ---------------------------------------------------------------------------

describe('createToolErrorResponse', () => {
  it('creates a ToolResponse with isError: true', () => {
    const response = createToolErrorResponse(ErrorCode.INVALID_PARAMS, 'Missing param');
    assert.equal(response.isError, true);
    assert.equal(response.content.length, 1);
    assert.equal(response.content[0].type, 'text');
  });

  it('includes the error code in the response JSON', () => {
    const response = createToolErrorResponse(ErrorCode.RESOURCE_NOT_FOUND, 'Not found');
    const parsed = JSON.parse(response.content[0].text);
    assert.equal(parsed.code, -32002);
    assert.equal(parsed.error, 'Not found');
  });

  it('sanitizes the error message in the response', () => {
    const response = createToolErrorResponse(
      ErrorCode.INTERNAL_ERROR,
      'Failed reading /Users/dev/project/file.ts',
    );
    const parsed = JSON.parse(response.content[0].text);
    assert.ok(!parsed.error.includes('/Users/dev'), `Should not expose path: ${parsed.error}`);
  });
});

// ---------------------------------------------------------------------------
// ERROR_CATEGORIES
// ---------------------------------------------------------------------------

describe('ERROR_CATEGORIES', () => {
  it('maps all standard JSON-RPC error codes to category strings', () => {
    assert.equal(ERROR_CATEGORIES[-32600], 'invalid_request');
    assert.equal(ERROR_CATEGORIES[-32601], 'method_not_found');
    assert.equal(ERROR_CATEGORIES[-32602], 'invalid_params');
    assert.equal(ERROR_CATEGORIES[-32002], 'resource_not_found');
    assert.equal(ERROR_CATEGORIES[-32603], 'internal_error');
  });

  it('all categories are non-empty strings', () => {
    for (const [code, category] of Object.entries(ERROR_CATEGORIES)) {
      assert.ok(
        typeof category === 'string' && category.length > 0,
        `Category for code ${code} must be a non-empty string`,
      );
    }
  });
});
