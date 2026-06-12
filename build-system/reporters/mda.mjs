/**
 * UI Foundations — MDA Linear Reporter
 *
 * Structured, linear build log inspired by DOS/MDA terminals.
 * Each build step is printed exactly once. No cursor movement,
 * no frame redraws, no animations.
 *
 * Architecture: events flow in → formatted text flows out (once).
 */

import { STAGES, STAGE_LABELS, STAGE_STATUS, EVENT_TYPES } from '../events.mjs';
import { getBoxChars } from '../environment.mjs';
import { getTheme } from '../themes/mda.mjs';
import { aggregatePages } from '../normalizer.mjs';
import {
  formatHeader,
  formatSectionTitle,
  formatMetricRow,
  formatSeparator,
  formatBuildComplete,
  formatBuildFailed,
  formatNote,
  formatOnline,
} from '../format.mjs';

// ─── Stage → Section Number ──────────────────────────────────────────────────

const SECTION_NUMBERS = {
  [STAGES.ICONS]: 1,
  [STAGES.TOKENS]: 2,
  [STAGES.CSS]: 3,
  [STAGES.SITE]: 5,
  [STAGES.SERVER]: 6,
};

const SECTION_LABELS = {
  [STAGES.ICONS]: 'ICONS',
  [STAGES.TOKENS]: 'TOKENS',
  [STAGES.CSS]: 'DISTRIBUTION',
  [STAGES.SITE]: 'DOCS',
  [STAGES.SERVER]: 'DEV SERVER',
};

// Build mode inserts a token integrity section [03] between tokens [02] and css [04]
const BUILD_SECTION_NUMBERS = {
  [STAGES.ICONS]: 1,
  [STAGES.TOKENS]: 2,
  // Token integrity is rendered as part of TOKENS stage completion
  [STAGES.CSS]: 4,
  [STAGES.SITE]: 5,
  [STAGES.SERVER]: 6,
};

// ─── MDA Reporter ────────────────────────────────────────────────────────────

export class MdaReporter {
  constructor(options = {}) {
    this.write = options.write || ((s) => process.stdout.write(s));
    this.env = options.env || {};
    this.theme = getTheme(options.themeName, options.env?.colorSupport ?? true);
    this.version = options.version || '0.0.0';
    this.buildMode = options.buildMode || 'build';
    this.verbose = options.verbose || false;

    // Track which sections have been printed
    this._printedSections = new Set();
    this._siteProgressEvents = [];
    this._headerPrinted = false;
  }

  onEvent(event, state) {
    switch (event.type) {
      case EVENT_TYPES.BUILD_START:
        this.version = event.version || this.version;
        this._printHeader();
        break;

      case EVENT_TYPES.STAGE_COMPLETE:
        this._printStageResult(event.stage, state);
        break;

      case EVENT_TYPES.STAGE_FAIL:
        this._printStageResult(event.stage, state);
        break;

      case EVENT_TYPES.STAGE_PROGRESS:
        // Collect site progress events for aggregation
        if (event.stage === STAGES.SITE) {
          this._siteProgressEvents.push(event);
        }
        break;

      case EVENT_TYPES.BUILD_COMPLETE:
        this._printBuildComplete(state, event.durationMs);
        break;

      case EVENT_TYPES.BUILD_FAIL:
        this._printBuildFailed(state, event);
        break;

      case EVENT_TYPES.SERVICE_READY:
        this._printServerReady(event, state);
        break;

      case EVENT_TYPES.LOG_MESSAGE:
        if (this.verbose) {
          this._printLogMessage(event);
        }
        break;

      default:
        break;
    }
  }

  // ─── Header ──────────────────────────────────────────────────────────

  _printHeader() {
    if (this._headerPrinted) return;
    this._headerPrinted = true;

    const c = this.theme.colors;
    this.write(`${c.emphasis}${formatHeader(this.version, this.env)}${c.reset}`);
  }

  // ─── Stage Results ───────────────────────────────────────────────────

  _printStageResult(stageId, state) {
    if (this._printedSections.has(stageId)) return;
    this._printedSections.add(stageId);

    const stageState = state.stages[stageId];
    if (!stageState) return;

    const isFail = stageState.status === STAGE_STATUS.FAIL;
    const c = this.theme.colors;

    switch (stageId) {
      case STAGES.ICONS:
        this._printIconSection(state, isFail, c);
        break;
      case STAGES.TOKENS:
        this._printTokenSection(state, isFail, c);
        break;
      case STAGES.CSS:
        this._printDistributionSection(state, isFail, c);
        break;
      case STAGES.SITE:
        this._printDocumentationSection(state, isFail, c);
        break;
      default:
        break;
    }
  }

  _printIconSection(state, isFail, c) {
    const m = state.metrics;
    const status = isFail ? 'FAIL' : 'OK';
    const color = isFail ? c.error : c.success;

    this.write(`${color}${formatSectionTitle(1, 'ICONS', status)}${c.reset}`);

    if (m.icons != null) {
      this.write(formatMetricRow('Entries', m.icons));
    }
    this.write(formatMetricRow('Output', 'icon-names.ts'));
  }

  _printTokenSection(state, isFail, c) {
    const m = state.metrics;
    const a = state.artifacts;

    // [02] TOKENS
    this.write(formatSectionTitle(2, 'TOKENS'));
    this.write(formatMetricRow('CSS', a.css ? 'READY' : 'PENDING'));
    this.write(formatMetricRow('JSON', a.json ? 'READY' : 'PENDING'));
    this.write(formatMetricRow('TypeScript', a.typescript ? 'READY' : 'PENDING'));
    this.write(formatMetricRow('YAML', a.yaml ? 'READY' : 'PENDING'));

    // [03] INTEGRITY
    const hasIssues = (m.missingCodeSyntax > 0 || m.duplicateCssVariables > 0);
    const status = isFail ? 'FAIL' : hasIssues ? 'WARN' : 'OK';
    const color = isFail ? c.error : hasIssues ? c.warning : c.success;

    this.write(`${color}${formatSectionTitle(3, 'INTEGRITY', status)}${c.reset}`);
    this.write(formatMetricRow('Missing WEB', m.missingCodeSyntax ?? 0));
    this.write(formatMetricRow('Unparseable WEB', m.unparseableCodeSyntax ?? 0));
    this.write(formatMetricRow('Duplicate vars', m.duplicateCssVariables ?? 0));
  }

  _printDistributionSection(state, isFail, c) {
    const m = state.metrics;
    const a = state.artifacts;

    const status = isFail ? 'FAIL' : 'OK';
    const color = isFail ? c.error : c.success;

    this.write(`${color}${formatSectionTitle(4, 'DIST', status)}${c.reset}`);
    this.write(formatMetricRow('Token CSS', m.tokenFiles ?? 0));
    this.write(formatMetricRow('Macros', a.macros ? 'READY' : 'PENDING'));
    this.write(formatMetricRow('Bundles', a.css ? 'READY' : 'PENDING'));
  }

  _printDocumentationSection(state, isFail, c) {
    const m = state.metrics;

    const status = isFail ? 'FAIL' : 'OK';
    const color = isFail ? c.error : c.success;

    this.write(`${color}${formatSectionTitle(5, 'DOCS', status)}${c.reset}`);

    // Aggregate pages by category
    const categories = aggregatePages(this._siteProgressEvents);
    if (categories.Foundations > 0) this.write(formatMetricRow('Foundations', categories.Foundations));
    if (categories.Components > 0) this.write(formatMetricRow('Components', categories.Components));
    if (categories.Playgrounds > 0) this.write(formatMetricRow('Playgrounds', categories.Playgrounds));
    if (categories.Examples > 0) this.write(formatMetricRow('Examples', categories.Examples));
    const systemPages = (categories.System || 0) + (categories.Tokens || 0);
    if (systemPages > 0) this.write(formatMetricRow('System', systemPages));

    this.write('\n');
    if (m.pages != null) this.write(formatMetricRow('Pages', m.pages));
    if (m.assets != null) this.write(formatMetricRow('Assets', m.assets));
    if (m.buildTime != null) this.write(formatMetricRow('Time', `${m.buildTime}s`));
  }

  // ─── Server Ready ────────────────────────────────────────────────────

  _printServerReady(event, state) {
    const c = this.theme.colors;

    this.write(`${c.success}${formatSectionTitle(6, 'DEV SERVER', 'RUN')}${c.reset}`);
    this.write(formatMetricRow('URL', event.url || 'http://localhost:8080/'));
    this.write(formatMetricRow('Watch', 'ACTIVE'));

    // Final online banner
    this.write(formatSeparator(this.env));
    this.write(`${c.success}${formatOnline()}${c.reset}`);
  }

  // ─── Build Complete / Failed ─────────────────────────────────────────

  _printBuildComplete(state, durationMs) {
    const c = this.theme.colors;
    this.write(formatSeparator(this.env));
    this.write(`${c.success}${formatBuildComplete(durationMs)}${c.reset}`);
  }

  _printBuildFailed(state, event) {
    const c = this.theme.colors;
    // Find the failed stage
    const failedStage = Object.values(state.stages).find(
      (s) => s.status === STAGE_STATUS.FAIL
    );
    const stageName = failedStage
      ? (SECTION_LABELS[failedStage.id] || STAGE_LABELS[failedStage.id] || failedStage.id)
      : 'UNKNOWN';

    this.write(formatSeparator(this.env));
    this.write(`${c.error}${formatBuildFailed(stageName, 1, event.error)}${c.reset}`);
  }

  // ─── Log Messages ───────────────────────────────────────────────────

  _printLogMessage(event) {
    const c = this.theme.colors;
    const levelColor = event.level === 'error' ? c.error
      : event.level === 'warn' ? c.warning
        : c.muted;
    this.write(`${levelColor}  ${event.level.toUpperCase().padEnd(5)} ${event.message}${c.reset}\n`);
  }
}
