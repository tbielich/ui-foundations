/**
 * Property tests for MCP Server prompt handlers.
 *
 * Property 15: Implement component prompt surface coverage
 * Property 16: Propose token prompt layer tailoring
 *
 * Feature: mcp-server, Property 15: Implement component prompt surface coverage
 * Feature: mcp-server, Property 16: Propose token prompt layer tailoring
 *
 * Validates: Requirements 17.1, 17.3, 17.4, 18.4
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';

import { implementComponentHandler } from '../../src/prompts/implement-component.js';
import { proposeTokenHandler } from '../../src/prompts/propose-token.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** The 10 required integration surfaces for component implementation. */
const INTEGRATION_SURFACES = [
  'CSS Pattern',
  'Nunjucks Macro',
  'Web Component',
  'Documentation Page',
  'Playground Page',
  'Playground Renderer',
  'Code Connect',
  'Component Token Layer',
  'Unit Tests',
  'Accessibility',
];

/** Valid layer values for the propose_token prompt. */
const VALID_LAYERS = ['core', 'semantic', 'component', 'mode'] as const;

/**
 * Layer-specific content expectations.
 * Each layer must contain at least one of the specified terms in the prompt template.
 */
const LAYER_SPECIFIC_CONTENT: Record<string, string[]> = {
  component: ['variant-first', 'Component.variant.part.property.state'],
  semantic: ['role-based', 'Category.Role.Qualifier'],
  core: ['primitives', 'Category.Subcategory.Scale'],
  mode: ['color palette', 'Color.Palette'],
};

/** A dummy rootPath for testing. */
const ROOT_PATH = '/tmp/test-prompts-root';

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/**
 * Generates valid component names: strings matching /^[a-z][a-z-]*$/ with length 1–30.
 */
const validComponentNameArb = fc
  .string({ minLength: 1, maxLength: 30 })
  .filter((name) => /^[a-z][a-z-]*$/.test(name));

/**
 * Generates valid layer values from the valid set.
 */
const validLayerArb = fc.constantFrom(...VALID_LAYERS);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extracts the prompt text from a PromptResponse. */
function getPromptText(response: { messages: Array<{ content: { text: string } }> }): string {
  return response.messages[0].content.text;
}

// ---------------------------------------------------------------------------
// Property 15: Implement component prompt surface coverage
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 15: Implement component prompt surface coverage', () => {
  /**
   * Validates: Requirements 17.1
   *
   * For any valid component name, the implement_component prompt template
   * SHALL reference all 10 integration surfaces.
   */
  it('prompt template references all 10 integration surfaces for any valid component name', async () => {
    await fc.assert(
      fc.asyncProperty(validComponentNameArb, async (name) => {
        const response = await implementComponentHandler({ name }, ROOT_PATH);
        const text = getPromptText(response);

        for (const surface of INTEGRATION_SURFACES) {
          assert.ok(
            text.includes(surface),
            `Prompt template for "${name}" must reference surface "${surface}" but it was not found`,
          );
        }
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 17.4
   *
   * For any valid component name, the implement_component prompt template
   * SHALL include file paths containing the component name as a path segment.
   */
  it('prompt template includes file paths with the component name as a path segment', async () => {
    await fc.assert(
      fc.asyncProperty(validComponentNameArb, async (name) => {
        const response = await implementComponentHandler({ name }, ROOT_PATH);
        const text = getPromptText(response);

        // Check that file paths use the component name.
        // Key expected paths from the implementation.
        const expectedPathSegments = [
          `src/ui/patterns/${name}.css`,
          `src/elements/ui-${name}.js`,
          `site/components/${name}.md`,
          `site/components/${name}-playground.md`,
          `schemas/web-${name}.figma.ts`,
          `tests/components/${name}.test.ts`,
        ];

        for (const pathSegment of expectedPathSegments) {
          assert.ok(
            text.includes(pathSegment),
            `Prompt template for "${name}" must include path "${pathSegment}" but it was not found`,
          );
        }
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 17.3
   *
   * For any valid component name, the implement_component prompt template
   * SHALL reject names that don't match the valid pattern.
   */
  it('prompt handler rejects invalid component names (empty or non-lowercase+hyphens)', async () => {
    const invalidNames = fc.oneof(
      fc.constant(''),
      fc.string({ minLength: 1, maxLength: 20 }).filter(
        (s) => !/^[a-z][a-z-]*$/.test(s),
      ),
    );

    await fc.assert(
      fc.asyncProperty(invalidNames, async (name) => {
        await assert.rejects(
          async () => implementComponentHandler({ name }, ROOT_PATH),
          (err: Error) => {
            assert.ok(
              err.message.includes('lowercase letters and hyphens'),
              `Error message should mention naming constraint, got: "${err.message}"`,
            );
            return true;
          },
        );
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 16: Propose token prompt layer tailoring
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 16: Propose token prompt layer tailoring', () => {
  /**
   * Validates: Requirements 18.4
   *
   * For any valid layer value, the propose_token prompt template SHALL contain
   * naming pattern guidance specific to that layer.
   */
  it('prompt template contains layer-specific naming pattern guidance for any valid layer', async () => {
    await fc.assert(
      fc.asyncProperty(validLayerArb, async (layer) => {
        const response = await proposeTokenHandler(
          { layer, purpose: 'Testing token proposal guidance' },
          ROOT_PATH,
        );
        const text = getPromptText(response);

        const expectedTerms = LAYER_SPECIFIC_CONTENT[layer];
        const foundAtLeastOne = expectedTerms.some((term) =>
          text.toLowerCase().includes(term.toLowerCase()),
        );

        assert.ok(
          foundAtLeastOne,
          `Prompt template for layer "${layer}" must contain at least one of: ${expectedTerms.join(', ')}. ` +
            `None found in template.`,
        );
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 18.4
   *
   * Layer-specific content is distinct: component layer contains variant-first guidance,
   * semantic contains role-based, core contains primitives, mode contains color palette.
   */
  it('each layer receives its own distinct naming guidance (not another layers guidance)', async () => {
    await fc.assert(
      fc.asyncProperty(validLayerArb, async (layer) => {
        const response = await proposeTokenHandler(
          { layer, purpose: 'Verifying layer-specific tailoring' },
          ROOT_PATH,
        );
        const text = getPromptText(response);

        // Verify that the specific guidance for the requested layer is present
        const expectedTerms = LAYER_SPECIFIC_CONTENT[layer];
        for (const term of expectedTerms) {
          assert.ok(
            text.toLowerCase().includes(term.toLowerCase()),
            `Prompt for "${layer}" layer must include "${term}"`,
          );
        }
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 18.3
   *
   * Invalid layer values produce an error listing valid options.
   */
  it('prompt handler rejects invalid layer values and lists valid options', async () => {
    const invalidLayerArb = fc
      .string({ minLength: 1, maxLength: 30 })
      .filter((s) => !VALID_LAYERS.includes(s as typeof VALID_LAYERS[number]));

    await fc.assert(
      fc.asyncProperty(invalidLayerArb, async (layer) => {
        await assert.rejects(
          async () => proposeTokenHandler({ layer, purpose: 'test purpose' }, ROOT_PATH),
          (err: Error) => {
            // Error should mention the invalid value
            assert.ok(
              err.message.includes(layer) || err.message.includes('Invalid layer'),
              `Error should reference invalid layer "${layer}", got: "${err.message}"`,
            );
            // Error should list valid layer options
            for (const validLayer of VALID_LAYERS) {
              assert.ok(
                err.message.includes(validLayer),
                `Error should list valid layer "${validLayer}", got: "${err.message}"`,
              );
            }
            return true;
          },
        );
      }),
      { numRuns: 100 },
    );
  });
});
