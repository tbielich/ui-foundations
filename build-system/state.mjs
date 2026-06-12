/**
 * UI Foundations — Build State Model
 *
 * Central source of truth for build phases and metrics.
 * Processes events deterministically into a single state object.
 */

import { EVENT_TYPES, STAGE_STATUS, STAGE_ORDER, STAGE_LABELS } from './events.mjs';

// ─── Initial State ───────────────────────────────────────────────────────────

export function createInitialState(stages = STAGE_ORDER) {
  return {
    status: 'idle', // idle | running | success | failed
    startedAt: null,
    completedAt: null,
    durationMs: null,
    error: null,
    stages: Object.fromEntries(
      stages.map((id) => [
        id,
        {
          id,
          label: STAGE_LABELS[id] || id,
          status: STAGE_STATUS.WAIT,
          startedAt: null,
          completedAt: null,
          durationMs: null,
          progress: null, // { current, total, detail }
          error: null,
        },
      ])
    ),
    metrics: {
      icons: null,
      tokenFiles: null,
      missingCodeSyntax: null,
      unparseableCodeSyntax: null,
      duplicateCssVariables: null,
      missingAliasTargets: null,
      pages: null,
      assets: null,
      buildTime: null,
      serverUrl: null,
    },
    artifacts: {
      css: false,
      json: false,
      typescript: false,
      yaml: false,
      html: false,
      macros: false,
    },
    log: [], // last N log entries
    activeStage: null,
  };
}

// ─── State Reducer ───────────────────────────────────────────────────────────

const MAX_LOG_ENTRIES = 50;

export function reduceEvent(state, event) {
  switch (event.type) {
    case EVENT_TYPES.BUILD_START:
      return {
        ...state,
        status: 'running',
        startedAt: event.timestamp,
        error: null,
      };

    case EVENT_TYPES.BUILD_COMPLETE:
      // Never overwrite a failed state with complete
      if (state.status === 'failed') return state;
      return {
        ...state,
        status: 'success',
        completedAt: event.timestamp,
        durationMs: event.durationMs,
        activeStage: null,
      };

    case EVENT_TYPES.BUILD_FAIL:
      return {
        ...state,
        status: 'failed',
        completedAt: event.timestamp,
        durationMs: event.durationMs,
        error: event.error,
      };

    case EVENT_TYPES.STAGE_START:
      return {
        ...state,
        activeStage: event.stage,
        stages: {
          ...state.stages,
          [event.stage]: {
            ...state.stages[event.stage],
            status: STAGE_STATUS.RUN,
            startedAt: event.timestamp,
          },
        },
      };

    case EVENT_TYPES.STAGE_PROGRESS:
      return {
        ...state,
        stages: {
          ...state.stages,
          [event.stage]: {
            ...state.stages[event.stage],
            progress: {
              current: event.current,
              total: event.total,
              detail: event.detail,
            },
          },
        },
      };

    case EVENT_TYPES.STAGE_COMPLETE: {
      const stageStatus =
        event.status === 'warn' ? STAGE_STATUS.WARN : STAGE_STATUS.OK;
      return {
        ...state,
        stages: {
          ...state.stages,
          [event.stage]: {
            ...state.stages[event.stage],
            status: stageStatus,
            completedAt: event.timestamp,
            durationMs: event.durationMs,
          },
        },
      };
    }

    case EVENT_TYPES.STAGE_FAIL:
      return {
        ...state,
        status: 'failed',
        activeStage: event.stage,
        stages: {
          ...state.stages,
          [event.stage]: {
            ...state.stages[event.stage],
            status: STAGE_STATUS.FAIL,
            completedAt: event.timestamp,
            durationMs: event.durationMs,
            error: event.error,
          },
        },
      };

    case EVENT_TYPES.METRIC_UPDATE:
      return {
        ...state,
        metrics: {
          ...state.metrics,
          ...event.metrics,
        },
      };

    case EVENT_TYPES.ARTIFACT_CREATED:
      return {
        ...state,
        artifacts: {
          ...state.artifacts,
          [event.artifact]: true,
        },
      };

    case EVENT_TYPES.LOG_MESSAGE: {
      const entry = {
        timestamp: event.timestamp,
        stage: event.stage,
        level: event.level,
        message: event.message,
      };
      const log = [...state.log, entry].slice(-MAX_LOG_ENTRIES);
      return { ...state, log };
    }

    case EVENT_TYPES.SERVICE_START:
      return {
        ...state,
        activeStage: event.stage,
        stages: {
          ...state.stages,
          [event.stage]: {
            ...state.stages[event.stage],
            status: STAGE_STATUS.RUN,
            startedAt: event.timestamp,
          },
        },
      };

    case EVENT_TYPES.SERVICE_READY:
      return {
        ...state,
        stages: {
          ...state.stages,
          [event.stage]: {
            ...state.stages[event.stage],
            status: STAGE_STATUS.OK,
            completedAt: event.timestamp,
          },
        },
        metrics: {
          ...state.metrics,
          serverUrl: event.url,
        },
      };

    case EVENT_TYPES.SERVICE_STOP:
      return {
        ...state,
        stages: {
          ...state.stages,
          [event.stage]: {
            ...state.stages[event.stage],
            status: STAGE_STATUS.WAIT,
          },
        },
      };

    default:
      return state;
  }
}
