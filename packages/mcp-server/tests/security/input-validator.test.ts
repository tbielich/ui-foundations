import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateStringLength,
  validateToolInput,
  validateTokenNameLength,
} from '../../src/security/input-validator.js';

describe('validateStringLength', () => {
  it('accepts strings within default 1000 char limit', () => {
    const result = validateStringLength('a'.repeat(1000));
    assert.equal(result.valid, true);
    assert.equal(result.error, undefined);
  });

  it('rejects strings exceeding default 1000 char limit', () => {
    const result = validateStringLength('a'.repeat(1001));
    assert.equal(result.valid, false);
    assert.ok(result.error);
    assert.ok(result.error.includes('1000'));
    assert.ok(result.error.includes('1001'));
  });

  it('accepts empty string', () => {
    const result = validateStringLength('');
    assert.equal(result.valid, true);
  });

  it('accepts strings within custom maxLength', () => {
    const result = validateStringLength('abcde', 5);
    assert.equal(result.valid, true);
  });

  it('rejects strings exceeding custom maxLength', () => {
    const result = validateStringLength('abcdef', 5);
    assert.equal(result.valid, false);
    assert.ok(result.error);
    assert.ok(result.error.includes('5'));
    assert.ok(result.error.includes('6'));
  });

  it('does not expose internal paths in error messages', () => {
    const result = validateStringLength('a'.repeat(1001));
    assert.ok(result.error);
    assert.ok(!result.error.includes('/'));
    assert.ok(!result.error.includes('\\'));
    assert.ok(!result.error.includes('stack'));
    assert.ok(!result.error.includes('env'));
  });
});

describe('validateToolInput', () => {
  it('accepts tool inputs within 10000 char limit', () => {
    const result = validateToolInput('x'.repeat(10000));
    assert.equal(result.valid, true);
    assert.equal(result.error, undefined);
  });

  it('rejects tool inputs exceeding 10000 char limit', () => {
    const result = validateToolInput('x'.repeat(10001));
    assert.equal(result.valid, false);
    assert.ok(result.error);
    assert.ok(result.error.includes('10000'));
    assert.ok(result.error.includes('10001'));
  });

  it('accepts empty string', () => {
    const result = validateToolInput('');
    assert.equal(result.valid, true);
  });

  it('does not expose internal details in error messages', () => {
    const result = validateToolInput('y'.repeat(10001));
    assert.ok(result.error);
    assert.ok(!result.error.includes('/'));
    assert.ok(!result.error.includes('\\'));
    assert.ok(!result.error.includes('stack'));
  });
});

describe('validateTokenNameLength', () => {
  it('accepts token names within 200 char limit', () => {
    const result = validateTokenNameLength('Button.solid.container.background.hover');
    assert.equal(result.valid, true);
    assert.equal(result.error, undefined);
  });

  it('accepts token names at exactly 200 chars', () => {
    const result = validateTokenNameLength('a'.repeat(200));
    assert.equal(result.valid, true);
  });

  it('rejects token names exceeding 200 char limit', () => {
    const result = validateTokenNameLength('a'.repeat(201));
    assert.equal(result.valid, false);
    assert.ok(result.error);
    assert.ok(result.error.includes('200'));
    assert.ok(result.error.includes('201'));
  });

  it('accepts empty string', () => {
    const result = validateTokenNameLength('');
    assert.equal(result.valid, true);
  });

  it('does not expose internal details in error messages', () => {
    const result = validateTokenNameLength('z'.repeat(201));
    assert.ok(result.error);
    assert.ok(!result.error.includes('/'));
    assert.ok(!result.error.includes('\\'));
    assert.ok(!result.error.includes('stack'));
  });
});
