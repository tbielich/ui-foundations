#!/usr/bin/env node

/**
 * UI Foundations — Build Runner
 *
 * Single-file linear MDA build log. Spawns build stages sequentially,
 * collects metrics from their stdout, prints a structured report once.
 *
 * Usage:
 *   node scripts/build.mjs           (foundation build)
 *   node scripts/build.mjs dev       (build + eleventy serve)
 *   npm run build:verbose             (raw output, no formatting)
 */

import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const VERSION = pkg.version || '0.0.0';

// ─── CLI ─────────────────────────────────────

const args = process.argv.slice(2);
const isDev = args.includes('dev');
const isVerbose = args.includes('--verbose');

// ─── Environment ─────────────────────────────

const isTTY = process.stdout.isTTY === true;
const noColor = !!(process.env.NO_COLOR || process.env.TERM === 'dumb');
const isCI = !!(process.env.CI || process.env.GITHUB_ACTIONS);
const useColor = isTTY && !noColor && !isCI;

// ─── ANSI Helpers ────────────────────────────

const c = useColor ? {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  white: '\x1b[97m',
} : { reset: '', bold: '', dim: '', green: '', red: '', yellow: '', white: '' };

// ─── Format (40-char width) ──────────────────

const W = 40;

/** Zero-pad to 4 digits, dim the leading zeros. */
function padNum(n) {
  const s = String(n);
  const zeros = Math.max(0, 4 - s.length);
  if (zeros === 0) return s;
  return `${c.dim}${'0'.repeat(zeros)}${c.reset}${s}`;
}

/** Visible length (strips ANSI for gap calculation). */
function visLen(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, '').length;
}

function row(label, value, last) {
  const conn = last ? '\u2514' : '\u251C';
  const val = typeof value === 'number' || /^\d+$/.test(String(value))
    ? padNum(Number(value))
    : String(value);
  const left = `${conn} ${label}`;
  const gap = W - left.length - visLen(val);
  return gap > 0 ? `${left}${' '.repeat(gap)}${val}` : `${left} ${val}`;
}

function section(label, status) {
  const prefix = `\u2588 ${label}`;
  if (!status) return prefix;
  const tag = `[${status}]`;
  const gap = W - prefix.length - tag.length;
  return gap > 0 ? `${prefix}${' '.repeat(gap)}${tag}` : `${prefix} ${tag}`;
}

const sep = '\u2500'.repeat(W);

function header() {
  const inner = W - 2;
  const l1 = ' \u257B\u257B\u00B7 \u2502 FOUNDATIONS';
  const l2 = ` \u2517\u251B\u2579 \u2502 BUILD ${VERSION}`;
  return [
    `\u256D${'\u2500'.repeat(inner)}\u256E`,
    `\u2502${l1}${' '.repeat(Math.max(0, inner - l1.length))}\u2502`,
    `\u2502${l2}${' '.repeat(Math.max(0, inner - l2.length))}\u2502`,
    `\u2570${'\u2500'.repeat(inner)}\u256F`,
  ].join('\n');
}

// ─── Metrics Patterns ────────────────────────

const RE = {
  icons: /Generated\s+\S+\s+\((\d+)\s+icons?\)/,
  missingWeb: /missing\s+codeSyntax\.WEB:\s+(\d+)/,
  unparseableWeb: /unparseable\s+codeSyntax\.WEB:\s+(\d+)/,
  duplicates: /duplicate\s+css\s+var\s+names[^:]*:\s+(\d+)/,
  tokenFiles: /\u2022\s+(\d+)\s+files?/,
  macros: /Macros\s+copied\s+to/,
  dist: /Dist\s+bundles\s+generated/,
  elevSummary: /\[11ty\]\s+Copied\s+(\d+)\s+Wrote\s+(\d+)\s+files?\s+in\s+([\d.]+)\s+seconds?/,
  elevPage: /\[11ty\]\s+Writing\s+\.\/_site\/([^\s]+)/,
  serverUrl: /(https?:\/\/localhost:\d+\/?)/,
};

// ─── Stage Runner ────────────────────────────

function runStage(cmd, args, onLine) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '0' },
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => {
      stdout += d;
      const lines = stdout.split('\n');
      stdout = lines.pop();
      lines.forEach(l => { if (l.trim()) onLine(l); });
    });
    proc.stderr.on('data', (d) => {
      stderr += d;
      const lines = stderr.split('\n');
      stderr = lines.pop();
      lines.forEach(l => { if (l.trim()) onLine(l); });
    });
    proc.on('close', (code) => {
      if (stdout.trim()) onLine(stdout);
      if (stderr.trim()) onLine(stderr);
      resolve(code ?? 0);
    });
    proc.on('error', reject);
  });
}

// ─── Eleventy Page Categories ────────────────

function categorize(path) {
  if (path.startsWith('components/') && path.includes('-playground')) return 'Playgrounds';
  if (path.startsWith('components/')) return 'Components';
  if (path.startsWith('foundations/')) return 'Foundations';
  if (path.startsWith('examples/')) return 'Examples';
  return 'System';
}

// ─── Main ────────────────────────────────────

const metrics = {
  icons: 0,
  missingWeb: 0,
  unparseableWeb: 0,
  duplicates: 0,
  tokenFiles: 0,
  macros: false,
  dist: false,
  tokenCss: false,
  tokenJson: false,
  tokenTs: false,
  tokenYaml: false,
  pages: 0,
  assets: 0,
  buildTime: 0,
  serverUrl: null,
  categories: { Foundations: 0, Components: 0, Playgrounds: 0, Examples: 0, System: 0 },
};

const buildStart = Date.now();
const out = (s) => process.stdout.write(s + '\n');

// Header
out(`${c.white}${header()}${c.reset}`);

// ─── Stage 1: Icons ──────────────────────────

let code = await runStage('node', ['scripts/generate-icon-list.mjs'], (line) => {
  if (isVerbose) out(line);
  const m = line.match(RE.icons);
  if (m) metrics.icons = parseInt(m[1], 10);
});

if (code !== 0) { fail('ICONS', code); process.exit(code); }

out(`${c.green}${section('ICONS', 'OK')}${c.reset}`);
out(row('Entries', metrics.icons, false));
out(row('Output', 'icon-names.ts', true));

// ─── Stage 2: Tokens ─────────────────────────

out(sep);

code = await runStage('node', ['scripts/extract-tokens.js'], (line) => {
  if (isVerbose) out(line);
  let m;
  if ((m = line.match(RE.missingWeb))) metrics.missingWeb = parseInt(m[1], 10);
  if ((m = line.match(RE.unparseableWeb))) metrics.unparseableWeb = parseInt(m[1], 10);
  if ((m = line.match(RE.duplicates))) metrics.duplicates = parseInt(m[1], 10);
  if (line.includes('css/')) metrics.tokenCss = true;
  if (line.includes('json/')) metrics.tokenJson = true;
  if (line.includes('ts/')) metrics.tokenTs = true;
  if (line.includes('tokens.yaml')) metrics.tokenYaml = true;
});

if (code !== 0) { fail('TOKENS', code); process.exit(code); }

out(section('TOKENS'));
out(row('CSS', metrics.tokenCss ? 'READY' : 'PENDING', false));
out(row('JSON', metrics.tokenJson ? 'READY' : 'PENDING', false));
out(row('TypeScript', metrics.tokenTs ? 'READY' : 'PENDING', false));
out(row('YAML', metrics.tokenYaml ? 'READY' : 'PENDING', true));

// Integrity
const hasIssues = metrics.missingWeb > 0 || metrics.duplicates > 0;
const intStatus = hasIssues ? 'WARN' : 'OK';
const intColor = hasIssues ? c.yellow : c.green;

out(sep);
out(`${intColor}${section('INTEGRITY', intStatus)}${c.reset}`);
out(row('Missing WEB', metrics.missingWeb, false));
out(row('Unparseable WEB', metrics.unparseableWeb, false));
out(row('Duplicate vars', metrics.duplicates, true));

// ─── Stage 3: CSS / Dist ─────────────────────

out(sep);

code = await runStage('node', ['scripts/build-css.mjs'], (line) => {
  if (isVerbose) out(line);
  let m;
  if ((m = line.match(RE.tokenFiles))) metrics.tokenFiles = parseInt(m[1], 10);
  if (RE.macros.test(line)) metrics.macros = true;
  if (RE.dist.test(line)) metrics.dist = true;
});

if (code !== 0) { fail('DIST', code); process.exit(code); }

out(`${c.green}${section('DIST', 'OK')}${c.reset}`);
out(row('Token CSS', metrics.tokenFiles, false));
out(row('Macros', metrics.macros ? 'READY' : 'PENDING', false));
out(row('Bundles', metrics.dist ? 'READY' : 'PENDING', true));

// ─── Stage 4: Eleventy (dev mode only) ───────

if (isDev) {
  out(sep);

  // For dev mode, eleventy --serve is long-running. We start it and wait for
  // the server-ready signal, then keep it running.
  const proc = spawn('npx', ['eleventy', '--serve'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  });

  await new Promise((resolve) => {
    let buf = '';
    const onData = (chunk) => {
      buf += chunk.toString();
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        if (isVerbose) out(line);

        let m;
        if ((m = line.match(RE.elevPage))) {
          metrics.categories[categorize(m[1])]++;
        }
        if ((m = line.match(RE.elevSummary))) {
          metrics.assets = parseInt(m[1], 10);
          metrics.pages = parseInt(m[2], 10);
          metrics.buildTime = parseFloat(m[3]);
        }
        if ((m = line.match(RE.serverUrl))) {
          metrics.serverUrl = m[1];
          // Print docs section now that we have all metrics
          printDocsSection();
          printServerSection();
          resolve();
        }
      }
    };
    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
    proc.on('close', () => resolve());
  });

  // Keep process alive
  process.on('SIGINT', () => { proc.kill(); process.exit(130); });
  process.on('SIGTERM', () => { proc.kill(); process.exit(143); });

} else {
  // Build-only: done
  const duration = Date.now() - buildStart;
  out(sep);
  out(`${c.green}BUILD OK \u00B7 READY \u00B7 ${duration}ms${c.reset}`);
}

// ─── Helpers ─────────────────────────────────

function printDocsSection() {
  const cats = metrics.categories;
  out(`${c.green}${section('DOCS', 'OK')}${c.reset}`);
  const rows = [];
  if (cats.Foundations > 0) rows.push(['Foundations', cats.Foundations]);
  if (cats.Components > 0) rows.push(['Components', cats.Components]);
  if (cats.Playgrounds > 0) rows.push(['Playgrounds', cats.Playgrounds]);
  if (cats.Examples > 0) rows.push(['Examples', cats.Examples]);
  if (cats.System > 0) rows.push(['System', cats.System]);
  if (metrics.pages > 0) rows.push(['Pages', metrics.pages]);
  if (metrics.assets > 0) rows.push(['Assets', metrics.assets]);
  if (metrics.buildTime > 0) rows.push(['Time', `${metrics.buildTime}s`]);
  rows.forEach(([l, v], i) => out(row(l, v, i === rows.length - 1)));
}

function printServerSection() {
  out(sep);
  out(`${c.green}${section('DEV SERVER', 'RUN')}${c.reset}`);
  out(row('URL', metrics.serverUrl, false));
  out(row('Watch', 'ACTIVE', true));
  out(sep);
  out(`${c.green}ONLINE \u00B7 SERVER \u00B7 WATCH${c.reset}`);
}

function fail(stage, exitCode) {
  out(sep);
  out(`${c.red}BUILD FAILED${c.reset}`);
  out(`Stage     ${stage}`);
  out(`Exit      ${exitCode}`);
  out(`\nRun \`npm run build:verbose\``);
}
