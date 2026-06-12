/**
 * UI Foundations — JSON Report Exporter
 *
 * Writes a machine-readable build report to dist/reports/build-report.json.
 */

import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '../..');
const REPORT_DIR = path.join(REPO_ROOT, 'dist', 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'build-report.json');

/**
 * Generate and write the build report from final state.
 *
 * @param {Object} state - Final build state
 * @param {Object} options
 * @param {string} options.version - Package version
 * @param {boolean} options.isCI - Whether running in CI
 * @returns {string} Path to written report
 */
export function writeReport(state, options = {}) {
  const report = {
    version: options.version || '0.0.0',
    status: state.status,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    durationMs: state.durationMs,
    environment: {
      mode: options.serve ? 'dev' : 'local',
      node: process.version,
      ci: options.isCI || false,
      platform: process.platform,
    },
    metrics: {
      icons: state.metrics.icons,
      tokenFiles: state.metrics.tokenFiles,
      missingCodeSyntax: state.metrics.missingCodeSyntax,
      unparseableCodeSyntax: state.metrics.unparseableCodeSyntax,
      duplicateCssVariables: state.metrics.duplicateCssVariables,
      pages: state.metrics.pages,
      assets: state.metrics.assets,
    },
    artifacts: { ...state.artifacts },
    stages: Object.fromEntries(
      Object.entries(state.stages).map(([id, s]) => [
        id,
        {
          status: s.status,
          durationMs: s.durationMs,
          error: s.error || null,
        },
      ])
    ),
  };

  // Remove null metrics for cleaner output
  for (const [key, value] of Object.entries(report.metrics)) {
    if (value === null) delete report.metrics[key];
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');

  return REPORT_PATH;
}
