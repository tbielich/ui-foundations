import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { getPatternHandler } from '../../src/tools/get-pattern.js';

describe('getPatternHandler', () => {
  let testDir: string;

  const patternDocContent = `# Forms

## Purpose

Help users provide structured input with clear labels, predictable grouping, and
recoverable errors.

## Canonical rules

- \`.kiro/steering/pattern-rules/forms.md\`

## Related docs

- \`docs/components/input.md\`
- \`docs/components/button.md\`
`;

  const patternRuleContent = `---
type: pattern-rule
domain: ui-foundations
status: active
pattern: forms
applies_to:
  - forms
  - field-groups
principles:
  - principle.proximity
  - principle.hierarchy
  - principle.affordance
heuristics:
  - heuristic.feedback
  - heuristic.error-prevention
  - heuristic.accessibility
inclusion: manual
---

# Pattern: forms

## Rule type
pattern composition rule

## Purpose
Help users provide structured input with clear labels, predictable grouping, and
recoverable errors.

## Structure
Place each control with its label, help text, and error text in one field group.
Group related fields under a visible section label when the relationship changes.

## Rules
- Every input control must have a programmatic label or accessible name.
- Required, optional, help, and error text must sit in the same field group.

## Interaction rules
- Validation feedback must identify the field, the problem, and the recovery action.
- Focus must move predictably through fields in reading order.

## Accessibility considerations
- Use semantic labels and native form controls before ARIA.
- Preserve visible focus on all interactive controls.

## Applied principles
- \`principle.proximity\`
- \`principle.hierarchy\`
- \`principle.affordance\`

## Applied heuristics
- \`heuristic.feedback\`
- \`heuristic.error-prevention\`
- \`heuristic.accessibility\`
`;

  beforeEach(async () => {
    testDir = join(tmpdir(), `get-pattern-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);

    // Create pattern doc files
    await mkdir(join(testDir, 'docs/patterns'), { recursive: true });
    await writeFile(join(testDir, 'docs/patterns/forms.md'), patternDocContent, 'utf8');
    await writeFile(join(testDir, 'docs/patterns/navigation.md'), '# Navigation\n\n## Purpose\n\nNavigation patterns.\n', 'utf8');
    await writeFile(join(testDir, 'docs/patterns/cards.md'), '# Cards\n\n## Purpose\n\nCard patterns.\n', 'utf8');
    await writeFile(join(testDir, 'docs/patterns/layout.md'), '# Layout\n\n## Purpose\n\nLayout patterns with --spacing-100 token.\n', 'utf8');
    await writeFile(join(testDir, 'docs/patterns/feedback.md'), '# Feedback\n\n## Purpose\n\nFeedback patterns.\n', 'utf8');

    // Create pattern rule files
    await mkdir(join(testDir, '.kiro/steering/pattern-rules'), { recursive: true });
    await writeFile(join(testDir, '.kiro/steering/pattern-rules/forms.md'), patternRuleContent, 'utf8');
    await writeFile(join(testDir, '.kiro/steering/pattern-rules/navigation.md'), `---
type: pattern-rule
principles:
  - principle.consistency
heuristics:
  - heuristic.recognition
---

# Pattern: navigation

## Purpose
Navigation landmarks and active state.

## Structure
Use semantic nav elements with landmark roles.

## Rules
- Use nav element for primary navigation.

## Interaction rules
- Active item must be visually distinct.

## Accessibility considerations
- Provide aria-current for active page.
`, 'utf8');
    await writeFile(join(testDir, '.kiro/steering/pattern-rules/cards.md'), `---
type: pattern-rule
principles:
  - principle.proximity
heuristics:
  - heuristic.recognition
---

# Pattern: cards

## Purpose
Card grouping and subject clarity.

## Structure
Each card groups a single subject with its metadata.

## Rules
- One primary subject per card.

## Interaction rules
- Card click targets must be clearly defined.

## Accessibility considerations
- Use article or section for card semantics.
`, 'utf8');
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  // -------------------------------------------------------------------------
  // Successful lookups
  // -------------------------------------------------------------------------

  it('returns structured pattern data for a valid name', async () => {
    const result = await getPatternHandler({ name: 'forms' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.name, 'forms');
    assert.ok(parsed.purpose);
    assert.ok(parsed.structure);
    assert.ok(parsed.compositionRules);
    assert.ok(parsed.interactionRules);
    assert.ok(parsed.accessibility);
    assert.ok(Array.isArray(parsed.designPrinciples));
    assert.ok(Array.isArray(parsed.heuristics));
    assert.ok(Array.isArray(parsed.relatedTokens));
    assert.ok(parsed.documentation);
  });

  it('performs case-insensitive exact match', async () => {
    const result = await getPatternHandler({ name: 'FORMS' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.name, 'forms');
  });

  it('handles mixed case input', async () => {
    const result = await getPatternHandler({ name: 'Navigation' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.name, 'navigation');
  });

  it('extracts design principles from frontmatter', async () => {
    const result = await getPatternHandler({ name: 'forms' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.designPrinciples.includes('principle.proximity'));
    assert.ok(parsed.designPrinciples.includes('principle.hierarchy'));
    assert.ok(parsed.designPrinciples.includes('principle.affordance'));
  });

  it('extracts heuristics from frontmatter', async () => {
    const result = await getPatternHandler({ name: 'forms' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.heuristics.includes('heuristic.feedback'));
    assert.ok(parsed.heuristics.includes('heuristic.error-prevention'));
    assert.ok(parsed.heuristics.includes('heuristic.accessibility'));
  });

  it('extracts related tokens (CSS custom properties) from content', async () => {
    const result = await getPatternHandler({ name: 'layout' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.relatedTokens.includes('--spacing-100'));
  });

  it('returns pattern without rule file gracefully', async () => {
    // layout and feedback have no rule files
    const result = await getPatternHandler({ name: 'layout' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.name, 'layout');
    assert.deepEqual(parsed.designPrinciples, []);
    assert.deepEqual(parsed.heuristics, []);
    assert.ok(parsed.purpose); // Falls back to doc content or description
  });

  it('includes full documentation content', async () => {
    const result = await getPatternHandler({ name: 'forms' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.documentation.includes('# Forms'));
    assert.ok(parsed.documentation.includes('## Purpose'));
  });

  // -------------------------------------------------------------------------
  // Error cases: unrecognized names
  // -------------------------------------------------------------------------

  it('returns error with provided name for unrecognized pattern', async () => {
    const result = await getPatternHandler({ name: 'accordion' }, testDir);

    assert.equal(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.error.includes('accordion'));
    assert.equal(parsed.providedName, 'accordion');
  });

  it('returns complete list of valid pattern names in error', async () => {
    const result = await getPatternHandler({ name: 'nonexistent' }, testDir);

    assert.equal(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.deepEqual(parsed.validPatterns, ['forms', 'navigation', 'cards', 'layout', 'feedback']);
  });

  it('rejects empty name (after trim)', async () => {
    const result = await getPatternHandler({ name: '   ' }, testDir);

    assert.equal(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.validPatterns.length === 5);
  });

  // -------------------------------------------------------------------------
  // Data source unavailability
  // -------------------------------------------------------------------------

  it('returns data source unavailable error when doc file is missing', async () => {
    await rm(join(testDir, 'docs/patterns/forms.md'));

    const result = await getPatternHandler({ name: 'forms' }, testDir);

    assert.equal(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.error.includes('temporarily unavailable'));
  });
});
