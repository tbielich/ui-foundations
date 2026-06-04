/**
 * Tool registry definitions for the UI Foundations MCP Server.
 *
 * Declarative array of all tool entries. Each entry specifies a name,
 * description, Zod input schema, and handler function.
 *
 * @module registry/tools
 */

import { z } from 'zod';
import type { ToolRegistryEntry, ToolResponse } from '../types.js';
import { getTokenHandler } from '../tools/get-token.js';
import { searchFoundationsHandler } from '../tools/search.js';
import { handleGetComponent } from '../tools/get-component.js';
import { validateTokenNameHandler } from '../tools/validate-token-name.js';
import { getPatternHandler } from '../tools/get-pattern.js';
import { getRuleHandler } from '../tools/get-rule.js';

/**
 * Placeholder handler that throws until the real handler is wired in Task 8.
 */
async function notImplemented(_args: unknown, _rootPath: string): Promise<ToolResponse> {
  throw new Error('Handler not implemented');
}

/**
 * All registered tool entries for the UI Foundations MCP Server.
 *
 * Each entry defines:
 * - name: the MCP tool name clients use to invoke it
 * - description: human-readable explanation of what the tool does
 * - inputSchema: Zod raw shape passed to server.tool() for input validation
 * - handler: async function that processes args and returns a ToolResponse
 */
export const tools: ToolRegistryEntry[] = [
  {
    name: 'search_foundations',
    description:
      'Search across all design system knowledge including tokens, components, patterns, rules, and foundations. Returns ranked results with relevance scores.',
    inputSchema: z.object({
      query: z.string().min(2, 'Query must be at least 2 characters'),
    }),
    handler: searchFoundationsHandler,
  },
  {
    name: 'get_component',
    description:
      'Look up a component by name. Returns full component details including documentation, CSS class, HTML pattern, variants, states, tokens, and Code Connect schema path.',
    inputSchema: z.object({
      name: z.string().min(1, 'Component name is required'),
    }),
    handler: handleGetComponent,
  },
  {
    name: 'get_token',
    description:
      'Look up tokens by name or partial name. Performs case-insensitive substring matching and returns up to 50 results with name, value, layer, type, and CSS custom property.',
    inputSchema: z.object({
      query: z.string().min(1, 'Token query is required'),
      layer: z
        .enum(['core', 'semantic', 'component', 'mode', 'brand'])
        .optional()
        .describe('Optional layer filter to restrict results to a specific token layer'),
    }),
    handler: getTokenHandler,
  },
  {
    name: 'get_pattern',
    description:
      'Look up a composition pattern by name. Returns pattern documentation including purpose, structure, composition rules, interaction rules, accessibility considerations, and related tokens.',
    inputSchema: z.object({
      name: z.string().min(1, 'Pattern name is required'),
    }),
    handler: getPatternHandler,
  },
  {
    name: 'get_rule',
    description:
      'Retrieve a governance rule by category. Valid categories: naming, layering, theming, design-to-code, review, agent-readiness.',
    inputSchema: z.object({
      category: z.string().min(1, 'Rule category is required'),
    }),
    handler: getRuleHandler,
  },
  {
    name: 'validate_token_name',
    description:
      'Validate a token name against UI Foundations naming conventions. Returns whether the name is valid, any violations found, and a suggested corrected name if invalid.',
    inputSchema: z.object({
      name: z.string().min(1, 'Token name is required'),
    }),
    handler: validateTokenNameHandler,
  },
];
