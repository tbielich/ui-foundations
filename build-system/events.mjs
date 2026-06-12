/**
 * UI Foundations — Build Event Schema
 *
 * Defines the event types, stage IDs, and factory functions
 * for the build system event model.
 */

// ─── Stage IDs ───────────────────────────────────────────────────────────────

export const STAGES = {
  ICONS: 'icons',
  TOKENS: 'tokens',
  CSS: 'css',
  MACROS: 'macros',
  BUNDLES: 'bundles',
  SITE: 'site',
  ASSETS: 'assets',
  SERVER: 'server',
};

export const STAGE_ORDER = [
  STAGES.ICONS,
  STAGES.TOKENS,
  STAGES.CSS,
  STAGES.MACROS,
  STAGES.BUNDLES,
  STAGES.SITE,
  STAGES.ASSETS,
  STAGES.SERVER,
];

export const STAGE_LABELS = {
  [STAGES.ICONS]: 'Icon Registry',
  [STAGES.TOKENS]: 'Token Extraction',
  [STAGES.CSS]: 'CSS Compilation',
  [STAGES.MACROS]: 'Macro Distribution',
  [STAGES.BUNDLES]: 'Bundle Generation',
  [STAGES.SITE]: 'Site Generation',
  [STAGES.ASSETS]: 'Asset Transfer',
  [STAGES.SERVER]: 'Development Server',
};

// ─── Event Types ─────────────────────────────────────────────────────────────

export const EVENT_TYPES = {
  BUILD_START: 'build:start',
  BUILD_COMPLETE: 'build:complete',
  BUILD_FAIL: 'build:fail',
  STAGE_START: 'stage:start',
  STAGE_PROGRESS: 'stage:progress',
  STAGE_COMPLETE: 'stage:complete',
  STAGE_FAIL: 'stage:fail',
  METRIC_UPDATE: 'metric:update',
  ARTIFACT_CREATED: 'artifact:created',
  LOG_MESSAGE: 'log:message',
  SERVICE_START: 'service:start',
  SERVICE_READY: 'service:ready',
  SERVICE_STOP: 'service:stop',
};

// ─── Stage Status ────────────────────────────────────────────────────────────

export const STAGE_STATUS = {
  WAIT: 'wait',
  RUN: 'run',
  OK: 'ok',
  WARN: 'warn',
  FAIL: 'fail',
  SKIP: 'skip',
};

// ─── Event Factory ───────────────────────────────────────────────────────────

function timestamp() {
  return new Date().toISOString();
}

export function buildStart(meta = {}) {
  return {
    type: EVENT_TYPES.BUILD_START,
    timestamp: timestamp(),
    ...meta,
  };
}

export function buildComplete(durationMs, meta = {}) {
  return {
    type: EVENT_TYPES.BUILD_COMPLETE,
    timestamp: timestamp(),
    durationMs,
    status: 'success',
    ...meta,
  };
}

export function buildFail(error, durationMs, meta = {}) {
  return {
    type: EVENT_TYPES.BUILD_FAIL,
    timestamp: timestamp(),
    durationMs,
    error: typeof error === 'string' ? error : error.message,
    ...meta,
  };
}

export function stageStart(stage, label) {
  return {
    type: EVENT_TYPES.STAGE_START,
    timestamp: timestamp(),
    stage,
    label: label || STAGE_LABELS[stage] || stage,
  };
}

export function stageProgress(stage, current, total, detail) {
  return {
    type: EVENT_TYPES.STAGE_PROGRESS,
    timestamp: timestamp(),
    stage,
    current,
    total,
    detail,
  };
}

export function stageComplete(stage, durationMs, status = 'success') {
  return {
    type: EVENT_TYPES.STAGE_COMPLETE,
    timestamp: timestamp(),
    stage,
    durationMs,
    status,
  };
}

export function stageFail(stage, error, durationMs) {
  return {
    type: EVENT_TYPES.STAGE_FAIL,
    timestamp: timestamp(),
    stage,
    durationMs,
    error: typeof error === 'string' ? error : error.message,
  };
}

export function metricUpdate(stage, metrics) {
  return {
    type: EVENT_TYPES.METRIC_UPDATE,
    timestamp: timestamp(),
    stage,
    metrics,
  };
}

export function artifactCreated(stage, artifact) {
  return {
    type: EVENT_TYPES.ARTIFACT_CREATED,
    timestamp: timestamp(),
    stage,
    artifact,
  };
}

export function logMessage(stage, level, message) {
  return {
    type: EVENT_TYPES.LOG_MESSAGE,
    timestamp: timestamp(),
    stage,
    level, // 'info' | 'warn' | 'error'
    message,
  };
}

export function serviceStart(stage, meta = {}) {
  return {
    type: EVENT_TYPES.SERVICE_START,
    timestamp: timestamp(),
    stage,
    ...meta,
  };
}

export function serviceReady(stage, url) {
  return {
    type: EVENT_TYPES.SERVICE_READY,
    timestamp: timestamp(),
    stage,
    url,
  };
}

export function serviceStop(stage) {
  return {
    type: EVENT_TYPES.SERVICE_STOP,
    timestamp: timestamp(),
    stage,
  };
}
