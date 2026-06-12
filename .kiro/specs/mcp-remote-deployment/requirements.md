# Requirements Document

## Introduction

Deploy the UI Foundations MCP Server as a remote HTTP endpoint so that MCP-compatible AI agents can connect and consume design system knowledge (tokens, components, patterns, governance) without cloning the repository. The server already supports Streamable HTTP transport locally — this feature packages it for remote hosting with authentication, HTTPS, containerization, and operational tooling.

## Glossary

- **MCP_Server**: The `@ui-foundations/mcp-server` Node.js application that exposes design system content via the Model Context Protocol
- **Remote_Endpoint**: The publicly accessible HTTPS URL where the MCP_Server is deployed and agents connect
- **API_Key**: A secret bearer token used to authenticate agent connections to the Remote_Endpoint
- **Container_Image**: A Docker image packaging the MCP_Server with all required repository content (tokens, docs, patterns)
- **Health_Endpoint**: The existing `health_check` tool that reports server uptime, status, and request count
- **Streamable_HTTP**: The HTTP-based MCP transport (already implemented) that enables remote agent connections
- **Agent_Client**: Any MCP-compatible AI agent or tool that connects to the Remote_Endpoint as a consumer
- **Deployment_Pipeline**: The CI/CD workflow that builds, tests, and deploys the Container_Image to the hosting environment
- **Rate_Limiter**: A middleware that restricts the number of requests an Agent_Client can make within a time window

## Requirements

### Requirement 1: Container Packaging

**User Story:** As a platform engineer, I want the MCP Server packaged as a Docker container with all required content baked in, so that it can be deployed to any container hosting platform without needing access to the source repository at runtime.

#### Acceptance Criteria

1. THE Deployment_Pipeline SHALL produce a Container_Image that includes the compiled MCP_Server and all repository content required to serve resources (tokens, component docs, patterns, governance docs, foundations)
2. WHEN the Container_Image starts, THE MCP_Server SHALL listen on the HTTP transport without requiring a `--root` flag by defaulting to the baked-in content directory
3. THE Container_Image SHALL expose a configurable port via an environment variable with a default of 3100
4. WHEN the Container_Image is built, THE Deployment_Pipeline SHALL exclude development dependencies, test files, and git history from the image
5. THE Container_Image SHALL use a Node.js base image with a version that satisfies the `engines.node >= 18` constraint

### Requirement 2: HTTPS and Transport Security

**User Story:** As a security-conscious team member, I want all traffic to the remote MCP Server encrypted with TLS, so that design system content and API keys are not transmitted in plaintext.

#### Acceptance Criteria

1. THE Remote_Endpoint SHALL serve all traffic exclusively over HTTPS
2. WHEN an Agent_Client connects via plain HTTP, THE Remote_Endpoint SHALL redirect the request to HTTPS or reject it with a 301/308 status
3. THE Remote_Endpoint SHALL use a valid, publicly trusted TLS certificate
4. THE Remote_Endpoint SHALL enforce a minimum TLS version of 1.2

### Requirement 3: API Key Authentication

**User Story:** As a team lead, I want the remote MCP Server protected by API key authentication, so that only authorized agents and team members can access design system content.

#### Acceptance Criteria

1. WHEN an Agent_Client sends a request without a valid API key, THE MCP_Server SHALL reject the request with HTTP 401 Unauthorized
2. THE MCP_Server SHALL accept API keys via the `Authorization: Bearer <key>` header
3. WHEN an Agent_Client provides a valid API key, THE MCP_Server SHALL process the MCP request normally
4. THE MCP_Server SHALL support multiple active API keys simultaneously to allow key rotation without downtime
5. THE MCP_Server SHALL load API keys from an environment variable at startup
6. WHEN an API key is invalid or expired, THE MCP_Server SHALL return a JSON error body with a descriptive message and HTTP 401 status
7. THE MCP_Server SHALL use constant-time comparison when validating API keys to prevent timing attacks

### Requirement 4: Health and Readiness

**User Story:** As a platform engineer, I want the deployed server to expose health and readiness endpoints, so that load balancers and monitoring can determine server availability.

#### Acceptance Criteria

1. THE MCP_Server SHALL expose an HTTP GET `/health` endpoint that returns a JSON body with status, uptime, and request count
2. WHEN the MCP_Server has completed startup and the search index is built, THE `/health` endpoint SHALL return HTTP 200 with `"status": "ok"`
3. WHILE the MCP_Server is still initializing the search index, THE `/health` endpoint SHALL return HTTP 503 with `"status": "starting"`
4. THE `/health` endpoint SHALL respond without requiring authentication to allow load balancer probes

### Requirement 5: Deployment Pipeline

**User Story:** As a developer, I want the container image built and deployed automatically on pushes to the main branch, so that the remote endpoint always reflects the latest design system content.

#### Acceptance Criteria

1. WHEN a commit is pushed to the main branch, THE Deployment_Pipeline SHALL build a new Container_Image
2. WHEN the Container_Image build succeeds, THE Deployment_Pipeline SHALL run the MCP Server integration tests against the built image
3. WHEN the integration tests pass, THE Deployment_Pipeline SHALL deploy the Container_Image to the hosting environment
4. IF the integration tests fail, THEN THE Deployment_Pipeline SHALL abort the deployment and report the failure
5. THE Deployment_Pipeline SHALL tag each Container_Image with the git commit SHA and a `latest` tag

### Requirement 6: Agent Connection Configuration

**User Story:** As a developer using an AI agent, I want clear connection configuration for the remote MCP Server, so that I can connect my agent without needing to clone or run anything locally.

#### Acceptance Criteria

1. THE MCP_Server documentation SHALL provide a remote connection configuration example specifying the endpoint URL, transport type, and authentication header
2. WHEN an Agent_Client connects using the documented configuration, THE MCP_Server SHALL establish a valid MCP session and respond to tool and resource requests
3. THE Remote_Endpoint SHALL support concurrent connections from multiple Agent_Clients simultaneously

### Requirement 7: Rate Limiting

**User Story:** As a platform engineer, I want request rate limiting on the remote endpoint, so that a single misbehaving agent cannot exhaust server resources or incur excessive costs.

#### Acceptance Criteria

1. THE Rate_Limiter SHALL restrict each API key to a configurable maximum number of requests per time window
2. WHEN an Agent_Client exceeds the rate limit, THE MCP_Server SHALL reject requests with HTTP 429 Too Many Requests and include a `Retry-After` header
3. THE Rate_Limiter SHALL load its configuration (requests per window, window duration) from environment variables
4. THE Rate_Limiter SHALL track request counts per API key independently

### Requirement 8: Graceful Shutdown

**User Story:** As a platform engineer, I want the server to shut down gracefully on container stop signals, so that in-flight MCP sessions complete cleanly without data loss or broken connections.

#### Acceptance Criteria

1. WHEN the MCP_Server receives a SIGTERM signal, THE MCP_Server SHALL stop accepting new connections
2. WHEN the MCP_Server receives a SIGTERM signal, THE MCP_Server SHALL wait up to 30 seconds for in-flight requests to complete before exiting
3. IF in-flight requests do not complete within 30 seconds, THEN THE MCP_Server SHALL force close remaining connections and exit with code 0

### Requirement 9: Operational Logging

**User Story:** As a platform engineer, I want structured request logs emitted to stdout, so that I can monitor usage, debug issues, and feed logs into centralized observability tools.

#### Acceptance Criteria

1. THE MCP_Server SHALL emit a structured JSON log line to stdout for each completed request including timestamp, method, duration in milliseconds, status code, and API key identifier (last 4 characters only)
2. THE MCP_Server SHALL emit a structured JSON log line for authentication failures including timestamp, source IP, and failure reason
3. THE MCP_Server SHALL NOT log full API key values or request body content containing sensitive data
