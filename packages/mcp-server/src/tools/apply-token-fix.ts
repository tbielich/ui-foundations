/**
 * apply_token_fix tool handler.
 *
 * Applies a proposed token correction to the appropriate source file.
 * Supports renaming a token or updating its value in the Figma export JSON.
 * After applying, the agent should call validate_system to verify the fix.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ToolResponse } from '../types.js';

type FixAction = 'rename' | 'update_value' | 'add' | 'remove';

/**
 * Traverses a DTCG object to find and modify a token by its codeSyntax.WEB name.
 * Returns true if the token was found and modified.
 */
function findAndModify(
  obj: Record<string, unknown>,
  targetCssName: string,
  action: FixAction,
  newValue?: unknown,
  newName?: string,
): boolean {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const node = value as Record<string, unknown>;
    if (!node || typeof node !== 'object') continue;

    if ('$value' in node) {
      const extensions = node['$extensions'] as Record<string, unknown> | undefined;
      const codeSyntax = extensions?.['com.figma.codeSyntax'] as Record<string, string> | undefined;
      const webName = codeSyntax?.['WEB']?.replace(/^var\(--/, '').replace(/\)$/, '');

      if (webName === targetCssName) {
        if (action === 'update_value') {
          node['$value'] = newValue;
          return true;
        }
        if (action === 'remove') {
          delete obj[key];
          return true;
        }
        if (action === 'rename' && newName && codeSyntax) {
          codeSyntax['WEB'] = `var(--${newName})`;
          return true;
        }
        return false;
      }
    } else {
      if (findAndModify(node, targetCssName, action, newValue, newName)) return true;
    }
  }
  return false;
}

export async function applyTokenFixHandler(args: unknown, rootPath: string): Promise<ToolResponse> {
  const { token, action, newValue, newName, file } = args as {
    token: string;
    action: FixAction;
    newValue?: unknown;
    newName?: string;
    file?: string;
  };

  // Determine target file
  const figmaDir = join(rootPath, 'figma/exports');
  const targetFile = file
    ? join(figmaDir, file)
    : join(figmaDir, 'Semantics (Roles).tokens.json');

  // Read current content
  let content: string;
  try {
    content = await readFile(targetFile, 'utf8');
  } catch {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: `Cannot read ${file || 'Semantics (Roles).tokens.json'}` }) }],
      isError: true,
    };
  }

  const parsed = JSON.parse(content) as Record<string, unknown>;

  // Apply the fix
  const success = findAndModify(parsed, token, action, newValue, newName);

  if (!success) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: `Token "${token}" not found in ${file || 'Semantics (Roles).tokens.json'}` }) }],
      isError: true,
    };
  }

  // Write back
  await writeFile(targetFile, JSON.stringify(parsed, null, 2) + '\n', 'utf8');

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        action,
        token,
        file: file || 'Semantics (Roles).tokens.json',
        ...(newValue !== undefined && { newValue }),
        ...(newName && { newName }),
        nextStep: 'Run validate_system to verify the fix, then diagnose_drift to confirm resolution.',
      }, null, 2),
    }],
  };
}
