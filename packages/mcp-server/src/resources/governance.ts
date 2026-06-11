/**
 * Governance resource handlers for the UI Foundations MCP Server.
 *
 * Maps `uif://governance/{identifier}` URIs to their corresponding files:
 * - rules → docs/ui-foundations-rules.md
 * - naming → docs/foundations/foundation-002-naming-and-grouping.md
 * - layering → docs/foundations/foundation-001-token-layering.md
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

import { FileReader } from '../util/file-reader.js';
import type { ResourceResponse } from '../types.js';

/** Map of valid governance resource identifiers to their file paths. */
const GOVERNANCE_RESOURCES: Record<string, string> = {
  rules: 'docs/ui-foundations-rules.md',
  naming: 'docs/foundations/foundation-002-naming-and-grouping.md',
  layering: 'docs/foundations/foundation-001-token-layering.md',
};

/** All valid governance resource identifiers. */
const VALID_IDENTIFIERS = Object.keys(GOVERNANCE_RESOURCES);

/**
 * Handles a `uif://governance/{identifier}` resource read request.
 *
 * Parses the identifier from the URI, maps it to the corresponding file,
 * reads the file content, and returns a ResourceResponse with text/markdown
 * MIME type.
 *
 * @param uri - The full resource URI (e.g., `uif://governance/rules`).
 * @param rootPath - Absolute path to the repository root.
 * @returns A ResourceResponse containing the file content.
 * @throws If the identifier is not recognized or the file cannot be read.
 */
export async function handleGovernanceResource(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  // Extract the identifier (everything after "uif://governance/")
  const identifier = uri.replace('uif://governance/', '');

  const filePath = GOVERNANCE_RESOURCES[identifier];

  if (!filePath) {
    const validUris = VALID_IDENTIFIERS.map((id) => `uif://governance/${id}`);
    throw new Error(
      `Resource not found: ${uri}. Valid governance resource URIs: ${validUris.join(', ')}`,
    );
  }

  const reader = new FileReader(rootPath);

  let result;
  try {
    result = await reader.read(filePath);
  } catch {
    throw new Error(
      `Governance resource unavailable: could not read backing file "${filePath}" for ${uri}`,
    );
  }

  return {
    uri,
    name: getResourceName(identifier),
    mimeType: 'text/markdown',
    content: result.content,
    metadata: {
      contentHash: result.contentHash,
      category: 'governance',
    },
  };
}

/**
 * Returns a human-readable name for the given governance resource identifier.
 */
function getResourceName(identifier: string): string {
  const names: Record<string, string> = {
    rules: 'Governance Rules',
    naming: 'Naming Conventions',
    layering: 'Token Layering',
  };
  return names[identifier] ?? identifier;
}
