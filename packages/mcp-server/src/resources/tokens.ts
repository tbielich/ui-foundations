/**
 * Token resource handlers for the UI Foundations MCP Server.
 *
 * Maps token resource URIs to their corresponding JSON files:
 * - uif://tokens/core → dist/tokens/json/core-primitives.tokens.json
 * - uif://tokens/semantic → dist/tokens/json/semantics-roles.tokens.json
 * - uif://tokens/component → dist/tokens/json/components-ui.tokens.json
 * - uif://tokens/modes → combines mode-light and mode-dark JSON
 * - uif://tokens/brands → combines all brand JSON files
 *
 * Each response includes a `layer` metadata field indicating the token layer.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { FileReader } from '../util/file-reader.js';
import { contentHash } from '../util/content-hash.js';
import type { ResourceResponse, TokenLayer } from '../types.js';

/** Base directory for token JSON files relative to root. */
const TOKEN_JSON_DIR = 'dist/tokens/json';

/** Mapping of single-file token URIs to their file paths and layers. */
const SINGLE_FILE_TOKENS: Record<string, { file: string; layer: TokenLayer; name: string }> = {
  'uif://tokens/core': {
    file: `${TOKEN_JSON_DIR}/core-primitives.tokens.json`,
    layer: 'core',
    name: 'Core Primitives Tokens',
  },
  'uif://tokens/semantic': {
    file: `${TOKEN_JSON_DIR}/semantics-roles.tokens.json`,
    layer: 'semantic',
    name: 'Semantic Role Tokens',
  },
  'uif://tokens/component': {
    file: `${TOKEN_JSON_DIR}/components-ui.tokens.json`,
    layer: 'component',
    name: 'Component UI Tokens',
  },
};

/**
 * Handles token resource reads for single-file tokens (core, semantic, component).
 */
async function handleSingleFileToken(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  const mapping = SINGLE_FILE_TOKENS[uri];
  if (!mapping) {
    throw new Error(`Unknown token resource URI: ${uri}`);
  }

  const reader = new FileReader(rootPath);

  let result;
  try {
    result = await reader.read(mapping.file);
  } catch {
    const error = new Error(
      `Token file not found or unreadable: ${mapping.file}`,
    );
    (error as Error & { code: number }).code = -32603;
    throw error;
  }

  return {
    uri,
    name: mapping.name,
    mimeType: 'application/json',
    content: result.content,
    metadata: {
      contentHash: result.contentHash,
      category: 'tokens',
      layer: mapping.layer,
    },
  };
}

/**
 * Handles the uif://tokens/modes resource.
 * Combines mode-light and mode-dark JSON into a single response.
 */
async function handleModesToken(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  const reader = new FileReader(rootPath);
  const lightFile = `${TOKEN_JSON_DIR}/appearance-modes.tokens.mode-light.json`;
  const darkFile = `${TOKEN_JSON_DIR}/appearance-modes.tokens.mode-dark.json`;

  let lightResult;
  let darkResult;

  try {
    lightResult = await reader.read(lightFile);
  } catch {
    const error = new Error(`Token file not found or unreadable: ${lightFile}`);
    (error as Error & { code: number }).code = -32603;
    throw error;
  }

  try {
    darkResult = await reader.read(darkFile);
  } catch {
    const error = new Error(`Token file not found or unreadable: ${darkFile}`);
    (error as Error & { code: number }).code = -32603;
    throw error;
  }

  const combined = {
    'mode-light': JSON.parse(lightResult.content),
    'mode-dark': JSON.parse(darkResult.content),
  };

  const combinedContent = JSON.stringify(combined);
  const hash = contentHash(combinedContent);

  return {
    uri,
    name: 'Appearance Mode Tokens',
    mimeType: 'application/json',
    content: combinedContent,
    metadata: {
      contentHash: hash,
      category: 'tokens',
      layer: 'mode',
    },
  };
}

/**
 * Handles the uif://tokens/brands resource.
 * Discovers all brand JSON files and combines them into a single response
 * keyed by brand name.
 */
async function handleBrandsToken(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  const reader = new FileReader(rootPath);
  const tokenDir = join(rootPath, TOKEN_JSON_DIR);

  let files: string[];
  try {
    files = await readdir(tokenDir);
  } catch {
    const error = new Error(
      `Token directory not found or unreadable: ${TOKEN_JSON_DIR}`,
    );
    (error as Error & { code: number }).code = -32603;
    throw error;
  }

  // Filter for brand files matching the pattern themes-brands.tokens.*.json
  const brandPattern = /^themes-brands\.tokens\.(.+)\.json$/;
  const brandFiles = files
    .filter((f) => brandPattern.test(f))
    .sort();

  if (brandFiles.length === 0) {
    const error = new Error(
      `No brand token files found in ${TOKEN_JSON_DIR}`,
    );
    (error as Error & { code: number }).code = -32603;
    throw error;
  }

  const combined: Record<string, unknown> = {};

  for (const brandFile of brandFiles) {
    const match = brandFile.match(brandPattern);
    if (!match) continue;

    const brandName = match[1];
    const relativePath = `${TOKEN_JSON_DIR}/${brandFile}`;

    let result;
    try {
      result = await reader.read(relativePath);
    } catch {
      const error = new Error(
        `Token file not found or unreadable: ${relativePath}`,
      );
      (error as Error & { code: number }).code = -32603;
      throw error;
    }

    combined[brandName] = JSON.parse(result.content);
  }

  const combinedContent = JSON.stringify(combined);
  const hash = contentHash(combinedContent);

  return {
    uri,
    name: 'Brand Theme Tokens',
    mimeType: 'application/json',
    content: combinedContent,
    metadata: {
      contentHash: hash,
      category: 'tokens',
      layer: 'brand',
    },
  };
}

/**
 * Main handler for all token resource URIs.
 *
 * Routes to the appropriate sub-handler based on the URI:
 * - uif://tokens/core, uif://tokens/semantic, uif://tokens/component → single file
 * - uif://tokens/modes → combined mode files
 * - uif://tokens/brands → combined brand files
 *
 * @param uri - The token resource URI.
 * @param rootPath - Absolute path to the repository root.
 * @returns The resource response with content and metadata including layer.
 */
export async function handleTokens(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  if (uri in SINGLE_FILE_TOKENS) {
    return handleSingleFileToken(uri, rootPath);
  }

  if (uri === 'uif://tokens/modes') {
    return handleModesToken(uri, rootPath);
  }

  if (uri === 'uif://tokens/brands') {
    return handleBrandsToken(uri, rootPath);
  }

  throw new Error(`Unknown token resource URI: ${uri}`);
}
