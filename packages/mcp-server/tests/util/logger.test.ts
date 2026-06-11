import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { logRequest, logError, logStartup } from '../../src/util/logger.js';

describe('logger', () => {
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

  describe('logRequest', () => {
    it('writes a JSON object per line to stderr', () => {
      logRequest({
        timestamp: '2024-01-15T10:30:00.000Z',
        method: 'resources/read',
        target: 'uif://tokens/core',
        responseMs: 42,
        success: true,
      });

      assert.equal(stderrOutput.length, 1);
      const entry = JSON.parse(stderrOutput[0]);
      assert.equal(entry.timestamp, '2024-01-15T10:30:00.000Z');
      assert.equal(entry.method, 'resources/read');
      assert.equal(entry.target, 'uif://tokens/core');
      assert.equal(entry.responseMs, 42);
      assert.equal(entry.success, true);
    });

    it('includes requestId when provided', () => {
      logRequest({
        timestamp: '2024-01-15T10:30:00.000Z',
        method: 'tools/call',
        target: 'search_foundations',
        responseMs: 15,
        success: true,
        requestId: 'req-123',
      });

      const entry = JSON.parse(stderrOutput[0]);
      assert.equal(entry.requestId, 'req-123');
    });

    it('includes numeric requestId', () => {
      logRequest({
        timestamp: '2024-01-15T10:30:00.000Z',
        method: 'tools/call',
        target: 'get_component',
        responseMs: 8,
        success: true,
        requestId: 42,
      });

      const entry = JSON.parse(stderrOutput[0]);
      assert.equal(entry.requestId, 42);
    });

    it('includes error details when present', () => {
      logRequest({
        timestamp: '2024-01-15T10:30:00.000Z',
        method: 'resources/read',
        target: 'uif://tokens/missing',
        responseMs: 5,
        success: false,
        requestId: 'req-456',
        error: { code: -32002, category: 'resource_not_found' },
      });

      const entry = JSON.parse(stderrOutput[0]);
      assert.equal(entry.success, false);
      assert.deepEqual(entry.error, { code: -32002, category: 'resource_not_found' });
    });

    it('omits requestId when not provided', () => {
      logRequest({
        timestamp: '2024-01-15T10:30:00.000Z',
        method: 'resources/list',
        target: 'resources/list',
        responseMs: 20,
        success: true,
      });

      const entry = JSON.parse(stderrOutput[0]);
      assert.equal('requestId' in entry, false);
    });

    it('omits error when not provided', () => {
      logRequest({
        timestamp: '2024-01-15T10:30:00.000Z',
        method: 'resources/read',
        target: 'uif://agents/rules',
        responseMs: 12,
        success: true,
      });

      const entry = JSON.parse(stderrOutput[0]);
      assert.equal('error' in entry, false);
    });

    it('output ends with a newline', () => {
      logRequest({
        timestamp: '2024-01-15T10:30:00.000Z',
        method: 'resources/read',
        target: 'uif://tokens/core',
        responseMs: 10,
        success: true,
      });

      assert.ok(stderrOutput[0].endsWith('\n'));
    });
  });

  describe('logError', () => {
    it('writes error entry with auto-generated ISO 8601 timestamp', () => {
      const before = new Date().toISOString();
      logError({
        method: 'resources/read',
        target: 'uif://tokens/invalid',
        responseMs: 3,
        requestId: 'err-1',
        error: { code: -32002, category: 'resource_not_found' },
      });
      const after = new Date().toISOString();

      const entry = JSON.parse(stderrOutput[0]);
      assert.ok(entry.timestamp >= before);
      assert.ok(entry.timestamp <= after);
      assert.equal(entry.success, false);
      assert.equal(entry.method, 'resources/read');
      assert.equal(entry.target, 'uif://tokens/invalid');
      assert.equal(entry.responseMs, 3);
      assert.equal(entry.requestId, 'err-1');
      assert.deepEqual(entry.error, { code: -32002, category: 'resource_not_found' });
    });

    it('omits requestId when not provided', () => {
      logError({
        method: 'tools/call',
        target: 'search_foundations',
        responseMs: 1,
        error: { code: -32602, category: 'invalid_params' },
      });

      const entry = JSON.parse(stderrOutput[0]);
      assert.equal('requestId' in entry, false);
    });
  });

  describe('logStartup', () => {
    it('writes startup event with version and counts', () => {
      const before = new Date().toISOString();
      logStartup({
        version: '0.6.0',
        transport: 'stdio',
        resourceCount: 25,
        toolCount: 6,
      });
      const after = new Date().toISOString();

      const entry = JSON.parse(stderrOutput[0]);
      assert.ok(entry.timestamp >= before);
      assert.ok(entry.timestamp <= after);
      assert.equal(entry.event, 'startup');
      assert.equal(entry.version, '0.6.0');
      assert.equal(entry.transport, 'stdio');
      assert.equal(entry.resourceCount, 25);
      assert.equal(entry.toolCount, 6);
    });

    it('handles HTTP transport type', () => {
      logStartup({
        version: '1.0.0',
        transport: 'http',
        resourceCount: 30,
        toolCount: 8,
      });

      const entry = JSON.parse(stderrOutput[0]);
      assert.equal(entry.transport, 'http');
    });
  });
});
