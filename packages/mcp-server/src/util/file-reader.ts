/**
 * Cached file reader with SHA-256 content hashing.
 *
 * Reads files relative to a configured root path, computes SHA-256 content
 * hashes, and caches results in memory to avoid redundant hashing within a
 * request cycle.
 *
 * Always re-reads from disk on each call to ensure fresh content per
 * Requirement 21.3. The cache stores results to avoid redundant hashing
 * within the same request cycle.
 *
 * Requirements: 21.2, 21.3, 5.8
 */

import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

import { contentHash } from './content-hash.js';
import type { FileReadResult } from '../types.js';

/** Map of file extensions to MIME types. */
const MIME_TYPES: Record<string, string> = {
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.css': 'text/css',
};

/** Default MIME type for unknown extensions. */
const DEFAULT_MIME_TYPE = 'text/plain';

/**
 * Resolves a MIME type from a file extension.
 */
function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] ?? DEFAULT_MIME_TYPE;
}

/**
 * Cached file reader that reads files relative to a root path and computes
 * SHA-256 content hashes for cache control.
 */
export class FileReader {
  private cache: Map<string, FileReadResult>;
  private rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    this.cache = new Map();
  }

  /**
   * Reads a file relative to the configured root path.
   *
   * Always re-reads from disk to ensure fresh content. Caches the result
   * (including content hash) to avoid redundant hashing within the same
   * request cycle.
   *
   * @param relativePath - Path relative to the root directory.
   * @returns The file content, its SHA-256 hash, MIME type, and read timestamp.
   * @throws If the file cannot be read (e.g., does not exist or is not accessible).
   */
  async read(relativePath: string): Promise<FileReadResult> {
    const absolutePath = join(this.rootPath, relativePath);
    const content = await readFile(absolutePath, 'utf8');
    const hash = contentHash(content);
    const mimeType = getMimeType(relativePath);
    const lastRead = Date.now();

    const result: FileReadResult = {
      content,
      contentHash: hash,
      mimeType,
      lastRead,
    };

    this.cache.set(relativePath, result);
    return result;
  }

  /**
   * Invalidates the cached result for a specific file path.
   *
   * @param relativePath - Path relative to the root directory to invalidate.
   */
  invalidate(relativePath: string): void {
    this.cache.delete(relativePath);
  }

  /**
   * Invalidates all cached results.
   */
  invalidateAll(): void {
    this.cache.clear();
  }
}
