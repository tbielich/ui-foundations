# CI

## Purpose

Explain what the current CI path actually runs and where the configuration
lives.

## Accessibility principle entry

- `docs/principles/accessibility.md` (principles)
- `docs/accessibility-audit-interactive-components.md` (audit workflow)

## Canonical rules

- `package.json`
- `.github/workflows/ci.yml`

Current pipeline:

- `npm run lint`
- `npm run test:unit`
- `npm run build:all`
- `npm run smoke:check`
- `npm run tokens:validate`
- `npm run dtcg:validate`
- `npm run assets:check`
- `npm run rules:validate`
- `npm run docs:build`

## Related docs

- `docs/validation/README.md`
- `docs/agentic/rule-pipeline-audit.md`
