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
import { diagnoseDriftHandler } from '../tools/diagnose-drift.js';
import { applyTokenFixHandler } from '../tools/apply-token-fix.js';
import { validateSystemHandler } from '../tools/validate-system.js';

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
      'Look up published tokens by name, partial name, or CSS custom property. Performs case-insensitive substring matching and returns up to 50 results with name, value, layer, type, and CSS custom property.',
    inputSchema: z.object({
      query: z.string().min(1, 'Token query is required'),
      layer: z
        .enum(['core', 'semantic', 'component', 'mode', 'brand'])
        .optional()
        .describe('Optional layer filter to restrict results to a specific token layer'),
      includeUnpublished: z
        .boolean()
        .optional()
        .describe('Include variables marked hiddenFromPublishing in Figma exports. Defaults to false.'),
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
  {
    name: 'diagnose_drift',
    description:
      'Compare Figma export tokens with generated code tokens to identify drift (missing tokens, value mismatches, naming differences). Use this as the first step in an agent loop to detect what needs fixing.',
    inputSchema: z.object({
      layer: z
        .string()
        .optional()
        .describe('Optional filter to check only a specific Figma export file (substring match on filename)'),
    }),
    handler: diagnoseDriftHandler,
  },
  {
    name: 'apply_token_fix',
    description:
      'Apply a token correction to a Figma export file. Supports rename, update_value, and remove actions. After applying, call validate_system to verify the fix.',
    inputSchema: z.object({
      token: z.string().min(1, 'CSS token name (without --) to target'),
      action: z.enum(['rename', 'update_value', 'remove']),
      newValue: z.unknown().optional().describe('New value for update_value action'),
      newName: z.string().optional().describe('New CSS name (without --) for rename action'),
      file: z.string().optional().describe('Target file in figma/exports/ (defaults to Semantics (Roles).tokens.json)'),
    }),
    handler: applyTokenFixHandler,
  },
  {
    name: 'validate_system',
    description:
      'Run the project CI check pipeline and return structured pass/fail. Use after apply_token_fix to verify changes, or independently to check system health.',
    inputSchema: z.object({
      command: z
        .string()
        .optional()
        .describe('Custom command to run (defaults to npm run ci:check)'),
    }),
    handler: validateSystemHandler,
  },
];
