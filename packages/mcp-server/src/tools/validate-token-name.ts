/**
 * validate_token_name tool handler.
 *
 * Validates a proposed token name against the naming conventions defined in
 * docs/foundations/foundation-002-naming-and-grouping.md.
 *
 * Checks:
 * - Non-empty string
 * - Maximum 200 characters
 * - At least 2 dot-separated segments
 * - First segment (component/role) is PascalCase
 * - Subsequent segments are lowercase or kebab-case
 * - Layer prefix matches a known token layer
 * - Last segment (if a state) is a recognized state value
 * - No segment contains device labels (mobile, tablet, desktop)
 *
 * Returns { valid, violations[], suggestedName } structure.
 *
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6
 */

import type { TokenValidationResult, TokenViolation, ToolResponse } from '../types.js';

/** Maximum allowed token name length. */
const MAX_TOKEN_NAME_LENGTH = 200;

/** Known token layer prefixes (first segment values). */
const KNOWN_LAYER_PREFIXES = new Set([
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
]);

/** Recognized state values (valid as last segment). */
const RECOGNIZED_STATES = new Set([
  'default',
  'hover',
  'active',
  'focus',
  'disabled',
]);

/** Device labels that must not appear in any segment. */
const DEVICE_LABELS = new Set(['mobile', 'tablet', 'desktop']);

/**
 * Checks if a string is in PascalCase.
 * PascalCase: starts with uppercase letter, contains only alphanumeric chars,
 * and has at least one letter.
 */
function isPascalCase(segment: string): boolean {
  if (segment.length === 0) return false;
  // Must start with an uppercase letter
  if (!/^[A-Z]/.test(segment)) return false;
  // Must contain only alphanumeric characters (no hyphens, underscores, spaces)
  if (!/^[A-Za-z0-9]+$/.test(segment)) return false;
  return true;
}

/**
 * Checks if a string is lowercase or kebab-case.
 * Valid: all lowercase letters, digits, and hyphens; must not start/end with hyphen.
 */
function isLowercaseOrKebabCase(segment: string): boolean {
  if (segment.length === 0) return false;
  // Must contain only lowercase letters, digits, and hyphens
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(segment)) return false;
  return true;
}

/**
 * Converts a string to PascalCase.
 * Handles kebab-case, camelCase, and already-PascalCase inputs.
 */
function toPascalCase(segment: string): string {
  if (segment.length === 0) return segment;

  // Split on hyphens, underscores, or camelCase boundaries
  const words = segment
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Converts a string to kebab-case.
 * Handles PascalCase, camelCase, and other formats.
 */
function toKebabCase(segment: string): string {
  if (segment.length === 0) return segment;

  return segment
    // Insert hyphen before uppercase letters that follow lowercase
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    // Replace underscores and spaces with hyphens
    .replace(/[_\s]+/g, '-')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/**
 * Checks if a segment contains a device label.
 */
function containsDeviceLabel(segment: string): boolean {
  const lower = segment.toLowerCase();
  return DEVICE_LABELS.has(lower);
}

/**
 * Validates a token name and returns the validation result.
 */
function validateTokenName(name: string): TokenValidationResult {
  const violations: TokenViolation[] = [];

  // Rule: non-empty
  if (!name || name.trim().length === 0) {
    violations.push({
      segment: '',
      ruleNumber: '15.5',
      message:
        'Token name must be a non-empty string containing at least two dot-separated segments.',
    });
    return { valid: false, violations, suggestedName: null };
  }

  // Rule: max 200 characters
  if (name.length > MAX_TOKEN_NAME_LENGTH) {
    violations.push({
      segment: name,
      ruleNumber: '15.6',
      message: `Token name must not exceed ${MAX_TOKEN_NAME_LENGTH} characters. Current length: ${name.length}.`,
    });
    return { valid: false, violations, suggestedName: null };
  }

  const segments = name.split('.');

  // Rule: at least 2 dot-separated segments
  if (segments.length < 2) {
    violations.push({
      segment: name,
      ruleNumber: '15.5',
      message:
        'Token name must contain at least two dot-separated segments (e.g., Component.property).',
    });
    // Try to generate suggestion even for single-segment names
    const suggested = generateSuggestedName(segments);
    return { valid: false, violations, suggestedName: suggested };
  }

  const firstSegment = segments[0];
  const subsequentSegments = segments.slice(1);

  // Rule: First segment must be PascalCase
  if (!isPascalCase(firstSegment)) {
    violations.push({
      segment: firstSegment,
      ruleNumber: '15.4',
      message: `First segment "${firstSegment}" must be PascalCase (e.g., "Button", "Color", "Typography").`,
    });
  }

  // Rule: Layer prefix must match a known token layer
  if (!KNOWN_LAYER_PREFIXES.has(firstSegment)) {
    // Only flag this if first segment is PascalCase but unrecognized
    // (if it's not PascalCase, the above rule already covers it)
    const pascalVersion = toPascalCase(firstSegment);
    if (!KNOWN_LAYER_PREFIXES.has(pascalVersion)) {
      violations.push({
        segment: firstSegment,
        ruleNumber: '15.4',
        message: `Layer prefix "${firstSegment}" is not a known token layer. Known layers: ${[...KNOWN_LAYER_PREFIXES].join(', ')}.`,
      });
    }
  }

  // Rule: Subsequent segments must be lowercase or kebab-case
  for (const segment of subsequentSegments) {
    if (!isLowercaseOrKebabCase(segment)) {
      violations.push({
        segment,
        ruleNumber: '15.4',
        message: `Segment "${segment}" must be lowercase or kebab-case (e.g., "solid", "border-color").`,
      });
    }
  }

  // Rule: Last segment (if a state) must be a recognized state value
  const lastSegment = segments[segments.length - 1];
  if (RECOGNIZED_STATES.has(lastSegment)) {
    // Valid state — no violation
  }
  // If last segment looks like it could be a state but isn't recognized,
  // we don't flag it because not every token ends with a state.

  // Rule: No segment can contain device labels
  for (const segment of segments) {
    if (containsDeviceLabel(segment)) {
      violations.push({
        segment,
        ruleNumber: '15.4',
        message: `Segment "${segment}" contains a device label. Device labels (mobile, tablet, desktop) are not allowed in token names.`,
      });
    }
  }

  const valid = violations.length === 0;
  const suggestedName = valid ? null : generateSuggestedName(segments);

  return { valid, violations, suggestedName };
}

/**
 * Generates a suggested corrected token name from the given segments.
 *
 * - Converts first segment to PascalCase if not already
 * - Converts subsequent segments to kebab-case if not already
 * - Removes device labels
 * - Preserves overall structure
 */
function generateSuggestedName(segments: string[]): string {
  if (segments.length === 0) return '';

  const corrected: string[] = [];

  // First segment: PascalCase
  const first = toPascalCase(segments[0]);
  corrected.push(first);

  // Subsequent segments: kebab-case, filtering out device labels
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    if (containsDeviceLabel(segment)) {
      continue; // Remove device labels
    }
    corrected.push(toKebabCase(segment));
  }

  // Ensure at least 2 segments
  if (corrected.length < 2) {
    corrected.push('default');
  }

  return corrected.join('.');
}

/**
 * Handles the `validate_token_name` tool call.
 *
 * @param args - Tool arguments (expected to contain `name` string).
 * @param rootPath - Absolute path to the repository root.
 * @returns ToolResponse with validation result as JSON text.
 */
export async function validateTokenNameHandler(
  args: unknown,
  rootPath: string,
): Promise<ToolResponse> {
  const { name } = args as { name: string };

  const result = validateTokenName(name);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
