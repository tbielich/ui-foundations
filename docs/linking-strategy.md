# Linking Strategy

## Purpose

This document defines how `ui-foundations` links to durable design knowledge
without hardcoding vault locations in documentation pages.

## Why the vault exists

The UI Foundations Vault owns durable design foundation knowledge: design
principles, usability heuristics, accessibility principles, typography, color
theory, information architecture, visual hierarchy, gestalt principles, and
design intelligence.

The `ui-foundations` runtime repository owns implementation knowledge:
token architecture, generated outputs, pattern and component implementation,
documentation-site behavior, validation, and CI.

## Why links are centralized

Vault links are project configuration. Documentation pages should not embed a
repository URL, local filesystem path, branch name, or future documentation
domain. Centralizing those values keeps the public docs stable when the vault
publication target changes.

The single source of truth is:

- `config/site.js`
- `vault.repository`
- `vault.documentation`
- `vault.branch`

Eleventy pages generate vault documentation links through the
`vaultDocumentationUrl` filter. Non-rendered Markdown docs should refer to the
configuration keys instead of embedding full vault locations.

## Repository vs documentation URL

`vault.repository` identifies the source repository for the vault. Use it when a
reader or tool needs the source repository itself.

`vault.documentation` identifies the published documentation location for
canonical foundation knowledge. Public documentation pages should use this value
for knowledge links.

The two values are intentionally separate. They currently point to the same
place, but they do not have to remain the same.

## Future migration

When vault documentation moves from repository-hosted pages to a dedicated
documentation domain, only `vault.documentation` in `config/site.js` should
change. Documentation pages should not require edits.

The repository URL can remain stable for source control while the documentation
URL moves to a dedicated publishing target.

## Source of truth policy

- Durable foundation knowledge is canonical in the configured vault.
- Implementation documentation is canonical in `ui-foundations`.
- Public docs must link to vault knowledge through the central configuration.
- Runtime code, tokens, components, and generated output must not depend on
  vault links.
- Do not introduce environment variables for vault location. The vault location
  is project configuration, not deployment configuration.


## Related docs

- `docs/canonical-reference-matrix.md`
- `docs/terminology.md`
