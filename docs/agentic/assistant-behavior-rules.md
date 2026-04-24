---
title: Assistant rules (UI Foundations)
status: active
type: agent-guide
---

# Assistant rules (UI Foundations)

1. Always follow foundation rules in `/docs/foundations` as the source of truth.
2. Keep the 4-layer architecture: Core → Color Modes → Semantics → Components.
3. Components may only reference Semantics/Core tokens; no raw values in components.
4. Typography tokens never include color; text color lives in `Color.Text.*`.
5. Responsive thresholds:
   - Viewport breakpoints in `Core.Breakpoint.*`
   - Container query thresholds in `Core.Container.*`
6. Use variant-first naming: `Component.variant.part.property.state`.
7. Before creating a new component, run a boundary check:
   - Prefer composition inside an existing component family when behavior is mainly layout/wrapping/grouping.
   - Create a standalone component only if it introduces distinct semantics, API surface, or lifecycle.
   - This decision is independent from token work: new tokens alone are not sufficient reason for a standalone component.
   - Apply the Snowflake check: local one-off solutions stay local; shared utility can enter the system.
   - Source of truth: `docs/foundations/foundation-009-component-boundaries-and-utility.md`.
8. When creating a new component, always complete all integration surfaces:
   - CSS pattern in `src/ui/patterns/<component>.css`
   - Import in `src/ui/index.css`
   - React wrapper in `src/react/<component>.js`
   - Export in `src/react/index.js`
   - Nunjucks macro in `site/_includes/macros/ui.njk` (source of truth; `dist/macros/ui.njk` is copied during build)
   - Playground renderer in `site/assets/playground/renderers.js` — register the render function and add it to the `renderers` map
   - Playground page in `site/components/<component>-playground.md` with `renderer: <component>` matching the key in the renderers map
   - Docs page in `site/components/<component>.md`
   - Code Connect file in `schemas/web-<component>.figma.ts`
   Missing any of these (especially the playground renderer) will cause broken pages.
9. Every new component must have its own Component-layer tokens. Never reuse tokens from another component (e.g. do not use `--input-checkbox-*` for a radio).
   - Check `dist/tokens/css/components-ui.tokens.css` for existing tokens.
   - If the component has no tokens in Figma yet, propose new ones following the naming pattern `--<component>-<part>-<property>-<state>` and add them to `components-ui.tokens.css`, referencing only Semantic or Core tokens.
   - This keeps components independently themeable and avoids hidden coupling.
10. Token alias references must point to tokens that actually exist in the system.
    - Before adding a `$ref`, verify the target exists in `dist/tokens/css/` (Core, Modes, Semantics).
    - Run `npm run tokens:generate` and check for "missing alias targets" warnings.
    - Never invent Semantic/Core token names (e.g. `Color/Fill/Muted`, `Size/Spacing/50`) — use only what the system provides.
    - If a needed Semantic token does not exist, flag it for creation in Figma first.
11. CSS class naming must follow the project convention: bare component name (e.g. `.slider`, `.radio`, `.checkbox`).
    - Never prefix with `.ui-` or other namespaces.
    - CSS patterns must be wrapped in `@layer components { }`.
12. React wrappers must follow the existing pattern:
    - Named `export function` (not `export const`)
    - No CSS imports inside React files
    - Use `React.createElement`, not JSX
    - Class array pattern: `const classes = ["component"]; if (className) classes.push(className);`
13. Docs-only UI (code-tabs, mode toggles) must use docs-specific CSS, not component tokens.
    - The `.code-tabs-bar` and `.docs-header` button groups are styled in `site/assets/docs.css` with hardcoded docs colors.
    - They must not inherit brand theming from `data-brand`.
