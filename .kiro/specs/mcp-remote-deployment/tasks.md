# Implementation Plan: MCP Remote Deployment

## Overview

Package the existing `@ui-foundations/mcp-server` for remote hosting on Fly.io by layering authentication, rate limiting, health endpoints, graceful shutdown, and structured logging as middleware around the existing HTTP transport. Then containerize with baked-in content and automate deployment via CI/CD.

## Tasks

- [ ] 1. Implement auth middleware
  - [ ] 1.1 Create `packages/mcp-server/src/security/auth.ts` with Bearer token validation
    - Implement `AuthConfig` interface loading API keys from `MCP_API_KEYS` env var (comma-separated)
    - Implement `authenticateRequest()` function using `crypto.timingSafeEqual` for constant-time comparison
    - Return `AuthResult` with `keyIdentifier` (last 4 chars) for logging
    - Handle missing header, malformed header, and invalid key cases with descriptive error messages
    - Exit with code 1 and clear error if `MCP_API_KEYS` is empty or missing at startup
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 1.2 Write property tests for auth middleware
    - **Property 1: Authentication rejects invalid credentials with structured error**
    - **Property 2: Authentication accepts any configured key**
    - **Validates: Requirements 3.1, 3.3, 3.4, 3.6, 3.7**
    - Create `tests/properties/auth.property.test.ts`
    - Use fast-check to generate random invalid keys and verify 401 + JSON error shape
    - Use fast-check to generate random key sets, pick any key from set, verify it passes

  - [ ]* 1.3 Write unit tests for auth middleware
    - Create `tests/security/auth.test.ts`
    - Test valid/invalid/missing/malformed Authorization headers
    - Test multiple key configurations and key rotation scenarios
    - Verify constant-time comparison behavior
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 2. Implement rate limiter
  - [ ] 2.1 Create `packages/mcp-server/src/security/rate-limiter.ts` with sliding window implementation
    - Implement `RateLimiterConfig` interface with `maxRequests` and `windowMs`
    - Implement `RateLimiter` class with `check()` and `consume()` methods
    - Load config from `RATE_LIMIT_MAX` (default: 100) and `RATE_LIMIT_WINDOW_MS` (default: 60000) env vars
    - Track per API key using full key hash
    - Return `RateLimitResult` with `allowed`, `remaining`, and `retryAfterSeconds`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 2.2 Write property tests for rate limiter
    - **Property 3: Rate limiter enforces configured ceiling then rejects with Retry-After**
    - **Property 4: Rate limit tracking is per-key independent**
    - **Validates: Requirements 7.1, 7.2, 7.4**
    - Create `tests/properties/rate-limiter.property.test.ts`
    - Use fast-check to generate random (max, window) configs, verify allow/reject boundary at max+1
    - Use fast-check to generate two keys with random request sequences, verify independence

  - [ ]* 2.3 Write unit tests for rate limiter
    - Create `tests/security/rate-limiter.test.ts`
    - Test window enforcement, boundary behavior (exactly at limit), per-key isolation
    - Test configuration loading from environment variables
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 3. Implement health endpoint
  - [ ] 3.1 Create `packages/mcp-server/src/util/health.ts` with HTTP health handler
    - Implement `HealthResponse` interface with `status`, `uptimeSeconds`, `requestCount`, `startedAt`
    - Return HTTP 200 with `"status": "ok"` when search index is built
    - Return HTTP 503 with `"status": "starting"` during initialization
    - No authentication required for this endpoint
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 3.2 Write property test for health endpoint
    - **Property 10: Health endpoint returns valid response shape**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - Create `tests/properties/health.property.test.ts`
    - Use fast-check to generate random server states, verify response shape and status codes

  - [ ]* 3.3 Write unit tests for health endpoint
    - Create `tests/util/health.test.ts`
    - Test response shape in both ready and starting states
    - Verify no auth is required
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 4. Implement request logger
  - [ ] 4.1 Create `packages/mcp-server/src/util/request-logger.ts` with structured JSON logging
    - Implement `RequestLogEntry` and `AuthFailureLogEntry` interfaces
    - Log to stdout (not stderr) for container log collection
    - Include timestamp (ISO 8601), method, path, statusCode, durationMs, keyId (last 4 chars)
    - Log auth failures with timestamp, event, sourceIp, and reason
    - Never log full API keys or request body content
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 4.2 Write property tests for request logger
    - **Property 7: Request log entries contain all required fields**
    - **Property 8: Auth failure log entries contain all required fields**
    - **Property 9: Full API keys never appear in log output**
    - **Validates: Requirements 9.1, 9.2, 9.3**
    - Create `tests/properties/request-logger.property.test.ts`
    - Use fast-check to generate random request data, verify all fields present
    - Use fast-check to generate random API keys and verify full key never appears in output

  - [ ]* 4.3 Write unit tests for request logger
    - Create `tests/util/request-logger.test.ts`
    - Test output format, field presence, key masking
    - Verify auth failure events include source IP
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 5. Implement graceful shutdown
  - [ ] 5.1 Create `packages/mcp-server/src/util/shutdown.ts` with SIGTERM handler
    - Implement `ShutdownConfig` interface with `gracePeriodMs` and `server` reference
    - Implement `registerShutdownHandler()` function
    - On SIGTERM: stop accepting new connections via `server.close()`
    - Track in-flight requests with a counter
    - Wait up to 30 seconds for in-flight requests to complete
    - Force-close remaining sockets and exit with code 0 after grace period
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 5.2 Write unit tests for graceful shutdown
    - Create `tests/util/shutdown.test.ts`
    - Test signal handling, grace period timing, force close behavior
    - Test that new connections are refused after SIGTERM
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 6. Checkpoint - Core middleware complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Wire middleware into HTTP server
  - [ ] 7.1 Modify `packages/mcp-server/src/index.ts` to integrate all middleware
    - Add health endpoint handler (`GET /health`) before auth — no auth required
    - Add auth middleware for all other requests
    - Add rate limiter after successful auth
    - Add request logging for all completed requests
    - Add auth failure logging
    - Register graceful shutdown handler with the HTTP server
    - Default `--root` to `/app/content` when running in container (check for baked-in content dir)
    - Send proper JSON error responses for 401, 429, 500, 503
    - Include `WWW-Authenticate: Bearer` header on 401 responses
    - Include `Retry-After` header on 429 responses
    - _Requirements: 3.1, 3.2, 4.4, 7.2, 8.1, 9.1, 9.2_

  - [ ]* 7.2 Write integration tests for middleware pipeline
    - Create `tests/integration/middleware-pipeline.test.ts`
    - Test request flow: health bypasses auth, invalid auth returns 401, valid auth proceeds to rate limiter
    - Test rate limit triggers 429 with Retry-After header
    - Test proper JSON error bodies
    - _Requirements: 3.1, 3.2, 4.4, 7.2_

- [ ] 8. Checkpoint - Server integration complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Create container and deployment configuration
  - [ ] 9.1 Create `packages/mcp-server/Dockerfile` with multi-stage build
    - Stage 1 (builder): Node.js 22 Alpine, install all deps, compile TypeScript
    - Stage 2 (production): Node.js 22 Alpine, install production deps only, copy compiled output
    - Copy baked-in `content/` directory into image
    - Exclude dev dependencies, test files, git history
    - Expose configurable port (default 3100) via `PORT` env var
    - Set CMD to run with `--transport http --port 3100 --root /app/content`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 9.2 Create `packages/mcp-server/fly.toml` with Fly.io configuration
    - Set app name, primary region (fra)
    - Configure internal port 3100, force HTTPS, auto stop/start machines
    - Set min_machines_running to 1
    - Add health check on `/health` with 10s grace period, 30s interval
    - Set environment variables for NODE_ENV, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1_

  - [ ] 9.3 Create `.github/workflows/deploy-mcp.yml` CI/CD pipeline
    - Trigger on pushes to main branch with path filters (packages/mcp-server/**, docs/**, tokens/**)
    - Assemble content directory from repository (tokens, docs, patterns, governance, foundations)
    - Build Docker image tagged with git SHA and `latest`
    - Run integration tests against the built image
    - Deploy to Fly.io on test success, abort on failure
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 10. Update documentation
  - [ ] 10.1 Update `packages/mcp-server/README.md` with remote connection configuration
    - Add remote connection section with endpoint URL, transport type, and auth header example
    - Provide MCP client configuration JSON example
    - Document environment variables for deployment
    - Document available API key setup process
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The design specifies TypeScript throughout — all implementation uses the existing project conventions (Node.js built-in test runner + fast-check)
- TLS/HTTPS (Requirement 2) is handled by Fly.io platform configuration, not application code
- Concurrent agent connections (Requirement 6.3) are inherently supported by the existing StreamableHTTPServerTransport

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "3.1", "4.1", "5.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.2", "2.3", "3.2", "3.3", "4.2", "4.3", "5.2"] },
    { "id": 2, "tasks": ["7.1"] },
    { "id": 3, "tasks": ["7.2", "9.1", "9.2", "9.3"] },
    { "id": 4, "tasks": ["10.1"] }
  ]
}
```
