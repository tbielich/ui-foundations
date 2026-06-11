/**
 * Property tests for MCP Server validation tools.
 *
 * Property 12: Invalid enum parameter rejection
 * Property 13: Token name validation structural invariant
 * Property 14: Token naming rule enforcement
 *
 * Feature: mcp-server, Property 12: Invalid enum parameter rejection
 * Feature: mcp-server, Property 13: Token name validation structural invariant
 * Feature: mcp-server, Property 14: Token naming rule enforcement
 *
 * Validates: Requirements 12.5, 14.2, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 16.2, 16.3, 18.3
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';

import { getTokenHandler } from '../../src/tools/get-token.js';
import { getRuleHandler } from '../../src/tools/get-rule.js';
import { validateTokenNameHandler } from '../../src/tools/validate-token-name.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Valid layer values for get_token tool. */
const VALID_TOKEN_LAYERS = ['core', 'semantic', 'component', 'mode', 'brand'];

/** Valid categories for get_rule tool. */
const VALID_RULE_CATEGORIES = [
  'naming',
  'layering',
  'theming',
  'design-to-code',
  'review',
  'agent-readiness',
];

/** Known layer prefixes for token names (PascalCase first segments). */
const KNOWN_LAYER_PREFIXES = [
  'Button',
  'Color',
  'Typography',
  'Corner',
  'Spacing',
  'Size',
  'Label',
  'Input',
  'Icon',
  'Checkbox',
  'Radio',
  'Switch',
  'Slider',
  'Link',
  'ButtonGroup',
];

/** Recognized state values (valid as last segment). */
const RECOGNIZED_STATES = ['default', 'hover', 'active', 'focus', 'disabled'];

/** Device labels that are forbidden. */
const DEVICE_LABELS = ['mobile', 'tablet', 'desktop'];

/** A dummy rootPath for testing (handlers that need files may fail but we test error paths). */
const ROOT_PATH = '/tmp/test-validation-root';

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Generates invalid layer values (strings not in VALID_TOKEN_LAYERS). */
const invalidLayerArb = fc
  .string({ minLength: 1, maxLength: 30 })
  .filter((s) => !VALID_TOKEN_LAYERS.includes(s.toLowerCase()));

/** Generates invalid rule categories (strings not in VALID_RULE_CATEGORIES). */
const invalidCategoryArb = fc
  .string({ minLength: 1, maxLength: 30 })
  .filter((s) => {
    const normalized = s.trim().replace(/[_\s]+/g, '-').toLowerCase();
    return !VALID_RULE_CATEGORIES.includes(normalized);
  });

/** Generates arbitrary non-empty strings for token name validation. */
const arbitraryTokenNameArb = fc.string({ minLength: 1, maxLength: 200 });

/** Generates a valid lowercase/kebab-case segment (no device labels). */
const lowercaseSegmentArb = fc
  .string({ minLength: 1, maxLength: 15 })
  .filter((s) => /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(s))
  .filter((s) => !DEVICE_LABELS.includes(s));

/** Generates a valid first segment (PascalCase from known layers). */
const validFirstSegmentArb = fc.constantFrom(...KNOWN_LAYER_PREFIXES);

/**
 * Generates a fully valid token name:
 * - PascalCase first segment from known layers
 * - At least 1 additional lowercase/kebab-case segment (no device labels)
 * - Optionally ends with a recognized state
 * - ≥2 segments, ≤200 chars total
 */
const validTokenNameArb = fc
  .tuple(
    validFirstSegmentArb,
    fc.array(lowercaseSegmentArb, { minLength: 1, maxLength: 4 }),
    fc.boolean(),
  )
  .map(([first, middle, addState]) => {
    const segments = [first, ...middle];
    if (addState) {
      // Replace last segment with a recognized state or append one
      const state = RECOGNIZED_STATES[Math.floor(Math.random() * RECOGNIZED_STATES.length)];
      segments.push(state);
    }
    return segments.join('.');
  })
  .filter((name) => name.length <= 200 && name.split('.').length >= 2);

/**
 * Generates token names that violate the PascalCase-first-segment rule.
 * First segment starts with lowercase.
 */
const invalidFirstSegmentArb = fc
  .tuple(
    fc.string({ minLength: 1, maxLength: 10 }).filter((s) => /^[a-z][a-z0-9]+$/.test(s)),
    fc.array(lowercaseSegmentArb, { minLength: 1, maxLength: 3 }),
  )
  .map(([first, rest]) => [first, ...rest].join('.'));

/**
 * Generates token names containing a device label segment.
 */
const tokenNameWithDeviceLabelArb = fc
  .tuple(
    validFirstSegmentArb,
    lowercaseSegmentArb,
    fc.constantFrom(...DEVICE_LABELS),
    lowercaseSegmentArb,
  )
  .map(([first, seg1, device, seg2]) => `${first}.${seg1}.${device}.${seg2}`);

/**
 * Generates token names with only a single segment (violates ≥2 segments rule).
 */
const singleSegmentNameArb = fc.constantFrom(...KNOWN_LAYER_PREFIXES);

/**
 * Generates token names exceeding 200 characters.
 */
const tooLongTokenNameArb = fc
  .tuple(
    validFirstSegmentArb,
    fc.array(
      fc.string({ minLength: 5, maxLength: 20 }).filter((s) => /^[a-z][a-z0-9-]*[a-z0-9]$/.test(s)),
      { minLength: 10, maxLength: 30 },
    ),
  )
  .map(([first, segments]) => [first, ...segments].join('.'))
  .filter((name) => name.length > 200);

// ---------------------------------------------------------------------------
// Helper to parse tool response JSON
// ---------------------------------------------------------------------------

function parseToolResponse(response: { content: Array<{ type: string; text: string }>; isError?: boolean }) {
  return JSON.parse(response.content[0].text);
}

// ---------------------------------------------------------------------------
// Property 12: Invalid enum parameter rejection
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 12: Invalid enum parameter rejection', () => {
  /**
   * Validates: Requirements 12.5
   */
  it('getTokenHandler rejects invalid layer values and lists all valid layers', async () => {
    await fc.assert(
      fc.asyncProperty(invalidLayerArb, async (invalidLayer) => {
        const response = await getTokenHandler({ query: 'test', layer: invalidLayer }, ROOT_PATH);
        assert.equal(response.isError, true, `Expected error for layer: "${invalidLayer}"`);

        const parsed = parseToolResponse(response);
        assert.ok(parsed.error, 'Error field should be present');

        // Error must list all valid layer values
        for (const validLayer of VALID_TOKEN_LAYERS) {
          assert.ok(
            parsed.error.includes(validLayer),
            `Error should list valid layer "${validLayer}", got: ${parsed.error}`,
          );
        }
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 14.2
   */
  it('getRuleHandler rejects invalid categories and lists all valid categories', async () => {
    await fc.assert(
      fc.asyncProperty(invalidCategoryArb, async (invalidCategory) => {
        const response = await getRuleHandler({ category: invalidCategory }, ROOT_PATH);
        assert.equal(response.isError, true, `Expected error for category: "${invalidCategory}"`);

        const parsed = parseToolResponse(response);
        assert.ok(parsed.error, 'Error field should be present');

        // Error must list all valid categories
        for (const validCat of VALID_RULE_CATEGORIES) {
          assert.ok(
            parsed.error.includes(validCat),
            `Error should list valid category "${validCat}", got: ${parsed.error}`,
          );
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 13: Token name validation structural invariant
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 13: Token name validation structural invariant', () => {
  /**
   * Validates: Requirements 15.1, 15.2, 15.3
   *
   * For any token name string, the response always has boolean `valid`.
   * When false: non-empty violations (each with ruleNumber+message), non-null suggestedName.
   * When true: empty violations array.
   */
  it('response always has boolean valid field for arbitrary strings', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryTokenNameArb, async (name) => {
        const response = await validateTokenNameHandler({ name }, ROOT_PATH);

        // Should never be an error response (validation always returns a result)
        assert.equal(response.isError, undefined);

        const parsed = parseToolResponse(response);
        assert.equal(typeof parsed.valid, 'boolean', 'valid field must be a boolean');
      }),
      { numRuns: 100 },
    );
  });

  it('when valid is false: violations is non-empty with ruleNumber and message, suggestedName is non-null', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Use names likely to be invalid: lowercase first segment
        invalidFirstSegmentArb,
        async (name) => {
          const response = await validateTokenNameHandler({ name }, ROOT_PATH);
          const parsed = parseToolResponse(response);

          if (parsed.valid === false) {
            // Violations must be a non-empty array
            assert.ok(Array.isArray(parsed.violations), 'violations must be an array');
            assert.ok(parsed.violations.length > 0, 'violations must be non-empty when invalid');

            // Each violation must have ruleNumber and message
            for (const violation of parsed.violations) {
              assert.equal(
                typeof violation.ruleNumber,
                'string',
                'Each violation must have a string ruleNumber',
              );
              assert.ok(violation.ruleNumber.length > 0, 'ruleNumber must be non-empty');
              assert.equal(
                typeof violation.message,
                'string',
                'Each violation must have a string message',
              );
              assert.ok(violation.message.length > 0, 'message must be non-empty');
            }

            // suggestedName must be non-null (can be a string)
            assert.notEqual(parsed.suggestedName, null, 'suggestedName must be non-null when invalid');
            assert.equal(typeof parsed.suggestedName, 'string', 'suggestedName must be a string');
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('when valid is true: violations is an empty array', async () => {
    await fc.assert(
      fc.asyncProperty(validTokenNameArb, async (name) => {
        const response = await validateTokenNameHandler({ name }, ROOT_PATH);
        const parsed = parseToolResponse(response);

        if (parsed.valid === true) {
          assert.ok(Array.isArray(parsed.violations), 'violations must be an array');
          assert.equal(parsed.violations.length, 0, 'violations must be empty when valid is true');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('structural invariant holds for completely random strings including edge cases', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.string({ minLength: 0, maxLength: 250 }),
          fc.constantFrom('', '   ', '.', '..', '...', 'A', 'a.b.c'),
        ),
        async (name) => {
          const response = await validateTokenNameHandler({ name }, ROOT_PATH);
          const parsed = parseToolResponse(response);

          // Always has boolean valid
          assert.equal(typeof parsed.valid, 'boolean');

          // Always has violations array
          assert.ok(Array.isArray(parsed.violations));

          if (parsed.valid) {
            assert.equal(parsed.violations.length, 0);
          } else {
            assert.ok(parsed.violations.length > 0);
            for (const v of parsed.violations) {
              assert.equal(typeof v.ruleNumber, 'string');
              assert.equal(typeof v.message, 'string');
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 14: Token naming rule enforcement
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 14: Token naming rule enforcement', () => {
  /**
   * Validates: Requirements 15.4, 15.5, 15.6
   *
   * Names conforming to all rules validate as true.
   */
  it('well-formed token names (PascalCase layer, lowercase segments, no device labels, ≥2 segments, ≤200 chars) validate as true', async () => {
    await fc.assert(
      fc.asyncProperty(validTokenNameArb, async (name) => {
        const response = await validateTokenNameHandler({ name }, ROOT_PATH);
        const parsed = parseToolResponse(response);

        assert.equal(
          parsed.valid,
          true,
          `Expected valid=true for well-formed name "${name}", got violations: ${JSON.stringify(parsed.violations)}`,
        );
        assert.equal(parsed.violations.length, 0);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Names violating PascalCase first segment rule validate as false.
   */
  it('names with non-PascalCase first segment validate as false with violation', async () => {
    await fc.assert(
      fc.asyncProperty(invalidFirstSegmentArb, async (name) => {
        const response = await validateTokenNameHandler({ name }, ROOT_PATH);
        const parsed = parseToolResponse(response);

        assert.equal(
          parsed.valid,
          false,
          `Expected valid=false for non-PascalCase first segment in "${name}"`,
        );
        assert.ok(parsed.violations.length > 0, 'Should have at least one violation');
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Names containing device labels validate as false.
   */
  it('names containing device labels (mobile, tablet, desktop) validate as false', async () => {
    await fc.assert(
      fc.asyncProperty(tokenNameWithDeviceLabelArb, async (name) => {
        const response = await validateTokenNameHandler({ name }, ROOT_PATH);
        const parsed = parseToolResponse(response);

        assert.equal(
          parsed.valid,
          false,
          `Expected valid=false for name with device label: "${name}"`,
        );
        assert.ok(parsed.violations.length > 0, 'Should have at least one violation');

        // At least one violation should mention device label
        const hasDeviceLabelViolation = parsed.violations.some(
          (v: { message: string }) =>
            v.message.toLowerCase().includes('device label') ||
            v.message.toLowerCase().includes('mobile') ||
            v.message.toLowerCase().includes('tablet') ||
            v.message.toLowerCase().includes('desktop'),
        );
        assert.ok(hasDeviceLabelViolation, 'Should have a device label violation');
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Single-segment names (missing dot separator) validate as false.
   */
  it('single-segment names (no dot separator) validate as false', async () => {
    await fc.assert(
      fc.asyncProperty(singleSegmentNameArb, async (name) => {
        const response = await validateTokenNameHandler({ name }, ROOT_PATH);
        const parsed = parseToolResponse(response);

        assert.equal(
          parsed.valid,
          false,
          `Expected valid=false for single-segment name: "${name}"`,
        );
        assert.ok(parsed.violations.length > 0, 'Should have at least one violation');
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Names exceeding 200 characters validate as false.
   */
  it('names exceeding 200 characters validate as false', async () => {
    await fc.assert(
      fc.asyncProperty(tooLongTokenNameArb, async (name) => {
        const response = await validateTokenNameHandler({ name }, ROOT_PATH);
        const parsed = parseToolResponse(response);

        assert.equal(
          parsed.valid,
          false,
          `Expected valid=false for name exceeding 200 chars (length: ${name.length})`,
        );
        assert.ok(parsed.violations.length > 0, 'Should have at least one violation');
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Empty or whitespace-only names validate as false.
   */
  it('empty or whitespace-only names validate as false', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('', ' ', '  ', '\t', '\n', '   \t\n  '),
        async (name) => {
          const response = await validateTokenNameHandler({ name }, ROOT_PATH);
          const parsed = parseToolResponse(response);

          assert.equal(
            parsed.valid,
            false,
            `Expected valid=false for empty/whitespace name: "${name}"`,
          );
          assert.ok(parsed.violations.length > 0, 'Should have at least one violation');
        },
      ),
      { numRuns: 100 },
    );
  });
});
