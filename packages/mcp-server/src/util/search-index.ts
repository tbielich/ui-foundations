/**
 * In-memory full-text search index with TF-IDF relevance scoring.
 *
 * Builds an inverted index from resource content at startup and supports
 * substring matching with contextual excerpts.
 *
 * Requirements: 10.1 (relevance-ranked results), 10.2 (URI, excerpt, score),
 * 10.4 (results within 500ms).
 */

import type { SearchResult } from '../types.js';

/** Internal document representation stored in the index. */
interface IndexedDocument {
  uri: string;
  content: string;
  /** Term frequency map: term → count of occurrences in this document. */
  termFrequencies: Map<string, number>;
  /** Total number of terms in the document. */
  termCount: number;
}

/** Entry in the inverted index mapping a term to its document occurrences. */
interface PostingEntry {
  uri: string;
  termFrequency: number;
}

/**
 * SearchIndex maintains an in-memory inverted index and supports
 * TF-IDF relevance scoring with substring matching for excerpt generation.
 */
export class SearchIndex {
  private rootPath: string;
  private documents: Map<string, IndexedDocument> = new Map();
  private invertedIndex: Map<string, PostingEntry[]> = new Map();
  private totalDocuments: number = 0;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  /**
   * Finalizes the index after all documents have been added.
   * Currently a no-op since the inverted index is built incrementally
   * via addDocument(). Can be extended later for batch optimization.
   */
  async build(): Promise<void> {
    // Index is built incrementally via addDocument calls.
    // This method exists for future optimization (e.g., precomputing IDF values).
  }

  /**
   * Adds a document to the search index.
   *
   * Gracefully handles indexing failures for individual documents.
   * If indexing a document throws, the error is caught and the document
   * is skipped — other documents remain searchable.
   *
   * @param uri - The resource URI identifying this document.
   * @param content - The full text content to index.
   * @returns true if the document was indexed successfully, false if it was skipped due to an error.
   */
  addDocument(uri: string, content: string): boolean {
    try {
      if (typeof content !== 'string' || content.length === 0) {
        return false;
      }

      const terms = this.tokenize(content);
      const termFrequencies = new Map<string, number>();

      for (const term of terms) {
        termFrequencies.set(term, (termFrequencies.get(term) ?? 0) + 1);
      }

      const doc: IndexedDocument = {
        uri,
        content,
        termFrequencies,
        termCount: terms.length,
      };

      this.documents.set(uri, doc);
      this.totalDocuments = this.documents.size;

      // Update inverted index
      for (const [term, frequency] of termFrequencies) {
        const postings = this.invertedIndex.get(term) ?? [];
        // Remove existing entry for this URI (in case of re-indexing)
        const filtered = postings.filter((p) => p.uri !== uri);
        filtered.push({ uri, termFrequency: frequency });
        this.invertedIndex.set(term, filtered);
      }

      return true;
    } catch {
      // Graceful degradation: skip this document, other documents remain searchable.
      return false;
    }
  }

  /**
   * Searches the index for documents matching the query.
   *
   * Uses TF-IDF scoring for term-based relevance and supports substring
   * matching within document content for excerpt generation.
   *
   * @param query - The search query string.
   * @param limit - Maximum number of results to return (default: 20).
   * @returns Array of SearchResult sorted by descending score.
   */
  search(query: string, limit: number = 20): SearchResult[] {
    if (this.totalDocuments === 0) {
      return [];
    }

    const queryTerms = this.tokenize(query);
    if (queryTerms.length === 0) {
      return [];
    }

    const scores = new Map<string, number>();

    // Compute TF-IDF score for each document
    for (const term of queryTerms) {
      const postings = this.invertedIndex.get(term);
      if (!postings || postings.length === 0) {
        continue;
      }

      // IDF: log(totalDocs / docsContainingTerm)
      const idf = Math.log(this.totalDocuments / postings.length);

      for (const posting of postings) {
        const doc = this.documents.get(posting.uri);
        if (!doc) continue;

        // TF: termFrequency / totalTermsInDoc (normalized)
        const tf = posting.termFrequency / doc.termCount;
        const tfidf = tf * idf;

        scores.set(posting.uri, (scores.get(posting.uri) ?? 0) + tfidf);
      }
    }

    // Also do substring matching to catch partial/compound matches
    const queryLower = query.toLowerCase();
    for (const [uri, doc] of this.documents) {
      if (doc.content.toLowerCase().includes(queryLower)) {
        // Boost documents that contain the exact query substring
        const currentScore = scores.get(uri) ?? 0;
        const substringBoost = 0.3;
        scores.set(uri, currentScore + substringBoost);
      }
    }

    if (scores.size === 0) {
      return [];
    }

    // Normalize scores to 0.0–1.0 range
    const maxScore = Math.max(...scores.values());
    const results: SearchResult[] = [];

    for (const [uri, rawScore] of scores) {
      const normalizedScore = maxScore > 0 ? rawScore / maxScore : 0;
      const doc = this.documents.get(uri);
      if (!doc) continue;

      const excerpt = this.generateExcerpt(doc.content, query);
      results.push({
        uri,
        excerpt,
        score: Math.round(normalizedScore * 1000) / 1000, // 3 decimal places
      });
    }

    // Sort by descending score
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  /**
   * Tokenizes content into lowercase terms (words).
   * Splits on non-alphanumeric characters and filters out very short tokens.
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 2);
  }

  /**
   * Generates a contextual excerpt of up to 200 characters showing
   * the query match within the document content.
   */
  private generateExcerpt(content: string, query: string): string {
    const maxLength = 200;
    const contentLower = content.toLowerCase();
    const queryLower = query.toLowerCase();

    // Try to find the exact query substring first
    let matchIndex = contentLower.indexOf(queryLower);

    // If no exact substring match, try to find the first query term
    if (matchIndex === -1) {
      const queryTerms = this.tokenize(query);
      for (const term of queryTerms) {
        matchIndex = contentLower.indexOf(term);
        if (matchIndex !== -1) break;
      }
    }

    // If still no match, return the beginning of the content
    if (matchIndex === -1) {
      return content.slice(0, maxLength).trim();
    }

    // Center the excerpt around the match
    const contextPadding = Math.floor((maxLength - query.length) / 2);
    let start = Math.max(0, matchIndex - contextPadding);
    let end = Math.min(content.length, start + maxLength);

    // Adjust start if end is capped
    if (end - start < maxLength) {
      start = Math.max(0, end - maxLength);
    }

    // Try to start/end at word boundaries
    if (start > 0) {
      const spaceIndex = content.indexOf(' ', start);
      if (spaceIndex !== -1 && spaceIndex < start + 20) {
        start = spaceIndex + 1;
      }
    }

    let excerpt = content.slice(start, end).trim();

    // Ensure excerpt doesn't exceed 200 chars
    if (excerpt.length > maxLength) {
      excerpt = excerpt.slice(0, maxLength).trim();
    }

    return excerpt;
  }
}
