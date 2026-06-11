/**
 * get_pattern tool handler for the UI Foundations MCP Server.
 *
 * Looks up a composition pattern by name (case-insensitive exact match) and
 * returns structured documentation including purpose, structure, composition
 * rules, interaction rules, accessibility considerations, applied design
 * principles, applied heuristics, and related component tokens.
 *
 * Requirements: 13.1, 13.2, 13.3, 13.4
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ToolResponse } from '../types.js';

/** Known pattern identifiers mapped to their source files. */
const KNOWN_PATTERNS: Record<string, { docFile: string; ruleFile: string; description: string }> = {
  forms: {
    docFile: 'docs/patterns/forms.md',
    ruleFile: '.kiro/steering/pattern-rules/forms.md',
    description:
      'Form-pattern guidance connecting field grouping, labels, help text, errors, and action ordering.',
  },
  navigation: {
    docFile: 'docs/patterns/navigation.md',
    ruleFile: '.kiro/steering/pattern-rules/navigation.md',
    description:
      'Navigation-pattern expectations for landmarks, active state, hierarchy, and destination structure.',
  },
  cards: {
    docFile: 'docs/patterns/cards.md',
    ruleFile: '.kiro/steering/pattern-rules/cards.md',
    description:
      'Card-pattern guidance for single-object grouping, subject clarity, and scoped actions.',
  },
  layout: {
    docFile: 'docs/patterns/layout.md',
    ruleFile: '',
    description:
      'Layout-related guidance from foundations and component rules covering responsive breakpoints and composition.',
  },
  feedback: {
    docFile: 'docs/patterns/feedback.md',
    ruleFile: '',
    description:
      'Guidance around interactive feedback, visible state, error recovery, and assistive feedback.',
  },
};

/** All valid pattern names (lowercase). */
const VALID_PATTERN_NAMES = Object.keys(KNOWN_PATTERNS);

/**
 * Extracts a markdown section by heading name from content.
 * Returns the text between the matching heading and the next heading of equal or higher level.
 */
function extractSection(content: string, heading: string): string | null {
  const headingRegex = new RegExp(
    `^##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`,
    'im',
  );
  const match = headingRegex.exec(content);
  if (!match) return null;

  const startIndex = match.index + match[0].length;
  const nextHeadingRegex = /^##\s+/m;
  const remaining = content.slice(startIndex);
  const nextMatch = nextHeadingRegex.exec(remaining);
  const sectionText = nextMatch ? remaining.slice(0, nextMatch.index) : remaining;

  return sectionText.trim() || null;
}

/**
 * Extracts related component tokens (CSS custom property references) from content.
 */
function extractRelatedTokens(content: string): string[] {
  const tokens: string[] = [];
  const cssVarRegex = /--[a-z][a-z0-9-]+/g;
  let match: RegExpExecArray | null;

  while ((match = cssVarRegex.exec(content)) !== null) {
    if (!tokens.includes(match[0])) {
      tokens.push(match[0]);
    }
  }

  return tokens;
}

/**
 * Parses frontmatter principles array from pattern rule content.
 */
function extractFrontmatterList(content: string, key: string): string[] {
  const frontmatterMatch = /^---\s*\n([\s\S]*?)\n---/m.exec(content);
  if (!frontmatterMatch) return [];

  const frontmatter = frontmatterMatch[1];
  const keyRegex = new RegExp(`^${key}:\\s*$`, 'm');
  const keyMatch = keyRegex.exec(frontmatter);
  if (!keyMatch) return [];

  const startIndex = keyMatch.index + keyMatch[0].length;
  const remaining = frontmatter.slice(startIndex);
  const items: string[] = [];
  const lineRegex = /^\s+-\s+(.+)$/gm;
  let lineMatch: RegExpExecArray | null;

  while ((lineMatch = lineRegex.exec(remaining)) !== null) {
    items.push(lineMatch[1].trim());
  }

  // Stop at the first non-list line
  const lines = remaining.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;
    if (trimmed.startsWith('- ')) {
      result.push(trimmed.slice(2).trim());
    } else {
      break;
    }
  }

  return result;
}

/**
 * Handles the `get_pattern` tool call.
 *
 * Accepts `{ name: string }` args, normalizes name to lowercase for case-insensitive
 * exact match against registered pattern names.
 *
 * @param args - Tool arguments (expected to contain `name` string).
 * @param rootPath - Absolute path to the repository root.
 * @returns ToolResponse with structured pattern data as JSON text, or an error response.
 */
export async function getPatternHandler(
  args: unknown,
  rootPath: string,
): Promise<ToolResponse> {
  const { name } = args as { name: string };
  const normalizedName = name.toLowerCase().trim();

  // Case-insensitive exact match
  if (!VALID_PATTERN_NAMES.includes(normalizedName)) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: `Pattern not found: "${name}". Valid pattern names are: ${VALID_PATTERN_NAMES.join(', ')}`,
            providedName: name,
            validPatterns: VALID_PATTERN_NAMES,
          }),
        },
      ],
      isError: true,
    };
  }

  const patternEntry = KNOWN_PATTERNS[normalizedName];

  // Read the pattern documentation file
  let docContent: string;
  try {
    const docPath = join(rootPath, patternEntry.docFile);
    docContent = await readFile(docPath, 'utf8');
  } catch {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: `Pattern data source is temporarily unavailable for "${normalizedName}".`,
            providedName: name,
          }),
        },
      ],
      isError: true,
    };
  }

  // Attempt to read the pattern rule file for structured data
  let ruleContent: string | null = null;
  if (patternEntry.ruleFile) {
    try {
      const rulePath = join(rootPath, patternEntry.ruleFile);
      ruleContent = await readFile(rulePath, 'utf8');
    } catch {
      // Rule file not available — continue with doc content only
    }
  }

  // Extract structured data from rule content (if available)
  const purpose =
    (ruleContent && extractSection(ruleContent, 'Purpose')) ||
    extractSection(docContent, 'Purpose') ||
    patternEntry.description;

  const structure = ruleContent ? extractSection(ruleContent, 'Structure') : null;

  const compositionRules = ruleContent ? extractSection(ruleContent, 'Rules') : null;

  const interactionRules = ruleContent ? extractSection(ruleContent, 'Interaction rules') : null;

  const accessibility = ruleContent
    ? extractSection(ruleContent, 'Accessibility considerations')
    : null;

  const designPrinciples = ruleContent
    ? extractFrontmatterList(ruleContent, 'principles')
    : [];

  const heuristics = ruleContent ? extractFrontmatterList(ruleContent, 'heuristics') : [];

  // Extract related component tokens from both sources
  const allContent = [docContent, ruleContent].filter(Boolean).join('\n');
  const relatedTokens = extractRelatedTokens(allContent);

  const result = {
    name: normalizedName,
    description: patternEntry.description,
    purpose,
    structure,
    compositionRules,
    interactionRules,
    accessibility,
    designPrinciples,
    heuristics,
    relatedTokens,
    documentation: docContent,
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result),
      },
    ],
  };
}
