# UI Foundations v1 Release Readiness

This is the only release-tracking document that should be updated during implementation.

## Status

- Governance Baseline: frozen
- Audit Baseline: frozen in `docs/audits/v1/`
- Execution mode: implementation

## Critical path

- E1 Foundation: Governance Baseline
- E2 Foundation: Specification Lifecycle & Versioning
- E3 Runtime: Reproducible Release Pipeline
- E4 Intelligence: MCP Contract Hardening
- E6 Runtime: Accessibility Baseline

## v1 release gates

- [ ] Critical epics complete (E1, E2, E3, E4)
- [ ] Accessibility baseline complete (E6)
- [ ] No release-blocking vulnerabilities
- [ ] Release workflow dry-run evidence linked
- [ ] Spec lifecycle metadata complete for foundation specs
- [ ] MCP contracts and compatibility policy published
- [ ] Required CI checks green for release candidate
- [ ] Final sign-off recorded

## Breaking changes

- React wrapper exports (`ui-foundations/react` and
  `ui-foundations/react/*`) are removed in v1. Consumers must migrate using
  `docs/migrations/react-to-web-components.md` before upgrading.
- The canonical `uif.*` macro usage and `<uif-*>` Custom Element namespace are
  implemented under #197. Legacy `<ui-*>` registrations are removed without
  compatibility aliases; consumers must follow
  `docs/migrations/public-api-namespace-v1.md`.

## Evidence log

| Gate | Evidence | Status |
|---|---|---|
| Critical epics complete |  | Pending |
| Accessibility baseline |  | Pending |
| Vulnerability status |  | Pending |
| Release dry-run |  | Pending |
| Spec metadata completeness |  | Pending |
| MCP contract readiness |  | Pending |
| CI status |  | Pending |
| Final sign-off |  | Pending |
