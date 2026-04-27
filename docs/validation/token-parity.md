# Token Parity

## Purpose

Describe how the repo currently checks token integrity and where future parity
work is planned.

## Canonical rules

- `docs/token-pipeline.md`
- `.kiro/specs/token-drift-detection/requirements.md`
- `.kiro/specs/dark-mode-validation/requirements.md`

Current enforced checks:

- `npm run tokens:validate`
- `npm run dtcg:validate`
- `npm run rules:validate`

## Related docs

- `docs/foundations/figma-code-parity.md`
- `docs/foundations/design-token-format.md`
- `docs/validation/ci.md`
