/**
 * Computes the Levenshtein edit distance between two strings.
 *
 * Returns the minimum number of single-character edits (insertions,
 * deletions, substitutions) required to transform string `a` into string `b`.
 *
 * Used for fuzzy match suggestions — when a component/pattern name has an
 * edit distance ≤ 3 from a valid name, suggest the closest match.
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  // Edge cases: one or both strings are empty
  if (m === 0) return n;
  if (n === 0) return m;

  // Use a single-row DP approach for space efficiency.
  // prev[j] represents the edit distance between a[0..i-1] and b[0..j-1].
  const prev = new Array<number>(n + 1);

  // Initialize: transforming empty string into b[0..j-1] costs j insertions
  for (let j = 0; j <= n; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    let prevDiag = prev[0];
    prev[0] = i;

    for (let j = 1; j <= n; j++) {
      const temp = prev[j];
      if (a[i - 1] === b[j - 1]) {
        prev[j] = prevDiag;
      } else {
        prev[j] = 1 + Math.min(
          prevDiag,  // substitution
          prev[j],   // deletion
          prev[j - 1] // insertion
        );
      }
      prevDiag = temp;
    }
  }

  return prev[n];
}
