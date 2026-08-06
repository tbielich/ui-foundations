# UI Foundations v1 migration guide

This repository-only guide collects the consumer changes required for UI
Foundations v1. Migration history does not belong on individual component pages:
those pages document the current API, while this file owns the release boundary,
compatibility policy, and old-to-new mappings.

## Public naming in v1

All UIF-owned public APIs use the canonical `uif` namespace unless a separately
approved contract governs the surface:

| Surface | Before v1 | v1 | Compatibility |
|---|---|---|---|
| CSS classes | `.component`, `.component-part` | `.uif-component`, `.uif-component-part` | Legacy selectors remain CSS-only aliases through v1.x. |
| Component tokens | `--component-*` | `--uif-component-*` | No library-owned legacy token aliases or fallbacks. |
| Nunjucks usage | `ui.*` | consumer-selected alias `uif.*` | The macro module path and named exports are unchanged. |
| Custom Elements | `<ui-*>` | `<uif-*>` | Direct breaking rename; no alias or dual registration. |

The class migration is prefix-only. UIF continues to use flat class chains,
chained variant classes such as `.outline`, and `.is-*` authored states. It does
not introduce BEM names.

## Consumer migration sequence

1. Update Figma integrations and token overrides from `--component-*` to
   `--uif-component-*`.
2. Update authored and generated markup to `.uif-*` classes. Do not depend on
   the v1.x selector aliases for new work.
3. Import the existing Nunjucks macro module as `uif` and invoke `uif.*`.
4. Replace authored `<ui-*>` tags, DOM creation and queries, tag selectors,
   automation fixtures, snapshots, and local TypeScript tag maps with
   `<uif-*>`.
5. Re-test consumer overrides in every supported brand and appearance mode.

Consumers that temporarily support both v0.9 and v1 should declare old and new
token names with the same value in consumer-owned CSS. UIF does not provide a
token alias layer because bidirectional custom-property aliases cannot preserve
all ancestor- and component-scoped overrides reliably.

## Component-family map

The table lists representative public roots and token families. Structural
parts follow the same prefix replacement.

| Family | Canonical classes | Canonical token slots or runtime inputs | Canonical Custom Elements |
|---|---|---|---|
| Accordion | `.uif-accordion`, `.uif-accordion-item`, `.uif-accordion-item-content` | `--uif-accordion-*` | `<uif-accordion>`, `<uif-accordion-item>` |
| Avatar | `.uif-avatar`, `.uif-avatar-initials` | `--uif-avatar-*` | `<uif-avatar>` |
| Badge | `.uif-badge`, `.uif-badge-text` | `--uif-badge-*` | `<uif-badge>` |
| Button | `.uif-button` with `.solid`, `.outline`, or `.ghost` | `--uif-button-*` | `<uif-button>` |
| ButtonGroup | `.uif-button-group` | `--uif-button-group-*` | `<uif-button-group>` |
| Calendar | `.uif-calendar`, `.uif-calendar-*` | `--uif-calendar-*` | No autonomous Calendar element |
| Checkbox | `.uif-checkbox`, `.uif-checkbox-field`, `.uif-checkbox-field-text` | `--uif-checkbox-*` | `<uif-checkbox>` |
| Divider | `.uif-divider` | code-only `--uif-divider-color`; no component-scoped Figma variables | `<uif-divider>` |
| Form | `.uif-form`, `.uif-form-*` | `--uif-form-*` | `<uif-form>`, `<uif-form-group>`, `<uif-form-field>`, `<uif-form-helper>`, `<uif-form-actions>` |
| Icon | `.uif-icon` | code-only `--uif-icon-src` | `<uif-icon>` |
| Input | `.uif-input`, `.uif-input-field`, `.uif-input-field-control` | `--uif-input-*` | `<uif-input>` |
| Label composition | `.uif-label-content`, `.uif-label-content-text`, `.uif-field-label*` | `--uif-field-label-*`; separately governed `--typography-label-*` remains unchanged | `<uif-field-label>` |
| Link | `.uif-link` | `--uif-link-*` | `<uif-link>` |
| Radio | `.uif-radio`, `.uif-radio-field`, `.uif-radio-field-text` | `--uif-radio-*` | `<uif-radio>` |
| Select | `.uif-select` | `--uif-select-*` | `<uif-select>` |
| Switch | `.uif-switch`, `.uif-switch-field`, `.uif-switch-field-text` | `--uif-switch-*` | `<uif-switch>` |
| Tabs | `.uif-tabs`, `.uif-tab-list`, `.uif-tab`, `.uif-tab-panels`, `.uif-tab-panel` | `--uif-tabs-*` | `<uif-tab-list>`, `<uif-tab>`, `<uif-tab-panel>` |
| Textarea | `.uif-textarea` | `--uif-textarea-*` | `<uif-textarea>` |
| TreeView | `.uif-tree-view`, `.uif-tree-node`, `.uif-tree-node-row`, `.uif-tree-children` | `--uif-tree-view-*` | `<uif-tree-view>` |
| Tooltip | `.uif-tooltip`, `.uif-tooltip-trigger` | `--uif-tooltip-*` | `<uif-tooltip>` |

For every token-bearing family, Figma `codeSyntax.WEB` is the naming source and
generated `dist/` files must be regenerated rather than edited directly.

## Stable package and JavaScript surfaces

The naming migration does not rename:

- `ui-foundations/macros/ui.njk` or its named macro exports;
- `ui-foundations/elements` or `ui-foundations/elements/ui-*` package subpaths;
- `ui-*.js` element module filenames;
- JavaScript constructors and named exports such as `UIButton`.

## Compatibility removal

Legacy bare class selectors are deprecated in v1.x. Their removal is Wave 4
work for v2.0 or later and must be tracked separately. The v2 change must remove
selector aliases, compatibility allowlists, warning fixtures, and related
release guidance together.

## Governing records

- `docs/migrations/naming-scope-migration-plan.md` — migration strategy,
  rationale, risks, and implementation waves.
- `docs/migrations/public-api-namespace-v1.md` — exhaustive Custom Element tag
  map and macro-alias boundary.
- `docs/adr/adr-uif-public-api-namespace.md` — approved namespace decision.
- Issues #145, #156, and #197 — planning, component migration, and final public
  namespace implementation.

## Validation

```sh
npm run lint
npm run test:unit
npm run ci:check
npm pack --dry-run
```
