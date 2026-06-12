/**
 * UI Foundations — Terminal Reporter (Full MDA Dashboard)
 *
 * Single-frame renderer for wide interactive terminals (>= 96 cols).
 * Uses cursor movement to redraw one persistent frame in place.
 * All rows are width-verified using string-width.
 */

import { STAGE_ORDER, STAGE_LABELS, STAGE_STATUS } from '../events.mjs';
import { getBoxChars } from '../environment.mjs';
import { getTheme } from '../themes/mda.mjs';
import {
  createLayout,
  visibleWidth,
  truncateVisible,
  padRightVisible,
  padLeftVisible,
  centerVisible,
  renderFullRow,
  renderSplitRow,
  renderTopBorder,
  renderBottomBorder,
  renderMidSplit,
  renderMidFull,
  replaceEmojis,
} from '../grid.mjs';

// ─── Constants ───────────────────────────────────────────────────────────────

const PROGRESS_WIDTH = 10;
const MIN_RENDER_INTERVAL_MS = 60; // ~16 fps max

// ─── Terminal Reporter ───────────────────────────────────────────────────────

export class TerminalReporter {
  constructor(options = {}) {
    this.write = options.write || ((s) => process.stdout.write(s));
    this.env = options.env || {};
    this.theme = getTheme(options.themeName, options.env?.colorSupport ?? true);
    this.box = getBoxChars(this.env);
    this.version = options.version || '0.0.0';
    this.layout = createLayout(Math.min(options.env?.columns || 96, 96));
    this.lineCount = 0;
    this.lastRenderTime = 0;
    this.pendingRender = null;
    this.buildMode = options.buildMode || 'build'; // 'build' | 'dev'
    this.finalized = false;
  }

  onEvent(event, state) {
    if (this.finalized) return;

    switch (event.type) {
      case 'build:start':
        this.version = event.version || this.version;
        this._renderNow(state);
        break;

      case 'stage:start':
      case 'stage:complete':
      case 'stage:fail':
      case 'metric:update':
      case 'service:ready':
        this._scheduleRender(state);
        break;

      case 'stage:progress':
        // Throttle progress updates heavily
        break;

      case 'build:complete':
        this._cancelPending();
        this._redraw(state);
        this._renderFinalPanel(state);
        this.finalized = true;
        break;

      case 'build:fail':
        this._cancelPending();
        this._redraw(state);
        this._renderErrorPanel(state, event);
        this.finalized = true;
        break;

      default:
        break;
    }
  }

  // ─── Render Scheduling ───────────────────────────────────────────────

  _scheduleRender(state) {
    if (!this.env.isTTY) return;
    const now = Date.now();
    const elapsed = now - this.lastRenderTime;
    if (elapsed >= MIN_RENDER_INTERVAL_MS) {
      this._renderNow(state);
    } else if (!this.pendingRender) {
      this.pendingRender = setTimeout(() => {
        this.pendingRender = null;
        this._renderNow(state);
      }, MIN_RENDER_INTERVAL_MS - elapsed);
    }
  }

  _cancelPending() {
    if (this.pendingRender) {
      clearTimeout(this.pendingRender);
      this.pendingRender = null;
    }
  }

  _renderNow(state) {
    this.lastRenderTime = Date.now();
    if (this.env.isTTY) {
      this._redraw(state);
    }
  }

  _redraw(state) {
    this._clearPrevious();
    this._renderFrame(state);
  }

  _clearPrevious() {
    if (this.lineCount > 0 && this.env.isTTY) {
      // Move cursor to start of first line and clear all lines
      this.write(`\x1b[${this.lineCount}F`);
      this.write(`\x1b[J`); // clear from cursor to end of screen
    }
  }

  _renderFrame(state) {
    const lines = this._buildFrame(state);
    this.lineCount = lines.length;
    this.write(lines.join('\n') + '\n');
  }

  // ─── Frame Construction ──────────────────────────────────────────────

  _buildFrame(state) {
    const L = this.layout;
    const b = this.box;
    const t = this.theme;
    const c = t.colors;
    const lines = [];

    // ── Header ──
    lines.push(renderTopBorder(L, b, t));
    lines.push(this._headerLine1(state));
    lines.push(this._headerLine2(state));

    // ── Split: Pipeline | Diagnostics ──
    lines.push(renderMidSplit(L, b, t));

    const leftLines = this._pipelinePanel(state);
    const rightLines = this._diagnosticsPanel(state);
    const maxPanelRows = Math.max(leftLines.length, rightLines.length);

    for (let i = 0; i < maxPanelRows; i++) {
      const left = leftLines[i] || '';
      const right = rightLines[i] || '';
      lines.push(renderSplitRow(left, right, L, b, t));
    }

    // ── Activity Stream ──
    lines.push(renderMidFull(L, b, t));
    const actLines = this._activityLines(state);
    for (const line of actLines) {
      lines.push(renderFullRow(` ${padRightVisible(line, L.innerWidth - 1)}`, L, b, t));
    }

    // ── Bottom ──
    lines.push(renderBottomBorder(L, b, t));

    return lines;
  }

  _headerLine1(state) {
    const c = this.theme.colors;
    const L = this.layout;
    const b = this.box;

    const left = `${c.emphasis}UI FOUNDATIONS CONTROL SYSTEM${c.reset}`;
    const statusText = this._topLevelStatus(state);
    const right = `${c.muted}BUILD ${this.version} / ${statusText}${c.reset}`;
    const leftVis = visibleWidth(left);
    const rightVis = visibleWidth(right);
    const gap = L.innerWidth - 2 - leftVis - rightVis; // -2 for padding spaces
    const content = `${left}${' '.repeat(Math.max(1, gap))}${right}`;
    return renderFullRow(` ${padRightVisible(content, L.innerWidth - 1)}`, L, b, this.theme);
  }

  _headerLine2(state) {
    const c = this.theme.colors;
    const L = this.layout;
    const b = this.box;

    const left = `${c.muted}DESIGN SYSTEM COMPILER${c.reset}`;
    const nodeVer = process.version.replace('v', '').split('.')[0];
    const right = `${c.muted}NODE ${nodeVer}${c.reset}`;
    const leftVis = visibleWidth(left);
    const rightVis = visibleWidth(right);
    const gap = L.innerWidth - 2 - leftVis - rightVis;
    const content = `${left}${' '.repeat(Math.max(1, gap))}${right}`;
    return renderFullRow(` ${padRightVisible(content, L.innerWidth - 1)}`, L, b, this.theme);
  }

  _topLevelStatus(state) {
    switch (state.status) {
      case 'idle': return 'INITIALIZING';
      case 'running': return 'BUILDING';
      case 'success':
        if (this.buildMode === 'dev' && state.metrics.serverUrl) return 'ONLINE';
        return 'BUILD COMPLETE';
      case 'failed': return 'FAILED';
      default: return state.status.toUpperCase();
    }
  }

  // ─── Pipeline Panel (left) ───────────────────────────────────────────

  _pipelinePanel(state) {
    const c = this.theme.colors;
    const b = this.box;
    const lines = [];
    const stageIds = Object.keys(state.stages);

    lines.push(`${c.emphasis}PIPELINE${c.reset}`);

    let idx = 1;
    for (const id of stageIds) {
      const stg = state.stages[id];
      const num = `${c.muted}${String(idx).padStart(2, '0')}${c.reset}`;
      const label = (stg.label || id).toUpperCase();
      const bar = this._progressBar(stg.status);
      const tag = this._statusTag(stg.status);
      // Fixed structure: "NN LABEL....... [████████] TAG"
      const labelPadded = padRightVisible(label, 20);
      lines.push(`${num} ${labelPadded} [${bar}] ${tag}`);
      idx++;
    }

    return lines;
  }

  _progressBar(status) {
    const b = this.box;
    switch (status) {
      case STAGE_STATUS.OK: return b.blockFull.repeat(PROGRESS_WIDTH);
      case STAGE_STATUS.WARN: return b.blockFull.repeat(8) + b.warning.repeat(2);
      case STAGE_STATUS.RUN: return b.blockLight.repeat(PROGRESS_WIDTH);
      case STAGE_STATUS.FAIL: return b.cross_mark.repeat(PROGRESS_WIDTH);
      case STAGE_STATUS.WAIT:
      default: return b.blockEmpty.repeat(PROGRESS_WIDTH);
    }
  }

  _statusTag(status) {
    const c = this.theme.colors;
    switch (status) {
      case STAGE_STATUS.OK: return `${c.success}OK${c.reset}`;
      case STAGE_STATUS.WARN: return `${c.warning}WARN${c.reset}`;
      case STAGE_STATUS.RUN: return `${c.info}RUN${c.reset}`;
      case STAGE_STATUS.FAIL: return `${c.error}FAIL${c.reset}`;
      case STAGE_STATUS.WAIT: return `${c.muted}WAIT${c.reset}`;
      default: return `${c.muted}${status}${c.reset}`;
    }
  }

  // ─── Diagnostics Panel (right) ───────────────────────────────────────

  _diagnosticsPanel(state) {
    const c = this.theme.colors;
    const m = state.metrics;
    const lines = [];

    lines.push(`${c.emphasis}SYSTEM DIAGNOSTICS${c.reset}`);

    const entries = [
      ['ICONS REGISTERED', m.icons],
      ['TOKEN FILES', m.tokenFiles],
      ['MISSING CODESYNTAX', m.missingCodeSyntax, 'warn'],
      ['DUPLICATE VARIABLES', m.duplicateCssVariables, 'error'],
      ['GENERATED PAGES', m.pages],
      ['COPIED ASSETS', m.assets],
    ];

    for (const [label, value, severity] of entries) {
      const displayVal = value != null ? String(value) : '\u2014';
      let valColor = c.emphasis;
      if (value != null && value > 0 && severity === 'warn') valColor = c.warning;
      if (value != null && value > 0 && severity === 'error') valColor = c.error;
      const labelStr = `${c.foreground}${padRightVisible(label, 26)}${c.reset}`;
      const valStr = `${valColor}${padLeftVisible(displayVal, 6)}${c.reset}`;
      lines.push(`${labelStr}${valStr}`);
    }

    lines.push('');
    lines.push(`${c.emphasis}OUTPUT MATRIX${c.reset}`);

    const artifacts = [
      ['CSS', state.artifacts.css],
      ['JSON', state.artifacts.json],
      ['TYPESCRIPT', state.artifacts.typescript],
      ['YAML', state.artifacts.yaml],
      ['HTML', state.artifacts.html],
      ['MACROS', state.artifacts.macros],
    ];
    for (const [name, ready] of artifacts) {
      const status = ready
        ? `${c.success}READY${c.reset}`
        : `${c.muted}\u2014${c.reset}`;
      lines.push(`${c.foreground}${padRightVisible(name, 14)}${c.reset}${status}`);
    }

    return lines;
  }

  // ─── Activity Stream ─────────────────────────────────────────────────

  _activityLines(state) {
    const c = this.theme.colors;
    const maxLines = 5;
    // Filter to meaningful events only
    const meaningful = state.log.filter((e) =>
      e.level === 'error' || e.level === 'warn' || this._isMeaningfulInfo(e)
    );
    const entries = meaningful.slice(-maxLines);
    const lines = [];
    const contentWidth = this.layout.innerWidth - 3;

    for (const entry of entries) {
      const time = this._formatTime(entry.timestamp);
      const stage = padRightVisible((entry.stage || '').toUpperCase(), 7);
      const levelColor = entry.level === 'error' ? c.error
        : entry.level === 'warn' ? c.warning
          : c.muted;
      let msg = replaceEmojis(entry.message || '');
      msg = truncateVisible(msg, contentWidth - 20);
      lines.push(`${c.muted}${time}${c.reset} ${levelColor}[${stage}]${c.reset} ${msg}`);
    }

    // Ensure minimum height
    while (lines.length < 3) {
      lines.push('');
    }

    return lines;
  }

  _isMeaningfulInfo(entry) {
    if (!entry.message) return false;
    const msg = entry.message;
    // Filter out formatting noise
    if (/^[•\s]+css\/\*/.test(msg)) return false;
    if (/Extract report:/.test(msg)) return false;
    if (/^\s*$/.test(msg)) return false;
    // Keep meaningful messages
    if (/Generated|generated|Tokens|token|bundles|Macros|copied|Dist|Registry/i.test(msg)) return true;
    if (/pre-generated|Using/i.test(msg)) return true;
    if (/error|fail|warn/i.test(msg)) return true;
    return false;
  }

  _formatTime(ts) {
    if (!ts) return '        ';
    const d = new Date(ts);
    return d.toLocaleTimeString('en-GB', { hour12: false });
  }

  // ─── Final Panels ────────────────────────────────────────────────────

  _renderFinalPanel(state) {
    const c = this.theme.colors;
    const L = this.layout;
    const b = this.box;
    const m = state.metrics;
    const lines = [];

    lines.push('');
    lines.push(renderTopBorder(L, b, this.theme));
    lines.push(renderFullRow(centerVisible('', L.innerWidth), L, b, this.theme));

    if (this.buildMode === 'dev' && m.serverUrl) {
      // Dev mode: ONLINE
      const title = `${c.success}${c.bold}UI FOUNDATIONS ONLINE${c.reset}`;
      lines.push(renderFullRow(centerVisible(title, L.innerWidth), L, b, this.theme));
      lines.push(renderFullRow(centerVisible('', L.innerWidth), L, b, this.theme));

      const parts = [];
      if (m.missingCodeSyntax === 0 && m.duplicateCssVariables === 0) parts.push('TOKENS VALID');
      if (m.icons != null) parts.push(`${m.icons} ICONS`);
      if (m.pages != null) parts.push(`${m.pages} PAGES`);
      if (m.assets != null) parts.push(`${m.assets} ASSETS`);
      const summary = `${c.foreground}${parts.join('   ')}${c.reset}`;
      lines.push(renderFullRow(centerVisible(summary, L.innerWidth), L, b, this.theme));
      lines.push(renderFullRow(centerVisible('', L.innerWidth), L, b, this.theme));
      lines.push(renderFullRow(centerVisible(`${c.emphasis}SERVER ${m.serverUrl}${c.reset}`, L.innerWidth), L, b, this.theme));
      lines.push(renderFullRow(centerVisible(`${c.muted}WATCH MODE ACTIVE${c.reset}`, L.innerWidth), L, b, this.theme));
    } else {
      // Build mode: BUILD COMPLETE
      const title = `${c.success}${c.bold}BUILD COMPLETE${c.reset}`;
      lines.push(renderFullRow(centerVisible(title, L.innerWidth), L, b, this.theme));
      lines.push(renderFullRow(centerVisible('', L.innerWidth), L, b, this.theme));

      const parts = [];
      if (m.missingCodeSyntax === 0 && m.duplicateCssVariables === 0) parts.push('TOKENS VALID');
      if (m.icons != null) parts.push(`${m.icons} ICONS`);
      parts.push('ARTIFACTS READY');
      const summary = `${c.foreground}${parts.join('   ')}${c.reset}`;
      lines.push(renderFullRow(centerVisible(summary, L.innerWidth), L, b, this.theme));
      lines.push(renderFullRow(centerVisible('', L.innerWidth), L, b, this.theme));
      lines.push(renderFullRow(centerVisible(`${c.muted}BUILD TIME ${state.durationMs}ms${c.reset}`, L.innerWidth), L, b, this.theme));
    }

    lines.push(renderFullRow(centerVisible('', L.innerWidth), L, b, this.theme));
    lines.push(renderBottomBorder(L, b, this.theme));
    lines.push('');

    this.write(lines.join('\n') + '\n');
  }

  _renderErrorPanel(state, event) {
    const c = this.theme.colors;
    const L = this.layout;
    const b = this.box;
    const lines = [];

    const failedStage = Object.values(state.stages).find((s) => s.status === STAGE_STATUS.FAIL);

    lines.push('');
    lines.push(`${c.error}${b.topLeft}${b.horizontal} BUILD INTERRUPTED ${b.horizontal.repeat(L.innerWidth - 20)}${b.topRight}${c.reset}`);
    lines.push(renderFullRow(centerVisible('', L.innerWidth), L, b, this.theme));

    if (failedStage) {
      const stageInfo = `STAGE       ${failedStage.label || failedStage.id}`;
      lines.push(renderFullRow(` ${padRightVisible(stageInfo, L.innerWidth - 1)}`, L, b, this.theme));
    }
    lines.push(renderFullRow(` ${padRightVisible('STATUS      [FAIL]', L.innerWidth - 1)}`, L, b, this.theme));
    lines.push(renderFullRow(` ${padRightVisible('EXIT CODE   1', L.innerWidth - 1)}`, L, b, this.theme));
    lines.push(renderFullRow(centerVisible('', L.innerWidth), L, b, this.theme));

    if (event.error) {
      const errMsg = truncateVisible(event.error, L.innerWidth - 2);
      lines.push(renderFullRow(` ${padRightVisible(errMsg, L.innerWidth - 1)}`, L, b, this.theme));
    }

    lines.push(renderFullRow(centerVisible('', L.innerWidth), L, b, this.theme));
    lines.push(renderBottomBorder(L, b, this.theme));
    lines.push('');

    this.write(lines.join('\n') + '\n');
  }
}
