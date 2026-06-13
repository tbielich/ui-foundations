/**
 * UI Foundations — Format Utilities
 *
 * Lightweight formatting helpers for the linear MDA build log.
 * No cursor movement, no frame rendering, no layout grid.
 * Uses string-width for ANSI-aware column alignment.
 */

import stringWidth from 'string-width';
import stripAnsi from 'strip-ansi';

// ─── Width Utilities ─────────────────────────

export function visibleWidth(str) {
  return stringWidth(stripAnsi(String(str)));
}

export function padRight(str, width) {
  const visible = visibleWidth(str);
  if (visible >= width) return str;
  return str + ' '.repeat(width - visible);
}

export function padLeft(str, width) {
  const visible = visibleWidth(str);
  if (visible >= width) return str;
  return ' '.repeat(width - visible) + str;
}

// ─── Emoji Replacement ───────────────────────

const EMOJI_MAP = [
  [/📁/g, '[OUT]'],
  [/📊/g, '[RPT]'],
  [/♻️/g, '[CACHE]'],
  [/✅/g, '[OK]'],
  [/❌/g, '[FAIL]'],
  [/⚠️/g, '[WARN]'],
  [/⚠/g, '[WARN]'],
  [/🔧/g, '[FIX]'],
  [/📋/g, '[NOTE]'],
  [/🧹/g, '[CLEAN]'],
];

export function replaceEmojis(str) {
  let result = str;
  for (const [pattern, replacement] of EMOJI_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// ─── MDA Log Formatting ─────────────────────

const LOG_WIDTH = 40;

/**
 * Pad a numeric value to 4 digits with leading zeros.
 */
function pad4(value) {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return String(num).padStart(4, '0');
}

/**
 * Format a value — numbers get 4-digit padding, strings stay as-is.
 */
function formatValue(value) {
  if (typeof value === 'number') return pad4(value);
  const str = String(value);
  // If it's a pure integer string, pad it
  if (/^\d+$/.test(str)) return pad4(str);
  return str;
}

/**
 * Render the header box with rounded corners.
 *
 * ╭──────────────────────────────────────╮
 * │ ╻╻· │ FOUNDATIONS                    │
 * │ ┗┛╹ │ BUILD 0.7.0                    │
 * ╰──────────────────────────────────────╯
 */
export function formatHeader(version, env) {
  const w = LOG_WIDTH;
  const inner = w - 2;
  const logo1 = '\u257B\u257B\u00B7';  // ╻╻·
  const logo2 = '\u2517\u251B\u2579';  // ┗┛╹

  const line1Content = ` ${logo1} \u2502 FOUNDATIONS`;
  const line2Content = ` ${logo2} \u2502 BUILD ${version}`;

  const pad1 = inner - line1Content.length;
  const pad2 = inner - line2Content.length;

  const lines = [
    `\u256D${'\u2500'.repeat(inner)}\u256E`,
    `\u2502${line1Content}${' '.repeat(Math.max(0, pad1))}\u2502`,
    `\u2502${line2Content}${' '.repeat(Math.max(0, pad2))}\u2502`,
    `\u2570${'\u2500'.repeat(inner)}\u256F`,
  ];
  return lines.join('\n') + '\n';
}

/**
 * Render a section headline with block char and status.
 *
 * █ ICONS                           [OK]
 */
export function formatSectionTitle(number, label, status) {
  const prefix = `\u2588 ${label.toUpperCase()}`;
  if (!status) {
    return `${prefix}\n`;
  }
  const tag = `[${status}]`;
  const gap = LOG_WIDTH - prefix.length - tag.length;
  if (gap < 1) {
    return `${prefix} ${tag}\n`;
  }
  return `${prefix}${' '.repeat(gap)}${tag}\n`;
}

/**
 * Render a metric row with tree connector.
 *
 * ├ Entries                         0289
 */
export function formatMetricRow(label, value, isLast) {
  const connector = isLast ? '\u2514' : '\u251C';
  const valueStr = formatValue(value);
  const content = `${connector} ${label}`;
  const gap = LOG_WIDTH - content.length - valueStr.length;
  if (gap < 1) {
    return `${content} ${valueStr}\n`;
  }
  return `${content}${' '.repeat(gap)}${valueStr}\n`;
}

/**
 * Render a section separator line.
 *
 * ───────────────────────────────────────
 */
export function formatSeparator() {
  return `${'\u2500'.repeat(LOG_WIDTH)}\n`;
}

/**
 * Render the final build-complete footer.
 *
 * BUILD OK · READY · 510ms
 */
export function formatBuildComplete(durationMs) {
  return `BUILD OK \u00B7 READY \u00B7 ${durationMs}ms\n`;
}

/**
 * Render the final build-failed footer.
 */
export function formatBuildFailed(stage, exitCode, reason) {
  const lines = [
    'BUILD FAILED\n',
    '\n',
    `Stage     ${stage}\n`,
  ];
  if (exitCode != null) {
    lines.push(`Exit      ${exitCode}\n`);
  }
  if (reason) {
    lines.push(`Reason    ${reason}\n`);
  }
  lines.push(`\nRun \`npm run build:verbose\`\n`);
  return lines.join('');
}

/**
 * Render a note or warning between sections.
 */
export function formatNote(level, message) {
  const tag = level.toUpperCase().padEnd(5);
  return `${tag} ${message}\n`;
}

/**
 * Render the docs:dev online footer.
 */
export function formatOnline() {
  return 'ONLINE \u00B7 SERVER \u00B7 WATCH\n';
}

/**
 * Render a status tag standalone (kept for compatibility).
 */
export function formatStatus(status) {
  const tag = `[${status}]`;
  return `${' '.repeat(Math.max(0, LOG_WIDTH - tag.length))}${tag}\n`;
}
