# Canonical Topic-Source Matrix

## Purpose

Map major Runtime documentation topics to one clear canonical source and one
Runtime implementation reference.

This matrix is a documentation traceability aid. It does not define governance
policy architecture.

| Topic | Canonical source | Runtime implementation reference |
|---|---|---|
| Runtime/Vault documentation boundary | `docs/adr/adr-runtime-and-vault-documentation-architecture.md` | `docs/architecture.md` |
| Public API naming and usage | `docs/public-api.md` | `README.md` quickstart + migration links |
| Public API migration mappings | `docs/migrations/public-api-namespace-v1.md` | `site/` and `src/elements/` usage surfaces |
| Token layer model | `docs/foundations/foundation-001-token-layering.md` | `docs/foundations/README.md`, `docs/token-pipeline.md` |
| Token generation mechanics | `docs/token-pipeline.md` | `scripts/extract-tokens.js`, `dist/tokens/` |
| Pattern/component hierarchy and status | `docs/patterns/README.md` | `docs/components/README.md` |
| Runtime accessibility principles | `docs/principles/accessibility.md` | `docs/accessibility-audit-interactive-components.md`, `docs/validation/README.md` |
| Validation pipeline | `docs/validation/ci.md` | `package.json` scripts, `.github/workflows/ci.yml` |
| Governance consumption lifecycle | `.uif/registry/source.yml` + consumed pack metadata | `docs/uif-governance.md`, `docs/governance-baseline.md` |
| Canonical link ownership strategy | `config/site.js` (`vault.*` config) | `docs/linking-strategy.md` |

## Terminology links

Use `docs/terminology.md` for canonical/compatibility/deprecated/placeholder
term definitions used in this matrix.
