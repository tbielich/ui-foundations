# Requirements Document

## Introduction

UI Foundations MCP Server exposes the design system's knowledge, rules, components, patterns, and tokens to AI agents via the Model Context Protocol (MCP). It provides a structured, deterministic interface so that any MCP-compatible client (Kiro, Goose, Codex, Copilot Studio, or future agents) can discover and consume design system context without manually loading files or guessing repository structure.

Phase 1 scope covers read-only resource access, search tools, validation utilities, and context-loading prompts. It does not include write operations, Jira/GitLab integration, Figma mutations, automated code mods, user management, or complex authentication.

## Glossary

- **MCP_Server**: The Model Context Protocol server process that exposes UI Foundations resources, tools, and prompts to MCP clients
- **MCP_Client**: Any AI agent or tool that connects to the MCP_Server to consume design system context (e.g. Kiro, Goose, Codex, Copilot Studio)
- **Resource**: A read-only content endpoint identified by a URI that returns structured design system knowledge
- **Tool**: A callable function exposed by the MCP_Server that performs a computation and returns a result
- **Prompt**: A reusable prompt template exposed by the MCP_Server that helps agents perform common design system tasks
- **URI**: A Uniform Resource Identifier following the `uif://` scheme that uniquely addresses a resource
- **Token**: A design token (CSS custom property) at any layer: Core, Semantic, Component, or Theme
- **Component**: A UI Foundations component with its CSS pattern, documentation, tokens, and metadata
- **Pattern**: A composition-level guide (forms, navigation, cards, layout, feedback) describing how components work together
- **Rule**: A governance or behavior rule from the design system (naming, layering, theming, agent behavior)
- **Context_Manifest**: The machine-readable JSON index at `docs/context-manifest.json` describing all available context files
- **Transport**: The communication mechanism between MCP_Client and MCP_Server (stdio or HTTP/SSE)
- **Validator**: A function that checks whether an input conforms to design system naming or structural rules

## Requirements

### Requirement 1: Server Initialization and Transport

**User Story:** As an MCP client, I want to connect to the MCP server over standard transports, so that I can access UI Foundations knowledge from any compatible environment.

#### Acceptance Criteria

1. WHEN an MCP_Client initiates a connection via stdio transport, THE MCP_Server SHALL complete the MCP handshake and return server capabilities within 2 seconds
2. WHEN an MCP_Client initiates a connection via HTTP/SSE transport, THE MCP_Server SHALL complete the MCP handshake and return server capabilities within 3 seconds
3. WHEN the MCP handshake completes, THE MCP_Server SHALL return its supported protocol version, server name, and available capabilities listing all registered resources, tools, and prompts
4. IF an MCP_Client sends a malformed initialization request, THEN THE MCP_Server SHALL return a JSON-RPC error response containing an error code and a message indicating which required fields are missing or invalid
5. WHILE the MCP_Server is running, THE MCP_Server SHALL maintain the transport connection and respond to each valid JSON-RPC request within 5 seconds
6. IF an MCP_Client requests a protocol version that the MCP_Server does not support, THEN THE MCP_Server SHALL return a JSON-RPC error indicating the unsupported version and listing the supported protocol versions
7. IF the transport connection is interrupted or idle for more than 30 seconds without a keepalive, THEN THE MCP_Server SHALL close the connection and release associated resources

### Requirement 2: Resource Discovery and Listing

**User Story:** As an MCP client, I want to discover all available resources, so that I can understand what design system knowledge is accessible.

#### Acceptance Criteria

1. WHEN an MCP_Client sends a `resources/list` request without a cursor parameter, THE MCP_Server SHALL return the first page of available resources within 500 milliseconds, where each resource entry includes URI, name, description, MIME type, and category
2. THE MCP_Server SHALL expose all resources under the `uif://` URI scheme with the category encoded as the first path segment (e.g. `uif://tokens/core`, `uif://components/button`)
3. THE MCP_Server SHALL organize resources into exactly these categories: manifest, agents, tokens, components, patterns, governance, and foundations
4. WHEN an MCP_Client sends a `resources/list` request with a cursor parameter, THE MCP_Server SHALL return the next page of resources containing at most 50 resource entries and a next cursor value, or no cursor if the final page has been reached
5. IF an MCP_Client sends a `resources/list` request with an invalid or expired cursor parameter, THEN THE MCP_Server SHALL return a JSON-RPC error with code -32602 and a message indicating the cursor is not recognized

### Requirement 3: Context Manifest Resource

**User Story:** As an MCP client, I want to load the full system context manifest, so that I can understand the repository structure and loading priorities.

#### Acceptance Criteria

1. WHEN an MCP_Client reads the resource at `uif://manifest/context`, THE MCP_Server SHALL return the content of `docs/context-manifest.json` as a JSON object with MIME type `application/json`
2. THE MCP_Server SHALL validate that the manifest response contains the top-level keys `contextFiles` (each entry including a `priority` number), `contextDirectories` (each entry including a `path` string), and `tokenSources` (each entry including a glob path string) before serving the resource
3. WHEN an MCP_Client reads the resource at `uif://manifest/version`, THE MCP_Server SHALL return a JSON object containing a `version` field with the value of the `version` field from the repository root `package.json`
4. IF the `docs/context-manifest.json` file is missing or contains invalid JSON, THEN THE MCP_Server SHALL return a JSON-RPC error indicating the manifest could not be loaded

### Requirement 4: Agent Rules Resources

**User Story:** As an MCP client, I want to retrieve agent behavior rules and workflows, so that I can operate according to UI Foundations governance.

#### Acceptance Criteria

1. WHEN an MCP_Client reads the resource at `uif://agents/rules`, THE MCP_Server SHALL return the full raw content of `AGENTS.md` as `text/markdown`
2. WHEN an MCP_Client reads the resource at `uif://agents/behavior`, THE MCP_Server SHALL return the full raw content of `docs/agentic/assistant-behavior-rules.md` as `text/markdown`
3. WHEN an MCP_Client reads the resource at `uif://agents/design-contract`, THE MCP_Server SHALL return the full raw content of `DESIGN.md` as `text/markdown`
4. WHEN an MCP_Client reads the resource at `uif://agents/implementation`, THE MCP_Server SHALL return the full raw content of `IMPLEMENTATION.md` as `text/markdown`
5. IF an MCP_Client reads a resource under `uif://agents/` with a path segment that does not match one of the defined agent resource identifiers (rules, behavior, design-contract, implementation), THEN THE MCP_Server SHALL return a resource-not-found error listing the valid agent resource URIs

### Requirement 5: Token Resources

**User Story:** As an MCP client, I want to access design tokens by layer, so that I can reference correct token values and names during implementation.

#### Acceptance Criteria

1. WHEN an MCP_Client reads the resource at `uif://tokens/core`, THE MCP_Server SHALL return the content of `dist/tokens/json/core-primitives.tokens.json` as a JSON object conforming to the DTCG token format
2. WHEN an MCP_Client reads the resource at `uif://tokens/semantic`, THE MCP_Server SHALL return the content of `dist/tokens/json/semantics-roles.tokens.json` as a JSON object conforming to the DTCG token format
3. WHEN an MCP_Client reads the resource at `uif://tokens/component`, THE MCP_Server SHALL return the content of `dist/tokens/json/components-ui.tokens.json` as a JSON object conforming to the DTCG token format
4. WHEN an MCP_Client reads the resource at `uif://tokens/modes`, THE MCP_Server SHALL return a JSON object containing both `mode-light` and `mode-dark` keys, each holding the content of the corresponding `dist/tokens/json/appearance-modes.tokens.mode-*.json` file
5. WHEN an MCP_Client reads the resource at `uif://tokens/brands`, THE MCP_Server SHALL return a JSON object containing one key per brand file found in `dist/tokens/json/themes-brands.tokens.*.json`, each holding that file's content
6. THE MCP_Server SHALL include a `layer` metadata field in the response for each token resource indicating its token layer (core, semantic, component, mode, or brand)
7. IF a token source file referenced by a token resource URI is missing or unreadable, THEN THE MCP_Server SHALL return a JSON-RPC error with code -32603 and a message identifying the missing file path
8. THE MCP_Server SHALL return token resource responses within 2 seconds of receiving the read request

### Requirement 6: Component Resources

**User Story:** As an MCP client, I want to retrieve component documentation and metadata, so that I can correctly use and reference components during development.

#### Acceptance Criteria

1. WHEN an MCP_Client reads the resource at `uif://components/{name}` where `{name}` is a kebab-case component identifier matching a registered component, THE MCP_Server SHALL return a structured JSON response containing the component documentation content, CSS pattern file path, list of available variants, list of supported states, and list of associated token names
2. WHEN an MCP_Client reads the resource at `uif://components`, THE MCP_Server SHALL return a JSON array of all available components, each containing name, description, and resource URI
3. IF an MCP_Client reads a resource at `uif://components/{name}` where `{name}` does not match a known component after case-insensitive comparison, THEN THE MCP_Server SHALL return a resource-not-found error with a list of valid component names
4. WHEN an MCP_Client reads the resource at `uif://components/{name}` where `{name}` differs in casing from the canonical kebab-case identifier but matches after case-insensitive normalization, THE MCP_Server SHALL resolve the component and return the same response as the canonical form

### Requirement 7: Pattern Resources

**User Story:** As an MCP client, I want to access composition patterns, so that I can understand how components should work together.

#### Acceptance Criteria

1. WHEN an MCP_Client reads the resource at `uif://patterns/{name}` where `{name}` is one of the exposed pattern identifiers, THE MCP_Server SHALL return the pattern documentation including description, component composition guidance, and related token references
2. WHEN an MCP_Client reads the resource at `uif://patterns`, THE MCP_Server SHALL return a list of all available patterns with name, description, and URI
3. THE MCP_Server SHALL expose patterns for forms, navigation, cards, layout, and feedback, sourced from `docs/patterns/`
4. IF an MCP_Client reads a resource at `uif://patterns/{name}` where `{name}` does not match an exposed pattern identifier, THEN THE MCP_Server SHALL return a resource-not-found error with a list of valid pattern names

### Requirement 8: Governance Resources

**User Story:** As an MCP client, I want to access governance and naming rules, so that I can validate my work against the design system's standards.

#### Acceptance Criteria

1. WHEN an MCP_Client reads the resource at `uif://governance/rules`, THE MCP_Server SHALL return the full content of `docs/ui-foundations-rules.md` as UTF-8 text with MIME type `text/markdown`
2. WHEN an MCP_Client reads the resource at `uif://governance/naming`, THE MCP_Server SHALL return the full content of `docs/foundations/foundation-002-naming-and-grouping.md` as UTF-8 text with MIME type `text/markdown`
3. WHEN an MCP_Client reads the resource at `uif://governance/layering`, THE MCP_Server SHALL return the full content of `docs/foundations/foundation-001-token-layering.md` as UTF-8 text with MIME type `text/markdown`
4. IF the backing file for a governance resource cannot be read, THEN THE MCP_Server SHALL return an error response indicating which file is unavailable

### Requirement 9: Foundation Architecture Resources

**User Story:** As an MCP client, I want to access architecture decision records, so that I can understand the reasoning behind design system decisions.

#### Acceptance Criteria

1. WHEN an MCP_Client reads the resource at `uif://foundations/{id}` where `{id}` is a valid foundation document identifier (001 through 012), THE MCP_Server SHALL return the content of the corresponding foundation document from `docs/foundations/` as UTF-8 text with MIME type `text/markdown`
2. WHEN an MCP_Client reads the resource at `uif://foundations`, THE MCP_Server SHALL return a list of all foundation documents with identifier, title, and URI
3. IF an MCP_Client reads a resource at `uif://foundations/{id}` where `{id}` does not match a known foundation document, THEN THE MCP_Server SHALL return a resource-not-found error with a list of valid foundation identifiers

### Requirement 10: Search Tool

**User Story:** As an MCP client, I want to search across all design system knowledge, so that I can quickly find relevant information without knowing the exact resource URI.

#### Acceptance Criteria

1. WHEN an MCP_Client calls the `search_foundations` tool with a query string of at least 2 characters, THE MCP_Server SHALL return up to 20 matching results ranked by descending relevance score from across all resources (tokens, components, patterns, rules, foundations)
2. THE MCP_Server SHALL include the resource URI, a content excerpt of up to 200 characters, and a numeric relevance score between 0.0 and 1.0 for each search result
3. IF an MCP_Client calls `search_foundations` with an empty query or a query shorter than 2 characters, THEN THE MCP_Server SHALL return a JSON-RPC error indicating that a query of at least 2 characters is required
4. THE MCP_Server SHALL return search results within 500 milliseconds for queries against the full knowledge base
5. IF no resources match the query, THEN THE MCP_Server SHALL return an empty result set with a message indicating no matches were found

### Requirement 11: Component Lookup Tool

**User Story:** As an MCP client, I want to look up a specific component's full details, so that I can get implementation-ready information in a single call.

#### Acceptance Criteria

1. WHEN an MCP_Client calls the `get_component` tool with a valid component name, THE MCP_Server SHALL return a structured JSON object containing the component's documentation, CSS class name, HTML pattern, available variants (as a list), supported states (as a list), associated token names (as a list), and Code Connect schema path
2. WHEN an MCP_Client calls the `get_component` tool with a valid component name, THE MCP_Server SHALL return the response within 200 milliseconds
3. IF an MCP_Client calls the `get_component` tool with an unrecognized component name, THEN THE MCP_Server SHALL return an error containing a list of valid component names and, if a component name has an edit distance of 3 or fewer from the input, a suggestion for the closest match
4. IF a component exists but one or more optional fields (variants, states, tokens, or Code Connect schema path) have no data, THEN THE MCP_Server SHALL return the component response with those fields set to empty lists or null rather than omitting them
5. THE MCP_Server SHALL accept component names in any casing (uppercase, lowercase, mixed) and normalize to the canonical lowercase kebab-case form before lookup

### Requirement 12: Token Lookup Tool

**User Story:** As an MCP client, I want to look up tokens by name or partial name, so that I can find the correct token for a given purpose.

#### Acceptance Criteria

1. WHEN an MCP_Client calls the `get_token` tool with a token name or partial name of at least 2 characters, THE MCP_Server SHALL perform a case-insensitive substring match against all token names and return up to 50 matching tokens, each including their name, value, layer, type, and CSS custom property form
2. WHEN an MCP_Client calls the `get_token` tool with a `layer` filter parameter, THE MCP_Server SHALL return only tokens belonging to the specified layer (core, semantic, component, or theme), applying the filter in combination with any name query
3. IF no tokens match the query, THEN THE MCP_Server SHALL return an empty result set with a message indicating no tokens matched and echoing the search term used
4. IF an MCP_Client calls the `get_token` tool with a query shorter than 2 characters and no layer filter, THEN THE MCP_Server SHALL return an error indicating the minimum query length requirement
5. IF an MCP_Client calls the `get_token` tool with an invalid `layer` filter value, THEN THE MCP_Server SHALL return an error listing the valid layer values (core, semantic, component, theme)

### Requirement 13: Pattern Lookup Tool

**User Story:** As an MCP client, I want to look up a composition pattern, so that I can understand how to combine components for a specific use case.

#### Acceptance Criteria

1. WHEN an MCP_Client calls the `get_pattern` tool with a valid pattern name, THE MCP_Server SHALL return the pattern documentation including: purpose, structure description, composition rules, interaction rules, accessibility considerations, applied design principles, applied heuristics, and related component tokens
2. WHEN an MCP_Client calls the `get_pattern` tool with a valid pattern name, THE MCP_Server SHALL perform a case-insensitive exact match against the registered pattern names
3. IF an MCP_Client calls the `get_pattern` tool with an unrecognized pattern name, THEN THE MCP_Server SHALL return an error response that includes the unrecognized name provided and the complete list of valid pattern names
4. IF the pattern data source is unavailable when the `get_pattern` tool is called, THEN THE MCP_Server SHALL return an error response indicating the data source is temporarily unavailable

### Requirement 14: Rule Lookup Tool

**User Story:** As an MCP client, I want to retrieve a specific governance rule, so that I can check compliance for a particular aspect of implementation.

#### Acceptance Criteria

1. WHEN an MCP_Client calls the `get_rule` tool with a rule category (naming, layering, theming, design-to-code, review, agent-readiness), THE MCP_Server SHALL return the corresponding section from `docs/ui-foundations-rules.md` as plain text content matching the category to its document heading (naming → "Naming Rules", layering → "Layer Model", theming → "Theming Rules", design-to-code → "Design-to-Code Rules", review → "Review Checklist", agent-readiness → "Agent-Readiness Rules")
2. IF an MCP_Client calls the `get_rule` tool with an unrecognized category, THEN THE MCP_Server SHALL return a JSON-RPC error listing the six valid rule categories (naming, layering, theming, design-to-code, review, agent-readiness)
3. THE MCP_Server SHALL accept the category parameter in any casing and normalize to the canonical lowercase-hyphenated form before matching

### Requirement 15: Token Name Validation Tool

**User Story:** As an MCP client, I want to validate a proposed token name against naming conventions, so that I can ensure compliance before creating tokens.

#### Acceptance Criteria

1. WHEN an MCP_Client calls the `validate_token_name` tool with a token name string in Figma dot-notation format (e.g., `Button.solid.container.background.hover`), THE MCP_Server SHALL return a validation result containing a boolean `valid` field and, if invalid, an array of violation objects
2. IF the token name is invalid, THEN THE MCP_Server SHALL return one violation entry per failed rule, each citing the specific rule number from `docs/foundations/foundation-002-naming-and-grouping.md` and describing what segment violated it
3. IF the token name is invalid, THEN THE MCP_Server SHALL return a suggested corrected name that conforms to the naming convention defined in `docs/foundations/foundation-002-naming-and-grouping.md`
4. THE MCP_Server SHALL validate that the first segment (component or role name) uses PascalCase, that subsequent multi-word segments use kebab-case, that the layer prefix matches a known token layer (Component, Color, Typography, Corner, Spacing), that the last segment is a recognized state value when a state is present (one of: default, hover, active, focus, disabled), and that no segment contains device labels (mobile, tablet, desktop)
5. IF the token name is an empty string or contains only whitespace, THEN THE MCP_Server SHALL return a validation failure indicating that the token name must be a non-empty string containing at least two dot-separated segments
6. THE MCP_Server SHALL accept token name strings with a maximum length of 200 characters and reject any input exceeding this limit with a validation error indicating the length constraint

### Requirement 16: Context Loading Prompt

**User Story:** As an MCP client, I want to use a pre-built prompt that loads the correct context in the right order, so that I can follow UI Foundations governance without manually orchestrating file reads.

#### Acceptance Criteria

1. WHEN an MCP_Client requests the `load_context` prompt, THE MCP_Server SHALL return a prompt template that lists file paths from the `contextFiles` entries in `docs/context-manifest.json` ordered by ascending `priority` value (1 through 8)
2. THE MCP_Server SHALL include a required `task_type` argument in the prompt accepting exactly the values `implementation`, `audit`, `token-proposal`, and `pattern-discovery`, and SHALL include only the `contextDirectories` entries relevant to the selected task type alongside the base `contextFiles` sequence
3. IF the MCP_Client supplies a `task_type` value not in the accepted set, THEN THE MCP_Server SHALL return an error response indicating the invalid argument and listing the accepted values
4. IF `docs/context-manifest.json` cannot be read or parsed, THEN THE MCP_Server SHALL return an error response indicating the manifest is unavailable

### Requirement 17: Component Implementation Prompt

**User Story:** As an MCP client, I want a prompt that guides component creation, so that I can scaffold new components following the 10-surface workflow.

#### Acceptance Criteria

1. WHEN an MCP_Client requests the `implement_component` prompt with a component name argument, THE MCP_Server SHALL return a prompt template that provides actionable guidance for each of the 10 required integration surfaces (CSS pattern, Nunjucks macro, React wrapper, docs page, playground page, playground renderer, Code Connect, component token layer, unit tests, accessibility requirements)
2. WHEN the MCP_Server returns the `implement_component` prompt template, THE MCP_Server SHALL include file path references to the governance rules document (`docs/agentic/assistant-behavior-rules.md` Rules 8–12) and the naming rules document (`docs/ui-foundations-rules.md` Naming Rules section) within the template
3. IF the MCP_Client requests the `implement_component` prompt with a component name argument that is empty or contains characters other than lowercase letters and hyphens, THEN THE MCP_Server SHALL return an error response indicating the component name must be a non-empty string containing only lowercase letters and hyphens
4. WHEN the MCP_Server returns the `implement_component` prompt template, THE MCP_Server SHALL include the expected file paths for each integration surface using the component name argument as the path segment (e.g., `src/ui/patterns/<name>.css`, `src/react/<name>.js`, `site/components/<name>.md`)

### Requirement 18: Token Proposal Prompt

**User Story:** As an MCP client, I want a prompt that guides token creation proposals, so that I can follow the correct naming and layering process.

#### Acceptance Criteria

1. WHEN an MCP_Client requests the `propose_token` prompt with a `layer` argument (one of: core, semantic, component, mode) and a `purpose` argument (free-text description of the token's intended use, maximum 500 characters), THE MCP_Server SHALL return a prompt template that includes sections for naming rules, layer placement rationale, reference checks against existing tokens, and a validation step using the `validate_token_name` tool
2. THE MCP_Server SHALL inline the naming convention rules from `docs/foundations/foundation-002-naming-and-grouping.md` and the layering rules from `docs/foundations/foundation-001-token-layering.md` as literal text within the prompt template so the consuming agent has full rule context without additional resource reads
3. IF an MCP_Client requests the `propose_token` prompt with a `layer` argument value that is not one of core, semantic, component, or mode, THEN THE MCP_Server SHALL return a JSON-RPC error listing the valid layer values
4. THE MCP_Server SHALL tailor the naming pattern guidance in the prompt template to the requested layer: component-layer proposals receive the variant-first path format (`Component.variant.part.property.state`), semantic-layer proposals receive the role-based format (`Color.Text.Default`), core-layer proposals receive the primitives format, and mode-layer proposals receive the color palette format

### Requirement 19: Error Handling and Resilience

**User Story:** As an MCP client, I want consistent and informative error responses, so that I can understand failures and recover gracefully.

#### Acceptance Criteria

1. IF an MCP_Client sends a request referencing a resource URI that does not exist, THEN THE MCP_Server SHALL return a JSON-RPC error response with code -32002, a message that includes the requested URI value, and the same "id" as the original request
2. IF an MCP_Client calls a tool with missing required parameters, THEN THE MCP_Server SHALL return a JSON-RPC error response with code -32602, a message that includes the names of all missing required parameters, and the same "id" as the original request
3. IF the MCP_Server encounters an internal error while reading a file, THEN THE MCP_Server SHALL return a JSON-RPC error response with code -32603, a message that includes the file path or URI that could not be read, and the same "id" as the original request, without persisting any partial side effects from the failed operation
4. THE MCP_Server SHALL log all errors that result in a JSON-RPC error response to standard error output, with each log entry containing an ISO 8601 timestamp, the request ID, the error code, and the resource URI or tool name from the original request
5. IF the MCP_Server returns a JSON-RPC error response, THEN THE MCP_Server SHALL deliver that response within 2 seconds of receiving the original request

### Requirement 20: Security and Input Validation

**User Story:** As a system administrator, I want the MCP server to reject malicious or invalid inputs, so that the server remains stable and does not expose sensitive data.

#### Acceptance Criteria

1. THE MCP_Server SHALL validate all incoming request parameters against the expected types defined by the MCP protocol schema and reject any string parameter exceeding 1,000 characters (unless a tool-specific limit applies) before processing
2. IF a resource URI contains path traversal sequences in any encoding (including literal `../`, URL-encoded `%2e%2e%2f`, backslash variants `..\`, or double-encoded forms), THEN THE MCP_Server SHALL reject the request with an error indicating a disallowed path pattern and not resolve the path
3. THE MCP_Server SHALL restrict file access to the repository root directory and configured resource paths only
4. THE MCP_Server SHALL not expose environment variables, `.env` files, `.git` directory contents, or private key files (files with extensions `.pem`, `.key`, `.p12`, `.pfx`, or files whose content begins with a PEM private key header) through any resource or tool
5. IF a tool input exceeds 10,000 characters, THEN THE MCP_Server SHALL reject the request with an error indicating the maximum allowed size and the actual input size
6. IF the MCP_Server rejects a request due to a validation or security rule, THEN THE MCP_Server SHALL return an error response that does not include internal file system paths, stack traces, or environment variable values

### Requirement 21: Versioning and Cache Control

**User Story:** As an MCP client, I want to know which version of the design system I am consuming, so that I can detect when content has changed.

#### Acceptance Criteria

1. THE MCP_Server SHALL include the package version (from `package.json`) as a string in the semantic versioning format within the server capabilities response during initialization
2. WHEN an MCP_Client reads any resource, THE MCP_Server SHALL include a content hash (SHA-256 hex digest of the resource body) in the response metadata that remains identical for identical content and changes when the content changes
3. WHEN the underlying source files change, THE MCP_Server SHALL return the updated file content and an updated content hash on the next resource read without requiring a server restart
4. IF the `package.json` file cannot be read at startup, THEN THE MCP_Server SHALL fail initialization with an error message indicating the version file is unavailable

### Requirement 22: Observability

**User Story:** As a system administrator, I want the MCP server to produce structured logs, so that I can monitor usage and diagnose issues.

#### Acceptance Criteria

1. THE MCP_Server SHALL log each request as a single JSON object per line to standard error output, containing: an ISO 8601 timestamp, the method name, the resource URI or tool name, the response time in milliseconds, and a boolean success indicator
2. WHEN the MCP_Server starts, THE MCP_Server SHALL log a JSON object to standard error output containing: the server version, the transport type, and the number of registered resources and tools
3. WHILE the MCP_Server is running, THE MCP_Server SHALL respond to a health check method within 500 milliseconds with a JSON object containing uptime in seconds and total request count since startup
4. IF a request fails due to an error, THEN THE MCP_Server SHALL log a JSON object to standard error output containing: an ISO 8601 timestamp, the method name, the resource URI or tool name, the response time in milliseconds, and an error category indicating the type of failure

### Requirement 23: Deployment and Package Integration

**User Story:** As a developer, I want the MCP server to integrate with the existing build and package pipeline, so that it can be distributed alongside the design system.

#### Acceptance Criteria

1. THE MCP_Server SHALL be runnable as a standalone Node.js process via a `bin` entry in `package.json` that, when executed, starts the server and completes the MCP handshake ready to accept requests
2. THE MCP_Server SHALL read all source content from the repository file system at a root path configured via a `--root` CLI argument, defaulting to the current working directory when the argument is not provided
3. THE MCP_Server SHALL require no external services or databases to function (file-system-only dependency for Phase 1)
4. WHEN distributed via npm, THE MCP_Server SHALL be invocable with `npx ui-foundations-mcp` using stdio transport and SHALL complete the MCP handshake within 2 seconds of process start
5. IF the configured root path does not exist or is not readable, THEN THE MCP_Server SHALL exit with a non-zero exit code and write an error message indicating the path failure to stderr
6. THE MCP_Server SHALL require Node.js 18.0.0 or later and SHALL declare this minimum in the `engines` field of `package.json`

### Requirement 24: Extensibility

**User Story:** As a maintainer, I want the MCP server to support adding new resources and tools without modifying core server logic, so that the system can grow with the design system.

#### Acceptance Criteria

1. THE MCP_Server SHALL load resource definitions from a declarative registry (configuration file or module exports) where each entry specifies at minimum a URI, name, description, MIME type, and file path or handler reference
2. THE MCP_Server SHALL load tool definitions from a declarative registry where each entry specifies at minimum a name, description, input schema, and handler reference
3. WHEN a new resource entry is added to the registry, THE MCP_Server SHALL expose it on the next server start without changes to existing resource handlers or core server code
4. WHEN a new tool entry is added to the registry, THE MCP_Server SHALL expose it on the next server start without changes to existing tool handlers or core server code
5. IF a registry entry is malformed or references a missing file or handler, THEN THE MCP_Server SHALL log an error identifying the invalid entry and continue loading all remaining valid entries
