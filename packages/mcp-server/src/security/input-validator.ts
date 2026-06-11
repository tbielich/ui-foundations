/**
 * Input length and type validation for the UI Foundations MCP Server.
 *
 * Enforces size limits on incoming request parameters to prevent
 * resource exhaustion and ensure stable server operation.
 *
 * Default limits:
 * - String parameters: 1,000 characters
 * - Tool inputs (full body): 10,000 characters
 * - Token names: 200 characters
 *
 * Error messages include the maximum allowed length and the actual input
 * length, but never expose internal paths, stack traces, or environment
 * variable values.
 *
 * @module security/input-validator
 */

/** Default maximum length for generic string parameters. */
const DEFAULT_MAX_STRING_LENGTH = 1_000;

/** Maximum length for full tool input payloads. */
const MAX_TOOL_INPUT_LENGTH = 10_000;

/** Maximum length for token name strings. */
const MAX_TOKEN_NAME_LENGTH = 200;

/** Validation result returned by all validation functions. */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates that a string parameter does not exceed the allowed length.
 *
 * @param input - The string to validate.
 * @param maxLength - Maximum allowed character count. Defaults to 1,000.
 * @returns Validation result with an error message if the input is too long.
 */
export function validateStringLength(
  input: string,
  maxLength: number = DEFAULT_MAX_STRING_LENGTH,
): ValidationResult {
  if (input.length > maxLength) {
    return {
      valid: false,
      error: `Input exceeds maximum allowed length of ${maxLength} characters (received ${input.length} characters)`,
    };
  }
  return { valid: true };
}

/**
 * Validates that a tool input payload does not exceed the 10,000 character limit.
 *
 * @param input - The full tool input string to validate.
 * @returns Validation result with an error message if the input is too long.
 */
export function validateToolInput(input: string): ValidationResult {
  if (input.length > MAX_TOOL_INPUT_LENGTH) {
    return {
      valid: false,
      error: `Tool input exceeds maximum allowed length of ${MAX_TOOL_INPUT_LENGTH} characters (received ${input.length} characters)`,
    };
  }
  return { valid: true };
}

/**
 * Validates that a token name does not exceed the 200 character limit.
 *
 * @param input - The token name string to validate.
 * @returns Validation result with an error message if the input is too long.
 */
export function validateTokenNameLength(input: string): ValidationResult {
  if (input.length > MAX_TOKEN_NAME_LENGTH) {
    return {
      valid: false,
      error: `Token name exceeds maximum allowed length of ${MAX_TOKEN_NAME_LENGTH} characters (received ${input.length} characters)`,
    };
  }
  return { valid: true };
}
