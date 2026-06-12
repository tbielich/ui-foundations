/**
 * UI Foundations — Plain Reporter
 *
 * CI-safe, no ANSI, linear output.
 * No escape sequences, no cursor manipulation.
 */

import { STAGE_ORDER, STAGE_LABELS, STAGE_STATUS } from '../events.mjs';

// ─── Status Labels ───────────────────────────────────────────────────────────

const STATUS_TEXT = {
  [STAGE_STATUS.WAIT]: 'wait',
  [STAGE_STATUS.RUN]: 'run',
  [STAGE_STATUS.OK]: 'ok',
  [STAGE_STATUS.WARN]: 'warn',
  [STAGE_STATUS.FAIL]: 'FAIL',
  [STAGE_STATUS.SKIP]: 'skip',
};

// ─── Plain Reporter ──────────────────────────────────────────────────────────

export class PlainReporter {
  constructor(options = {}) {
    this.write = options.write || ((s) => process.stdout.write(s));
    this.version = options.version || '0.0.0';
    this.started = false;
  }

  onEvent(event, state) {
    switch (event.type) {
      case 'build:start':
        this.version = event.version || this.version;
        this.write(`[build] UI Foundations ${this.version}\n`);
        this.started = true;
        break;

      case 'stage:complete':
      case 'stage:fail': {
        const status = event.type === 'stage:fail' ? 'FAIL' : 'ok';
        const label = STAGE_LABELS[event.stage] || event.stage;
        const metrics = this._stageMetrics(event.stage, state);
        const duration = event.durationMs ? ` (${event.durationMs}ms)` : '';
        this.write(`[${status}] ${label}${metrics}${duration}\n`);
        break;
      }

      case 'build:complete': {
        const m = state.metrics;
        const parts = [];
        if (m.icons != null) parts.push(`${m.icons} icons`);
        if (m.tokenFiles != null) parts.push(`${m.tokenFiles} token files`);
        if (m.pages != null) parts.push(`${m.pages} pages`);
        if (m.assets != null) parts.push(`${m.assets} assets`);
        const summary = parts.length > 0 ? ` (${parts.join(', ')})` : '';
        this.write(`[done] Build complete in ${event.durationMs}ms${summary}\n`);
        if (m.serverUrl) {
          this.write(`[ready] ${m.serverUrl}\n`);
        }
        break;
      }

      case 'build:fail':
        this.write(`[FAIL] Build failed: ${event.error}\n`);
        break;

      case 'service:ready':
        this.write(`[ready] ${event.url}\n`);
        break;

      default:
        // Only log errors and warnings in plain mode
        if (event.type === 'log:message' && event.level === 'error') {
          this.write(`[error] ${event.message}\n`);
        }
        break;
    }
  }

  _stageMetrics(stage, state) {
    const m = state.metrics;
    switch (stage) {
      case 'icons':
        return m.icons != null ? `: ${m.icons} icons` : '';
      case 'tokens': {
        const parts = [];
        if (m.missingCodeSyntax != null) parts.push(`${m.missingCodeSyntax} missing`);
        if (m.duplicateCssVariables != null) parts.push(`${m.duplicateCssVariables} duplicates`);
        return parts.length > 0 ? `: ${parts.join(', ')}` : '';
      }
      case 'css':
        return m.tokenFiles != null ? `: ${m.tokenFiles} bundles` : '';
      case 'site': {
        const parts = [];
        if (m.pages != null) parts.push(`${m.pages} pages`);
        if (m.assets != null) parts.push(`${m.assets} assets`);
        return parts.length > 0 ? `: ${parts.join(', ')}` : '';
      }
      default:
        return '';
    }
  }
}
