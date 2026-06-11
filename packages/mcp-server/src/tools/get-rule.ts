/**
 * get_rule tool handler for the UI Foundations MCP Server.
 *
 * Retrieves a governance rule section from `docs/ui-foundations-rules.md` by category.
 * Accepts the category in any casing and normalizes to lowercase-hyphenated form.
 *
 * Requirements: 14.1, 14.2, 14.3
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ToolResponse } from '../types.js';

/** Valid rule categories and their corresponding section headings in the rules document. */
const CATEGORY_MAP: Record<string, string> = {
  'naming': 'Naming Rules',
  'layering': 'Layer Model',
  'theming': 'Theming Rules',
  'design-to-code': 'Design-to-Code Rules',
  'review': 'Review Checklist',
  'agent-readiness': 'Agent-Readiness Rules',
};

/** List of valid category keys for error messages. */
const VALID_CATEGORIES = Object.keys(CATEGORY_MAP);

/** Relative path to the rules document from the repository root. */
const RULES_FILE_PATH = 'docs/ui-foundations-rules.md';

/**
 * Normalizes a category input to the canonical lowercase-hyphenated form.
 *
 * Handles various input formats:
 * - "Naming" → "naming"
 * - "DESIGN_TO_CODE" → "design-to-code"
 * - "Agent Readiness" → "agent-readiness"
 * - "LayerModel" → "layer-model" (though this wouldn't match a valid category)
 *
 * @param input - Raw category string from the user.
 * @returns Normalized lowercase-hyphenated string.
 */
function normalizeCategory(input: string): string {
  return input
    .trim()
    .replace(/[_\s]+/g, '-') // Replace underscores and spaces with hyphens
    .toLowerCase();
}

/**
 * Extracts a section from markdown content by its heading.
 *
 * Finds the heading at level 2 (##) and extracts all content from that heading
 * to the next same-level heading or end of file.
 *
 * @param content - Full markdown content.
 * @param heading - The section heading text to find (without the ## prefix).
 * @returns The extracted section content including the heading, or null if not found.
 */
function extractSection(content: string, heading: string): string | null {
  const lines = content.split('\n');
  let startIndex = -1;
  let endIndex = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match ## headings (level 2)
    if (line.startsWith('## ')) {
      const headingText = line.replace(/^##\s+/, '').trim();

      if (headingText === heading) {
        startIndex = i;
      } else if (startIndex !== -1) {
        // Found the next same-level heading after our target section
        endIndex = i;
        break;
      }
    }
  }

  if (startIndex === -1) {
    return null;
  }

  return lines.slice(startIndex, endIndex).join('\n').trim();
}

/**
 * Handler for the `get_rule` tool.
 *
 * @param args - Tool arguments (expected to contain `category` string).
 * @param rootPath - Absolute path to the repository root.
 * @returns ToolResponse with the rule section content, or an error response.
 */
export async function getRuleHandler(args: unknown, rootPath: string): Promise<ToolResponse> {
  const { category } = args as { category: string };

  // Normalize the category input to lowercase-hyphenated form
  const normalized = normalizeCategory(category);

  // Check if the normalized category is valid
  if (!Object.hasOwn(CATEGORY_MAP, normalized)) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: `Invalid rule category: "${category}". Valid categories are: ${VALID_CATEGORIES.join(', ')}`,
            validCategories: VALID_CATEGORIES,
          }),
        },
      ],
      isError: true,
    };
  }

  const sectionHeading = CATEGORY_MAP[normalized];

  // Read the rules document
  let fileContent: string;
  try {
    const absolutePath = join(rootPath, RULES_FILE_PATH);
    fileContent = await readFile(absolutePath, 'utf8');
  } catch {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: `Unable to read rules document. The file "${RULES_FILE_PATH}" could not be loaded.`,
          }),
        },
      ],
      isError: true,
    };
  }

  // Extract the section corresponding to the category
  const section = extractSection(fileContent, sectionHeading);
  if (!section) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: `Section "${sectionHeading}" not found in the rules document.`,
          }),
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          category: normalized,
          heading: sectionHeading,
          content: section,
        }),
      },
    ],
  };
}
