/**
 * UI Foundations — Build Orchestrator
 *
 * Spawns child processes for each build stage, captures output,
 * and emits structured events. No rendering logic here.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { STAGES } from './events.mjs';
import * as events from './events.mjs';
import { normalizeLine } from './normalizer.mjs';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');

// ─── Stage Definitions ───────────────────────────────────────────────────────

/**
 * Each stage defines the command to run and which stage ID it maps to.
 * Stages run sequentially in the order defined here.
 */
const BUILD_STAGES = [
  {
    id: STAGES.ICONS,
    command: 'node',
    args: ['scripts/generate-icon-list.mjs'],
  },
  {
    id: STAGES.TOKENS,
    command: 'node',
    args: ['scripts/extract-tokens.js'],
  },
  {
    id: STAGES.CSS,
    command: 'node',
    args: ['scripts/build-css.mjs'],
  },
];

const SITE_STAGE = {
  id: STAGES.SITE,
  command: 'npx',
  args: ['eleventy'],
};

const DEV_STAGE = {
  id: STAGES.SITE,
  command: 'npx',
  args: ['eleventy', '--serve'],
};

// ─── Orchestrator ────────────────────────────────────────────────────────────

/**
 * Run the build pipeline, emitting events via the callback.
 *
 * @param {Function} emit - Called with each event object
 * @param {Object} options
 * @param {boolean} options.includeSite - Include Eleventy site build
 * @param {boolean} options.serve - Run Eleventy in serve mode (long-running)
 * @param {AbortSignal} options.signal - For cancellation
 * @returns {Promise<{exitCode: number}>}
 */
export async function runBuild(emit, options = {}) {
  const { includeSite = false, serve = false, signal } = options;
  const buildStart = Date.now();

  emit(events.buildStart({
    version: await getPackageVersion(),
    mode: serve ? 'dev' : 'build',
  }));

  // Determine stages to run
  const stages = [...BUILD_STAGES];
  if (includeSite || serve) {
    stages.push(serve ? DEV_STAGE : SITE_STAGE);
  }

  let failedStage = null;

  for (const stage of stages) {
    if (signal?.aborted) {
      emit(events.buildFail('Aborted', Date.now() - buildStart));
      return { exitCode: 130 };
    }

    const stageStart = Date.now();
    emit(events.stageStart(stage.id));

    try {
      const exitCode = await runStage(stage, emit, signal);
      const stageDuration = Date.now() - stageStart;

      if (exitCode !== 0) {
        emit(events.stageFail(stage.id, `Exit code ${exitCode}`, stageDuration));
        failedStage = stage.id;
        break;
      }

      emit(events.stageComplete(stage.id, stageDuration));
    } catch (err) {
      const stageDuration = Date.now() - stageStart;
      emit(events.stageFail(stage.id, err, stageDuration));
      failedStage = stage.id;
      break;
    }
  }

  const totalDuration = Date.now() - buildStart;

  if (failedStage) {
    emit(events.buildFail(`Stage "${failedStage}" failed`, totalDuration));
    return { exitCode: 1 };
  }

  emit(events.buildComplete(totalDuration));
  return { exitCode: 0 };
}

// ─── Stage Runner ────────────────────────────────────────────────────────────

function runStage(stage, emit, signal) {
  return new Promise((resolve, reject) => {
    const proc = spawn(stage.command, stage.args, {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '0' },
      signal,
    });

    let stdoutBuffer = '';
    let stderrBuffer = '';

    proc.stdout.on('data', (chunk) => {
      stdoutBuffer += chunk.toString();
      const lines = stdoutBuffer.split('\n');
      stdoutBuffer = lines.pop(); // keep incomplete line in buffer

      for (const line of lines) {
        const normalized = normalizeLine(line, stage.id, 'stdout');
        for (const event of normalized) {
          emit(event);
        }
      }
    });

    proc.stderr.on('data', (chunk) => {
      stderrBuffer += chunk.toString();
      const lines = stderrBuffer.split('\n');
      stderrBuffer = lines.pop();

      for (const line of lines) {
        const normalized = normalizeLine(line, stage.id, 'stderr');
        for (const event of normalized) {
          emit(event);
        }
      }
    });

    proc.on('close', (code) => {
      // Flush remaining buffers
      if (stdoutBuffer.trim()) {
        const normalized = normalizeLine(stdoutBuffer, stage.id, 'stdout');
        for (const event of normalized) emit(event);
      }
      if (stderrBuffer.trim()) {
        const normalized = normalizeLine(stderrBuffer, stage.id, 'stderr');
        for (const event of normalized) emit(event);
      }
      resolve(code ?? 0);
    });

    proc.on('error', (err) => {
      if (err.code === 'ABORT_ERR') {
        resolve(130);
      } else {
        reject(err);
      }
    });
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getPackageVersion() {
  try {
    const { readFile } = await import('node:fs/promises');
    const pkg = JSON.parse(await readFile(path.join(REPO_ROOT, 'package.json'), 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}
