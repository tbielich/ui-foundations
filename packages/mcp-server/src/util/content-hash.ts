/**
 * Content hash utility for computing SHA-256 hex digests.
 *
 * Used to generate deterministic content hashes for resource responses,
 * enabling cache validation per Requirement 21.2.
 */

import { createHash } from 'node:crypto';

/**
 * Computes the SHA-256 hex digest of the given string content.
 *
 * @param content - The string content to hash.
 * @returns The lowercase hexadecimal SHA-256 digest.
 */
export function contentHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}
