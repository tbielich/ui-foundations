# Runtime Terminology Baseline

## Purpose

This glossary defines the Runtime documentation terms used for consistency.

Canonical governance/principle definitions remain in Vault-linked sources.
Runtime uses this glossary to keep implementation-facing wording stable.

## Baseline policy (WS7 decision)

1. Use **canonical** for the approved primary form developers should author.
2. Use **compatibility** for supported legacy forms retained for migration.
3. Use **deprecated** for legacy forms scheduled for removal.
4. Use **placeholder** for non-canonical tracker pages that do not define final
   behavior.
5. Use **summary-level guidance** for pages that point to existing rules but do
   not act as standalone specifications.

## Glossary

| Term | Meaning in Runtime docs | Example |
|---|---|---|
| Canonical | Primary approved Runtime-authored form | `.uif-*`, `<uif-*>`, `uif.*` |
| Compatibility | Legacy form still supported for migration boundaries | `.button` CSS-only compatibility selector |
| Deprecated | Legacy form allowed short-term and expected to be removed | Bare class warnings in naming checks |
| Placeholder | Reserved page/location; non-canonical behavior guidance | `docs/patterns/modal.md` status |
| Pattern guidance | Reusable composition guidance, may summarize other sources | `docs/patterns/forms.md` |
| Component surface | Runtime behavior surface with interactive/encapsulated usage | `src/elements/ui-*.js` |
| Runtime canonical source | Primary Runtime page for a local implementation topic | `docs/public-api.md` |
| Vault canonical source | Durable cross-repository canonical source | `vault.documentation` links |
| Published version | Version declared by consumed Vault pack metadata | Governance pack `0.6.0` |
| Consumed snapshot/version | Runtime-adopted governance snapshot recorded locally | `source.yml` `0.7.0` |
| Planned/forward version | Not yet published/consumed baseline; future target reference | `0.8.0` in derived contract context |

## Related docs

- `docs/canonical-reference-matrix.md`
- `docs/public-api.md`
- `docs/patterns/README.md`
- `docs/governance-baseline.md`
