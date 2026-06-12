/**
 * UI Foundations — MDA Theme
 *
 * Monochrome Display Adapter inspired theme.
 * Primarily monochrome with minimal accent color for status.
 */

export const mda = {
  name: 'mda',
  label: 'MDA Monochrome',

  // Semantic color tokens (ANSI escape codes)
  colors: {
    background: '',        // terminal default
    foreground: '\x1b[37m', // white
    muted: '\x1b[90m',     // gray
    emphasis: '\x1b[97m',  // bright white
    success: '\x1b[32m',   // green
    warning: '\x1b[33m',   // yellow
    error: '\x1b[31m',     // red
    info: '\x1b[36m',      // cyan
    brand: '\x1b[92m',     // bright green (primary accent)
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
  },
};

export const amber = {
  name: 'amber',
  label: 'Amber Phosphor',

  colors: {
    background: '',
    foreground: '\x1b[33m',  // yellow (amber)
    muted: '\x1b[2;33m',     // dim yellow
    emphasis: '\x1b[1;33m',  // bold yellow
    success: '\x1b[32m',
    warning: '\x1b[1;33m',
    error: '\x1b[31m',
    info: '\x1b[33m',
    brand: '\x1b[1;33m',
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
  },
};

export const phosphor = {
  name: 'phosphor',
  label: 'Green Phosphor',

  colors: {
    background: '',
    foreground: '\x1b[32m',  // green
    muted: '\x1b[2;32m',     // dim green
    emphasis: '\x1b[1;32m',  // bold green
    success: '\x1b[92m',     // bright green
    warning: '\x1b[33m',
    error: '\x1b[31m',
    info: '\x1b[32m',
    brand: '\x1b[1;92m',
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
  },
};

// No-color fallback (all tokens are empty strings)
export const noColor = {
  name: 'none',
  label: 'No Color',

  colors: Object.fromEntries(
    Object.keys(mda.colors).map((k) => [k, ''])
  ),
};

// ─── Theme Registry ──────────────────────────────────────────────────────────

const THEMES = { mda, amber, phosphor, none: noColor };

export function getTheme(name, colorSupport) {
  if (!colorSupport) return noColor;
  return THEMES[name] || mda;
}
