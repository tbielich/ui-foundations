---
title: ADR – Density and Responsive Token Strategy
status: proposed
type: adr
---

# ADR: Density and Responsive Token Strategy

## Context

The current token architecture handles brand and light/dark mode well, but has
no systematic approach for **density modes** (compact vs. comfortable vs.
spacious) or **responsive token adaptation** (values that change at breakpoints).

As the system scales to multiple products (mobile-first apps, data-dense
dashboards, marketing pages), different density needs will emerge. Without a
strategy, consumers will hack around the system with ad-hoc overrides.

## Decision

Introduce density as a **third orthogonal mode axis** alongside brand and
appearance, using the same `data-*` attribute pattern.

### Activation Model

```html
<body data-brand="a" data-mode="light" data-density="comfortable">
```

Three density values:
- `compact` — reduced spacing, smaller touch targets (data tables, dashboards)
- `comfortable` — default, current values (standard UIs)
- `spacious` — increased spacing, larger targets (marketing, accessibility)

### Token Architecture

Density is an **Appearance-layer mode axis** (like light/dark mode), not an
arbitrary brand-semantic variant:

```
Core (raw spacing scale: 100=4px, 200=8px, 300=12px, 400=16px ...)
  ↑
Density (maps semantic roles to different Core steps per density)
  ↑
Semantics (Size/Spacing Tight, Size/Spacing Component, etc.)
  ↑
Components (`--uif-button-padding-inline`, `--input-gap`, etc.)
```

### Implementation in Figma

Use a new Figma Variable Collection: **Density** with three modes
(`Compact`, `Comfortable`, `Spacious`).

Each Semantic Size/Spacing token gets mode-specific values:

| Semantic Token | Compact | Comfortable | Spacious |
|---|---|---|---|
| `Size/Spacing Tight` | Size/Spacing/050 (2px) | Size/Spacing/100 (4px) | Size/Spacing/200 (8px) |
| `Size/Spacing Component` | Size/Spacing/100 (4px) | Size/Spacing/200 (8px) | Size/Spacing/300 (12px) |
| `Size/Spacing Comfortable` | Size/Spacing/200 (8px) | Size/Spacing/300 (12px) | Size/Spacing/400 (16px) |
| `Size/Spacing Spacious` | Size/Spacing/300 (12px) | Size/Spacing/400 (16px) | Size/Spacing/500 (20px) |

### Implementation in CSS

```css
/* Default = comfortable (current values, no change) */
:root {
  --size-spacing-tight: 0.25rem;      /* 4px */
  --size-spacing-component: 0.5rem;   /* 8px */
  --size-spacing-comfortable: 0.75rem;/* 12px */
  --size-spacing-spacious: 1rem;      /* 16px */
}

/* Compact override */
:root[data-density="compact"] {
  --size-spacing-tight: 0.125rem;     /* 2px */
  --size-spacing-component: 0.25rem;  /* 4px */
  --size-spacing-comfortable: 0.5rem; /* 8px */
  --size-spacing-spacious: 0.75rem;   /* 12px */
}

/* Spacious override */
:root[data-density="spacious"] {
  --size-spacing-tight: 0.5rem;       /* 8px */
  --size-spacing-component: 0.75rem;  /* 12px */
  --size-spacing-comfortable: 1rem;   /* 16px */
  --size-spacing-spacious: 1.25rem;   /* 20px */
}
```

### Responsive Tokens

Responsive adaptation is **not** a token-layer concern. Instead:

1. Components use `@container` queries with Core Container thresholds
   (Foundation-005) to adapt layout.
2. The density attribute can be set responsively via a small JS utility:
   ```js
   // Consumer-owned, not library code
   const mql = matchMedia('(max-width: 640px)');
   document.documentElement.dataset.density = mql.matches ? 'compact' : 'comfortable';
   ```
3. Typography already uses `clamp()` in CSS for fluid scaling — this stays.

Rationale: Embedding breakpoint logic in tokens would create a parallel
responsive system that conflicts with CSS-native solutions. Keep tokens static;
let CSS and consumers handle responsiveness.

### Scope

Density affects:
- ✅ Spacing tokens (`Size/Spacing *`)
- ✅ Border tokens (`Size/Border *`) — compact may use thinner borders
- ❌ Colors — not affected by density
- ❌ Typography — not affected (separate concern)
- ❌ Corner radii — not affected

### Consumer Control (consistent with Foundation-008)

Like mode activation, density policy is consumer-owned:
- Whether density switching is available
- How density is determined (manual toggle, viewport, user preference)
- When/how `data-density` is set

The library ships the token overrides; the consumer activates them.

## Consequences

- No breaking changes — current system is implicitly `comfortable`
- Semantic Size tokens (introduced in Week 2) become the natural density pivot
- Components need zero changes — they already reference Semantic Size tokens
- New Core token `Size/Spacing/050` (2px) needed for compact mode
- Figma needs a new Variable Collection with 3 modes
- CSS output grows by ~20 lines per density tier

## Implementation Phases

1. **Now**: This ADR establishes the pattern. No code changes.
2. **When needed**: Add `Size/Spacing/050` to Core, create Density collection
   in Figma, generate CSS density overrides in pipeline.
3. **Consumer-ready**: Ship density CSS as opt-in file
   (`dist/tokens/css/density-compact.tokens.css`).

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| T-shirt sizes in Core (sm/md/lg) | Conflates scale step with density intent |
| Media queries in tokens | Creates parallel responsive system, conflicts with container queries |
| Component-level density props | Doesn't scale; every component needs its own density logic |
| Density as a brand-semantic variant | Semantics (Brands) is for brand-scoped semantic meaning, not spatial adaptation |
