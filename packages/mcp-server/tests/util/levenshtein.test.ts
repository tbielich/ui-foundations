import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { levenshtein } from '../../src/util/levenshtein.js';

describe('levenshtein', () => {
  it('returns 0 for identical strings', () => {
    assert.equal(levenshtein('button', 'button'), 0);
  });

  it('returns length of b when a is empty', () => {
    assert.equal(levenshtein('', 'abc'), 3);
  });

  it('returns length of a when b is empty', () => {
    assert.equal(levenshtein('abc', ''), 3);
  });

  it('returns 0 for two empty strings', () => {
    assert.equal(levenshtein('', ''), 0);
  });

  it('counts single insertion', () => {
    assert.equal(levenshtein('button', 'buttons'), 1);
  });

  it('counts single deletion', () => {
    assert.equal(levenshtein('buttons', 'button'), 1);
  });

  it('counts single substitution', () => {
    assert.equal(levenshtein('button', 'buttan'), 1);
  });

  it('computes distance for completely different strings', () => {
    assert.equal(levenshtein('abc', 'xyz'), 3);
  });

  it('computes distance for typical fuzzy match case', () => {
    // "buton" -> "button" requires 1 insertion
    assert.equal(levenshtein('buton', 'button'), 1);
  });

  it('computes distance for transposition-like edit', () => {
    // "slider" -> "silider" — insert 'i' = 1, but actual transposition needs 2 ops
    assert.equal(levenshtein('slider', 'slidre'), 2);
  });

  it('handles distance ≤ 3 fuzzy matching threshold', () => {
    // "chekbox" -> "checkbox" distance is 1 (insert 'c')
    assert.equal(levenshtein('chekbox', 'checkbox'), 1);
    // "swith" -> "switch" distance is 1 (insert 'c')
    assert.equal(levenshtein('swith', 'switch'), 1);
    // "radi" -> "radio" distance is 1
    assert.equal(levenshtein('radi', 'radio'), 1);
  });

  it('is symmetric', () => {
    assert.equal(levenshtein('kitten', 'sitting'), levenshtein('sitting', 'kitten'));
  });

  it('classic example: kitten to sitting', () => {
    // kitten -> sitten (substitution) -> sittin (substitution) -> sitting (insertion) = 3
    assert.equal(levenshtein('kitten', 'sitting'), 3);
  });

  it('handles single character strings', () => {
    assert.equal(levenshtein('a', 'b'), 1);
    assert.equal(levenshtein('a', 'a'), 0);
  });
});
