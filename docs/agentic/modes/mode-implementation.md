# Mode — Implementation

## Purpose

Modify or create components, tokens, or styles within the system.

## Inherits

All rules from `docs/agentic/assistant-behavior-rules.md`.

## Delta

- Make the smallest possible change
- Complete all required integration surfaces before finishing

## Validation

- No hardcoded values
- Tokens exist and are valid
- Component supports theming
- `npm run ci:check` passes
