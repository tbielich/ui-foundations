/**
 * Shared TypeScript interfaces and types for the UI Foundations MCP Server.
 *
 * These types define the data models used across resource handlers, tool handlers,
 * prompt handlers, and the registry system.
 */

import type { ZodSchema } from 'zod';

// ---------------------------------------------------------------------------
// Category and layer enumerations
// ---------------------------------------------------------------------------

/** Resource categories for the uif:// URI scheme. */
export type ResourceCategory =
  | 'manifest'
  | 'agents'
  | 'tokens'
  | 'components'
  | 'patterns'
  | 'governance'
  | 'foundations';

/** Design token layers in the token architecture. */
export type TokenLayer = 'core' | 'semantic' | 'component' | 'mode' | 'brand';

// ---------------------------------------------------------------------------
// Resource response
// ---------------------------------------------------------------------------

/** Response structure returned by resource handlers. */
export interface ResourceResponse {
  uri: string;
  name: string;
  mimeType: string;
  content: string | object;
  metadata: {
    contentHash: string;
    category: ResourceCategory;
    layer?: TokenLayer;
  };
}

// ---------------------------------------------------------------------------
// Registry entries
// ---------------------------------------------------------------------------

/** Declarative entry in the resource registry. */
export interface ResourceRegistryEntry {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  category: ResourceCategory;
  handler: (uri: string, rootPath: string) => Promise<ResourceResponse>;
  /** Optional callback to list concrete URIs for template resources (URIs with {param}). */
  listCallback?: (rootPath: string) => Promise<Array<{ uri: string; name: string }>>;
}

/** Response structure returned by tool handlers. */
export interface ToolResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

/** Declarative entry in the tool registry. */
export interface ToolRegistryEntry {
  name: string;
  description: string;
  inputSchema: ZodSchema;
  handler: (args: unknown, rootPath: string) => Promise<ToolResponse>;
}

/** Argument definition for prompt templates. */
export interface PromptArgument {
  name: string;
  description: string;
  required: boolean;
}

/** Response structure returned by prompt handlers. */
export interface PromptResponse {
  messages: Array<{ role: string; content: { type: string; text: string } }>;
}

/** Declarative entry in the prompt registry. */
export interface PromptRegistryEntry {
  name: string;
  description: string;
  arguments: PromptArgument[];
  handler: (args: Record<string, string>, rootPath: string) => Promise<PromptResponse>;
}

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

/** Component metadata and documentation. */
export interface ComponentData {
  name: string;
  description: string;
  documentation: string;
  cssClassName: string;
  htmlPattern: string;
  variants: string[];
  states: string[];
  tokens: string[];
  codeConnectSchemaPath: string | null;
  uri: string;
}

/** Token metadata including resolved value and layer. */
export interface TokenData {
  name: string;
  cssProperty: string;
  value: unknown;
  type: string;
  layer: TokenLayer;
  hiddenFromPublishing?: boolean;
}

/** Composition pattern metadata and documentation. */
export interface PatternData {
  name: string;
  description: string;
  documentation: string;
  relatedComponents: string[];
  relatedTokens: string[];
  uri: string;
}

// ---------------------------------------------------------------------------
// Token validation
// ---------------------------------------------------------------------------

/** Result of validating a token name against naming conventions. */
export interface TokenValidationResult {
  valid: boolean;
  violations: TokenViolation[];
  suggestedName: string | null;
}

/** A single naming rule violation found during token name validation. */
export interface TokenViolation {
  segment: string;
  ruleNumber: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

/** A single search result with relevance scoring. */
export interface SearchResult {
  uri: string;
  excerpt: string;
  score: number;
}

// ---------------------------------------------------------------------------
// File reader
// ---------------------------------------------------------------------------

/** Result of reading a file through the cached file reader. */
export interface FileReadResult {
  content: string;
  contentHash: string;
  mimeType: string;
  lastRead: number;
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

/** Structured log entry written to stderr as JSON. */
export interface LogEntry {
  timestamp: string;
  method: string;
  target: string;
  responseMs: number;
  success: boolean;
  requestId?: string | number;
  error?: { code: number; category: string };
}
