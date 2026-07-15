# UIF-Prefixed Public Naming Migration Plan

**Issue:** [#145](https://github.com/tbielich/ui-foundations/issues/145)
**Depends on:** [#144](https://github.com/tbielich/ui-foundations/issues/144)
**Date:** 2026-07-15
**Status:** Ready for review
**Target release:** v1.0

## Purpose

Migrate UIF-owned public component classes and component token slots from
unscoped names to the Vault Naming Contract without mixing the planning change
with production implementation.

This document makes the compatibility, deprecation, release, and first-PR
boundaries required by #145. It does not change runtime CSS, token exports,
emitters, package output, examples, or tests.

## Inputs and authority

1. `.uif/packs/governance/contracts/naming-contract.json` is the machine-readable
   naming authority.
2. `docs/audits/naming-scope-audit.md` is the affected-file and consumer-risk
   inventory from #144.
3. Figma `codeSyntax.WEB` values in `figma/exports/Patterns (UI).tokens.json`
   remain the source for generated component token names.
4. Generated files under `dist/` must be inspected after generation, never
   edited directly.

## Decisions

| Concern | Decision |
|---|---|
| Public class prefix | Use `.uif-*`. |
| Public token prefix | Use `--uif-*`. |
| Class model | Keep flat class chains; do not introduce BEM. |
| Variants | Keep chained modifier classes such as `.outline` and `.ghost`. |
| Authored states | Keep chained `.is-*` classes; native pseudo-classes remain primary where available. |
| UIF-owned emitters | Emit canonical class names only after their migration wave. Do not dual-emit legacy and canonical root classes. |
| Legacy class compatibility | Retain legacy selectors as deprecated selector aliases through v1.x. |
| Legacy token compatibility | Do not publish library-owned token aliases. The token rename is an explicit v1.0 breaking change. |
| Removal | Remove legacy class selector aliases no earlier than v2.0. |
| First implementation | Use Button as the pilot in #146; do not migrate unrelated component families. |

### Why class aliases are required

Selector aliases can preserve existing consumer markup without changing the
canonical markup produced by React, custom elements, Nunjucks, or playground
renderers. Canonical and legacy selectors must share the same declaration block
and specificity. New examples and emitters must not teach or produce legacy
classes.

### Why token aliases are not recommended

A global alias such as `--button-x: var(--uif-button-x)` preserves consumers that
read the legacy property, but it does not reliably preserve component- or
ancestor-scoped overrides in both directions. Reversing the alias has the same
problem for canonical overrides. Publishing both names would therefore promise
compatibility while allowing silent visual regressions—the highest-risk failure
identified by #144.

The package is currently pre-1.0 (`0.9.0`), so v1.0 is the explicit breaking
boundary for component token names. Consumers that must support both 0.9 and 1.0
temporarily should declare both names with the same value in their own CSS. This
keeps cascade ownership with the consumer and avoids ambiguous library alias
precedence.

## Selector migration map

The mapping is prefix-only for public component roots and structural parts.
Variant, state, pseudo-class, and data-attribute segments remain unchanged.

| Legacy selector or class | Canonical selector or class | Wave | Compatibility |
|---|---|---:|---|
| `.button` | `.uif-button` | 1 | Keep `.button` selector alias through v1.x. |
| `.button.solid` | `.uif-button.solid` | 1 | Solid remains the default; owned emitters add `.solid` explicitly. |
| `.button.outline` | `.uif-button.outline` | 1 | Keep chained variant. |
| `.button.ghost` | `.uif-button.ghost` | 1 | Keep chained variant. |
| `.button.icon-only` | `.uif-button.icon-only` | 1 | Keep chained modifier. |
| `.button.is-hover` | `.uif-button.is-hover` | 1 | Keep authored preview state. |
| `.button.is-active` | `.uif-button.is-active` | 1 | Keep authored preview state. |
| `.button.is-focus-visible` | `.uif-button.is-focus-visible` | 1 | Keep authored preview state. |
| `.button.is-disabled` | `.uif-button.is-disabled` | 1 | Native `:disabled` remains primary. |
| `.button-group` | `.uif-button-group` | 2 | Excluded from the Button pilot. |
| `.icon` | `.uif-icon` | 2 | Shared component; excluded from the Button pilot. |
| `.label-content` | `.uif-label-content` | 2 | Shared composition; excluded from the Button pilot. |
| `.label-content-text` | `.uif-label-content-text` | 2 | Shared composition; excluded from the Button pilot. |
| `.label-content.is-icon-only` | `.uif-label-content.is-icon-only` | 2 | Shared composition; excluded from the Button pilot. |

For compound selectors, apply the same mapping to every public component class:

```css
.button .label-content         -> .uif-button .uif-label-content
.button-group > .button        -> .uif-button-group > .uif-button
.badge > .icon                 -> .uif-badge > .uif-icon
```

During a component's compatibility window, the canonical and legacy forms must
resolve to identical declarations. Do not change selector behavior, ordering,
or specificity as part of the rename.

## Token migration map

All UIF-owned Button token slots use a deterministic prefix replacement. Token
path segments after the component name do not change.

| Legacy token or family | Canonical token or family | Scope |
|---|---|---|
| `--button-*` | `--uif-button-*` | All Button token slots in wave 1, except the ButtonGroup family below. |
| `--button-border-*` | `--uif-button-border-*` | Border color, size, and radius slots. |
| `--button-solid-*` | `--uif-button-solid-*` | Solid variant container, border, and text slots. |
| `--button-outline-*` | `--uif-button-outline-*` | Outline variant container, border, and text slots. |
| `--button-ghost-*` | `--uif-button-ghost-*` | Ghost variant container, border, and text slots. |
| `--button-font-*` | `--uif-button-font-*` | Font family, size, and weight slots. |
| `--button-line-height` | `--uif-button-line-height` | Button typography slot. |
| `--button-padding-*` | `--uif-button-padding-*` | Inline, block, and icon-only padding slots. |
| `--button-gap` | `--uif-button-gap` | Button content gap. |
| `--button-height-min` | `--uif-button-height-min` | Minimum target height. |
| `--button-width-min` | `--uif-button-width-min` | Minimum target width. |
| `--button-overlay-*` | `--uif-button-overlay-*` | Interaction overlays. |
| `--button-container-background-disabled` | `--uif-button-container-background-disabled` | Disabled container slot. |
| `--button-text-color-disabled` | `--uif-button-text-color-disabled` | Disabled text slot. |
| `--button-group-*` | `--uif-button-group-*` | Wave 2; excluded from #146. |

Representative exact mappings required by the pilot are:

| Legacy token | Canonical token |
|---|---|
| `--button-padding-inline` | `--uif-button-padding-inline` |
| `--button-border-radius` | `--uif-button-border-radius` |
| `--button-solid-container-background-default` | `--uif-button-solid-container-background-default` |
| `--button-outline-border-color-focus` | `--uif-button-outline-border-color-focus` |
| `--button-ghost-text-color-active` | `--uif-button-ghost-text-color-active` |
| `--button-text-color-disabled` | `--uif-button-text-color-disabled` |

The rename begins in Figma `codeSyntax.WEB`, then flows through token generation.
Implementation must not search-and-replace generated `dist/` artifacts.

## Cross-pattern dependency decision

`src/ui/patterns/input.css` currently falls back from `--input-line-height` to
`--button-line-height`. The generated token set already provides
`--input-line-height`, so Input does not need a Button namespace dependency.

#146 may remove only that fallback as a documented boundary exception:

```css
/* Current */
line-height: var(--input-line-height, var(--button-line-height, 1.5));

/* Planned dependency cleanup; exact final fallback must use existing tokens */
line-height: var(--input-line-height, var(--typography-body-line-height));
```

The implementation must verify the referenced typography token exists before
applying this change. No other Input selector or token is in the Button pilot.

## Compatibility and deprecation policy

### v0.9.x — warning phase

- Existing unscoped classes and tokens remain functional.
- Naming validation reports them as deprecated with canonical replacements.
- Documentation and release notes announce the v1 token breaking change.

### v1.0 — canonical token boundary and class transition

- UIF-owned Button emitters output `.uif-button` and explicit variant classes.
- Button CSS supports `.uif-button` and the deprecated `.button` selector alias.
- Generated Button tokens use only `--uif-button-*`.
- Library-owned `--button-*` aliases are not emitted.
- Consumer migration notes and a searchable mapping accompany the release.

### v1.x — class alias observation window

- Legacy class selector aliases remain supported and documented as deprecated.
- New source, docs, examples, tests, and generated snippets use canonical names.
- CI rejects newly authored legacy usage outside an explicit compatibility
  allowlist.
- Removal evidence is collected from repository searches, downstream validation,
  and reported consumer issues.

### v2.0 or later — removal

- Remove legacy class selector aliases only in a major release.
- Publish the removal in release notes and migration guidance.
- Remove compatibility allowlist entries and warning fixtures in the same PR.

## Breaking-change analysis

| Risk | Effect | Mitigation / release gate |
|---|---|---|
| Consumer markup uses `.button` | Styling would disappear after alias removal. | Keep selector alias through v1.x; canonical-only emitters stop growth. |
| Consumer CSS overrides `--button-*` | Overrides stop affecting v1 Button. | Treat as explicit v1 breaking change; publish exact map and dual-declaration guidance before release. |
| Consumer CSS targets UIF internals such as `.label-content` | Shared-part rename can break extensions. | Migrate shared parts in a separate wave with their own aliases. |
| Runtime and emitters land separately | Docs or wrappers can emit an unsupported name. | Ship CSS, owned emitters, docs, snippets, and tests atomically per component wave. |
| Generated token artifacts drift | Package can expose old names despite source updates. | Generate from Figma export and inspect CSS/JSON/package tarball. |
| Input depends on Button line height | Removing the old Button token can change Input fallback behavior. | Remove the cross-pattern fallback only after verifying Input's own token and an existing typography fallback. |
| Both old and new names appear in authored output | Deprecation never converges and consumers copy old names. | Canonical-only emitter rule plus CI allowlist for compatibility selectors. |
| Specificity changes during aliasing | Consumer overrides can change unexpectedly. | Test computed selector specificity and interaction states. |

## Implementation waves

### Wave 1 — Button pilot (#146)

The first production PR is intentionally limited to the Button root, variants,
states, and Button-owned token slots.

Included:

- Rename Button `codeSyntax.WEB` entries from `--button-*` to
  `--uif-button-*`, excluding `--button-group-*`.
- Regenerate token CSS and JSON through the existing pipeline.
- Add canonical `.uif-button` selectors while retaining `.button` selector
  aliases with equivalent specificity.
- Update Button-owned emitters in React, `<ui-button>`, Nunjucks, and the Button
  playground renderer/generator to emit `.uif-button` and explicit variant
  classes.
- Preserve shared legacy child classes (`.icon`, `.label-content`,
  `.label-content-text`) until their own migration wave.
- Remove the Input-to-Button line-height fallback only under the boundary rule
  above.
- Update Button docs, examples, MCP fixtures, smoke checks, and snapshots that
  assert the Button root or Button token names.
- Add compatibility tests proving `.button` and `.uif-button` render the same
  Button states during v1.x.
- Add negative checks preventing new `--button-*` output.

Excluded:

- ButtonGroup classes and tokens.
- Icon and Label class migrations.
- Calendar's legacy Button/Icon emitter usage.
- Other component classes or tokens.
- Removal of legacy `.button` selector support.
- Any token alias layer.

### Wave 2 — shared and dependent surfaces

- Migrate ButtonGroup, Icon, and Label public names with separate compatibility
  aliases.
- Update Calendar, Link, Input controls, Badge, shared macros, and docs-only
  consumers of those classes.
- Update code generators and cross-component fixtures.
- Keep each component family in a separate reviewable PR where practical.

### Wave 3 — remaining component families

- Apply the same prefix-only mapping to the remaining audited component roots,
  parts, and component token slots.
- Generate from Figma first for every token-bearing component.
- Do not combine unrelated behavioral or visual changes with a naming wave.

### Wave 4 — legacy class removal

- Run only after the v1.x observation window and as part of v2.0 or later.
- Remove selector aliases, compatibility allowlists, deprecated examples, and
  warning fixtures together.

## Documentation update scope

Each implementation wave updates the documentation that emits, teaches, or
copies the affected public names:

- pattern and playground pages
- getting-started and consumer examples
- Nunjucks macro output and generated snippets
- class-naming and release migration guidance
- affected architecture examples and MCP JSDoc examples

Docs-only controls must use docs-specific classes rather than relying on public
component aliases. Documentation must label legacy names as deprecated and must
not present them as normal examples.

## Test and validation scope

Every implementation wave must cover:

1. canonical class output for React, custom elements, Nunjucks, and playground
2. legacy class selector compatibility during v1.x
3. canonical token generation in CSS and JSON
4. absence of legacy token names in generated v1 Button output
5. all variants and native/authored states
6. icon-only accessible naming and disabled behavior
7. consumer overrides using canonical tokens at root, ancestor, and component
   scope
8. docs build and package smoke checks
9. package tarball inspection for public exports

Required repository checks:

```sh
npm run lint
npm run test:unit
npm run ci:check
npm run build:all
npm run docs:site
npm pack --dry-run
```

## Package output considerations

- Keep existing export paths stable; this migration changes names inside the
  exported CSS/JSON, not package subpaths.
- Generate `dist/tokens/css/patterns-ui.tokens.css` and corresponding JSON from
  the Figma export.
- Verify `dist/ui/index.css`, `dist/main.css`, React output, custom-element
  output, macros, and package tarball contents.
- Update smoke checks that currently require `.button` so they require the
  canonical selector and separately assert the intended compatibility alias.
- Do not hand-edit or commit ignored `dist/` output unless the repository's
  release process explicitly changes that policy.
- Release the token rename only at the declared v1.0 breaking boundary.

## Consumer migration notes

Before upgrading to v1.0:

1. Replace public class roots and parts using the selector migration table.
2. Replace every UIF component override from `--button-*` to
   `--uif-button-*`.
3. If one consumer stylesheet must support both 0.9 and 1.0, temporarily declare
   both properties with the same value:

   ```css
   .checkout-action {
     --button-padding-inline: 1rem;
     --uif-button-padding-inline: 1rem;
   }
   ```

4. Do not replace semantic/core tokens such as `--color-*`, `--size-*`, or
   `--shadow-*`; #144 confirmed they are outside this component-scoping change.
5. Test default, hover, active, focus-visible, disabled, icon-only, and each
   variant after upgrading.
6. Remove the legacy duplicate declaration after all supported applications use
   v1.x.

## Completion criteria for #145

- [x] Selector migration map exists.
- [x] Token migration map exists.
- [x] Breaking changes and mitigations are identified.
- [x] Transitional class aliases are required and bounded.
- [x] Library-owned token aliases are rejected with rationale.
- [x] Deprecation and removal releases are defined.
- [x] Documentation, test, package, and consumer scopes are defined.
- [x] The first implementation PR is small and reviewable.
- [x] No production files are changed by this planning issue.
