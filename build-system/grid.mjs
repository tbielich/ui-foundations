/**
 * UI Foundations — Grid Layout Primitives
 *
 * Deterministic grid system for the terminal dashboard.
 * All width calculations use string-width for visible-column accuracy.
 * Every row produced by this module has exactly `layout.width` visible columns.
 */

import stringWidth from 'string-width';
import stripAnsi from 'strip-ansi';
import { getBoxChars } from './environment.mjs';

// ─── Layout Constants ────────────────────────────────────────────────────────

export function createLayout(totalWidth = 96) {
  const width = totalWidth;
  const innerWidth = width - 2; // excluding left and right border chars
  // Split row structure: ║ + SP + left + SP + ║ + SP + right + SP + ║
  // width = 3 borders + 4 spaces + leftColumnWidth + rightColumnWidth
  // leftColumnWidth + rightColumnWidth = width - 7
  const contentWidth = width - 7;
  const leftColumnWidth = Math.ceil(contentWidth / 2);
  const rightColumnWidth = contentWidth - leftColumnWidth;
  return {
    width,
    innerWidth,
    leftColumnWidth,
    rightColumnWidth,
  };
}

// ─── Width Utilities ─────────────────────────────────────────────────────────

export function visibleWidth(str) {
  return stringWidth(stripAnsi(str));
}

export function truncateVisible(str, maxWidth) {
  const stripped = stripAnsi(str);
  if (stringWidth(stripped) <= maxWidth) return str;

  // Walk through the plain string, accumulating visible width
  let result = '';
  let width = 0;
  // We need to work on the ANSI-containing string but measure visible chars
  const ansiRegex = /\x1b\[[0-9;]*m/g;
  let lastIndex = 0;
  let match;
  const matches = [];
  while ((match = ansiRegex.exec(str)) !== null) {
    matches.push({ index: match.index, end: match.index + match[0].length, code: match[0] });
  }

  let mi = 0;
  for (let i = 0; i < str.length; i++) {
    // If we're at an ANSI escape, copy it through (zero width)
    if (mi < matches.length && i === matches[mi].index) {
      result += matches[mi].code;
      i = matches[mi].end - 1; // -1 because loop increments
      mi++;
      continue;
    }
    const charWidth = stringWidth(str[i]);
    if (width + charWidth >= maxWidth) {
      result += '…';
      break;
    }
    result += str[i];
    width += charWidth;
  }
  return result;
}

export function padRightVisible(str, targetWidth, fillChar = ' ') {
  const current = visibleWidth(str);
  if (current >= targetWidth) return str;
  return str + fillChar.repeat(targetWidth - current);
}

export function padLeftVisible(str, targetWidth, fillChar = ' ') {
  const current = visibleWidth(str);
  if (current >= targetWidth) return str;
  return fillChar.repeat(targetWidth - current) + str;
}

export function centerVisible(str, targetWidth, fillChar = ' ') {
  const current = visibleWidth(str);
  if (current >= targetWidth) return str;
  const totalPad = targetWidth - current;
  const leftPad = Math.floor(totalPad / 2);
  const rightPad = totalPad - leftPad;
  return fillChar.repeat(leftPad) + str + fillChar.repeat(rightPad);
}

// ─── Row Builders ────────────────────────────────────────────────────────────

/**
 * Build a full-width row with single content area.
 * Result: ║ <content padded to innerWidth> ║
 */
export function renderFullRow(content, layout, box, theme) {
  const c = theme.colors;
  const inner = padRightVisible(content, layout.innerWidth);
  return `${c.foreground}${box.vertical}${c.reset}${inner}${c.foreground}${box.vertical}${c.reset}`;
}

/**
 * Build a two-column row.
 * Result: ║ <left padded> ║ <right padded> ║
 */
export function renderSplitRow(leftContent, rightContent, layout, box, theme) {
  const c = theme.colors;
  const left = padRightVisible(leftContent, layout.leftColumnWidth);
  const right = padRightVisible(rightContent, layout.rightColumnWidth);
  return `${c.foreground}${box.vertical}${c.reset} ${left} ${c.foreground}${box.vertical}${c.reset} ${right} ${c.foreground}${box.vertical}${c.reset}`;
}

/**
 * Top border: ╔═══...═══╗
 */
export function renderTopBorder(layout, box, theme) {
  const c = theme.colors;
  return `${c.foreground}${box.topLeft}${box.horizontal.repeat(layout.innerWidth)}${box.topRight}${c.reset}`;
}

/**
 * Bottom border: ╚═══...═══╝
 */
export function renderBottomBorder(layout, box, theme) {
  const c = theme.colors;
  return `${c.foreground}${box.bottomLeft}${box.horizontal.repeat(layout.innerWidth)}${box.bottomRight}${c.reset}`;
}

/**
 * Mid split divider: ╠═══╦═══╣
 * Must match renderSplitRow: ║ SP left SP ║ SP right SP ║
 * So: ╠ + (1 + leftColumnWidth + 1) fills + ╦ + (1 + rightColumnWidth + 1) fills + ╣
 */
export function renderMidSplit(layout, box, theme) {
  const c = theme.colors;
  const leftFill = layout.leftColumnWidth + 2;
  const rightFill = layout.rightColumnWidth + 2;
  return `${c.foreground}${box.teeRight}${box.horizontal.repeat(leftFill)}${box.teeDown}${box.horizontal.repeat(rightFill)}${box.teeLeft}${c.reset}`;
}

/**
 * Full-width mid divider: ╠═══...═══╣
 */
export function renderMidFull(layout, box, theme) {
  const c = theme.colors;
  return `${c.foreground}${box.teeRight}${box.horizontal.repeat(layout.innerWidth)}${box.teeLeft}${c.reset}`;
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
