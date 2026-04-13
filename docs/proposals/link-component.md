---
title: Component Proposal: Link
status: draft
type: proposal
---

# Component Proposal: Link

## Boundary Decision

Link is a standalone component. It has distinct semantics (`<a>` vs `<button>`), its own interaction state (visited), and is reusable across all products. Passes the utility test per Foundation-009.

## Token Naming

Following `Component.variant.part.property.state` (Foundation-002):

| Figma Variable | CSS Token | Value |
|---|---|---|
| Link/Text Color/Default | `--link-text-color-default` | `var(--color-text-brand)` |
| Link/Text Color/Hover | `--link-text-color-hover` | `var(--color-text-brand)` |
| Link/Text Color/Active | `--link-text-color-active` | `var(--color-text-brand)` |
| Link/Text Color/Visited | `--link-text-color-visited` | `var(--brand-color-primary-dark)` |
| Link/Text Color/Disabled | `--link-text-color-disabled` | `var(--color-text-disabled)` |
| Link/Text Decoration/Default | `--link-text-decoration-default` | `underline` |
| Link/Text Decoration/Hover | `--link-text-decoration-hover` | `none` |
| Link/Font Weight | `--link-font-weight` | `inherit` |

## CSS Pattern

Target: `src/ui/patterns/link.css`

```css
@layer components {
  .link {
    display: inline-flex;
    align-items: center;
    gap: var(--link-gap, var(--size-spacing-100));
    color: var(--link-text-color-default);
    text-decoration: var(--link-text-decoration-default, underline);
    font-weight: var(--link-font-weight, inherit);
    cursor: pointer;
    transition: color 0.15s, text-decoration 0.15s;
  }

  .link:hover,
  .link.is-hover {
    color: var(--link-text-color-hover);
    text-decoration: var(--link-text-decoration-hover, none);
  }

  .link:active,
  .link.is-active {
    color: var(--link-text-color-active);
  }

  .link:visited,
  .link.is-visited {
    color: var(--link-text-color-visited);
  }

  .link:focus-visible,
  .link.is-focus-visible {
    outline: none;
    box-shadow: 0 0 0 var(--shadow-focus, 0) var(--color-focus, transparent);
  }

  .link[aria-disabled="true"],
  .link.is-disabled {
    color: var(--link-text-color-disabled, var(--color-text-disabled));
    pointer-events: none;
  }
}
```

## React Wrapper

Not required at this stage.

## Implementation Surface

| Action | Path |
|---|---|
| New | `src/ui/patterns/link.css` |
| Update | `src/ui/index.css` (add import) |
| New | Figma variables in Components (UI) collection |
| New | `site/components/link.md` |
| New | `site/components/link-playground.md` |

## Implementation Sequence (Foundation-010)

1. Create Figma variables in Components (UI) collection
2. Export tokens via Token Foundry plugin
3. Run `npm run build:all`
4. Add `src/ui/patterns/link.css`
5. Add import to `src/ui/index.css`
6. Add docs page
7. Run `npm run ci:check`

## Open Questions

- Should visited state be brand-scoped or use a dedicated semantic token?
- Should there be a `link--subtle` variant with muted color?

## Notes

- Icon support uses the existing `label-content` composition pattern (same as Button)
- No new icon-specific tokens needed — `label-content` gap handles spacing
