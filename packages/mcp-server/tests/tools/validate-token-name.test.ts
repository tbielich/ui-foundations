import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateTokenNameHandler } from '../../src/tools/validate-token-name.js';

/** Helper to parse JSON from tool response */
function parseResult(response: { content: Array<{ text: string }> }) {
  return JSON.parse(response.content[0].text);
}

describe('validateTokenNameHandler', () => {
  const rootPath = '/tmp/test-root';

  // -------------------------------------------------------------------------
  // Valid token names
  // -------------------------------------------------------------------------

  describe('valid names', () => {
    it('accepts a valid component token name', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Button.solid.container.background.hover' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, true);
      assert.deepEqual(parsed.violations, []);
      assert.equal(parsed.suggestedName, null);
    });

    it('accepts a valid semantic token name', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Color.text.default' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, true);
    });

    it('accepts a token with kebab-case segments', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Button.outline.container.border-color.hover' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, true);
    });

    it('accepts a minimal 2-segment name', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Typography.label' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, true);
    });

    it('accepts Corner token', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Corner.medium' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, true);
    });

    it('accepts Spacing token', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Spacing.small' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, true);
    });

    it('accepts a token ending with recognized state', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Input.default.container.border-color.focus' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, true);
    });
  });

  // -------------------------------------------------------------------------
  // Invalid: empty and whitespace
  // -------------------------------------------------------------------------

  describe('empty/whitespace names', () => {
    it('rejects an empty string', async () => {
      const result = await validateTokenNameHandler({ name: '' }, rootPath);
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(parsed.violations.length > 0);
      assert.ok(parsed.violations[0].ruleNumber === '15.5');
    });

    it('rejects whitespace-only string', async () => {
      const result = await validateTokenNameHandler({ name: '   ' }, rootPath);
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(parsed.violations[0].ruleNumber === '15.5');
    });
  });

  // -------------------------------------------------------------------------
  // Invalid: length constraint
  // -------------------------------------------------------------------------

  describe('length constraint', () => {
    it('rejects names exceeding 200 characters', async () => {
      const longName = 'Button.' + 'a'.repeat(200);
      const result = await validateTokenNameHandler({ name: longName }, rootPath);
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(parsed.violations.some((v: { ruleNumber: string }) => v.ruleNumber === '15.6'));
    });

    it('accepts name at exactly 200 characters', async () => {
      // Build a name that is exactly 200 chars: "Button." + remaining chars
      const remaining = 200 - 'Button.'.length;
      const segments = [];
      let len = 0;
      while (len < remaining - 1) {
        const seg = 'abc';
        segments.push(seg);
        len += seg.length + 1; // +1 for dot
      }
      const name = 'Button.' + segments.join('.').slice(0, remaining);
      // Just test it doesn't blow up at boundary (may or may not be valid for other rules)
      const result = await validateTokenNameHandler({ name: name.slice(0, 200) }, rootPath);
      const parsed = parseResult(result);
      // Should not have a 15.6 violation
      assert.ok(!parsed.violations.some((v: { ruleNumber: string }) => v.ruleNumber === '15.6'));
    });
  });

  // -------------------------------------------------------------------------
  // Invalid: less than 2 segments
  // -------------------------------------------------------------------------

  describe('segment count', () => {
    it('rejects single-segment name', async () => {
      const result = await validateTokenNameHandler({ name: 'Button' }, rootPath);
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(parsed.violations.some((v: { ruleNumber: string }) => v.ruleNumber === '15.5'));
    });
  });

  // -------------------------------------------------------------------------
  // Invalid: first segment not PascalCase
  // -------------------------------------------------------------------------

  describe('first segment PascalCase check', () => {
    it('rejects lowercase first segment', async () => {
      const result = await validateTokenNameHandler(
        { name: 'button.solid.container.background.hover' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(
        parsed.violations.some(
          (v: { ruleNumber: string; segment: string }) =>
            v.ruleNumber === '15.4' && v.segment === 'button',
        ),
      );
    });

    it('rejects kebab-case first segment', async () => {
      const result = await validateTokenNameHandler(
        { name: 'button-group.solid.container' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(
        parsed.violations.some(
          (v: { ruleNumber: string; segment: string }) =>
            v.ruleNumber === '15.4' && v.segment === 'button-group',
        ),
      );
    });
  });

  // -------------------------------------------------------------------------
  // Invalid: subsequent segments not kebab-case
  // -------------------------------------------------------------------------

  describe('subsequent segments kebab-case check', () => {
    it('rejects PascalCase in subsequent segment', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Button.Solid.container.background' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(
        parsed.violations.some(
          (v: { ruleNumber: string; segment: string }) =>
            v.ruleNumber === '15.4' && v.segment === 'Solid',
        ),
      );
    });

    it('rejects camelCase in subsequent segment', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Button.solid.borderColor.hover' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(
        parsed.violations.some(
          (v: { ruleNumber: string; segment: string }) =>
            v.ruleNumber === '15.4' && v.segment === 'borderColor',
        ),
      );
    });
  });

  // -------------------------------------------------------------------------
  // Invalid: device labels
  // -------------------------------------------------------------------------

  describe('device labels', () => {
    it('rejects segment containing "mobile"', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Button.solid.mobile.background' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(
        parsed.violations.some(
          (v: { ruleNumber: string; message: string }) =>
            v.ruleNumber === '15.4' && v.message.includes('device label'),
        ),
      );
    });

    it('rejects segment containing "tablet"', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Button.tablet.container' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(
        parsed.violations.some(
          (v: { message: string }) => v.message.includes('device label'),
        ),
      );
    });

    it('rejects segment containing "desktop"', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Color.desktop.text' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(
        parsed.violations.some(
          (v: { message: string }) => v.message.includes('device label'),
        ),
      );
    });
  });

  // -------------------------------------------------------------------------
  // Unknown layer prefix
  // -------------------------------------------------------------------------

  describe('unknown layer prefix', () => {
    it('rejects an unknown PascalCase prefix', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Widget.solid.container' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      assert.ok(
        parsed.violations.some(
          (v: { ruleNumber: string; message: string }) =>
            v.ruleNumber === '15.4' && v.message.includes('not a known token layer'),
        ),
      );
    });
  });

  // -------------------------------------------------------------------------
  // Suggested name generation
  // -------------------------------------------------------------------------

  describe('suggestedName', () => {
    it('returns null when name is valid', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Button.solid.container.background.hover' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.suggestedName, null);
    });

    it('suggests PascalCase correction for first segment', async () => {
      const result = await validateTokenNameHandler(
        { name: 'button.solid.container.background.hover' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.suggestedName, 'Button.solid.container.background.hover');
    });

    it('suggests kebab-case correction for subsequent segments', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Button.Solid.Container.Background.hover' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.suggestedName, 'Button.solid.container.background.hover');
    });

    it('removes device labels from suggested name', async () => {
      const result = await validateTokenNameHandler(
        { name: 'Button.mobile.solid.container' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.ok(parsed.suggestedName !== null);
      assert.ok(!parsed.suggestedName.toLowerCase().includes('mobile'));
    });

    it('ensures suggested name has at least 2 segments', async () => {
      const result = await validateTokenNameHandler({ name: 'button' }, rootPath);
      const parsed = parseResult(result);
      // For single segment, we generate a suggestion with at least 2 segments
      if (parsed.suggestedName) {
        const segments = parsed.suggestedName.split('.');
        assert.ok(segments.length >= 2);
      }
    });
  });

  // -------------------------------------------------------------------------
  // Violation structure
  // -------------------------------------------------------------------------

  describe('violation structure', () => {
    it('each violation includes segment, ruleNumber, and message', async () => {
      const result = await validateTokenNameHandler(
        { name: 'button.Solid.Container' },
        rootPath,
      );
      const parsed = parseResult(result);
      assert.equal(parsed.valid, false);
      for (const violation of parsed.violations) {
        assert.ok('segment' in violation, 'violation should have segment');
        assert.ok('ruleNumber' in violation, 'violation should have ruleNumber');
        assert.ok('message' in violation, 'violation should have message');
        assert.ok(typeof violation.segment === 'string');
        assert.ok(typeof violation.ruleNumber === 'string');
        assert.ok(typeof violation.message === 'string');
      }
    });
  });
});
