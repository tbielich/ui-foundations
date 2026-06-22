/**
 * diagnose_drift tool handler.
 *
 * Compares Figma export tokens (figma/exports/) with generated CSS output
 * (dist/tokens/json/) to identify naming mismatches, missing tokens, and
 * value differences. Returns structured drift report for agent loops.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { ToolResponse } from '../types.js';

interface DriftEntry {
  token: string;
  type: 'missing_in_code' | 'missing_in_figma' | 'value_mismatch' | 'name_mismatch';
  figmaValue?: unknown;
  codeValue?: unknown;
  figmaName?: string;
  codeName?: string;
}

/** Extracts flat token map { "codeSyntax.WEB name" → $value } from a Figma export file. */
function extractFigmaTokens(
  obj: Record<string, unknown>,
  prefix = '',
): Map<string, unknown> {
  const result = new Map<string, unknown>();

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const node = value as Record<string, unknown>;
    if (!node || typeof node !== 'object') continue;

    const path = prefix ? `${prefix}.${key}` : key;

    if ('$value' in node) {
      // Use codeSyntax.WEB as canonical name if present
      const extensions = node['$extensions'] as Record<string, unknown> | undefined;
      const codeSyntax = extensions?.['com.figma.codeSyntax'] as Record<string, string> | undefined;
      const webName = codeSyntax?.['WEB'];

      // Extract the CSS variable name from var(--xxx), strip any leading dashes
      const canonicalName = webName
        ? webName.replace(/^var\(--/, '').replace(/\)$/, '').replace(/^-+/, '')
        : path.replace(/\./g, '-').toLowerCase();

      result.set(canonicalName, node['$value']);
    } else {
      for (const [k, v] of extractFigmaTokens(node, path)) {
        result.set(k, v);
      }
    }
  }

  return result;
}

/** Normalizes a key segment: lowercase, spaces and special chars to hyphens. */
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/\s+/g, '-');
}

/** Extracts flat token map from a dist/tokens/json DTCG file. */
function extractCodeTokens(
  obj: Record<string, unknown>,
  prefix = '',
): Map<string, unknown> {
  const result = new Map<string, unknown>();

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const node = value as Record<string, unknown>;
    if (!node || typeof node !== 'object') continue;

    const normalizedKey = normalizeKey(key);
    const path = prefix ? `${prefix}-${normalizedKey}` : normalizedKey;

    if ('$value' in node) {
      result.set(path, node['$value']);
    } else {
      for (const [k, v] of extractCodeTokens(node, path)) {
        result.set(k, v);
      }
    }
  }

  return result;
}

/**
 * Semantically compares two token values, accounting for format differences:
 * - $ref slash notation vs dot notation: "Color/Neutral/800" ≈ "{Color.Neutral.800}"
 * - Bare number vs DTCG dimension: 16 ≈ {value:16, unit:"px"}
 * - Color object vs hex string: {hex:"#FF0000"} ≈ "#ff0000"
 * - Font weight name vs number: "Semi Bold" ≈ 600
 */
function valuesMatch(figma: unknown, code: unknown): boolean {
  // Identical
  if (JSON.stringify(figma) === JSON.stringify(code)) return true;

  // $ref (Figma) vs curly-brace ref (code): {"$ref":"Color/Neutral/800"} vs "{Color.Neutral.800}"
  if (figma && typeof figma === 'object' && '$ref' in (figma as Record<string, unknown>)) {
    const ref = (figma as Record<string, unknown>)['$ref'] as string;
    const normalized = `{${ref.replace(/\//g, '.')}}`;
    if (normalized === code) return true;
  }
  if (typeof figma === 'string' && typeof code === 'string') {
    // Both string refs with different slash/dot separators
    const figmaNorm = figma.replace(/\//g, '.');
    const codeNorm = code.replace(/\//g, '.');
    if (figmaNorm === codeNorm) return true;
  }

  // Bare number (Figma) vs DTCG dimension object (code): 16 vs {value:16, unit:"px"}
  if (typeof figma === 'number' && code && typeof code === 'object') {
    const c = code as Record<string, unknown>;
    if ('value' in c && c['value'] === figma) return true;
  }

  // Color object (Figma) vs hex string (code)
  if (figma && typeof figma === 'object' && 'hex' in (figma as Record<string, unknown>)) {
    const hex = ((figma as Record<string, unknown>)['hex'] as string).toLowerCase();
    if (typeof code === 'string' && code.toLowerCase() === hex) return true;
  }

  // Resolved hex (Figma) vs alias ref (code) — these are genuinely different representations
  // but if Figma has a resolved value and code has an alias, flag it as drift
  // (this is the one real case)

  // Font weight name vs number: "Semi Bold" ≈ 600
  const fontWeightMap: Record<string, number> = {
    'thin': 100, 'hairline': 100,
    'extra light': 200, 'ultra light': 200,
    'light': 300,
    'normal': 400, 'regular': 400,
    'medium': 500,
    'semi bold': 600, 'demi bold': 600,
    'bold': 700,
    'extra bold': 800, 'ultra bold': 800,
    'black': 900, 'heavy': 900,
  };
  if (typeof figma === 'string' && typeof code === 'number') {
    if (fontWeightMap[figma.toLowerCase()] === code) return true;
  }

  return false;
}

async function loadJsonFiles(dir: string): Promise<Map<string, unknown>> {
  const combined = new Map<string, unknown>();
  try {
    const files = await readdir(dir);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const content = await readFile(join(dir, file), 'utf8');
      const parsed = JSON.parse(content) as Record<string, unknown>;
      for (const [k, v] of extractCodeTokens(parsed)) {
        combined.set(k, v);
      }
    }
  } catch {
    // Directory may not exist
  }
  return combined;
}

export async function diagnoseDriftHandler(args: unknown, rootPath: string): Promise<ToolResponse> {
  const { layer } = args as { layer?: string };

  // Load Figma exports
  const figmaDir = join(rootPath, 'figma/exports');
  const figmaTokens = new Map<string, unknown>();
  try {
    const files = await readdir(figmaDir);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      if (layer && !file.toLowerCase().includes(layer.toLowerCase())) continue;
      const content = await readFile(join(figmaDir, file), 'utf8');
      const parsed = JSON.parse(content) as Record<string, unknown>;
      for (const [k, v] of extractFigmaTokens(parsed)) {
        figmaTokens.set(k, v);
      }
    }
  } catch {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'Cannot read figma/exports/' }) }],
      isError: true,
    };
  }

  // Load generated code tokens
  const codeTokens = await loadJsonFiles(join(rootPath, 'dist/tokens/json'));

  if (codeTokens.size === 0) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'No tokens in dist/tokens/json/. Run npm run tokens:generate first.' }) }],
      isError: true,
    };
  }

  // Compare
  const drift: DriftEntry[] = [];

  for (const [name, figmaValue] of figmaTokens) {
    if (!codeTokens.has(name)) {
      drift.push({ token: name, type: 'missing_in_code', figmaValue });
    } else {
      const codeValue = codeTokens.get(name);
      if (!valuesMatch(figmaValue, codeValue)) {
        drift.push({ token: name, type: 'value_mismatch', figmaValue, codeValue });
      }
    }
  }

  for (const [name] of codeTokens) {
    if (!figmaTokens.has(name)) {
      drift.push({ token: name, type: 'missing_in_figma' });
    }
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        summary: {
          figmaTokenCount: figmaTokens.size,
          codeTokenCount: codeTokens.size,
          driftCount: drift.length,
          missingInCode: drift.filter(d => d.type === 'missing_in_code').length,
          missingInFigma: drift.filter(d => d.type === 'missing_in_figma').length,
          valueMismatches: drift.filter(d => d.type === 'value_mismatch').length,
        },
        drift: drift.slice(0, 100),
        truncated: drift.length > 100,
      }, null, 2),
    }],
  };
}
