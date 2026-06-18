---
inclusion: manual
---

# Figma Reconciliation

Use this when checking for drift between Figma design and code implementation.

## Surfaces to Review per Component

1. `figma/exports/*.tokens.json` — token exports from Figma
2. `dist/tokens/css/patterns-ui.tokens.css` — generated CSS tokens
3. `schemas/web-*.figma.ts` — Code Connect mappings
4. `src/ui/patterns/*.css` — CSS implementation
5. `src/react/*.js` — React wrappers
6. `site/patterns/` — docs and playground pages

## Checks

- All Figma tokens present in generated CSS?
- CSS variable names match Figma `codeSyntax.WEB` values?
- All states covered (default, hover, active, focus, disabled)?
- Code Connect node IDs point to valid Figma component sets?
- Docs page token table matches actual CSS token usage?

## Sources

- `docs/ui-foundations-rules.md` → design-to-code rules
- `docs/agentic/assistant-behavior-rules.md` → rules 8-13
- `IMPLEMENTATION.md` → file locations

## Note

This workflow will be partially automated by the token-drift-detection spec once implemented. See `.kiro/specs/token-drift-detection/`.
