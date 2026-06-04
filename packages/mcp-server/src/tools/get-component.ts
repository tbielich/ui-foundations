/**
 * get_component tool handler for the UI Foundations MCP Server.
 *
 * Looks up a component by name (case-insensitive) and returns full component
 * details including documentation, CSS class, HTML pattern, variants, states,
 * tokens, and Code Connect schema path.
 *
 * Delegates to the components resource handler which already implements:
 * - Case-insensitive name resolution to canonical kebab-case
 * - Full ComponentData construction from file system
 * - Not-found errors with valid names list and fuzzy suggestions (edit distance ≤3)
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

import { handleComponents } from '../resources/components.js';
import type { ToolResponse } from '../types.js';

/**
 * Handles the `get_component` tool call.
 *
 * @param args - Tool arguments (expected to contain `name` string).
 * @param rootPath - Absolute path to the repository root.
 * @returns ToolResponse with component data as JSON text, or an error response.
 */
export async function handleGetComponent(
  args: unknown,
  rootPath: string,
): Promise<ToolResponse> {
  const { name } = args as { name: string };

  try {
    const response = await handleComponents(`uif://components/${name}`, rootPath);
    return {
      content: [{ type: 'text', text: response.content as string }],
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error looking up component';
    return {
      content: [{ type: 'text', text: message }],
      isError: true,
    };
  }
}
