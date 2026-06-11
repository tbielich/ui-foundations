/**
 * Agent resource handlers for the UI Foundations MCP Server.
 *
 * Maps `uif://agents/{identifier}` URIs to their corresponding files:
 * - rules → AGENTS.md
 * - behavior → docs/agentic/assistant-behavior-rules.md
 * - design-contract → DESIGN.md
 * - implementation → IMPLEMENTATION.md
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { FileReader } from '../util/file-reader.js';
import type { ResourceResponse } from '../types.js';

/** Map of valid agent resource identifiers to their file paths. */
const AGENT_RESOURCES: Record<string, string> = {
  rules: 'AGENTS.md',
  behavior: 'docs/agentic/assistant-behavior-rules.md',
  'design-contract': 'DESIGN.md',
  implementation: 'IMPLEMENTATION.md',
};

/** All valid agent resource identifiers. */
const VALID_IDENTIFIERS = Object.keys(AGENT_RESOURCES);

/**
 * Handles a `uif://agents/{identifier}` resource read request.
 *
 * Parses the identifier from the URI, maps it to the corresponding file,
 * reads the file content, and returns a ResourceResponse with text/markdown
 * MIME type.
 *
 * @param uri - The full resource URI (e.g., `uif://agents/rules`).
 * @param rootPath - Absolute path to the repository root.
 * @returns A ResourceResponse containing the file content.
 * @throws If the identifier is not recognized or the file cannot be read.
 */
export async function handleAgentResource(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  // Extract the identifier (everything after "uif://agents/")
  const identifier = uri.replace('uif://agents/', '');

  const filePath = AGENT_RESOURCES[identifier];

  if (!filePath) {
    const validUris = VALID_IDENTIFIERS.map((id) => `uif://agents/${id}`);
    throw new Error(
      `Resource not found: ${uri}. Valid agent resource URIs: ${validUris.join(', ')}`,
    );
  }

  const reader = new FileReader(rootPath);
  const result = await reader.read(filePath);

  return {
    uri,
    name: getResourceName(identifier),
    mimeType: 'text/markdown',
    content: result.content,
    metadata: {
      contentHash: result.contentHash,
      category: 'agents',
    },
  };
}

/**
 * Returns a human-readable name for the given agent resource identifier.
 */
function getResourceName(identifier: string): string {
  const names: Record<string, string> = {
    rules: 'Agent Rules',
    behavior: 'Assistant Behavior Rules',
    'design-contract': 'Design Contract',
    implementation: 'Implementation Guide',
  };
  return names[identifier] ?? identifier;
}
