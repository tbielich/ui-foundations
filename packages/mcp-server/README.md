# UI Foundations MCP Server

Model Context Protocol server that exposes UI Foundations design system knowledge to AI agents — tokens, components, patterns, governance rules, and architecture decisions.

## Quick Start

```bash
# From the repo root
cd packages/mcp-server
npm install
npm run build
node dist/mcp/index.js --root ../..
```

## Usage with MCP Clients

Add to your MCP client config (Kiro, Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "ui-foundations": {
      "command": "node",
      "args": [
        "/path/to/ui-foundations/packages/mcp-server/dist/mcp/index.js",
        "--root",
        "/path/to/ui-foundations"
      ]
    }
  }
}
```

Or using npx (after publish):

```json
{
  "mcpServers": {
    "ui-foundations": {
      "command": "npx",
      "args": ["@ui-foundations/mcp-server", "--root", "/path/to/ui-foundations"]
    }
  }
}
```

## CLI Options

| Flag | Default | Description |
|------|---------|-------------|
| `--root` | cwd | Path to the UI Foundations repository root |
| `--transport` | `stdio` | Transport type: `stdio` or `http` |
| `--port` | `3100` | Port for HTTP transport |

## Resources

The server exposes design system content via `uif://` URIs:

| Category | URIs | Content |
|----------|------|---------|
| Manifest | `uif://manifest/context`, `uif://manifest/version` | Context manifest, package version |
| Agents | `uif://agents/rules`, `behavior`, `design-contract`, `implementation` | Agent behavior rules |
| Tokens | `uif://tokens/core`, `semantic`, `component`, `modes`, `brands` | Design tokens (DTCG format) |
| Components | `uif://components`, `uif://components/{name}` | Component docs and metadata |
| Patterns | `uif://patterns`, `uif://patterns/{name}` | Composition patterns |
| Governance | `uif://governance/rules`, `naming`, `layering` | Naming and layering rules |
| Foundations | `uif://foundations`, `uif://foundations/{id}` | Architecture decisions |

## Tools

| Tool | Description |
|------|-------------|
| `search_foundations` | Full-text search across all resources |
| `get_component` | Get full component data by name |
| `get_token` | Search tokens by name/layer |
| `get_pattern` | Get composition pattern docs |
| `get_rule` | Get governance rule by category |
| `validate_token_name` | Validate token naming conventions |
| `diagnose_drift` | Compare Figma exports with generated tokens, report mismatches |
| `apply_token_fix` | Apply a rename, value update, or removal to a Figma export token |
| `validate_system` | Run CI check and return structured pass/fail |

### Agent Loop

The three tools `diagnose_drift`, `apply_token_fix`, and `validate_system` are designed to be called in sequence by any MCP client to form an autonomous agent loop:

```
┌─────────────────┐
│ diagnose_drift  │ ← What's broken?
└────────┬────────┘
         │ drift found
         ▼
┌─────────────────┐
│ apply_token_fix │ ← Fix it
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ validate_system │ ← Did it work?
└────────┬────────┘
         │ pass:false → loop back
         │ pass:true  → done
         ▼
```

The loop converges when `diagnose_drift` returns `driftCount: 0`. For drift types that `apply_token_fix` cannot resolve (e.g. `missing_in_code`), the agent receives enough context to decide on a different action (e.g. running `tokens:generate`).

## Prompts

| Prompt | Description |
|--------|-------------|
| `load_context` | Load design system context in priority order |
| `implement_component` | Guide for creating a new component (10 surfaces) |
| `propose_token` | Guide for proposing a new token |

## Development

```bash
# Run all tests
npm run test:mcp

# Unit tests only
npm run test:unit

# Property-based tests
npm run test:property

# Integration tests
npm run test:integration

# Build
npm run build
```

## Inspector

Test the server interactively with the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector --config inspector.json --server ui-foundations
```

## Architecture

- **Transport**: stdio (default) or Streamable HTTP
- **Registry-driven**: Resources, tools, and prompts defined declaratively
- **Security**: Path traversal protection, input validation, no secret exposure
- **Caching**: SHA-256 content hashing, fresh reads per request
- **Search**: In-memory inverted index with TF-IDF scoring
