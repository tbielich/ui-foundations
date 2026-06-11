/**
 * Foundation resource handlers for the UI Foundations MCP Server.
 *
 * Handles two URI forms:
 * - `uif://foundations` → JSON array listing all foundation documents (001–012)
 * - `uif://foundations/{id}` → markdown content of an individual foundation document
 *
 * Foundation files live in `docs/foundations/` and follow the naming pattern
 * `foundation-{NNN}-{slug}.md` (e.g., `foundation-001-token-layering.md`).
 *
 * Requirements: 9.1, 9.2, 9.3
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { FileReader } from '../util/file-reader.js';
import { contentHash } from '../util/content-hash.js';
import type { ResourceResponse } from '../types.js';

/** Directory containing foundation documents relative to root. */
const FOUNDATIONS_DIR = 'docs/foundations';

/** Regex matching foundation document file names. */
const FOUNDATION_PATTERN = /^foundation-(\d{3})-(.+)\.md$/;

/**
 * Represents a discovered foundation document.
 */
interface FoundationEntry {
  id: string;
  title: string;
  uri: string;
  relativePath: string;
}

/**
 * Extracts the title from a foundation document's YAML frontmatter.
 * Falls back to generating a title from the filename slug if no frontmatter
 * title is found.
 */
function extractTitle(content: string, slug: string): string {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/^title:\s*(.+)$/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
  }
  // Fallback: convert slug to title case
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Discovers all foundation documents in the foundations directory.
 * Returns entries sorted by ID (ascending).
 */
async function discoverFoundations(rootPath: string): Promise<FoundationEntry[]> {
  const dir = join(rootPath, FOUNDATIONS_DIR);
  const files = await readdir(dir);

  const reader = new FileReader(rootPath);
  const entries: FoundationEntry[] = [];

  for (const file of files) {
    const match = file.match(FOUNDATION_PATTERN);
    if (!match) continue;

    const id = match[1];
    const slug = match[2];
    const relativePath = `${FOUNDATIONS_DIR}/${file}`;

    const result = await reader.read(relativePath);
    const title = extractTitle(result.content, slug);

    entries.push({
      id,
      title,
      uri: `uif://foundations/${id}`,
      relativePath,
    });
  }

  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Handles the `uif://foundations` listing request.
 * Returns a JSON array of all foundation documents with id, title, and URI.
 */
async function handleFoundationListing(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  const entries = await discoverFoundations(rootPath);

  const listing = entries.map(({ id, title, uri: entryUri }) => ({
    id,
    title,
    uri: entryUri,
  }));

  const content = JSON.stringify(listing);
  const hash = contentHash(content);

  return {
    uri,
    name: 'Foundation Document Listing',
    mimeType: 'application/json',
    content,
    metadata: {
      contentHash: hash,
      category: 'foundations',
    },
  };
}

/**
 * Handles a `uif://foundations/{id}` individual document request.
 * Returns the markdown content of the specified foundation document.
 */
async function handleFoundationDocument(
  uri: string,
  rootPath: string,
  id: string,
): Promise<ResourceResponse> {
  const entries = await discoverFoundations(rootPath);
  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    const validIds = entries.map((e) => e.id);
    throw new Error(
      `Resource not found: ${uri}. Valid foundation identifiers: ${validIds.join(', ')}`,
    );
  }

  const reader = new FileReader(rootPath);
  const result = await reader.read(entry.relativePath);

  return {
    uri,
    name: entry.title,
    mimeType: 'text/markdown',
    content: result.content,
    metadata: {
      contentHash: result.contentHash,
      category: 'foundations',
    },
  };
}

/**
 * Main handler for all foundation resource URIs.
 *
 * Routes based on URI:
 * - `uif://foundations` → listing of all foundation documents
 * - `uif://foundations/{id}` → individual document content
 *
 * @param uri - The foundation resource URI.
 * @param rootPath - Absolute path to the repository root.
 * @returns The resource response with content and metadata.
 */
export async function handleFoundations(
  uri: string,
  rootPath: string,
): Promise<ResourceResponse> {
  // Exact match for listing
  if (uri === 'uif://foundations') {
    return handleFoundationListing(uri, rootPath);
  }

  // Extract ID from uif://foundations/{id}
  const id = uri.replace('uif://foundations/', '');

  if (!id) {
    return handleFoundationListing(uri, rootPath);
  }

  return handleFoundationDocument(uri, rootPath, id);
}

/**
 * Lists all available foundation documents for resource template enumeration.
 * Returns an array of { uri, name } objects for each foundation.
 */
export async function listFoundations(
  rootPath: string,
): Promise<Array<{ uri: string; name: string }>> {
  const entries = await discoverFoundations(rootPath);
  return entries.map((entry) => ({
    uri: entry.uri,
    name: entry.title,
  }));
}
