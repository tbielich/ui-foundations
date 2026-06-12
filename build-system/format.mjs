/**
 * UI Foundations — Format Utilities
 *
 * Lightweight formatting helpers for the linear MDA build log.
 * No cursor movement, no frame rendering, no layout grid.
 * Uses string-width for ANSI-aware column alignment.
 */

import stringWidth from 'string-width';
import stripAnsi from 'strip-ansi';
import { getBoxChars } from './environment.mjs';

// ─── Width Utilities ─────────────────────────────────────────────────────────

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

// ─── Emoji Replacement ───────────────────────────────────────────────────────

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

const LOG_WIDTH = 48;

/**
 * Render the primary MDA header box.
 *
 * ╔══════════════════════════════════════════════╗
 * ║ UI FOUNDATIONS          BUILD 0.7.0 ║
 * ╚══════════════════════════════════════════════╝
 */
export function formatHeader(version, env) {
  const box = getBoxChars(env);
  const innerWidth = LOG_WIDTH - 2;
  const title = ' UI FOUNDATIONS';
  const versionTag = `BUILD ${version} `;
  const gap = innerWidth - title.length - versionTag.length;
  const titleLine = `${box.vertical}${title}${' '.repeat(Math.max(1, gap))}${versionTag}${box.vertical}`;

  const lines = [
    `${box.topLeft}${box.horizontal.repeat(innerWidth)}${box.topRight}`,
    titleLine,
    `${box.bottomLeft}${box.horizontal.repeat(innerWidth)}${box.bottomRight}`,
  ];
  return lines.join('\n') + '\n';
}

/**
 * Render a section header: [01] ICONS
 */
export function formatSectionTitle(number, label) {
  const num = String(number).padStart(2, '0');
  return `\n  [${num}] ${label.toUpperCase()}\n`;
}

/**
 * Render a key-value metric row with right-aligned value.
 *
 *     Entries                              289
 */
export function formatMetricRow(label, value) {
  const indent = '    ';
  const valueStr = String(value);
  const availableWidth = LOG_WIDTH - indent.length;
  const gap = availableWidth - label.length - valueStr.length;
  if (gap < 1) {
    return `${indent}${label} ${valueStr}\n`;
  }
  return `${indent}${label}${' '.repeat(gap)}${valueStr}\n`;
}

/**
 * Render a status tag at the end of a section.
 *
 *                                        [OK]
 */
export function formatStatus(status) {
  const indent = '    ';
  const tag = `[${status}]`;
  const availableWidth = LOG_WIDTH - indent.length;
  return `${indent}${' '.repeat(Math.max(0, availableWidth - tag.length))}${tag}\n`;
}

/**
 * Render the footer separator line.
 *
 * ──────────────────────────────────────────────
 */
export function formatSeparator(env) {
  const box = getBoxChars(env);
  return `\n  ${box.sHorizontal.repeat(LOG_WIDTH - 4)}\n`;
}

/**
 * Render the final build-complete footer.
 *
 * BUILD OK · READY · 510ms
 */
export function formatBuildComplete(durationMs) {
  return `  BUILD OK · READY · ${durationMs}ms\n`;
}

/**
 * Render the final build-failed footer.
 */
export function formatBuildFailed(stage, exitCode, reason) {
  const lines = [
    '  BUILD FAILED\n',
    `\n`,
    `  Stage     ${stage}\n`,
  ];
  if (exitCode != null) {
    lines.push(`  Exit      ${exitCode}\n`);
  }
  if (reason) {
    lines.push(`  Reason    ${reason}\n`);
  }
  lines.push(`\n  Run \`npm run build:verbose\`\n`);
  return lines.join('');
}

/**
 * Render a note or warning between sections.
 *
 *   NOTE  Pre-generated token CSS reused
 */
export function formatNote(level, message) {
  const tag = level.toUpperCase().padEnd(5);
  return `\n  ${tag} ${message}\n`;
}

/**
 * Render the docs:dev online footer.
 */
export function formatOnline() {
  return '  ONLINE · SERVER · WATCH ACTIVE\n';
}
