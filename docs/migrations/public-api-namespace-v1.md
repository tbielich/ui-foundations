# UIF public API namespace migration

**Release boundary:** v1.0

**Tracking issue:** [#197](https://github.com/tbielich/ui-foundations/issues/197)

**Namespace authority:** `docs/adr/adr-uif-public-api-namespace.md`

UI Foundations v1 adopts the canonical `uif` namespace for public Nunjucks
usage and autonomous Custom Element tag names. This is an intentional breaking
change. Update consumer templates, authored HTML, DOM queries, tests, and type
augmentations as part of the v1 upgrade.

## Nunjucks macro usage

The macro module path and named macros are unchanged. Only the alias selected
by the importing consumer changes in canonical examples and generated output.

```njk
{# Before #}
{% import "ui-foundations/macros/ui.njk" as ui %}
{{ ui.button({ text: "Continue" }) }}

{# v1 #}
{% import "ui-foundations/macros/ui.njk" as uif %}
{{ uif.button({ text: "Continue" }) }}
```

## Custom Element tag mapping

| Before v1 | v1 |
|---|---|
| `<ui-icon>` | `<uif-icon>` |
| `<ui-button>` | `<uif-button>` |
| `<ui-button-group>` | `<uif-button-group>` |
| `<ui-input>` | `<uif-input>` |
| `<ui-checkbox>` | `<uif-checkbox>` |
| `<ui-radio>` | `<uif-radio>` |
| `<ui-progress-circle>` | `<uif-progress-circle>` |
| `<ui-switch>` | `<uif-switch>` |
| `<ui-range-slider>` | `<uif-range-slider>` |
| `<ui-badge>` | `<uif-badge>` |
| `<ui-divider>` | `<uif-divider>` |
| `<ui-textarea>` | `<uif-textarea>` |
| `<ui-avatar>` | `<uif-avatar>` |
| `<ui-accordion>` | `<uif-accordion>` |
| `<ui-accordion-item>` | `<uif-accordion-item>` |
| `<ui-tab-list>` | `<uif-tab-list>` |
| `<ui-tab>` | `<uif-tab>` |
| `<ui-tab-panel>` | `<uif-tab-panel>` |
| `<ui-tooltip>` | `<uif-tooltip>` |
| `<ui-modal>` | `<uif-modal>` |
| `<ui-select>` | `<uif-select>` |
| `<ui-link>` | `<uif-link>` |
| `<ui-field-label>` | `<uif-field-label>` |
| `<ui-form>` | `<uif-form>` |
| `<ui-form-group>` | `<uif-form-group>` |
| `<ui-form-field>` | `<uif-form-field>` |
| `<ui-form-helper>` | `<uif-form-helper>` |
| `<ui-form-actions>` | `<uif-form-actions>` |

Replace the old tag names anywhere consumers author or inspect them, including
server-rendered HTML, `document.createElement`, `querySelector`, tag selectors
in CSS, browser automation, fixtures, snapshots, and local
`HTMLElementTagNameMap` augmentations.

The legacy `ui-*` tags are not registered in v1. The package does not provide
compatibility aliases or dual registration, so old authored tags will not
upgrade to UI Foundations Custom Elements.

## Stable APIs

This migration does not rename:

- `ui-foundations/macros/ui.njk` or its named macro exports;
- `ui-foundations/elements` or `ui-foundations/elements/ui-*` package subpaths;
- `ui-*.js` element module filenames;
- JavaScript constructor and named export identifiers such as `UIButton`.

Import the same element modules and author the corresponding `<uif-*>` tags.
Generated `dist/` files are build output and must never be edited directly.

## Validation

Every implementation change must pass:

```sh
npm run lint
npm run test:unit
npm run ci:check
```
