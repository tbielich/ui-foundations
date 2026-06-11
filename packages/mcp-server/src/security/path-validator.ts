/**
 * Path validation and sandboxing for the MCP Server security layer.
 *
 * Detects path traversal sequences in all encodings, enforces sandbox
 * boundaries, and blocks access to sensitive files. Error responses never
 * expose internal file system paths, stack traces, or environment values.
 *
 * Requirements: 20.2, 20.3, 20.4, 20.6
 */

import { resolve, normalize, relative } from 'node:path';

// ---------------------------------------------------------------------------
// Path traversal patterns
// ---------------------------------------------------------------------------

/**
 * Patterns that indicate path traversal attempts in various encodings.
 * Covers literal, URL-encoded, backslash, and double-encoded variants.
 */
const TRAVERSAL_PATTERNS: RegExp[] = [
  // Literal forward-slash traversal
  /\.\.\//,
  // Literal backslash traversal
  /\.\.\\/,
  // URL-encoded forward-slash: %2e%2e%2f (case-insensitive)
  /%2e%2e%2f/i,
  // URL-encoded backslash: %2e%2e%5c (case-insensitive)
  /%2e%2e%5c/i,
  // Double-encoded forward-slash: %252e%252e%252f (case-insensitive)
  /%252e%252e%252f/i,
  // Double-encoded backslash: %252e%252e%255c (case-insensitive)
  /%252e%252e%255c/i,
  // Mixed encoding: %2e%2e/ or %2e%2e\
  /%2e%2e[/\\]/i,
  // Mixed encoding: ..%2f or ..%5c
  /\.\.%2f/i,
  /\.\.%5c/i,
  // Double-encoded dot with literal slash: %252e%252e/
  /%252e%252e[/\\]/i,
];

// ---------------------------------------------------------------------------
// Sensitive file patterns
// ---------------------------------------------------------------------------

/** File extensions considered sensitive (private keys and certificates). */
const SENSITIVE_EXTENSIONS = ['.pem', '.key', '.p12', '.pfx'];

/** Patterns matching sensitive file paths. */
const SENSITIVE_PATH_PATTERNS: RegExp[] = [
  // .env files (exact match or with suffix like .env.local)
  /(?:^|[/\\])\.env(?:\.|$)/i,
  // .git directory contents
  /(?:^|[/\\])\.git(?:[/\\]|$)/i,
];

/** PEM private key header pattern in file content. */
const PEM_HEADER_PATTERN = /-----BEGIN (?:RSA |EC |DSA |ENCRYPTED )?PRIVATE KEY-----/;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface PathValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file path for security concerns.
 *
 * Checks for:
 * 1. Path traversal sequences in any encoding (../,  %2e%2e%2f, ..\, %2e%2e%5c, double-encoded)
 * 2. Sandbox enforcement — resolved path must be under rootPath
 * 3. Sensitive file patterns (.env, .git/*, *.pem, *.key, *.p12, *.pfx)
 *
 * Error messages are generic and never expose internal paths.
 *
 * @param inputPath - The path to validate (may be relative or absolute).
 * @param rootPath - The sandbox root directory all paths must resolve under.
 * @returns Validation result with a generic error message if invalid.
 */
export function validatePath(inputPath: string, rootPath: string): PathValidationResult {
  // Step 1: Check for path traversal sequences in the raw input
  if (containsTraversalSequence(inputPath)) {
    return { valid: false, error: 'Path contains disallowed traversal pattern' };
  }

  // Also check URL-decoded form for traversal sequences
  let decoded: string;
  try {
    decoded = decodeURIComponent(inputPath);
    // Double-decode to catch double-encoded attempts
    const doubleDecoded = decodeURIComponent(decoded);
    if (containsTraversalSequence(decoded) || containsTraversalSequence(doubleDecoded)) {
      return { valid: false, error: 'Path contains disallowed traversal pattern' };
    }
  } catch {
    // If decoding fails, the raw input was already checked above
    decoded = inputPath;
  }

  // Step 2: Resolve and enforce sandbox boundary
  const resolvedRoot = resolve(rootPath);
  const resolvedPath = resolve(resolvedRoot, normalize(decoded));

  // The resolved path must be equal to or nested under the root
  const rel = relative(resolvedRoot, resolvedPath);
  if (rel.startsWith('..') || resolve(resolvedRoot, rel) !== resolvedPath) {
    return { valid: false, error: 'Access denied: path is outside allowed directory' };
  }

  // Step 3: Check for sensitive file patterns
  if (isSensitiveFile(resolvedPath)) {
    return { valid: false, error: 'Access denied: requested resource is restricted' };
  }

  return { valid: true };
}

/**
 * Checks if file content contains a PEM private key header.
 *
 * This is an additional content-level check beyond the file path validation.
 * Should be called after reading file content to block PEM key exposure.
 *
 * @param content - The file content to inspect.
 * @returns True if content appears to contain a private key.
 */
export function containsPemPrivateKey(content: string): boolean {
  return PEM_HEADER_PATTERN.test(content);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Tests whether the given string contains any known path traversal sequence.
 */
function containsTraversalSequence(input: string): boolean {
  return TRAVERSAL_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Tests whether a resolved absolute path targets a sensitive file.
 */
function isSensitiveFile(absolutePath: string): boolean {
  const lower = absolutePath.toLowerCase();

  // Check sensitive extensions
  for (const ext of SENSITIVE_EXTENSIONS) {
    if (lower.endsWith(ext)) {
      return true;
    }
  }

  // Check sensitive path patterns (using the original path to preserve case for regex)
  for (const pattern of SENSITIVE_PATH_PATTERNS) {
    if (pattern.test(absolutePath)) {
      return true;
    }
  }

  return false;
}
