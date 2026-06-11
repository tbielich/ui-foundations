/**
 * load_context prompt handler for the UI Foundations MCP Server.
 *
 * Returns a prompt template that lists file paths from `docs/context-manifest.json`
 * ordered by ascending priority. Includes task-type-specific contextDirectories
 * alongside the base contextFiles sequence.
 *
 * Requirements: 16.1, 16.2, 16.3, 16.4
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { PromptResponse } from '../types.js';

/** Valid task_type values for the load_context prompt. */
const VALID_TASK_TYPES = [
  'implementation',
  'audit',
  'token-proposal',
  'pattern-discovery',
] as const;

type TaskType = (typeof VALID_TASK_TYPES)[number];

/** Relative path to the context manifest from the repository root. */
const MANIFEST_PATH = 'docs/context-manifest.json';

/**
 * Maps each task type to the relevant contextDirectory keys from the manifest.
 *
 * Each task type requires different directories in addition to the base contextFiles.
 */
const TASK_TYPE_DIRECTORIES: Record<TaskType, string[]> = {
  'implementation': ['foundations', 'components', 'patterns', 'agentic', 'steering'],
  'audit': ['foundations', 'validation', 'agentic', 'steering'],
  'token-proposal': ['foundations', 'principles', 'validation'],
  'pattern-discovery': ['foundations', 'principles', 'patterns', 'components', 'steering'],
};

/** Structure of a single contextFile entry in the manifest. */
interface ContextFileEntry {
  path: string;
  purpose: string;
  priority: number;
}

/** Structure of a single contextDirectory entry in the manifest. */
interface ContextDirectoryEntry {
  path: string;
  purpose: string;
}

/** Expected top-level structure of the context manifest. */
interface ContextManifest {
  contextFiles: Record<string, ContextFileEntry>;
  contextDirectories: Record<string, ContextDirectoryEntry>;
}

/**
 * Handler for the `load_context` prompt.
 *
 * @param args - Prompt arguments (must contain `task_type` string).
 * @param rootPath - Absolute path to the repository root.
 * @returns PromptResponse with messages containing the ordered context file list.
 */
export async function loadContextHandler(
  args: Record<string, string>,
  rootPath: string,
): Promise<PromptResponse> {
  const taskType = args.task_type;

  // Validate task_type argument
  if (!taskType || !VALID_TASK_TYPES.includes(taskType as TaskType)) {
    throw new Error(
      `Invalid task_type: "${taskType ?? ''}". Valid values are: ${VALID_TASK_TYPES.join(', ')}`,
    );
  }

  // Read the context manifest
  let manifest: ContextManifest;
  try {
    const manifestPath = join(rootPath, MANIFEST_PATH);
    const raw = await readFile(manifestPath, 'utf8');
    manifest = JSON.parse(raw) as ContextManifest;
  } catch {
    throw new Error(
      'Context manifest unavailable. Unable to read or parse docs/context-manifest.json.',
    );
  }

  // Validate manifest structure
  if (!manifest.contextFiles || !manifest.contextDirectories) {
    throw new Error(
      'Context manifest unavailable. Unable to read or parse docs/context-manifest.json.',
    );
  }

  // Sort contextFiles by ascending priority
  const sortedFiles = Object.entries(manifest.contextFiles)
    .map(([key, entry]) => ({ key, ...entry }))
    .sort((a, b) => a.priority - b.priority);

  // Get task-type-specific directories
  const directoryKeys = TASK_TYPE_DIRECTORIES[taskType as TaskType];
  const directories = directoryKeys
    .map((key) => {
      const dir = manifest.contextDirectories[key];
      return dir ? { key, ...dir } : null;
    })
    .filter((d): d is { key: string; path: string; purpose: string } => d !== null);

  // Build the prompt content
  const lines: string[] = [
    `# UI Foundations Context Loading Order`,
    ``,
    `Task type: **${taskType}**`,
    ``,
    `## Base Context Files (load in this order)`,
    ``,
  ];

  for (const file of sortedFiles) {
    lines.push(`${file.priority}. \`${file.path}\` — ${file.purpose}`);
  }

  lines.push('');
  lines.push(`## Task-Specific Context Directories`);
  lines.push('');
  lines.push(`The following directories contain additional context relevant to **${taskType}** tasks:`);
  lines.push('');

  for (const dir of directories) {
    lines.push(`- \`${dir.path}\` — ${dir.purpose}`);
  }

  lines.push('');
  lines.push(`## Instructions`);
  lines.push('');
  lines.push(`1. Load the base context files in the numbered order above (priority 1 first).`);
  lines.push(`2. After loading base context, consult the task-specific directories as needed.`);
  lines.push(`3. Follow the governance rules and agent behavior guidelines from the loaded context.`);

  const text = lines.join('\n');

  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text,
        },
      },
    ],
  };
}
