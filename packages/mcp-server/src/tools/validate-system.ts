/**
 * validate_system tool handler.
 *
 * Runs the project's ci:check pipeline and returns structured pass/fail
 * results. Enables agents to verify fixes in a loop.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import type { ToolResponse } from '../types.js';

const execAsync = promisify(exec);

/** Timeout for ci:check (2 minutes). */
const TIMEOUT_MS = 120_000;

export async function validateSystemHandler(args: unknown, rootPath: string): Promise<ToolResponse> {
  const { command } = args as { command?: string };
  const cmd = command || 'npm run ci:check';

  try {
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: rootPath,
      timeout: TIMEOUT_MS,
      env: { ...process.env, NODE_ENV: 'test', FORCE_COLOR: '0' },
    });

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          pass: true,
          command: cmd,
          stdout: stdout.slice(-3000),
          stderr: stderr.slice(-1000),
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; code?: number; message?: string };
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          pass: false,
          command: cmd,
          exitCode: e.code ?? 1,
          stdout: (e.stdout || '').slice(-3000),
          stderr: (e.stderr || e.message || '').slice(-2000),
        }, null, 2),
      }],
    };
  }
}
