# Patterns

## Purpose

Pattern docs describe reusable HTML/CSS composition rules and the implementation
surfaces that apply them.

Patterns are not component-governance pages. Component-facing documentation is
tracked from `docs/components/README.md`.

## Classification policy (WS5)

Runtime pattern/component docs use three explicit statuses:

1. **Implemented pattern** — canonical implementation exists in `site/` and/or
   `src/ui/patterns/`.
2. **Pattern guidance** — reusable guidance exists, but no dedicated runtime
   implementation page is required.
3. **Component placeholder** — reserved location only; not canonical behavior
   guidance until implementation docs exist.

## Pattern and component hierarchy map

| Doc | Classification | Status | Implementation source |
|---|---|---|---|
| `button.md` | Implemented pattern | Active | `site/patterns/button.md`, `src/ui/patterns/button.css`, `src/elements/ui-button.js` |
| `input.md` | Implemented pattern | Active | `site/patterns/input.md`, `src/ui/patterns/input.css`, `src/elements/ui-input.js` |
| `forms.md` | Pattern guidance | Active | `.kiro/steering/pattern-rules/forms.md` |
| `navigation.md` | Pattern guidance | Active | `.kiro/steering/pattern-rules/navigation.md` |
| `cards.md` | Pattern guidance | Active | `.kiro/steering/pattern-rules/cards.md` |
| `feedback.md` | Pattern guidance | Placeholder summary | See TODO in page; no standalone feedback rule yet |
| `layout.md` | Pattern guidance | Placeholder summary | Foundations references only; no standalone layout pattern rule |
| `modal.md` | Component placeholder | Placeholder | No runtime component documentation yet |
| `notification.md` | Component placeholder | Placeholder | No runtime component documentation yet |
| `select.md` | Component placeholder | Placeholder | No standalone select component documentation yet |

## Canonical rules

- `.kiro/steering/pattern-rules/*.md`
- `docs/agentic/rule-pipeline.md`

## Who should read this

- Designers defining reusable structures
- Engineers deciding whether logic belongs at pattern or component level
- Agents proposing new pattern rules

## Related docs

- `docs/components/README.md`
- `docs/principles/README.md`
- `docs/validation/ci.md`
