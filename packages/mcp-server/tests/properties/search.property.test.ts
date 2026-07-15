/**
 * Property tests for the MCP Server search and token lookup tools.
 *
 * Property 9: Search result constraints
 * Property 10: Short query rejection
 * Property 11: Token search filter invariant
 *
 * Feature: mcp-server, Property 9: Search result constraints
 * Feature: mcp-server, Property 10: Short query rejection
 * Feature: mcp-server, Property 11: Token search filter invariant
 *
 * Validates: Requirements 10.1, 10.2, 10.3, 12.1, 12.2, 12.4
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import fc from 'fast-check';

import { SearchIndex } from '../../src/util/search-index.js';
import { createSearchHandler } from '../../src/tools/search.js';
import { getTokenHandler } from '../../src/tools/get-token.js';

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Generates a query string of at least 2 characters containing alphanumeric content. */
const validQueryArb = fc
  .string({ minLength: 2, maxLength: 50 })
  .filter((s) => s.trim().length >= 2 && /[a-zA-Z0-9]{2}/.test(s));

/** Generates a query string of fewer than 2 characters (including empty). */
const shortQueryArb = fc.oneof(
  fc.constant(''),
  fc.string({ minLength: 1, maxLength: 1 }),
);

/** Valid token layer values. */
const validLayerArb = fc.constantFrom('core', 'semantic', 'component');

/** Generates a token-like query string that could match token names. */
const tokenQueryArb = fc.constantFrom(
  'size', 'color', 'border', 'spacing', 'radius',
  'font', 'button', 'input', 'background', 'text',
  'padding', 'container', 'fill', 'surface', 'brand',
);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** Builds a SearchIndex with some representative documents for testing. */
function buildTestIndex(): SearchIndex {
  const index = new SearchIndex('/tmp/test-root');

  index.addDocument('uif://tokens/core', 'Size spacing 100 200 300 border radius dimension');
  index.addDocument('uif://tokens/semantic', 'Color text default brand surface fill feedback danger success');
  index.addDocument('uif://tokens/component', 'Button solid outline ghost container background hover active');
  index.addDocument('uif://components/button', 'The Button component supports solid outline and ghost variants with hover and active states');
  index.addDocument('uif://components/input', 'The Input component provides text entry fields with label and validation states');
  index.addDocument('uif://components/checkbox', 'The Checkbox component for binary selection with checked unchecked and indeterminate states');
  index.addDocument('uif://patterns/forms', 'Form composition pattern for layout spacing alignment validation feedback labels');
  index.addDocument('uif://patterns/navigation', 'Navigation patterns for menus tabs breadcrumbs and links hierarchy');
  index.addDocument('uif://patterns/cards', 'Card composition pattern for content grouping thumbnails titles descriptions actions');
  index.addDocument('uif://governance/rules', 'Naming rules layering model theming design to code review checklist agent readiness');
  index.addDocument('uif://governance/naming', 'Token naming convention PascalCase kebab-case segments component variant part property state');
  index.addDocument('uif://foundations/001', 'Token layering architecture core semantic component mode brand referencing');
  index.addDocument('uif://foundations/002', 'Naming and grouping conventions for design tokens figma alignment');
  index.addDocument('uif://agents/rules', 'Agent behavior rules context loading order repository rules decision bias');
  index.addDocument('uif://agents/behavior', 'Assistant behavior rules component surfaces CSS Web Components Nunjucks documentation');

  return index;
}

// ---------------------------------------------------------------------------
// Property 9: Search result constraints
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 9: Search result constraints', () => {
  let index: SearchIndex;
  let handler: (args: unknown, rootPath: string) => Promise<import('../../src/types.js').ToolResponse>;

  before(() => {
    index = buildTestIndex();
    handler = createSearchHandler(index);
  });

  it('returns at most 20 results for any valid query', async () => {
    await fc.assert(
      fc.asyncProperty(validQueryArb, async (query) => {
        const response = await handler({ query }, '/tmp/test-root');
        const data = JSON.parse(response.content[0].text);

        if (data.results) {
          assert.ok(data.results.length <= 20, `Got ${data.results.length} results, expected ≤20`);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('each result has a non-empty URI', async () => {
    await fc.assert(
      fc.asyncProperty(validQueryArb, async (query) => {
        const response = await handler({ query }, '/tmp/test-root');
        const data = JSON.parse(response.content[0].text);

        if (data.results && data.results.length > 0) {
          for (const result of data.results) {
            assert.ok(result.uri, `Result URI must be non-empty, got: "${result.uri}"`);
            assert.ok(typeof result.uri === 'string', 'URI must be a string');
            assert.ok(result.uri.length > 0, 'URI must not be empty string');
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('each result excerpt is at most 200 characters', async () => {
    await fc.assert(
      fc.asyncProperty(validQueryArb, async (query) => {
        const response = await handler({ query }, '/tmp/test-root');
        const data = JSON.parse(response.content[0].text);

        if (data.results && data.results.length > 0) {
          for (const result of data.results) {
            assert.ok(
              result.excerpt.length <= 200,
              `Excerpt length ${result.excerpt.length} exceeds 200 chars for query "${query}"`,
            );
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('each result score is in [0.0, 1.0]', async () => {
    await fc.assert(
      fc.asyncProperty(validQueryArb, async (query) => {
        const response = await handler({ query }, '/tmp/test-root');
        const data = JSON.parse(response.content[0].text);

        if (data.results && data.results.length > 0) {
          for (const result of data.results) {
            assert.ok(
              result.score >= 0.0 && result.score <= 1.0,
              `Score ${result.score} out of range [0.0, 1.0] for query "${query}"`,
            );
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('results are ordered by descending score', async () => {
    await fc.assert(
      fc.asyncProperty(validQueryArb, async (query) => {
        const response = await handler({ query }, '/tmp/test-root');
        const data = JSON.parse(response.content[0].text);

        if (data.results && data.results.length > 1) {
          for (let i = 0; i < data.results.length - 1; i++) {
            assert.ok(
              data.results[i].score >= data.results[i + 1].score,
              `Results not in descending score order at index ${i}: ${data.results[i].score} < ${data.results[i + 1].score}`,
            );
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('queries ≥2 chars never produce an error response', async () => {
    await fc.assert(
      fc.asyncProperty(validQueryArb, async (query) => {
        const response = await handler({ query }, '/tmp/test-root');
        assert.ok(!response.isError, `Expected no error for valid query "${query}"`);
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 10: Short query rejection
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 10: Short query rejection', () => {
  let index: SearchIndex;
  let handler: (args: unknown, rootPath: string) => Promise<import('../../src/types.js').ToolResponse>;

  before(() => {
    index = buildTestIndex();
    handler = createSearchHandler(index);
  });

  it('rejects queries shorter than 2 characters with an error', async () => {
    await fc.assert(
      fc.asyncProperty(shortQueryArb, async (query) => {
        const response = await handler({ query }, '/tmp/test-root');
        assert.equal(response.isError, true, `Expected error for short query "${query}"`);

        const data = JSON.parse(response.content[0].text);
        assert.ok(data.error, 'Expected error field in response');
        assert.ok(
          data.error.toLowerCase().includes('2 characters') ||
          data.error.toLowerCase().includes('at least 2'),
          `Error message should mention 2 character minimum: ${data.error}`,
        );
      }),
      { numRuns: 100 },
    );
  });

  it('rejects empty string queries', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(''), async (query) => {
        const response = await handler({ query }, '/tmp/test-root');
        assert.equal(response.isError, true, 'Expected error for empty query');
      }),
      { numRuns: 100 },
    );
  });

  it('rejects single-character queries', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 1 }),
        async (query) => {
          const response = await handler({ query }, '/tmp/test-root');
          assert.equal(response.isError, true, `Expected error for single-char query "${query}"`);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 11: Token search filter invariant
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 11: Token search filter invariant', () => {
  let tempDir: string;

  before(() => {
    // Create temp directory with token JSON files that mimic the real structure
    tempDir = mkdtempSync(join(tmpdir(), 'mcp-token-test-'));
    const distDir = join(tempDir, 'dist', 'tokens', 'json');
    mkdirSync(distDir, { recursive: true });

    // Core tokens
    const coreTokens = {
      Size: {
        Spacing: {
          '100': { $type: 'dimension', $value: { value: 4, unit: 'px' } },
          '200': { $type: 'dimension', $value: { value: 8, unit: 'px' } },
          '300': { $type: 'dimension', $value: { value: 12, unit: 'px' } },
          '400': { $type: 'dimension', $value: { value: 16, unit: 'px' } },
        },
        Border: {
          '100': { $type: 'dimension', $value: { value: 1, unit: 'px' } },
          '200': { $type: 'dimension', $value: { value: 2, unit: 'px' } },
        },
        Radius: {
          '100': { $type: 'dimension', $value: { value: 4, unit: 'px' } },
          '200': { $type: 'dimension', $value: { value: 8, unit: 'px' } },
          '300': { $type: 'dimension', $value: { value: 12, unit: 'px' } },
        },
      },
      Font: {
        Size: {
          '100': { $type: 'dimension', $value: { value: 12, unit: 'px' } },
          '200': { $type: 'dimension', $value: { value: 14, unit: 'px' } },
          '300': { $type: 'dimension', $value: { value: 16, unit: 'px' } },
        },
      },
    };

    // Semantic tokens
    const semanticTokens = {
      Color: {
        Text: {
          default: { $type: 'color', $value: '#1a1a1a' },
          brand: { $type: 'color', $value: '#0066cc' },
          danger: { $type: 'color', $value: '#cc0000' },
          success: { $type: 'color', $value: '#008800' },
        },
        Fill: {
          surface: { $type: 'color', $value: '#ffffff' },
          brand: { $type: 'color', $value: '#0066cc' },
          danger: { $type: 'color', $value: '#ffeeee' },
        },
        Border: {
          default: { $type: 'color', $value: '#cccccc' },
          brand: { $type: 'color', $value: '#0066cc' },
        },
      },
    };

    // Component tokens
    const componentTokens = {
      Button: {
        solid: {
          container: {
            background: {
              default: { $type: 'color', $value: '#0066cc' },
              hover: { $type: 'color', $value: '#0055aa' },
              active: { $type: 'color', $value: '#004488' },
            },
            'border-color': {
              default: { $type: 'color', $value: 'transparent' },
            },
          },
        },
        outline: {
          container: {
            background: {
              default: { $type: 'color', $value: 'transparent' },
              hover: { $type: 'color', $value: '#f0f8ff' },
            },
          },
        },
      },
      Input: {
        container: {
          background: {
            default: { $type: 'color', $value: '#ffffff' },
            disabled: { $type: 'color', $value: '#f5f5f5' },
          },
          'border-color': {
            default: { $type: 'color', $value: '#cccccc' },
            focus: { $type: 'color', $value: '#0066cc' },
          },
        },
      },
    };

    writeFileSync(join(distDir, 'core-primitives.tokens.json'), JSON.stringify(coreTokens));
    writeFileSync(join(distDir, 'semantics-roles.tokens.json'), JSON.stringify(semanticTokens));
    writeFileSync(join(distDir, 'components-ui.tokens.json'), JSON.stringify(componentTokens));
  });

  after(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('all returned tokens match the requested layer filter', async () => {
    await fc.assert(
      fc.asyncProperty(validLayerArb, tokenQueryArb, async (layer, query) => {
        const response = await getTokenHandler({ query, layer }, tempDir);
        const data = JSON.parse(response.content[0].text);

        if (data.results && data.results.length > 0) {
          for (const token of data.results) {
            assert.equal(
              token.layer,
              layer,
              `Token "${token.name}" has layer "${token.layer}", expected "${layer}"`,
            );
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('all returned token names contain the query as a case-insensitive substring', async () => {
    await fc.assert(
      fc.asyncProperty(validLayerArb, tokenQueryArb, async (layer, query) => {
        const response = await getTokenHandler({ query, layer }, tempDir);
        const data = JSON.parse(response.content[0].text);

        if (data.results && data.results.length > 0) {
          const queryLower = query.toLowerCase();
          for (const token of data.results) {
            assert.ok(
              token.name.toLowerCase().includes(queryLower),
              `Token name "${token.name}" does not contain query "${query}" (case-insensitive)`,
            );
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('result count never exceeds 50', async () => {
    await fc.assert(
      fc.asyncProperty(validLayerArb, tokenQueryArb, async (layer, query) => {
        const response = await getTokenHandler({ query, layer }, tempDir);
        const data = JSON.parse(response.content[0].text);

        if (data.results) {
          assert.ok(
            data.results.length <= 50,
            `Got ${data.results.length} results, expected ≤50`,
          );
        }
      }),
      { numRuns: 100 },
    );
  });

  it('with layer filter, short queries (<2 chars) are still accepted', async () => {
    await fc.assert(
      fc.asyncProperty(validLayerArb, fc.constant(''), async (layer, query) => {
        const response = await getTokenHandler({ query, layer }, tempDir);
        // With a layer filter, short query should NOT produce an error
        // (the minimum query length is only enforced without a layer filter)
        assert.ok(
          !response.isError,
          `Expected no error for short query with layer filter: layer="${layer}", query="${query}"`,
        );
      }),
      { numRuns: 100 },
    );
  });

  it('without layer filter, queries <2 chars produce an error', async () => {
    await fc.assert(
      fc.asyncProperty(shortQueryArb, async (query) => {
        const response = await getTokenHandler({ query }, tempDir);
        assert.equal(
          response.isError,
          true,
          `Expected error for query "${query}" without layer filter`,
        );
      }),
      { numRuns: 100 },
    );
  });
});
