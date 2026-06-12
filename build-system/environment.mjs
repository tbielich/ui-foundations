/**
 * UI Foundations — Environment Detection
 *
 * Detects terminal capabilities, CI environment, color support,
 * and determines the appropriate rendering mode.
 */

// ─── Rendering Modes ─────────────────────────────────────────────────────────

export const MODES = {
  FULL: 'full',       // >= 96 cols, TTY, color
  COMPACT: 'compact', // 60–95 cols, TTY
  PLAIN: 'plain',     // CI, no TTY, NO_COLOR, piped
};

// ─── Environment Detection ───────────────────────────────────────────────────

export function detectEnvironment(overrides = {}) {
  const isTTY = overrides.isTTY ?? (process.stdout.isTTY === true);
  const columns = overrides.columns ?? (process.stdout.columns || 80);

  const isCI = overrides.isCI ?? !!(
    process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.GITLAB_CI ||
    process.env.JENKINS_URL ||
    process.env.BUILDKITE ||
    process.env.CIRCLECI ||
    process.env.TRAVIS
  );

  const noColor = overrides.noColor ?? !!(
    process.env.NO_COLOR ||
    process.env.NO_COLOR === '' ||
    process.env.TERM === 'dumb'
  );

  const forceColor = overrides.forceColor ?? !!(
    process.env.FORCE_COLOR &&
    process.env.FORCE_COLOR !== '0'
  );

  const colorSupport = forceColor || (!noColor && isTTY);

  const unicodeSupport = overrides.unicodeSupport ?? detectUnicode();

  return {
    isTTY,
    columns,
    isCI,
    noColor,
    forceColor,
    colorSupport,
    unicodeSupport,
    nodeVersion: process.version,
    platform: process.platform,
  };
}

// ─── Mode Selection ──────────────────────────────────────────────────────────

export function selectMode(env, cliMode) {
  // CLI override takes priority
  if (cliMode === 'plain') return MODES.PLAIN;
  if (cliMode === 'compact') return MODES.COMPACT;
  if (cliMode === 'full') return MODES.FULL;

  // NO_COLOR or CI → always plain
  if (env.noColor || env.isCI) return MODES.PLAIN;

  // Non-interactive → plain
  if (!env.isTTY) return MODES.PLAIN;

  // Width-based selection
  if (env.columns >= 96) return MODES.FULL;
  if (env.columns >= 60) return MODES.COMPACT;

  return MODES.PLAIN;
}

// ─── Unicode Detection ───────────────────────────────────────────────────────

function detectUnicode() {
  // Windows cmd.exe often lacks Unicode; modern terminals support it
  if (process.platform === 'win32') {
    // Windows Terminal and modern consoles set WT_SESSION
    if (process.env.WT_SESSION) return true;
    // ConEmu
    if (process.env.ConEmuPID) return true;
    // Fallback: check codepage
    return false;
  }

  // Most Unix terminals support Unicode
  const lang = process.env.LANG || process.env.LC_ALL || '';
  if (lang.toLowerCase().includes('utf')) return true;

  // Modern macOS and Linux default to UTF-8
  if (process.platform === 'darwin' || process.platform === 'linux') return true;

  return false;
}

// ─── Box Drawing Character Sets ──────────────────────────────────────────────

export const BOX_UNICODE = {
  // Primary (double-line) panels
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║',
  teeRight: '╠',
  teeLeft: '╣',
  teeDown: '╦',
  teeUp: '╩',
  cross: '╬',

  // Secondary (single-line) panels
  sTopLeft: '┌',
  sTopRight: '┐',
  sBottomLeft: '└',
  sBottomRight: '┘',
  sHorizontal: '─',
  sVertical: '│',
  sTeeRight: '├',
  sTeeLeft: '┤',
  sTeeDown: '┬',
  sTeeUp: '┴',
  sCross: '┼',

  // Progress
  blockFull: '█',
  blockMedium: '▓',
  blockLight: '▒',
  blockEmpty: '░',

  // Status indicators
  filled: '■',
  empty: '□',
  bullet: '●',
  circle: '○',
  cross_mark: '×',
  warning: '!',
};

export const BOX_ASCII = {
  topLeft: '+',
  topRight: '+',
  bottomLeft: '+',
  bottomRight: '+',
  horizontal: '=',
  vertical: '|',
  teeRight: '+',
  teeLeft: '+',
  teeDown: '+',
  teeUp: '+',
  cross: '+',

  sTopLeft: '+',
  sTopRight: '+',
  sBottomLeft: '+',
  sBottomRight: '+',
  sHorizontal: '-',
  sVertical: '|',
  sTeeRight: '+',
  sTeeLeft: '+',
  sTeeDown: '+',
  sTeeUp: '+',
  sCross: '+',

  blockFull: '#',
  blockMedium: '#',
  blockLight: ':',
  blockEmpty: '.',

  filled: '[x]',
  empty: '[ ]',
  bullet: '*',
  circle: 'o',
  cross_mark: 'x',
  warning: '!',
};

export function getBoxChars(env) {
  return env.unicodeSupport ? BOX_UNICODE : BOX_ASCII;
}
