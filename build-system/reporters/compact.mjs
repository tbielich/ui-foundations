/**
 * UI Foundations — Compact Reporter
 *
 * Single-line-per-stage status display for medium-width terminals (60–95 cols).
 * Uses ANSI colors but no cursor manipulation.
 */

import { STAGE_ORDER, STAGE_LABELS, STAGE_STATUS } from '../events.mjs';
import { getBoxChars } from '../environment.mjs';
import { getTheme } from '../themes/mda.mjs';
import { visibleWidth, padRightVisible, truncateVisible, replaceEmojis } from '../grid.mjs';

// ─── Status Tags ─────────────────────────────────────────────────────────────

function statusTag(status, theme) {
  const c = theme.colors;
  switch (status) {
    case STAGE_STATUS.OK: return `${c.success}[OK]${c.reset}`;
    case STAGE_STATUS.RUN: return `${c.info}[RUN]${c.reset}`;
    case STAGE_STATUS.WAIT: return `${c.muted}[WAIT]${c.reset}`;
    case STAGE_STATUS.WARN: return `${c.warning}[WARN]${c.reset}`;
    case STAGE_STATUS.FAIL: return `${c.error}[FAIL]${c.reset}`;
    case STAGE_STATUS.SKIP: return `${c.muted}[SKIP]${c.reset}`;
    default: return `[${status}]`;
  }
}

// ─── Compact Reporter ────────────────────────────────────────────────────────

export class CompactReporter {
  constructor(options = {}) {
    this.write = options.write || ((s) => process.stdout.write(s));
    this.env = options.env || {};
    this.theme = getTheme(options.themeName, options.env?.colorSupport ?? true);
    this.box = getBoxChars(this.env);
    this.version = options.version || '0.0.0';
    this.width = Math.min(options.env?.columns || 80, 95);
    this.headerPrinted = false;
  }

  onEvent(event, state) {
    switch (event.type) {
      case 'build:start':
        this.version = event.version || this.version;
        this._printHeader();
        break;

      case 'stage:start':
        this._printStage(event.stage, state);
        break;

      case 'stage:complete':
      case 'stage:fail':
        this._printStage(event.stage, state);
        break;

      case 'build:complete':
        this._printFooter(state);
        break;

      case 'build:fail':
        this._printError(state, event);
        break;

      case 'service:ready':
        this._printServiceReady(event);
        break;

      default:
        break;
    }
  }

  _printHeader() {
    const c = this.theme.colors;
    const b = this.box;
    const inner = this.width - 4;
    const title = ` UI FOUNDATIONS ${this.version} `;
    const padding = inner - title.length;
    const line = b.sHorizontal.repeat(Math.max(0, padding));

    this.write(`${c.emphasis}${b.sTopLeft}${b.sHorizontal}${title}${line}${b.sTopRight}${c.reset}\n`);
    this.headerPrinted = true;
  }

  _printStage(stageId, state) {
    const stageState = state.stages[stageId];
    if (!stageState) return;

    const c = this.theme.colors;
    const b = this.box;
    const tag = statusTag(stageState.status, this.theme);
    const label = (STAGE_LABELS[stageId] || stageId).toUpperCase().padEnd(16);
    const metrics = this._stageMetrics(stageId, state);

    const inner = this.width - 4;
    const content = ` ${tag} ${label}${metrics}`;
    // Pad to fill width (approximate, ignoring ANSI escape length)
    this.write(`${c.foreground}${b.sVertical}${content.padEnd(inner + 20)}${b.sVertical}${c.reset}\n`);
  }

  _printFooter(state) {
    const c = this.theme.colors;
    const b = this.box;
    const inner = this.width - 4;
    const m = state.metrics;

    const parts = [];
    if (m.icons != null) parts.push(`${m.icons} icons`);
    if (m.pages != null) parts.push(`${m.pages} pages`);
    if (state.durationMs != null) parts.push(`${state.durationMs}ms`);

    const summary = parts.join(' · ');
    this.write(`${c.foreground}${b.sVertical} ${c.success}BUILD COMPLETE${c.reset}${c.foreground}  ${summary.padEnd(inner - 16)}${b.sVertical}${c.reset}\n`);
    this.write(`${c.emphasis}${b.sBottomLeft}${b.sHorizontal.repeat(inner)}${b.sBottomRight}${c.reset}\n`);
  }

  _printError(state, event) {
    const c = this.theme.colors;
    const b = this.box;
    const inner = this.width - 4;
    this.write(`${c.foreground}${b.sVertical} ${c.error}BUILD FAILED${c.reset}${c.foreground}  ${(event.error || '').slice(0, inner - 14).padEnd(inner - 14)}${b.sVertical}${c.reset}\n`);
    this.write(`${c.emphasis}${b.sBottomLeft}${b.sHorizontal.repeat(inner)}${b.sBottomRight}${c.reset}\n`);
  }

  _printServiceReady(event) {
    const c = this.theme.colors;
    const b = this.box;
    this.write(`${c.foreground}${b.sVertical} ${c.success}[READY]${c.reset}${c.foreground} ${event.url}${c.reset}\n`);
  }

  _stageMetrics(stageId, state) {
    const m = state.metrics;
    switch (stageId) {
      case 'icons':
        return m.icons != null ? `${m.icons}` : '';
      case 'tokens': {
        if (m.missingCodeSyntax === 0 && m.duplicateCssVariables === 0) return '0 errors';
        const parts = [];
        if (m.missingCodeSyntax > 0) parts.push(`${m.missingCodeSyntax} missing`);
        if (m.duplicateCssVariables > 0) parts.push(`${m.duplicateCssVariables} dupes`);
        return parts.join(', ') || '';
      }
      case 'css':
        return m.tokenFiles != null ? `${m.tokenFiles} bundles` : '';
      case 'site': {
        if (m.pages != null) return `${m.pages} pages`;
        const stageState = state.stages[stageId];
        if (stageState?.progress?.detail) return stageState.progress.detail.split(':')[1]?.trim() || '';
        return '';
      }
      default:
        return '';
    }
  }
}
