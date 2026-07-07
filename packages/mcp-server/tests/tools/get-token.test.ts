import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { getTokenHandler } from '../../src/tools/get-token.js';

describe('getTokenHandler', () => {
  let testDir: string;
  const tokenDir = 'dist/tokens/json';
  const figmaExportDir = 'figma/exports';

  beforeEach(async () => {
    testDir = join(tmpdir(), `get-token-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, tokenDir), { recursive: true });

    // Core primitives
    await writeFile(
      join(testDir, tokenDir, 'core-primitives.tokens.json'),
      JSON.stringify({
        Size: {
          Spacing: {
            '100': { $type: 'dimension', $value: { value: 4, unit: 'px' } },
            '200': { $type: 'dimension', $value: { value: 8, unit: 'px' } },
          },
          Border: {
            '100': { $type: 'dimension', $value: { value: 1, unit: 'px' } },
          },
        },
      }),
      'utf8',
    );

    // Semantic tokens
    await writeFile(
      join(testDir, tokenDir, 'semantics-roles.tokens.json'),
      JSON.stringify({
        Color: {
          Text: {
            Default: { $type: 'color', $value: '#000000' },
            Inverse: { $type: 'color', $value: '#ffffff' },
          },
          Fill: {
            Brand: { $type: 'color', $value: '#0066cc' },
          },
        },
      }),
      'utf8',
    );

    // Component tokens
    await writeFile(
      join(testDir, tokenDir, 'components-ui.tokens.json'),
      JSON.stringify({
        Button: {
          Solid: {
            'Border Color Default': { $type: 'color', $value: '{Color.Border.Brand}' },
            Container: {
              'Background Default': { $type: 'color', $value: '{Color.Fill.Brand}' },
            },
          },
        },
      }),
      'utf8',
    );
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  // -------------------------------------------------------------------------
  // Successful queries
  // -------------------------------------------------------------------------

  it('finds tokens by case-insensitive substring match', async () => {
    const result = await getTokenHandler({ query: 'spacing' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.results.length, 2);
    assert.ok(parsed.results.every((t: { name: string }) => t.name.toLowerCase().includes('spacing')));
  });

  it('returns correct structure for each result', async () => {
    const result = await getTokenHandler({ query: 'Size.Spacing.100' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.results.length, 1);
    const token = parsed.results[0];
    assert.equal(token.name, 'Size.Spacing.100');
    assert.equal(token.cssProperty, '--size-spacing-100');
    assert.deepEqual(token.value, { value: 4, unit: 'px' });
    assert.equal(token.type, 'dimension');
    assert.equal(token.layer, 'core');
  });

  it('CSS custom property uses lowercase dashes', async () => {
    const result = await getTokenHandler({ query: 'Color.Text.Default' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.results[0].cssProperty, '--color-text-default');
  });

  it('performs case-insensitive matching', async () => {
    const result = await getTokenHandler({ query: 'COLOR' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.results.length >= 3); // Text.Default, Text.Inverse, Fill.Brand
  });

  it('searches across all layers', async () => {
    const result = await getTokenHandler({ query: 'Default' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    const layers = new Set(parsed.results.map((t: { layer: string }) => t.layer));
    assert.ok(layers.has('semantic')); // Color.Text.Default
    assert.ok(layers.has('component')); // Button.Solid.Border Color Default, Container.Background Default
  });

  // -------------------------------------------------------------------------
  // Layer filter
  // -------------------------------------------------------------------------

  it('filters results by layer when layer parameter is provided', async () => {
    const result = await getTokenHandler({ query: 'co', layer: 'semantic' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.results.length > 0);
    assert.ok(parsed.results.every((t: { layer: string }) => t.layer === 'semantic'));
  });

  it('combines layer filter with query substring match', async () => {
    const result = await getTokenHandler({ query: 'Border', layer: 'core' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.results.length > 0);
    assert.ok(parsed.results.every((t: { layer: string }) => t.layer === 'core'));
    assert.ok(parsed.results.every((t: { name: string }) => t.name.toLowerCase().includes('border')));
  });

  // -------------------------------------------------------------------------
  // Result limits
  // -------------------------------------------------------------------------

  it('returns at most 50 results', async () => {
    // Create a token file with more than 50 tokens
    const manyTokens: Record<string, Record<string, unknown>> = {};
    for (let i = 0; i < 60; i++) {
      manyTokens[`Token${i}`] = { $type: 'dimension', $value: `${i}px` };
    }
    await writeFile(
      join(testDir, tokenDir, 'core-primitives.tokens.json'),
      JSON.stringify({ Test: manyTokens }),
      'utf8',
    );

    const result = await getTokenHandler({ query: 'Token' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.returned, 50);
    assert.equal(parsed.total, 60);
  });

  // -------------------------------------------------------------------------
  // Empty results
  // -------------------------------------------------------------------------

  it('returns empty result with message when no tokens match', async () => {
    const result = await getTokenHandler({ query: 'nonexistent' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.deepEqual(parsed.results, []);
    assert.ok(parsed.message.includes('nonexistent'));
  });

  it('returns empty result with layer context when layer filter yields no matches', async () => {
    const result = await getTokenHandler({ query: 'Spacing', layer: 'semantic' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.deepEqual(parsed.results, []);
    assert.ok(parsed.message.includes('semantic'));
  });

  // -------------------------------------------------------------------------
  // Error cases: query validation
  // -------------------------------------------------------------------------

  it('rejects query shorter than 2 chars when no layer filter', async () => {
    const result = await getTokenHandler({ query: 'a' }, testDir);

    assert.equal(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.error.includes('at least 2 characters'));
  });

  it('allows short query when layer filter is provided', async () => {
    const result = await getTokenHandler({ query: 'S', layer: 'core' }, testDir);

    // Should not be an error — layer filter provided
    assert.notEqual(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(Array.isArray(parsed.results));
  });

  // -------------------------------------------------------------------------
  // Error cases: invalid layer
  // -------------------------------------------------------------------------

  it('rejects invalid layer value with list of valid options', async () => {
    const result = await getTokenHandler({ query: 'spacing', layer: 'invalid' }, testDir);

    assert.equal(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.error.includes('Invalid layer value'));
    assert.ok(parsed.error.includes('core'));
    assert.ok(parsed.error.includes('semantic'));
    assert.ok(parsed.error.includes('component'));
    assert.ok(parsed.error.includes('mode'));
    assert.ok(parsed.error.includes('brand'));
  });

  // -------------------------------------------------------------------------
  // Graceful handling of missing files
  // -------------------------------------------------------------------------

  it('handles missing token files gracefully (skips them)', async () => {
    await rm(join(testDir, tokenDir, 'semantics-roles.tokens.json'));

    const result = await getTokenHandler({ query: 'Spacing' }, testDir);

    // Should still find core tokens
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.results.length > 0);
    assert.ok(parsed.results.every((t: { layer: string }) => t.layer === 'core'));
  });

  // -------------------------------------------------------------------------
  // Figma export source of truth
  // -------------------------------------------------------------------------

  it('indexes Pattern UI tokens from Figma exports', async () => {
    await mkdir(join(testDir, figmaExportDir), { recursive: true });
    await writeFile(
      join(testDir, figmaExportDir, 'Patterns (UI).tokens.json'),
      JSON.stringify({
        Typography: {
          Heading: {
            'Font Family': {
              $type: 'string',
              $value: { $ref: 'Brand/Font/Lead' },
              $extensions: {
                'com.figma.codeSyntax': {
                  WEB: 'var(--typography-heading-font-family)',
                },
              },
            },
          },
        },
      }),
      'utf8',
    );

    const result = await getTokenHandler({ query: 'heading' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.results.length, 1);
    assert.equal(parsed.results[0].name, 'Typography.Heading.Font Family');
    assert.equal(parsed.results[0].cssProperty, '--typography-heading-font-family');
    assert.equal(parsed.results[0].layer, 'component');
    assert.deepEqual(parsed.results[0].value, { $ref: 'Brand/Font/Lead' });
  });

  it('matches Figma export tokens by CSS custom property', async () => {
    await mkdir(join(testDir, figmaExportDir), { recursive: true });
    await writeFile(
      join(testDir, figmaExportDir, 'Themes (Brands).tokens.json'),
      JSON.stringify({
        Brand: {
          Font: {
            Lead: {
              $type: 'string',
              $value: { $ref: 'Font/Family/Serif' },
              $extensions: {
                'com.figma.codeSyntax': {
                  WEB: 'var(--brand-font-lead)',
                },
              },
            },
          },
        },
      }),
      'utf8',
    );

    const result = await getTokenHandler({ query: '--brand-font-lead' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.results.length, 1);
    assert.equal(parsed.results[0].name, 'Brand.Font.Lead');
    assert.equal(parsed.results[0].cssProperty, '--brand-font-lead');
    assert.equal(parsed.results[0].layer, 'brand');
  });

  it('excludes Figma variables hidden from publishing by default', async () => {
    await mkdir(join(testDir, figmaExportDir), { recursive: true });
    await writeFile(
      join(testDir, figmaExportDir, 'Patterns (UI).tokens.json'),
      JSON.stringify({
        Internal: {
          Debug: {
            $type: 'string',
            $value: 'draft',
            $extensions: {
              'com.figma.hiddenFromPublishing': true,
              'com.figma.codeSyntax': {
                WEB: 'var(--internal-debug)',
              },
            },
          },
        },
      }),
      'utf8',
    );

    const result = await getTokenHandler({ query: 'internal' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.deepEqual(parsed.results, []);
  });

  it('includes Figma variables hidden from publishing when requested', async () => {
    await mkdir(join(testDir, figmaExportDir), { recursive: true });
    await writeFile(
      join(testDir, figmaExportDir, 'Patterns (UI).tokens.json'),
      JSON.stringify({
        Internal: {
          Debug: {
            $type: 'string',
            $value: 'draft',
            $extensions: {
              'com.figma.hiddenFromPublishing': true,
              'com.figma.codeSyntax': {
                WEB: 'var(--internal-debug)',
              },
            },
          },
        },
      }),
      'utf8',
    );

    const result = await getTokenHandler(
      { query: 'internal', includeUnpublished: true },
      testDir,
    );

    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.results.length, 1);
    assert.equal(parsed.results[0].name, 'Internal.Debug');
    assert.equal(parsed.results[0].hiddenFromPublishing, true);
    assert.equal(parsed.includeUnpublished, true);
  });
});
