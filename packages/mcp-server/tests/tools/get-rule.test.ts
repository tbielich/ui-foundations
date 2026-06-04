import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { getRuleHandler } from '../../src/tools/get-rule.js';

describe('getRuleHandler', () => {
  let testDir: string;

  const rulesContent = `---
title: UI Foundations Rules
---

# UI Foundations Rules

## Purpose

This is the governing rules document.

---

## Layer Model

### Core
Raw foundational values only.

### Semantic
Reusable intent and meaning.

### Layer rules
- Do not mix layers.

---

## Naming Rules

- Names must express intent, role, usage, or state.
- Prefer semantic naming over visual naming.

---

## Theming Rules

- Keep brand and mode orthogonal.
- Theme at the correct layer.

---

## Design-to-Code Rules

- Minimise translation steps from Figma to code.
- Keep names closely aligned.

---

## Agent-Readiness Rules

Prefer:
- explicit naming
- clear layer boundaries

---

## Review Checklist

When reviewing tokens, ask:

- Is the correct layer being used?
- Is the naming explicit and stable?

---

## Anti-Patterns

Avoid:
- mixing layers
`;

  beforeEach(async () => {
    testDir = join(tmpdir(), `get-rule-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(join(testDir, 'docs'), { recursive: true });
    await writeFile(join(testDir, 'docs', 'ui-foundations-rules.md'), rulesContent, 'utf8');
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  // -------------------------------------------------------------------------
  // Successful lookups
  // -------------------------------------------------------------------------

  it('returns the Naming Rules section for category "naming"', async () => {
    const result = await getRuleHandler({ category: 'naming' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'naming');
    assert.equal(parsed.heading, 'Naming Rules');
    assert.ok(parsed.content.includes('Names must express intent'));
  });

  it('returns the Layer Model section for category "layering"', async () => {
    const result = await getRuleHandler({ category: 'layering' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'layering');
    assert.equal(parsed.heading, 'Layer Model');
    assert.ok(parsed.content.includes('Raw foundational values only'));
  });

  it('returns the Theming Rules section for category "theming"', async () => {
    const result = await getRuleHandler({ category: 'theming' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'theming');
    assert.equal(parsed.heading, 'Theming Rules');
    assert.ok(parsed.content.includes('Keep brand and mode orthogonal'));
  });

  it('returns the Design-to-Code Rules section for category "design-to-code"', async () => {
    const result = await getRuleHandler({ category: 'design-to-code' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'design-to-code');
    assert.equal(parsed.heading, 'Design-to-Code Rules');
    assert.ok(parsed.content.includes('Minimise translation steps'));
  });

  it('returns the Review Checklist section for category "review"', async () => {
    const result = await getRuleHandler({ category: 'review' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'review');
    assert.equal(parsed.heading, 'Review Checklist');
    assert.ok(parsed.content.includes('Is the correct layer being used'));
  });

  it('returns the Agent-Readiness Rules section for category "agent-readiness"', async () => {
    const result = await getRuleHandler({ category: 'agent-readiness' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'agent-readiness');
    assert.equal(parsed.heading, 'Agent-Readiness Rules');
    assert.ok(parsed.content.includes('explicit naming'));
  });

  // -------------------------------------------------------------------------
  // Case normalization (Requirement 14.3)
  // -------------------------------------------------------------------------

  it('normalizes uppercase input: "NAMING" → "naming"', async () => {
    const result = await getRuleHandler({ category: 'NAMING' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'naming');
  });

  it('normalizes mixed case: "Theming" → "theming"', async () => {
    const result = await getRuleHandler({ category: 'Theming' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'theming');
  });

  it('normalizes underscores to hyphens: "DESIGN_TO_CODE" → "design-to-code"', async () => {
    const result = await getRuleHandler({ category: 'DESIGN_TO_CODE' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'design-to-code');
  });

  it('normalizes spaces to hyphens: "Agent Readiness" → "agent-readiness"', async () => {
    const result = await getRuleHandler({ category: 'Agent Readiness' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'agent-readiness');
  });

  it('handles leading/trailing whitespace', async () => {
    const result = await getRuleHandler({ category: '  naming  ' }, testDir);

    assert.equal(result.isError, undefined);
    const parsed = JSON.parse(result.content[0].text);
    assert.equal(parsed.category, 'naming');
  });

  // -------------------------------------------------------------------------
  // Section extraction boundaries
  // -------------------------------------------------------------------------

  it('extracts section content up to the next same-level heading', async () => {
    const result = await getRuleHandler({ category: 'naming' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    // Should contain naming content but not theming content
    assert.ok(parsed.content.includes('Naming Rules'));
    assert.ok(!parsed.content.includes('Theming Rules'));
  });

  it('includes sub-headings within the extracted section', async () => {
    const result = await getRuleHandler({ category: 'layering' }, testDir);

    const parsed = JSON.parse(result.content[0].text);
    // Layer Model contains ### Core and ### Semantic sub-headings
    assert.ok(parsed.content.includes('### Core'));
    assert.ok(parsed.content.includes('### Semantic'));
  });

  // -------------------------------------------------------------------------
  // Error cases: invalid category
  // -------------------------------------------------------------------------

  it('rejects invalid category with list of valid options', async () => {
    const result = await getRuleHandler({ category: 'invalid' }, testDir);

    assert.equal(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.error.includes('Invalid rule category'));
    assert.ok(parsed.error.includes('invalid'));
    assert.deepEqual(parsed.validCategories, [
      'naming',
      'layering',
      'theming',
      'design-to-code',
      'review',
      'agent-readiness',
    ]);
  });

  it('rejects empty string category', async () => {
    const result = await getRuleHandler({ category: '   ' }, testDir);

    assert.equal(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.error.includes('Invalid rule category'));
  });

  // -------------------------------------------------------------------------
  // Error cases: file not readable
  // -------------------------------------------------------------------------

  it('returns error when rules file is missing', async () => {
    const emptyDir = join(tmpdir(), `get-rule-empty-${Date.now()}`);
    await mkdir(emptyDir, { recursive: true });

    const result = await getRuleHandler({ category: 'naming' }, emptyDir);

    assert.equal(result.isError, true);
    const parsed = JSON.parse(result.content[0].text);
    assert.ok(parsed.error.includes('Unable to read rules document'));

    await rm(emptyDir, { recursive: true, force: true });
  });
});
