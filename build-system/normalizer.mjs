/**
 * UI Foundations — Event Normalizer
 *
 * Parses raw stdout/stderr lines from child processes into
 * structured build events.
 */

import { STAGES } from './events.mjs';
import * as events from './events.mjs';
import { replaceEmojis } from './grid.mjs';

// ─── Pattern Matchers ────────────────────────────────────────────────────────

const PATTERNS = {
  // Icons: "✅ Generated schemas/icon-names.ts (289 icons)"
  iconCount: /Generated\s+\S+\s+\((\d+)\s+icons?\)/,

  // Tokens: "• 8 files" (from build-css after token usage)
  tokenFileCount: /•\s+(\d+)\s+files?/,

  // Tokens: "missing codeSyntax.WEB: 0"
  missingCodeSyntax: /missing\s+codeSyntax\.WEB:\s+(\d+)/,

  // Tokens: "unparseable codeSyntax.WEB: 0"
  unparseableCodeSyntax: /unparseable\s+codeSyntax\.WEB:\s+(\d+)/,

  // Tokens: "duplicate css var names (same scope): 0"
  duplicateCssVars: /duplicate\s+css\s+var\s+names[^:]*:\s+(\d+)/,

  // Tokens: "missing alias targets: N"
  missingAliasTargets: /missing\s+alias\s+targets:\s+(\d+)/,

  // Tokens success: "✅ Tokens generated from local exports!"
  tokensSuccess: /Tokens\s+generated\s+from\s+local\s+exports/,

  // CSS: "Using pre-generated token CSS from dist/tokens/css"
  cssUsingTokens: /Using\s+pre-generated\s+token\s+CSS/,

  // CSS: "✅ Macros copied to dist/macros/"
  macrosCopied: /Macros\s+copied\s+to/,

  // CSS: "✅ Dist bundles generated in dist/"
  distBundles: /Dist\s+bundles\s+generated/,

  // Eleventy: "[11ty] Copied 311 Wrote 54 files in 0.37 seconds"
  eleventySummary: /\[11ty\]\s+Copied\s+(\d+)\s+Wrote\s+(\d+)\s+files?\s+in\s+([\d.]+)\s+seconds?/,

  // Eleventy: "[11ty] Writing ./_site/components/button/index.html from ..."
  eleventyWriting: /\[11ty\]\s+Writing\s+\.\/_site\/([^\s]+)/,

  // Eleventy: "[11ty] Watching…" or server started
  eleventyWatching: /\[11ty\]\s+Watching/,

  // Eleventy server: "Server at http://localhost:8080/"
  eleventyServer: /(?:Server\s+at|Serving\s+at|http:\/\/localhost:\d+)/,
  serverUrl: /(https?:\/\/localhost:\d+\/?)/,

  // Error markers
  errorMarker: /^❌|Error:|error:|ENOENT|EACCES|Cannot find/,

  // Warning markers
  warnMarker: /^⚠️|⚠|Warning:|warning:/,
};

// ─── Normalizer ──────────────────────────────────────────────────────────────

/**
 * Normalize a single stdout/stderr line from a stage into zero or more events.
 *
 * @param {string} line - Raw output line
 * @param {string} stage - Current stage ID
 * @param {string} stream - 'stdout' or 'stderr'
 * @returns {Array} Array of event objects
 */
export function normalizeLine(line, stage, stream = 'stdout') {
  const result = [];
  const trimmed = line.trim();
  if (!trimmed) return result;

  // ─── Icons ───────────────────────────────────────────────────────────
  if (stage === STAGES.ICONS) {
    const iconMatch = trimmed.match(PATTERNS.iconCount);
    if (iconMatch) {
      result.push(events.metricUpdate(stage, { icons: parseInt(iconMatch[1], 10) }));
      result.push(events.artifactCreated(stage, 'typescript'));
      return result;
    }
  }

  // ─── Tokens ──────────────────────────────────────────────────────────
  if (stage === STAGES.TOKENS) {
    const missingMatch = trimmed.match(PATTERNS.missingCodeSyntax);
    if (missingMatch) {
      result.push(events.metricUpdate(stage, { missingCodeSyntax: parseInt(missingMatch[1], 10) }));
      return result;
    }

    const unparseMatch = trimmed.match(PATTERNS.unparseableCodeSyntax);
    if (unparseMatch) {
      result.push(events.metricUpdate(stage, { unparseableCodeSyntax: parseInt(unparseMatch[1], 10) }));
      return result;
    }

    const dupeMatch = trimmed.match(PATTERNS.duplicateCssVars);
    if (dupeMatch) {
      result.push(events.metricUpdate(stage, { duplicateCssVariables: parseInt(dupeMatch[1], 10) }));
      return result;
    }

    const aliasMatch = trimmed.match(PATTERNS.missingAliasTargets);
    if (aliasMatch) {
      result.push(events.metricUpdate(stage, { missingAliasTargets: parseInt(aliasMatch[1], 10) }));
      return result;
    }

    if (PATTERNS.tokensSuccess.test(trimmed)) {
      result.push(events.artifactCreated(stage, 'css'));
      result.push(events.artifactCreated(stage, 'json'));
      result.push(events.artifactCreated(stage, 'typescript'));
      result.push(events.artifactCreated(stage, 'yaml'));
      return result;
    }
  }

  // ─── CSS ─────────────────────────────────────────────────────────────
  if (stage === STAGES.CSS) {
    const fileCountMatch = trimmed.match(PATTERNS.tokenFileCount);
    if (fileCountMatch) {
      result.push(events.metricUpdate(stage, { tokenFiles: parseInt(fileCountMatch[1], 10) }));
      return result;
    }

    if (PATTERNS.macrosCopied.test(trimmed)) {
      result.push(events.artifactCreated(stage, 'macros'));
      return result;
    }

    if (PATTERNS.distBundles.test(trimmed)) {
      result.push(events.artifactCreated(stage, 'css'));
      return result;
    }
  }

  // ─── Site (Eleventy) ─────────────────────────────────────────────────
  if (stage === STAGES.SITE) {
    const summaryMatch = trimmed.match(PATTERNS.eleventySummary);
    if (summaryMatch) {
      result.push(events.metricUpdate(stage, {
        assets: parseInt(summaryMatch[1], 10),
        pages: parseInt(summaryMatch[2], 10),
        buildTime: parseFloat(summaryMatch[3]),
      }));
      result.push(events.artifactCreated(stage, 'html'));
      return result;
    }

    const writingMatch = trimmed.match(PATTERNS.eleventyWriting);
    if (writingMatch) {
      const filePath = writingMatch[1];
      // Categorize the page
      const category = categorizeEleventyPage(filePath);
      result.push(events.stageProgress(stage, null, null, `${category}: ${filePath}`));
      return result;
    }

    if (PATTERNS.eleventyWatching.test(trimmed)) {
      result.push(events.serviceStart(STAGES.SERVER));
      return result;
    }

    const serverUrlMatch = trimmed.match(PATTERNS.serverUrl);
    if (serverUrlMatch) {
      result.push(events.serviceReady(STAGES.SERVER, serverUrlMatch[1]));
      return result;
    }
  }

  // ─── Generic patterns (any stage) ───────────────────────────────────

  // Errors
  if (stream === 'stderr' && PATTERNS.errorMarker.test(trimmed)) {
    result.push(events.logMessage(stage, 'error', trimmed));
    return result;
  }

  // Warnings
  if (PATTERNS.warnMarker.test(trimmed)) {
    result.push(events.logMessage(stage, 'warn', trimmed));
    return result;
  }

  // Default: capture as info log
  result.push(events.logMessage(stage, 'info', replaceEmojis(trimmed)));
  return result;
}

// ─── Eleventy Page Categorization ────────────────────────────────────────────

const PAGE_CATEGORIES = [
  { prefix: 'components/', name: 'Components', hasPlayground: true },
  { prefix: 'foundations/', name: 'Foundations' },
  { prefix: 'tokens/', name: 'Tokens' },
  { prefix: 'examples/', name: 'Examples' },
];

function categorizeEleventyPage(filePath) {
  for (const cat of PAGE_CATEGORIES) {
    if (filePath.startsWith(cat.prefix)) {
      if (cat.hasPlayground && filePath.includes('-playground')) {
        return 'Playgrounds';
      }
      return cat.name;
    }
  }
  return 'System';
}

/**
 * Aggregate Eleventy pages by category from the state log.
 *
 * @param {Array} progressEvents - Array of stage:progress events for SITE stage
 * @returns {Object} { Components: N, Playgrounds: N, Foundations: N, ... }
 */
export function aggregatePages(progressEvents) {
  const counts = {
    Components: 0,
    Playgrounds: 0,
    Foundations: 0,
    Tokens: 0,
    Examples: 0,
    System: 0,
  };

  for (const ev of progressEvents) {
    if (ev.detail) {
      const colonIdx = ev.detail.indexOf(':');
      if (colonIdx > 0) {
        const category = ev.detail.slice(0, colonIdx).trim();
        if (category in counts) {
          counts[category]++;
        } else {
          counts.System++;
        }
      }
    }
  }

  return counts;
}
