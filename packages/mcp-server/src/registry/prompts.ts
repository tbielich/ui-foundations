/**
 * Prompt registry definitions for the UI Foundations MCP Server.
 *
 * Declarative array of all prompt entries. Each entry specifies a name,
 * description, argument definitions, and handler function.
 *
 * @module registry/prompts
 */

import type { PromptRegistryEntry } from '../types.js';
import { loadContextHandler } from '../prompts/load-context.js';
import { implementComponentHandler } from '../prompts/implement-component.js';
import { proposeTokenHandler } from '../prompts/propose-token.js';

/**
 * All registered prompt entries.
 *
 * Prompts:
 * - load_context: Loads correct context in priority order based on task type
 * - implement_component: Guides component creation following the 10-surface workflow
 * - propose_token: Guides token creation proposals with layer-specific naming guidance
 */
export const prompts: PromptRegistryEntry[] = [
  {
    name: 'load_context',
    description: 'Loads correct context in priority order based on task type',
    arguments: [
      {
        name: 'task_type',
        description:
          'The type of task to load context for. One of: implementation, audit, token-proposal, pattern-discovery',
        required: true,
      },
    ],
    handler: loadContextHandler,
  },
  {
    name: 'implement_component',
    description: 'Guides component creation following the 10-surface workflow',
    arguments: [
      {
        name: 'name',
        description:
          'Component name (lowercase letters and hyphens only)',
        required: true,
      },
    ],
    handler: implementComponentHandler,
  },
  {
    name: 'propose_token',
    description: 'Guides token creation proposals with layer-specific naming guidance',
    arguments: [
      {
        name: 'layer',
        description: 'Token layer. One of: core, semantic, component, mode',
        required: true,
      },
      {
        name: 'purpose',
        description:
          'Free-text description of the token\'s intended use (max 500 characters)',
        required: true,
      },
    ],
    handler: proposeTokenHandler,
  },
];
