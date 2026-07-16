# Public API Surface (v1)

## Purpose

Provide the canonical Runtime-facing public API summary for v1 and link to the
full migration guidance.

## Canonical v1 usage

- CSS classes: `.uif-*`
- Component token slots: `--uif-component-*`
- Nunjucks usage examples: `uif.*` alias
- Custom Element tags: `<uif-*>`

## Compatibility context

Legacy names are migration/compatibility context only and are not canonical
usage for new authored examples:

- bare classes such as `.button` and `.input`
- legacy tags such as `<ui-*>`
- legacy token prefixes such as `--component-*`

## Stable package/module surfaces

Some package/module surfaces intentionally remain stable in v1, including
`ui-foundations/elements/ui-*` subpaths and `ui-*.js` module filenames.
This is a package compatibility boundary, not a public authored-tag namespace.

## Canonical sources

- `docs/adr/adr-public-api-documentation-contract.md`
- `docs/adr/adr-uif-public-api-namespace.md`
- `docs/migrations/public-api-namespace-v1.md`
- `MIGRATION.md`
