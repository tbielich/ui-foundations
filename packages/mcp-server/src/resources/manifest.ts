/**
 * Manifest resource handlers for the UI Foundations MCP Server.
 *
 * Handles:
 * - `uif://manifest/context` → returns `docs/context-manifest.json` as JSON,
 *   validates top-level keys (contextFiles, contextDirectories, tokenSources)
 * - `uif://manifest/version` → returns version from root `package.json`
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4
 *
 * @module resources/manifest
 */

import { FileReader } from '../util/file-reader.js';
import type { ResourceResponse } from '../types.js';

/** Required top-level keys in the context manifest. */
const REQUIRED_MANIFEST_KEYS = ['contextFiles', 'contextDirectories', 'tokenSources'] as const;

/**
 * Handles requests for `uif://manifest/context`.
 *
 * Reads `docs/context-manifest.json` from the root path, parses it as JSON,
 * validates that it contains the required top-level keys, and returns it
 * with content hash metadata.
 *
 * @param uri - The resource URI (uif://manifest/context)
 * @param rootPath - Absolute path to the repository root
 * @returns ResourceResponse with parsed manifest content
 * @throws If the manifest file is missing, contains invalid JSON, or lacks required keys
 */
async function handleManifestContext(uri: string, rootPath: string): Promise<ResourceResponse> {
  const reader = new FileReader(rootPath);

  let fileResult;
  try {
    fileResult = await reader.read('docs/context-manifest.json');
  } catch {
    throw new Error('Context manifest could not be loaded: docs/context-manifest.json is missing or unreadable');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(fileResult.content);
  } catch {
    throw new Error('Context manifest could not be loaded: docs/context-manifest.json contains invalid JSON');
  }

  // Validate required top-level keys
  const missingKeys = REQUIRED_MANIFEST_KEYS.filter((key) => !(key in parsed));
  if (missingKeys.length > 0) {
    throw new Error(
      `Context manifest is invalid: missing required top-level keys: ${missingKeys.join(', ')}`,
    );
  }

  return {
    uri,
    name: 'Context Manifest',
    mimeType: 'application/json',
    content: parsed,
    metadata: {
      contentHash: fileResult.contentHash,
      category: 'manifest',
    },
  };
}

/**
 * Handles requests for `uif://manifest/version`.
 *
 * Reads the root `package.json`, extracts the `version` field, and returns
 * it as a JSON object `{ version: "x.x.x" }`.
 *
 * @param uri - The resource URI (uif://manifest/version)
 * @param rootPath - Absolute path to the repository root
 * @returns ResourceResponse with version content
 * @throws If package.json is missing or cannot be parsed
 */
async function handleManifestVersion(uri: string, rootPath: string): Promise<ResourceResponse> {
  const reader = new FileReader(rootPath);

  let fileResult;
  try {
    fileResult = await reader.read('package.json');
  } catch {
    throw new Error('Version could not be loaded: package.json is missing or unreadable');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(fileResult.content);
  } catch {
    throw new Error('Version could not be loaded: package.json contains invalid JSON');
  }

  if (typeof parsed.version !== 'string') {
    throw new Error('Version could not be loaded: package.json does not contain a valid version field');
  }

  const versionContent = { version: parsed.version };

  return {
    uri,
    name: 'Package Version',
    mimeType: 'application/json',
    content: versionContent,
    metadata: {
      contentHash: fileResult.contentHash,
      category: 'manifest',
    },
  };
}

/**
 * Manifest resource handler.
 *
 * Routes manifest URIs to their specific handlers:
 * - `uif://manifest/context` → handleManifestContext
 * - `uif://manifest/version` → handleManifestVersion
 *
 * @param uri - The full resource URI
 * @param rootPath - Absolute path to the repository root
 * @returns ResourceResponse for the requested manifest resource
 * @throws If the URI does not match a known manifest resource
 */
export async function handleManifest(uri: string, rootPath: string): Promise<ResourceResponse> {
  if (uri === 'uif://manifest/context') {
    return handleManifestContext(uri, rootPath);
  }

  if (uri === 'uif://manifest/version') {
    return handleManifestVersion(uri, rootPath);
  }

  throw new Error(`Unknown manifest resource: ${uri}. Valid manifest URIs: uif://manifest/context, uif://manifest/version`);
}
