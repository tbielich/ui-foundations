/**
 * Property tests for the MCP Server security layer.
 *
 * Property 17: Path traversal rejection
 * Property 18: Sandbox enforcement
 * Property 19: Input length enforcement
 *
 * Feature: mcp-server, Property 17: Path traversal rejection
 * Feature: mcp-server, Property 18: Sandbox enforcement
 * Feature: mcp-server, Property 19: Input length enforcement
 *
 * Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5, 20.6
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';

import { validatePath, containsPemPrivateKey } from '../../src/security/path-validator.js';
import {
  validateStringLength,
  validateToolInput,
  validateTokenNameLength,
} from '../../src/security/input-validator.js';

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Generates path traversal sequences in various encodings. */
const traversalSequenceArb = fc.oneof(
  fc.constant('../'),
  fc.constant('..\\'),
  fc.constant('%2e%2e%2f'),
  fc.constant('%2e%2e%5c'),
  fc.constant('%2E%2E%2F'),
  fc.constant('%2E%2E%5C'),
  fc.constant('%252e%252e%252f'),
  fc.constant('%252e%252e%255c'),
  fc.constant('..%2f'),
  fc.constant('..%5c'),
  fc.constant('%2e%2e/'),
  fc.constant('%2e%2e\\'),
);

/** Generates a path containing at least one traversal sequence. */
const pathWithTraversalArb = fc
  .tuple(
    fc.string({ minLength: 0, maxLength: 20 }).filter((s) => !s.includes('\0')),
    traversalSequenceArb,
    fc.string({ minLength: 0, maxLength: 20 }).filter((s) => !s.includes('\0')),
  )
  .map(([prefix, traversal, suffix]) => `${prefix}${traversal}${suffix}`);

/** Generates sensitive file paths. */
const sensitiveFileArb = fc.oneof(
  // .env files
  fc.constantFrom('.env', '.env.local', '.env.production', 'config/.env', 'src/.env.test'),
  // .git paths
  fc.constantFrom('.git/config', '.git/HEAD', '.git/objects/abc', 'repo/.git/refs'),
  // Private key files
  fc.constantFrom(
    'server.pem',
    'cert.key',
    'auth.p12',
    'ssl.pfx',
    'certs/private.pem',
    'keys/app.key',
    'deploy/cert.p12',
    'tls/server.pfx',
  ),
);

/** Generates paths that escape the sandbox (resolve outside root). */
const escapeSandboxArb = fc
  .tuple(
    fc.integer({ min: 1, max: 10 }),
    fc.string({ minLength: 1, maxLength: 10 }).filter((s) => /^[a-z]+$/.test(s)),
  )
  .map(([depth, filename]) => {
    const ups = Array.from({ length: depth }, () => '..').join('/');
    return `${ups}/${filename}`;
  });

/** Generates safe alphanumeric filenames that won't trigger any security rules. */
const safeFilenameArb = fc
  .string({ minLength: 1, maxLength: 30 })
  .filter((s) => /^[a-z][a-z0-9-]*[a-z0-9]$/.test(s))
  .map((s) => `${s}.txt`);

// ---------------------------------------------------------------------------
// Property 17: Path traversal rejection
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 17: Path traversal rejection', () => {
  const ROOT = '/tmp/test-root';

  it('rejects any path containing literal ../ traversal', () => {
    fc.assert(
      fc.property(pathWithTraversalArb, (path) => {
        const result = validatePath(path, ROOT);
        assert.equal(result.valid, false, `Expected rejection for path: ${path}`);
        assert.ok(result.error, 'Expected an error message');
      }),
      { numRuns: 100 },
    );
  });

  it('rejects URL-encoded traversal sequences (%2e%2e%2f)', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 0, maxLength: 10 }).filter((s) => /^[a-z]*$/.test(s)),
          fc.constantFrom('%2e%2e%2f', '%2E%2E%2F', '%2e%2e%5c', '%2E%2E%5C'),
          fc.string({ minLength: 0, maxLength: 10 }).filter((s) => /^[a-z]*$/.test(s)),
        ),
        ([prefix, encoded, suffix]) => {
          const path = `${prefix}${encoded}${suffix}`;
          const result = validatePath(path, ROOT);
          assert.equal(result.valid, false, `Expected rejection for encoded path: ${path}`);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('rejects double-encoded traversal sequences (%252e%252e%252f)', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 0, maxLength: 10 }).filter((s) => /^[a-z]*$/.test(s)),
          fc.constantFrom('%252e%252e%252f', '%252e%252e%255c'),
          fc.string({ minLength: 0, maxLength: 10 }).filter((s) => /^[a-z]*$/.test(s)),
        ),
        ([prefix, doubleEncoded, suffix]) => {
          const path = `${prefix}${doubleEncoded}${suffix}`;
          const result = validatePath(path, ROOT);
          assert.equal(result.valid, false, `Expected rejection for double-encoded: ${path}`);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('never resolves traversal paths against the file system (error message is generic)', () => {
    fc.assert(
      fc.property(pathWithTraversalArb, (path) => {
        const result = validatePath(path, ROOT);
        assert.equal(result.valid, false);
        // Error should not expose actual resolved path
        assert.ok(!result.error!.includes(ROOT), 'Error must not expose root path');
        assert.ok(
          !result.error!.includes('/tmp/'),
          'Error must not expose file system paths',
        );
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 18: Sandbox enforcement
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 18: Sandbox enforcement', () => {
  const ROOT = '/tmp/test-sandbox-root';

  it('denies paths that resolve outside the root directory', () => {
    fc.assert(
      fc.property(escapeSandboxArb, (path) => {
        const result = validatePath(path, ROOT);
        assert.equal(result.valid, false, `Expected denial for escaping path: ${path}`);
        assert.ok(result.error, 'Expected an error message');
      }),
      { numRuns: 100 },
    );
  });

  it('denies access to .env files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('.env', '.env.local', '.env.production', '.env.test'),
        (envFile) => {
          const result = validatePath(envFile, ROOT);
          assert.equal(result.valid, false, `Expected denial for: ${envFile}`);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('denies access to .git directory contents', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-z0-9/]+$/.test(s)),
        (subpath) => {
          const path = `.git/${subpath}`;
          const result = validatePath(path, ROOT);
          assert.equal(result.valid, false, `Expected denial for .git path: ${path}`);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('denies access to sensitive file extensions (.pem, .key, .p12, .pfx)', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 1, maxLength: 15 }).filter((s) => /^[a-z][a-z0-9-]*$/.test(s)),
          fc.constantFrom('.pem', '.key', '.p12', '.pfx'),
        ),
        ([basename, ext]) => {
          const path = `${basename}${ext}`;
          const result = validatePath(path, ROOT);
          assert.equal(result.valid, false, `Expected denial for sensitive file: ${path}`);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('denies sensitive files in subdirectories', () => {
    fc.assert(
      fc.property(sensitiveFileArb, (path) => {
        const result = validatePath(path, ROOT);
        assert.equal(result.valid, false, `Expected denial for: ${path}`);
      }),
      { numRuns: 100 },
    );
  });

  it('allows safe paths within root that are not sensitive', () => {
    fc.assert(
      fc.property(safeFilenameArb, (filename) => {
        const result = validatePath(filename, ROOT);
        assert.equal(result.valid, true, `Expected pass for safe path: ${filename}`);
      }),
      { numRuns: 100 },
    );
  });

  it('error messages for sandbox violations do not expose root path', () => {
    fc.assert(
      fc.property(escapeSandboxArb, (path) => {
        const result = validatePath(path, ROOT);
        if (!result.valid && result.error) {
          assert.ok(
            !result.error.includes(ROOT),
            'Error must not reveal root path',
          );
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 19: Input length enforcement
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 19: Input length enforcement', () => {
  /** Generates strings of a specific length range. */
  const longStringArb = (minLen: number, maxLen: number) =>
    fc.string({ minLength: minLen, maxLength: maxLen });

  it('rejects any string longer than 1000 characters via validateStringLength()', () => {
    fc.assert(
      fc.property(longStringArb(1001, 2000), (input) => {
        const result = validateStringLength(input);
        assert.equal(result.valid, false, `Expected rejection for ${input.length} chars`);
        assert.ok(result.error, 'Expected an error message');
      }),
      { numRuns: 100 },
    );
  });

  it('accepts strings of exactly 1000 characters or fewer via validateStringLength()', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 1000 }), (input) => {
        const result = validateStringLength(input);
        assert.equal(result.valid, true, `Expected acceptance for ${input.length} chars`);
      }),
      { numRuns: 100 },
    );
  });

  it('rejects any tool input longer than 10000 characters via validateToolInput()', () => {
    fc.assert(
      fc.property(longStringArb(10001, 15000), (input) => {
        const result = validateToolInput(input);
        assert.equal(result.valid, false, `Expected rejection for ${input.length} chars`);
        assert.ok(result.error, 'Expected an error message');
      }),
      { numRuns: 100 },
    );
  });

  it('accepts tool inputs of exactly 10000 characters or fewer via validateToolInput()', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 10000 }), (input) => {
        const result = validateToolInput(input);
        assert.equal(result.valid, true, `Expected acceptance for ${input.length} chars`);
      }),
      { numRuns: 100 },
    );
  });

  it('error responses from validateStringLength() contain no file paths or stack traces', () => {
    fc.assert(
      fc.property(longStringArb(1001, 5000), (input) => {
        const result = validateStringLength(input);
        assert.equal(result.valid, false);
        const error = result.error!;

        // Should not contain file system paths
        assert.ok(!error.includes('/Users/'), 'Error must not contain user paths');
        assert.ok(!error.includes('/home/'), 'Error must not contain home paths');
        assert.ok(!error.includes('/tmp/'), 'Error must not contain tmp paths');
        assert.ok(!error.includes('\\Users\\'), 'Error must not contain Windows paths');

        // Should not contain stack trace indicators
        assert.ok(!error.includes('at '), 'Error must not contain stack traces');
        assert.ok(!error.includes('Error:'), 'Error must not contain Error class references');
        assert.ok(!error.includes('node_modules'), 'Error must not contain node_modules paths');
      }),
      { numRuns: 100 },
    );
  });

  it('error responses from validateToolInput() contain no file paths or stack traces', () => {
    fc.assert(
      fc.property(longStringArb(10001, 15000), (input) => {
        const result = validateToolInput(input);
        assert.equal(result.valid, false);
        const error = result.error!;

        // Should not contain file system paths
        assert.ok(!error.includes('/Users/'), 'Error must not contain user paths');
        assert.ok(!error.includes('/home/'), 'Error must not contain home paths');
        assert.ok(!error.includes('/tmp/'), 'Error must not contain tmp paths');
        assert.ok(!error.includes('\\Users\\'), 'Error must not contain Windows paths');

        // Should not contain stack trace indicators
        assert.ok(!error.includes('at '), 'Error must not contain stack traces');
        assert.ok(!error.includes('Error:'), 'Error must not contain Error class references');
        assert.ok(!error.includes('node_modules'), 'Error must not contain node_modules paths');
      }),
      { numRuns: 100 },
    );
  });

  it('error responses do not contain environment variable values', () => {
    fc.assert(
      fc.property(longStringArb(1001, 3000), (input) => {
        const result = validateStringLength(input);
        assert.equal(result.valid, false);
        const error = result.error!;

        // Should not expose env var patterns
        assert.ok(
          !error.includes('process.env'),
          'Error must not reference process.env',
        );
        // Error should only contain the generic message with lengths
        assert.ok(
          error.includes('maximum allowed length'),
          'Error should reference the limit',
        );
        assert.ok(
          error.includes('characters'),
          'Error should mention characters',
        );
      }),
      { numRuns: 100 },
    );
  });

  it('rejects token names longer than 200 characters via validateTokenNameLength()', () => {
    fc.assert(
      fc.property(longStringArb(201, 500), (input) => {
        const result = validateTokenNameLength(input);
        assert.equal(result.valid, false, `Expected rejection for ${input.length} chars`);
        assert.ok(result.error, 'Expected an error message');
      }),
      { numRuns: 100 },
    );
  });
});
