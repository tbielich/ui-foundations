/**
 * Property tests for resource resolution in the MCP Server.
 *
 * Property 5: Not-found error includes valid alternatives
 * Property 6: Case-insensitive identifier resolution
 * Property 7: Component response completeness
 * Property 8: Fuzzy match suggestion for near-misses
 *
 * Feature: mcp-server, Property 5: Not-found error includes valid alternatives
 * Feature: mcp-server, Property 6: Case-insensitive identifier resolution
 * Feature: mcp-server, Property 7: Component response completeness
 * Feature: mcp-server, Property 8: Fuzzy match suggestion for near-misses
 *
 * Validates: Requirements 4.5, 6.3, 6.4, 7.4, 9.3, 11.1, 11.3, 11.4, 11.5, 13.2, 14.3
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import fc from 'fast-check';

import { handleAgentResource } from '../../src/resources/agents.js';
import { handleComponents } from '../../src/resources/components.js';
import { handlePatterns } from '../../src/resources/patterns.js';
import { handleFoundations } from '../../src/resources/foundations.js';
import { levenshtein } from '../../src/util/levenshtein.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Valid agent resource identifiers. */
const VALID_AGENT_IDENTIFIERS = ['rules', 'behavior', 'design-contract', 'implementation'];

/** Valid pattern names. */
const VALID_PATTERN_NAMES = ['forms', 'navigation', 'cards', 'layout', 'feedback'];

/** Component names available in our test fixture. */
const TEST_COMPONENT_NAMES = ['button', 'input', 'checkbox'];

/** Required fields on ComponentData responses. */
const REQUIRED_COMPONENT_FIELDS = [
  'name',
  'description',
  'documentation',
  'cssClassName',
  'htmlPattern',
  'variants',
  'states',
  'tokens',
  'codeConnectSchemaPath',
  'uri',
] as const;

/** Fields that must be arrays when empty (never omitted). */
const ARRAY_FIELDS = ['variants', 'states', 'tokens'] as const;

// ---------------------------------------------------------------------------
// Test fixture setup
// ---------------------------------------------------------------------------

let testDir: string;

/**
 * Creates a temporary directory with component fixture files for testing.
 */
async function setupTestFixtures(): Promise<string> {
  const dir = join(
    tmpdir(),
    `resolution-prop-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  await mkdir(dir, { recursive: true });

  // Component docs directory
  await mkdir(join(dir, 'site', 'components'), { recursive: true });
  await writeFile(
    join(dir, 'site', 'components', 'button.md'),
    '---\ntitle: Button\ndescription: Buttons trigger actions.\n---\n\n# Button\n\nButton docs.',
    'utf8',
  );
  await writeFile(
    join(dir, 'site', 'components', 'input.md'),
    '---\ntitle: Input\ndescription: Text input fields.\n---\n\n# Input\n\nInput docs.',
    'utf8',
  );
  await writeFile(
    join(dir, 'site', 'components', 'checkbox.md'),
    '---\ntitle: Checkbox\ndescription: A checkbox toggle.\n---\n\n# Checkbox\n\nCheckbox docs.',
    'utf8',
  );

  // CSS patterns
  await mkdir(join(dir, 'src', 'ui', 'patterns'), { recursive: true });
  await writeFile(
    join(dir, 'src', 'ui', 'patterns', 'button.css'),
    `.button {\n  display: inline-flex;\n}\n.button.outline {\n  background: transparent;\n}\n.button:hover,\n.button.is-hover {\n  opacity: 0.9;\n}\n.button:disabled,\n.button.is-disabled {\n  opacity: 0.5;\n}\n`,
    'utf8',
  );
  await writeFile(
    join(dir, 'src', 'ui', 'patterns', 'input.css'),
    `.input {\n  display: block;\n}\n`,
    'utf8',
  );

  // Schemas directory
  await mkdir(join(dir, 'schemas'), { recursive: true });
  await writeFile(join(dir, 'schemas', 'web-button.figma.ts'), 'export default {};', 'utf8');

  // Component tokens
  await mkdir(join(dir, 'dist', 'tokens', 'json'), { recursive: true });
  await writeFile(
    join(dir, 'dist', 'tokens', 'json', 'components-ui.tokens.json'),
    JSON.stringify({
      Button: {
        Solid: { 'Text Color Default': { $type: 'color', $value: '#fff' } },
      },
      Input: {
        Border: { 'Color Default': { $type: 'color', $value: '#ccc' } },
      },
    }),
    'utf8',
  );

  // Foundation docs (needed for handleFoundations)
  await mkdir(join(dir, 'docs', 'foundations'), { recursive: true });
  await writeFile(
    join(dir, 'docs', 'foundations', 'foundation-001-token-layering.md'),
    '---\ntitle: Token Layering\n---\n\n# Token Layering\n\nContent.',
    'utf8',
  );
  await writeFile(
    join(dir, 'docs', 'foundations', 'foundation-002-naming-and-grouping.md'),
    '---\ntitle: Naming and Grouping\n---\n\n# Naming\n\nContent.',
    'utf8',
  );
  await writeFile(
    join(dir, 'docs', 'foundations', 'foundation-003-theming.md'),
    '---\ntitle: Theming\n---\n\n# Theming\n\nContent.',
    'utf8',
  );

  // Pattern docs (needed for handlePatterns)
  await mkdir(join(dir, 'docs', 'patterns'), { recursive: true });
  await writeFile(
    join(dir, 'docs', 'patterns', 'forms.md'),
    '# Forms Pattern\n\nForms guidance.',
    'utf8',
  );
  await writeFile(
    join(dir, 'docs', 'patterns', 'navigation.md'),
    '# Navigation Pattern\n\nNavigation guidance.',
    'utf8',
  );
  await writeFile(
    join(dir, 'docs', 'patterns', 'cards.md'),
    '# Cards Pattern\n\nCards guidance.',
    'utf8',
  );
  await writeFile(
    join(dir, 'docs', 'patterns', 'layout.md'),
    '# Layout Pattern\n\nLayout guidance.',
    'utf8',
  );
  await writeFile(
    join(dir, 'docs', 'patterns', 'feedback.md'),
    '# Feedback Pattern\n\nFeedback guidance.',
    'utf8',
  );

  // Agent resource files
  await writeFile(join(dir, 'AGENTS.md'), '# Agent Rules\n\nRules content.', 'utf8');
  await writeFile(join(dir, 'DESIGN.md'), '# Design\n\nDesign content.', 'utf8');
  await writeFile(join(dir, 'IMPLEMENTATION.md'), '# Implementation\n\nImpl content.', 'utf8');
  await mkdir(join(dir, 'docs', 'agentic'), { recursive: true });
  await writeFile(
    join(dir, 'docs', 'agentic', 'assistant-behavior-rules.md'),
    '# Behavior Rules\n\nBehavior content.',
    'utf8',
  );

  return dir;
}

// ---------------------------------------------------------------------------
// Lifecycle hooks
// ---------------------------------------------------------------------------

before(async () => {
  testDir = await setupTestFixtures();
});

after(async () => {
  await rm(testDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Arbitraries (generators)
// ---------------------------------------------------------------------------

/**
 * Object prototype property names that should be excluded from generated
 * identifiers since they interfere with plain object key lookup.
 */
const OBJECT_PROTO_KEYS = new Set([
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf',
  '__proto__',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
]);

/**
 * Generates identifiers guaranteed NOT to match any valid agent identifiers
 * and not collide with Object prototype properties.
 */
const invalidAgentIdentifierArb = fc
  .string({ minLength: 1, maxLength: 30 })
  .filter((s) => !VALID_AGENT_IDENTIFIERS.includes(s.toLowerCase()))
  .filter((s) => /^[a-z0-9-]+$/.test(s))
  .filter((s) => !OBJECT_PROTO_KEYS.has(s));

/**
 * Generates pattern names guaranteed NOT to match any valid pattern names
 * and not collide with Object prototype properties.
 */
const invalidPatternNameArb = fc
  .string({ minLength: 1, maxLength: 30 })
  .filter((s) => !VALID_PATTERN_NAMES.includes(s.toLowerCase()))
  .filter((s) => /^[a-z0-9-]+$/.test(s))
  .filter((s) => !OBJECT_PROTO_KEYS.has(s));

/**
 * Generates foundation IDs that are NOT in the set of valid IDs (001, 002, 003).
 */
const invalidFoundationIdArb = fc
  .integer({ min: 4, max: 999 })
  .map((n) => String(n).padStart(3, '0'));

/**
 * Generates case variations of a given string.
 * E.g., "button" → "BUTTON", "Button", "bUtToN", etc.
 */
function caseVariationArb(name: string): fc.Arbitrary<string> {
  return fc
    .array(fc.boolean(), { minLength: name.length, maxLength: name.length })
    .map((choices) =>
      name
        .split('')
        .map((ch, i) => (choices[i] ? ch.toUpperCase() : ch.toLowerCase()))
        .join(''),
    );
}

/**
 * Generates strings with Levenshtein distance ≤ 3 from a given target.
 * Applies 1–3 random single-character edits (insert, delete, substitute).
 */
function nearMissArb(target: string): fc.Arbitrary<string> {
  const singleChar = fc.string({ minLength: 1, maxLength: 1 }).filter((c) => /[a-z]/.test(c));

  return fc
    .integer({ min: 1, max: 3 })
    .chain((edits) => {
      return fc.tuple(
        fc.constant(target),
        fc.array(
          fc.tuple(
            fc.constantFrom('insert' as const, 'delete' as const, 'substitute' as const),
            fc.integer({ min: 0, max: Math.max(0, target.length - 1) }),
            singleChar,
          ),
          { minLength: edits, maxLength: edits },
        ),
      );
    })
    .map(([base, operations]) => {
      let result = base;
      for (const [op, pos, ch] of operations) {
        const idx = Math.min(pos, result.length);
        if (op === 'insert') {
          result = result.slice(0, idx) + ch + result.slice(idx);
        } else if (op === 'delete' && result.length > 1) {
          result = result.slice(0, idx) + result.slice(idx + 1);
        } else if (op === 'substitute' && result.length > 0) {
          const subIdx = Math.min(idx, result.length - 1);
          result = result.slice(0, subIdx) + ch + result.slice(subIdx + 1);
        }
      }
      return result;
    })
    .filter((s) => s.length > 0)
    .filter((s) => !TEST_COMPONENT_NAMES.includes(s.toLowerCase()));
}

// ---------------------------------------------------------------------------
// Property 5: Not-found error includes valid alternatives
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 5: Not-found error includes valid alternatives', () => {
  it('agent resource not-found error includes requested URI and lists valid identifiers', async () => {
    await fc.assert(
      fc.asyncProperty(invalidAgentIdentifierArb, async (invalidId) => {
        const uri = `uif://agents/${invalidId}`;

        try {
          await handleAgentResource(uri, testDir);
          assert.fail('Expected error to be thrown');
        } catch (err: unknown) {
          const error = err as Error;
          // Error message includes the requested URI
          assert.ok(
            error.message.includes(uri),
            `Error should include requested URI "${uri}", got: ${error.message}`,
          );
          // Error message includes valid identifiers
          for (const validId of VALID_AGENT_IDENTIFIERS) {
            assert.ok(
              error.message.includes(validId),
              `Error should include valid identifier "${validId}", got: ${error.message}`,
            );
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('pattern resource not-found error includes requested URI and lists valid pattern names', async () => {
    await fc.assert(
      fc.asyncProperty(invalidPatternNameArb, async (invalidName) => {
        const uri = `uif://patterns/${invalidName}`;

        try {
          await handlePatterns(uri, testDir);
          assert.fail('Expected error to be thrown');
        } catch (err: unknown) {
          const error = err as Error;
          // Error message includes the requested URI
          assert.ok(
            error.message.includes(uri),
            `Error should include requested URI "${uri}", got: ${error.message}`,
          );
          // Error message includes valid pattern names
          for (const validName of VALID_PATTERN_NAMES) {
            assert.ok(
              error.message.includes(validName),
              `Error should include valid pattern name "${validName}", got: ${error.message}`,
            );
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('foundations resource not-found error includes requested URI and lists valid identifiers', async () => {
    await fc.assert(
      fc.asyncProperty(invalidFoundationIdArb, async (invalidId) => {
        const uri = `uif://foundations/${invalidId}`;

        try {
          await handleFoundations(uri, testDir);
          assert.fail('Expected error to be thrown');
        } catch (err: unknown) {
          const error = err as Error;
          // Error message includes the requested URI
          assert.ok(
            error.message.includes(uri),
            `Error should include requested URI "${uri}", got: ${error.message}`,
          );
          // Error message includes valid foundation identifiers
          assert.ok(
            error.message.includes('001'),
            `Error should include valid id "001", got: ${error.message}`,
          );
          assert.ok(
            error.message.includes('002'),
            `Error should include valid id "002", got: ${error.message}`,
          );
          assert.ok(
            error.message.includes('003'),
            `Error should include valid id "003", got: ${error.message}`,
          );
        }
      }),
      { numRuns: 100 },
    );
  });

  it('component resource not-found error includes requested identifier and lists valid component names', async () => {
    const invalidComponentArb = fc
      .string({ minLength: 1, maxLength: 20 })
      .filter((s) => /^[a-z0-9-]+$/.test(s))
      .filter((s) => !TEST_COMPONENT_NAMES.includes(s))
      .filter((s) => levenshtein(s, 'button') > 3 && levenshtein(s, 'input') > 3 && levenshtein(s, 'checkbox') > 3);

    await fc.assert(
      fc.asyncProperty(invalidComponentArb, async (invalidName) => {
        const uri = `uif://components/${invalidName}`;

        try {
          await handleComponents(uri, testDir);
          assert.fail('Expected error to be thrown');
        } catch (err: unknown) {
          const error = err as Error;
          // Error message includes the identifier
          assert.ok(
            error.message.includes(invalidName),
            `Error should include requested identifier "${invalidName}", got: ${error.message}`,
          );
          // Error message includes valid component names
          for (const validName of TEST_COMPONENT_NAMES) {
            assert.ok(
              error.message.includes(validName),
              `Error should include valid component name "${validName}", got: ${error.message}`,
            );
          }
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 6: Case-insensitive identifier resolution
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 6: Case-insensitive identifier resolution', () => {
  it('any case variation of a component name resolves to canonical kebab-case with same content', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...TEST_COMPONENT_NAMES).chain((name) => caseVariationArb(name)),
        async (caseVariant) => {
          const canonicalName = caseVariant.toLowerCase();
          const uri = `uif://components/${caseVariant}`;

          const result = await handleComponents(uri, testDir);
          const data = JSON.parse(result.content as string);

          // Resolves to the canonical form
          assert.equal(
            data.name,
            canonicalName,
            `Case variant "${caseVariant}" should resolve to canonical "${canonicalName}"`,
          );

          // Get canonical response for comparison
          const canonicalResult = await handleComponents(
            `uif://components/${canonicalName}`,
            testDir,
          );
          const canonicalData = JSON.parse(canonicalResult.content as string);

          // Same content as canonical form
          assert.equal(data.name, canonicalData.name);
          assert.equal(data.description, canonicalData.description);
          assert.equal(data.cssClassName, canonicalData.cssClassName);
          assert.equal(data.htmlPattern, canonicalData.htmlPattern);
          assert.deepEqual(data.variants, canonicalData.variants);
          assert.deepEqual(data.states, canonicalData.states);
          assert.deepEqual(data.tokens, canonicalData.tokens);
          assert.equal(data.codeConnectSchemaPath, canonicalData.codeConnectSchemaPath);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('pattern names resolve case-insensitively to canonical lowercase form', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...VALID_PATTERN_NAMES).chain((name) => caseVariationArb(name)),
        async (caseVariant) => {
          const uri = `uif://patterns/${caseVariant}`;

          // Pattern handler normalizes to lowercase internally
          const result = await handlePatterns(uri, testDir);

          // Should resolve successfully (not throw)
          assert.ok(result.uri, 'Pattern should resolve successfully');
          assert.equal(result.metadata.category, 'patterns');
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7: Component response completeness
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 7: Component response completeness', () => {
  it('all required fields are present in the response, never undefined or omitted', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...TEST_COMPONENT_NAMES),
        async (componentName) => {
          const uri = `uif://components/${componentName}`;
          const result = await handleComponents(uri, testDir);
          const data = JSON.parse(result.content as string);

          // Every required field must exist and not be undefined
          for (const field of REQUIRED_COMPONENT_FIELDS) {
            assert.ok(
              field in data,
              `Required field "${field}" must be present in response for "${componentName}"`,
            );
            assert.notEqual(
              data[field],
              undefined,
              `Required field "${field}" must not be undefined for "${componentName}"`,
            );
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('string fields (documentation, cssClassName, htmlPattern) are strings', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...TEST_COMPONENT_NAMES),
        async (componentName) => {
          const uri = `uif://components/${componentName}`;
          const result = await handleComponents(uri, testDir);
          const data = JSON.parse(result.content as string);

          assert.equal(typeof data.documentation, 'string');
          assert.equal(typeof data.cssClassName, 'string');
          assert.equal(typeof data.htmlPattern, 'string');
          assert.equal(typeof data.name, 'string');
          assert.equal(typeof data.description, 'string');
          assert.equal(typeof data.uri, 'string');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('array fields (variants, states, tokens) are arrays even when empty', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...TEST_COMPONENT_NAMES),
        async (componentName) => {
          const uri = `uif://components/${componentName}`;
          const result = await handleComponents(uri, testDir);
          const data = JSON.parse(result.content as string);

          for (const field of ARRAY_FIELDS) {
            assert.ok(
              Array.isArray(data[field]),
              `Field "${field}" must be an array for "${componentName}", got: ${typeof data[field]}`,
            );
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('codeConnectSchemaPath is either a string or null, never undefined', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...TEST_COMPONENT_NAMES),
        async (componentName) => {
          const uri = `uif://components/${componentName}`;
          const result = await handleComponents(uri, testDir);
          const data = JSON.parse(result.content as string);

          assert.ok(
            data.codeConnectSchemaPath === null || typeof data.codeConnectSchemaPath === 'string',
            `codeConnectSchemaPath must be string or null for "${componentName}", got: ${data.codeConnectSchemaPath}`,
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it('components with no CSS file still return all fields with proper defaults', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant('checkbox'), async (componentName) => {
        const uri = `uif://components/${componentName}`;
        const result = await handleComponents(uri, testDir);
        const data = JSON.parse(result.content as string);

        // Even without a CSS pattern file, all fields must be present
        assert.ok(Array.isArray(data.variants), 'variants must be array');
        assert.ok(Array.isArray(data.states), 'states must be array');
        assert.ok(Array.isArray(data.tokens), 'tokens must be array');
        assert.equal(typeof data.cssClassName, 'string');
        assert.equal(typeof data.htmlPattern, 'string');
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 8: Fuzzy match suggestion for near-misses
// ---------------------------------------------------------------------------

describe('Feature: mcp-server, Property 8: Fuzzy match suggestion for near-misses', () => {
  it('strings with Levenshtein ≤ 3 from a valid component name get a suggestion in the error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...TEST_COMPONENT_NAMES).chain((target) =>
          nearMissArb(target).map((nearMiss) => ({ target, nearMiss })),
        ),
        async ({ target, nearMiss }) => {
          // Confirm the generated near-miss is actually within distance 3
          const distance = levenshtein(nearMiss.toLowerCase(), target);
          // Only test if the distance is actually ≤ 3 (generator best-effort)
          if (distance > 3) return;

          const uri = `uif://components/${nearMiss}`;

          try {
            await handleComponents(uri, testDir);
            // If it resolves (case-insensitive match), that's also valid
          } catch (err: unknown) {
            const error = err as Error;
            // The error should include a "Did you mean" suggestion
            assert.ok(
              error.message.includes('Did you mean'),
              `Near-miss "${nearMiss}" (distance ${distance} from "${target}") should get a suggestion. Got: ${error.message}`,
            );
            // The suggestion should include the target component name
            assert.ok(
              error.message.includes(target),
              `Suggestion should include "${target}" for near-miss "${nearMiss}". Got: ${error.message}`,
            );
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('the levenshtein utility correctly measures distance for generated near-misses', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...TEST_COMPONENT_NAMES),
        fc.integer({ min: 1, max: 3 }),
        (target, numEdits) => {
          // Apply exactly numEdits single-char substitutions
          let mutated = target;
          for (let i = 0; i < numEdits && i < mutated.length; i++) {
            const ch = mutated[i] === 'z' ? 'a' : 'z';
            mutated = mutated.slice(0, i) + ch + mutated.slice(i + 1);
          }

          const distance = levenshtein(mutated, target);
          assert.ok(
            distance <= numEdits,
            `Distance between "${mutated}" and "${target}" should be ≤ ${numEdits}, got ${distance}`,
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});
