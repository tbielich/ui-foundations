# Implementation Plan: MCP Server

## Overview

Implements a Model Context Protocol server that exposes UI Foundations design system knowledge (tokens, components, patterns, governance rules, architecture decisions) to AI agents. The server uses a registry-driven architecture, reads content from the file system, and communicates via stdio (default) or Streamable HTTP transport.

## Tasks

- [x] 1. Set up project structure and core interfaces
  - [x] 1.1 Create package scaffolding
    - Create `packages/mcp-server/package.json` with bin entry (`ui-foundations-mcp`), engines (Node.js ≥ 18), type `module`, dependencies (`@modelcontextprotocol/sdk`, `zod`), devDependencies (`fast-check`, `@types/node`), and test scripts
    - Create `packages/mcp-server/tsconfig.json` with strict mode, ESM module, target ES2022, outDir `dist/mcp/`
    - Create directory structure: `src/`, `src/registry/`, `src/resources/`, `src/tools/`, `src/prompts/`, `src/security/`, `src/util/`, `tests/`, `tests/properties/`, `tests/integration/`
    - _Requirements: 23.1, 23.4, 23.6_

  - [x] 1.2 Define shared TypeScript interfaces and types
    - Create `src/types.ts` with interfaces: `ResourceRegistryEntry`, `ToolRegistryEntry`, `PromptRegistryEntry`, `ResourceResponse`, `ResourceCategory`, `TokenLayer`, `ComponentData`, `TokenData`, `PatternData`, `TokenValidationResult`, `TokenViolation`, `SearchResult`, `FileReadResult`, `LogEntry`
    - _Requirements: 2.1, 5.6, 6.1, 11.1, 12.1, 15.1_

- [x] 2. Implement utility layer
  - [x] 2.1 Implement structured JSON logger
    - Create `src/util/logger.ts` that writes JSON log entries (one per line) to stderr
    - Each entry contains: ISO 8601 timestamp, method name, target URI/tool name, responseMs, success boolean, optional requestId, optional error category
    - Implement `logRequest()`, `logError()`, and `logStartup()` functions
    - _Requirements: 19.4, 22.1, 22.2, 22.4_

  - [x] 2.2 Implement content hash utility
    - Create `src/util/content-hash.ts` with a function that computes SHA-256 hex digest of a string
    - _Requirements: 21.2_

  - [x] 2.3 Implement cached file reader
    - Create `src/util/file-reader.ts` with `FileReader` class
    - Reads files relative to configured root path, caches results in memory, computes SHA-256 content hash per read
    - Implements `read(relativePath)`, `invalidate(relativePath)`, `invalidateAll()` methods
    - Always re-reads from disk to ensure fresh content, caches within request cycle to avoid redundant hashing
    - _Requirements: 21.2, 21.3, 5.8_

  - [x] 2.4 Implement Levenshtein distance utility
    - Create `src/util/levenshtein.ts` with edit distance function for fuzzy matching suggestions
    - _Requirements: 11.3_

  - [x] 2.5 Implement search index
    - Create `src/util/search-index.ts` with `SearchIndex` class
    - Builds in-memory inverted index from all resource content at startup
    - Supports substring matching and TF-IDF relevance scoring
    - `search(query, limit?)` returns results with URI, excerpt (≤200 chars), and score (0.0–1.0) sorted by descending score
    - _Requirements: 10.1, 10.2, 10.4_

  - [x] 2.6 Write property test for content hash consistency (Property 20)
    - **Property 20: Content hash consistency**
    - For any resource read, `contentHash` equals SHA-256 hex of the content body; identical content produces identical hash; different content produces different hash
    - **Validates: Requirements 21.2**

- [x] 3. Implement security layer
  - [x] 3.1 Implement path validator
    - Create `src/security/path-validator.ts`
    - Detects and rejects path traversal sequences: `../`, `%2e%2e%2f`, `..\`, `%2e%2e%5c`, double-encoded variants
    - Enforces sandbox: resolved paths must be under configured rootPath
    - Blocks sensitive files: `.env`, `.git/*`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, PEM headers
    - Error responses never expose internal paths, stack traces, or env values
    - _Requirements: 20.2, 20.3, 20.4, 20.6_

  - [x] 3.2 Implement input validator
    - Create `src/security/input-validator.ts`
    - Enforces default 1,000 char limit for string parameters
    - Enforces 10,000 char max for tool inputs
    - Enforces 200 char max for token names
    - Returns safe error messages without internal details
    - _Requirements: 20.1, 20.5, 20.6_

  - [x] 3.3 Write property tests for security layer (Properties 17, 18, 19)
    - **Property 17: Path traversal rejection** — any URI with traversal sequences is rejected without file system resolution
    - **Property 18: Sandbox enforcement** — paths outside root are denied; sensitive file patterns are denied
    - **Property 19: Input length enforcement** — strings over 1,000 chars rejected; tool inputs over 10,000 chars rejected; error responses contain no internal paths/stack traces/env values
    - **Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5, 20.6**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement registry pattern and server core
  - [x] 5.1 Implement registry loader
    - Create `src/registry/index.ts` that loads resource, tool, and prompt registries
    - Iterates entries and calls MCP SDK registration APIs
    - Skips malformed entries (logs error) and continues loading remaining valid entries
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

  - [x] 5.2 Define resource registry
    - Create `src/registry/resources.ts` with declarative array of `ResourceRegistryEntry` objects
    - Covers all categories: manifest, agents, tokens, components, patterns, governance, foundations
    - Each entry specifies URI, name, description, MIME type, category, and handler reference
    - _Requirements: 2.1, 2.2, 2.3, 24.1_

  - [x] 5.3 Define tool registry
    - Create `src/registry/tools.ts` with declarative array of `ToolRegistryEntry` objects
    - Registers: `search_foundations`, `get_component`, `get_token`, `get_pattern`, `get_rule`, `validate_token_name`
    - Each entry includes Zod input schema and handler reference
    - _Requirements: 24.2_

  - [x] 5.4 Define prompt registry
    - Create `src/registry/prompts.ts` with declarative array of `PromptRegistryEntry` objects
    - Registers: `load_context`, `implement_component`, `propose_token`
    - Each entry includes argument definitions and handler reference
    - _Requirements: 16.1, 17.1, 18.1_

  - [x] 5.5 Implement MCP server setup
    - Create `src/server.ts` that creates `McpServer` instance
    - Registers all resources, tools, and prompts from registries
    - Returns server capabilities including protocol version, server name, all registered entries
    - Implements pagination for `resources/list` (max 50 per page, cursor-based)
    - Implements health check method returning uptime and request count
    - _Requirements: 1.3, 2.1, 2.4, 2.5, 22.3_

  - [x] 5.6 Implement entry point with CLI argument parsing
    - Create `src/index.ts` as main entry point
    - Parses CLI args: `--root` (default: cwd), `--transport` (stdio default, http), `--port` (for HTTP transport)
    - Creates transport (StdioServerTransport or StreamableHTTPServerTransport)
    - Connects server to transport
    - Reads `package.json` version for server info
    - Exits with non-zero code if root path doesn't exist or package.json unreadable
    - Logs startup info to stderr
    - _Requirements: 1.1, 1.2, 1.5, 1.7, 21.1, 21.4, 23.1, 23.2, 23.3, 23.5_

  - [x] 5.7 Write property tests for registry (Properties 1, 2, 3, 4, 22)
    - **Property 1: Capabilities list all registered entries** — initialization response includes every registered resource URI, tool name, and prompt name
    - **Property 2: Resource list entries contain all required fields** — each entry has non-empty URI matching `uif://{category}/{path}`, name, description, valid MIME type, category from allowed set
    - **Property 3: Pagination completeness** — iterating all pages yields exactly N entries, no page exceeds 50
    - **Property 4: Invalid cursor rejection** — non-server-issued cursor strings produce error code -32602
    - **Property 22: Registry extensibility** — new valid entries appear after restart; malformed entries are skipped with logged error
    - **Validates: Requirements 1.3, 2.1, 2.2, 2.4, 2.5, 24.3, 24.4, 24.5**

- [x] 6. Implement resource handlers
  - [x] 6.1 Implement manifest resource handler
    - Create `src/resources/manifest.ts`
    - `uif://manifest/context` → returns `docs/context-manifest.json` as JSON, validates top-level keys
    - `uif://manifest/version` → returns version from root `package.json`
    - Returns error if manifest is missing or invalid JSON
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 6.2 Implement agents resource handler
    - Create `src/resources/agents.ts`
    - Maps: `uif://agents/rules` → `AGENTS.md`, `uif://agents/behavior` → `docs/agentic/assistant-behavior-rules.md`, `uif://agents/design-contract` → `DESIGN.md`, `uif://agents/implementation` → `IMPLEMENTATION.md`
    - Returns `text/markdown` MIME type
    - Returns not-found error with valid agent resource URIs for unrecognized identifiers
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 6.3 Implement tokens resource handler
    - Create `src/resources/tokens.ts`
    - Maps `uif://tokens/core`, `uif://tokens/semantic`, `uif://tokens/component` to their JSON files
    - `uif://tokens/modes` → combines mode-light and mode-dark JSON
    - `uif://tokens/brands` → combines all brand JSON files
    - Includes `layer` metadata in responses
    - Returns error for missing token files
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 6.4 Implement components resource handler
    - Create `src/resources/components.ts`
    - `uif://components` → returns JSON array of all components (name, description, URI)
    - `uif://components/{name}` → returns structured component data with all fields
    - Case-insensitive resolution to canonical kebab-case
    - Returns not-found error with valid component names for unrecognized identifiers
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 6.5 Implement patterns resource handler
    - Create `src/resources/patterns.ts`
    - `uif://patterns` → lists all patterns with name, description, URI
    - `uif://patterns/{name}` → returns pattern documentation, related components/tokens
    - Exposes forms, navigation, cards, layout, and feedback patterns from `docs/patterns/`
    - Returns not-found error with valid pattern names
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 6.6 Implement governance resource handler
    - Create `src/resources/governance.ts`
    - `uif://governance/rules` → `docs/ui-foundations-rules.md`
    - `uif://governance/naming` → `docs/foundations/foundation-002-naming-and-grouping.md`
    - `uif://governance/layering` → `docs/foundations/foundation-001-token-layering.md`
    - Returns error if backing file unreadable
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 6.7 Implement foundations resource handler
    - Create `src/resources/foundations.ts`
    - `uif://foundations` → lists all foundation documents (001–012) with id, title, URI
    - `uif://foundations/{id}` → returns content of specific foundation document
    - Returns not-found error with valid identifiers
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 6.8 Write property tests for resolution (Properties 5, 6, 7, 8)
    - **Property 5: Not-found error includes valid alternatives** — error response includes requested URI and list of valid identifiers for that category
    - **Property 6: Case-insensitive identifier resolution** — any case variation resolves to canonical form with same response
    - **Property 7: Component response completeness** — all required fields present (documentation, cssClassName, htmlPattern, variants, states, tokens, codeConnectSchemaPath); empty data = empty arrays/null, never omitted
    - **Property 8: Fuzzy match suggestion for near-misses** — strings with Levenshtein ≤ 3 from valid name get suggestion in error
    - **Validates: Requirements 4.5, 6.3, 6.4, 7.4, 9.3, 11.1, 11.3, 11.4, 11.5, 13.2, 14.3**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement tool handlers
  - [x] 8.1 Implement search_foundations tool
    - Create `src/tools/search.ts`
    - Validates query length (≥2 chars), rejects short queries with error
    - Uses SearchIndex to find matches, returns up to 20 results
    - Each result includes URI, excerpt (≤200 chars), score (0.0–1.0), sorted by descending score
    - Returns empty result set with message if no matches
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 8.2 Implement get_component tool
    - Create `src/tools/get-component.ts`
    - Case-insensitive name resolution to canonical kebab-case
    - Returns full component data: documentation, cssClassName, htmlPattern, variants, states, tokens, codeConnectSchemaPath
    - Empty/missing optional fields returned as empty arrays or null
    - Unrecognized names: error with valid names list + fuzzy suggestion (edit distance ≤3)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 8.3 Implement get_token tool
    - Create `src/tools/get-token.ts`
    - Case-insensitive substring match on token names (≥2 char query)
    - Returns up to 50 matches: name, value, layer, type, CSS custom property
    - Layer filter: when provided, only returns tokens of that layer
    - Rejects query <2 chars (without layer filter), rejects invalid layer values with valid options list
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 8.4 Implement get_pattern tool
    - Create `src/tools/get-pattern.ts`
    - Case-insensitive exact match against registered pattern names
    - Returns pattern documentation: purpose, structure, composition rules, interaction rules, accessibility, design principles, heuristics, related component tokens
    - Unrecognized name: error with provided name + complete list of valid pattern names
    - Handles unavailable data source
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 8.5 Implement get_rule tool
    - Create `src/tools/get-rule.ts`
    - Accepts category parameter, normalizes to lowercase-hyphenated form
    - Maps: naming→"Naming Rules", layering→"Layer Model", theming→"Theming Rules", design-to-code→"Design-to-Code Rules", review→"Review Checklist", agent-readiness→"Agent-Readiness Rules"
    - Extracts corresponding section from `docs/ui-foundations-rules.md`
    - Rejects invalid categories with list of valid options
    - _Requirements: 14.1, 14.2, 14.3_

  - [x] 8.6 Implement validate_token_name tool
    - Create `src/tools/validate-token-name.ts`
    - Validates token name against naming conventions from `docs/foundations/foundation-002-naming-and-grouping.md`
    - Checks: PascalCase first segment, kebab-case subsequent segments, known layer prefix, recognized state values (last segment), no device labels, ≥2 dot-separated segments, ≤200 chars, non-empty
    - Returns `{ valid, violations[], suggestedName }` structure
    - Each violation includes segment, ruleNumber, message
    - Generates suggested corrected name when invalid
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [x] 8.7 Write property tests for search (Properties 9, 10, 11)
    - **Property 9: Search result constraints** — queries ≥2 chars return max 20 results, each with non-empty URI, excerpt ≤200 chars, score in [0.0, 1.0], ordered descending
    - **Property 10: Short query rejection** — queries <2 chars (including empty) produce error
    - **Property 11: Token search filter invariant** — with layer filter, all returned tokens match that layer, names contain query as case-insensitive substring, count ≤50
    - **Validates: Requirements 10.1, 10.2, 10.3, 12.1, 12.2, 12.4**

  - [x] 8.8 Write property tests for validation (Properties 12, 13, 14)
    - **Property 12: Invalid enum parameter rejection** — invalid enum values produce error listing all valid values
    - **Property 13: Token name validation structural invariant** — response always has boolean `valid`; when false: non-empty violations with ruleNumber/message, non-null suggestedName; when true: empty violations
    - **Property 14: Token naming rule enforcement** — names conforming to all rules validate as true; names violating any rule validate as false with specific violation
    - **Validates: Requirements 12.5, 14.2, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 16.2, 16.3, 18.3**

- [x] 9. Implement prompt handlers
  - [x] 9.1 Implement load_context prompt
    - Create `src/prompts/load-context.ts`
    - Returns prompt template with file paths from `docs/context-manifest.json` ordered by ascending priority (1–8)
    - Requires `task_type` argument: `implementation`, `audit`, `token-proposal`, `pattern-discovery`
    - Includes task-type-specific `contextDirectories` alongside base `contextFiles`
    - Rejects invalid task_type with error listing valid values
    - Returns error if manifest unavailable
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 9.2 Implement implement_component prompt
    - Create `src/prompts/implement-component.ts`
    - Requires component name argument (lowercase letters and hyphens only, non-empty)
    - Returns prompt template covering all 10 integration surfaces: CSS pattern, Nunjucks macro, React wrapper, docs page, playground page, playground renderer, Code Connect, component token layer, unit tests, accessibility
    - Includes file path references to governance and naming rules documents
    - Includes expected file paths using component name as path segment
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

  - [x] 9.3 Implement propose_token prompt
    - Create `src/prompts/propose-token.ts`
    - Requires `layer` argument (core, semantic, component, mode) and `purpose` argument (≤500 chars)
    - Inlines naming convention rules and layering rules as literal text
    - Tailors naming pattern guidance to requested layer: component→variant-first, semantic→role-based, core→primitives, mode→color palette
    - Includes sections for naming rules, layer placement rationale, reference checks, validation step
    - Rejects invalid layer values with error listing valid options
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

  - [x] 9.4 Write property tests for prompts (Properties 15, 16)
    - **Property 15: Implement component prompt surface coverage** — for any valid component name (non-empty, lowercase+hyphens), template references all 10 integration surfaces and includes file paths with component name
    - **Property 16: Propose token prompt layer tailoring** — for any valid layer, template contains layer-specific naming pattern guidance (variant-first for component, role-based for semantic, primitives for core, color palette for mode)
    - **Validates: Requirements 17.1, 17.3, 17.4, 18.4**

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement error handling and logging integration
  - [x] 11.1 Wire error handling into server core
    - Integrate structured error responses across all handlers using JSON-RPC error codes: -32600, -32601, -32602, -32002, -32603
    - Ensure every error preserves request ID, contains actionable message, delivers within 2 seconds
    - Ensure errors never expose absolute paths, stack traces, or env values
    - Wire logger to capture all error responses with full context
    - _Requirements: 1.4, 1.6, 19.1, 19.2, 19.3, 19.4, 19.5, 20.6_

  - [x] 11.2 Implement graceful degradation
    - Handle missing registry files (skip entry, log error, continue loading)
    - Handle unavailable individual resources after startup (only that resource errors, others continue)
    - Handle search index partial failure (other resources remain searchable)
    - _Requirements: 24.5_

  - [x] 11.3 Write property test for error logging (Property 21)
    - **Property 21: Error logging completeness** — for any request producing a JSON-RPC error, stderr contains JSON log entry with ISO 8601 timestamp, request ID, error code, URI/tool name, response time ms, error category string
    - **Validates: Requirements 19.4, 22.4**

- [x] 12. Integration wiring and distribution setup
  - [x] 12.1 Wire all components together in server.ts
    - Connect security layer as middleware before handler dispatch
    - Connect file reader to all resource/tool handlers with configured root path
    - Build search index on startup from all resource content
    - Ensure handshake completes within 2 seconds (stdio) / 3 seconds (HTTP)
    - Log startup info (version, transport type, registered resource/tool counts)
    - _Requirements: 1.1, 1.2, 1.5, 22.2_

  - [x] 12.2 Configure npm distribution
    - Set up `bin` entry in package.json pointing to compiled entry point
    - Ensure `npx ui-foundations-mcp` works with stdio transport
    - Add `files` field to include only dist and necessary metadata
    - Add build script (`tsc`) to compile TypeScript to `dist/mcp/`
    - _Requirements: 23.1, 23.4_

  - [x] 12.3 Write integration tests
    - Test server initialization and MCP handshake (stdio transport)
    - Test full request/response cycle for each resource category
    - Test search across indexed content
    - Test health check endpoint
    - Test connection timeout behavior
    - Test content hash updates when files change
    - _Requirements: 1.1, 1.3, 1.5, 21.2, 21.3, 22.3_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (22 properties total)
- Unit tests validate specific examples and edge cases
- The design specifies TypeScript with strict mode compiled to ESM
- Node.js built-in test runner is used for all tests; `fast-check` for property-based tests
- All property test files go in `packages/mcp-server/tests/properties/`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.4"] },
    { "id": 3, "tasks": ["2.3", "2.5"] },
    { "id": 4, "tasks": ["2.6", "3.1", "3.2"] },
    { "id": 5, "tasks": ["3.3", "5.1"] },
    { "id": 6, "tasks": ["5.2", "5.3", "5.4"] },
    { "id": 7, "tasks": ["5.5", "5.6"] },
    { "id": 8, "tasks": ["5.7", "6.1", "6.2", "6.3"] },
    { "id": 9, "tasks": ["6.4", "6.5", "6.6", "6.7"] },
    { "id": 10, "tasks": ["6.8", "8.1", "8.2", "8.3"] },
    { "id": 11, "tasks": ["8.4", "8.5", "8.6"] },
    { "id": 12, "tasks": ["8.7", "8.8", "9.1", "9.2", "9.3"] },
    { "id": 13, "tasks": ["9.4", "11.1", "11.2"] },
    { "id": 14, "tasks": ["11.3", "12.1"] },
    { "id": 15, "tasks": ["12.2", "12.3"] }
  ]
}
```
