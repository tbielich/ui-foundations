---
title: Assistant rules (UI Foundations)
status: active
type: agent-guide
---

# Assistant rules (UI Foundations)

1. Always follow foundation rules in `/docs/foundations` as the source of truth.
2. Keep the 4-layer architecture: Core → Appearance → Semantics (Brands) → Patterns/Components.
3. Patterns may only reference Semantics/Core tokens; no raw values in patterns.
4. Typography tokens never include color; text color lives in `Color.Text.*`.
5. Responsive thresholds:
   - Viewport breakpoints in `Core.Breakpoint.*`
   - Container query thresholds in `Core.Container.*`
6. Use variant-first naming: `Pattern.variant.part.property.state`.
7. Before creating a new pattern, run a boundary check:
   - Prefer composition inside an existing pattern family when behavior is mainly layout/wrapping/grouping.
   - Create a standalone pattern only if it introduces distinct semantics, API surface, or lifecycle.
   - This decision is independent from token work: new tokens alone are not sufficient reason for a standalone pattern.
   - Apply the Snowflake check: local one-off solutions stay local; shared utility can enter the system.
   - Source of truth: `docs/foundations/foundation-009-component-boundaries-and-utility.md`.
8. When creating a new pattern, always complete all integration surfaces:
   - CSS pattern in `src/ui/patterns/<pattern>.css`
   - Import in `src/ui/index.css`
   - React wrapper in `src/react/<pattern>.js`
   - Export in `src/react/index.js`
   - Nunjucks macro in `site/_includes/macros/ui.njk` (source of truth; `dist/macros/ui.njk` is copied during build)
   - Playground renderer in `site/assets/playground/renderers.js` — register the render function and add it to the `renderers` map
   - Playground page in `site/patterns/<pattern>-playground.md` with `renderer: <pattern>` matching the key in the renderers map
   - Docs page in `site/patterns/<pattern>.md`
   - Code Connect file in `schemas/web-<pattern>.figma.ts`
   - Pattern card in `site/patterns/index.md`
   Missing any of these (especially the playground renderer) will cause broken pages.
9. Every new pattern must have its own pattern-layer tokens. Never reuse tokens from another pattern (e.g. do not use `--input-checkbox-*` for a radio).
   - Check `dist/tokens/css/patterns-ui.tokens.css` for existing tokens.
   - If the pattern has no tokens in Figma yet, propose new public token slots following the Vault naming pattern `--uif-<pattern>-<part>-<property>-<state>` and add them to the `Patterns (UI)` collection, referencing only Semantics (Brands), Appearance, or Core tokens.
   - Migrated patterns emit canonical `--uif-*` tokens only. Button has no library-owned `--button-*` alias; components that have not yet migrated may retain unscoped tokens until their scoped migration is approved.
   - This keeps patterns independently adaptable across brand/mode context and avoids hidden coupling.
10. Token alias references must point to tokens that actually exist in the system.
    - Before adding a `$ref`, verify the target exists in `dist/tokens/css/` (Core, Appearance, Semantics (Brands)).
    - Run `npm run tokens:generate` and check for "missing alias targets" warnings.
    - Never invent Semantic/Core token names (e.g. `Color/Fill/Muted`, `Size/Spacing/50`) — use only what the system provides.
    - If a needed Semantic token does not exist, flag it for creation in Figma first.
11. CSS class naming must follow the consumed Vault Naming Contract from `.uif/packs/governance/contracts/naming-contract.json`; runtime generates its local naming contract from that artifact.
    - Local examples such as `.uif-slider`, `.uif-radio`, and `.uif-checkbox` are examples only, not source rules.
    - Existing bare pattern classes such as `.button`, `.radio`, and `.checkbox` are deprecated legacy compatibility and should warn during migration.
    - Never use `.ui-` or other non-Vault namespaces.
    - CSS patterns must be wrapped in `@layer components { }`.
12. React wrappers must follow the existing pattern:
    - Named `export function` (not `export const`)
    - No CSS imports inside React files
    - Use `React.createElement`, not JSX
    - Class array pattern: `const classes = ["component"]; if (className) classes.push(className);`
13. Docs-only UI (code-tabs, mode toggles) must use docs-specific CSS, not pattern tokens.
    - The `.code-tabs-bar` and `.docs-header` button groups are styled in `site/assets/docs.css` with hardcoded docs colors.
    - They must not inherit brand theming from `data-brand`.

## Modes

The agent operates in different modes depending on the task:

- **Implementation** → modify system
- **Audit** → inspect only
- **Pattern Discovery** → design patterns
- **Token Proposal** → suggest tokens

Mode-specific rules are defined in: `docs/agentic/modes/`
