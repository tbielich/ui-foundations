---
id: pattern.base.button
title: Button Pattern
type: pattern
status: draft
owners:
  - ui-foundations
created: 2026-07-08
updated: 2026-07-09
authority: derived
summary: Agent-readable base pattern contract for buttons.
related:
  derived_from:
    - /Users/Thomas.Bielich@tui.com/GitHub/ui-foundations/docs/patterns/button.md
    - /Users/Thomas.Bielich@tui.com/GitHub/ui-foundations/site/patterns/button.md
  references:
    - specification.pattern.schema
---

# Button Pattern

## Metadata

- id: `pattern.base.button`
- type: base
- status: draft
- source: `/Users/Thomas.Bielich@tui.com/GitHub/ui-foundations/docs/patterns/button.md`; supporting canonical page `/Users/Thomas.Bielich@tui.com/GitHub/ui-foundations/site/patterns/button.md`
- related standards: Native HTML `button`; WCAG focus appearance, text contrast, non-text contrast, and use of color requirements
- related components: `Button`, `ButtonGroup`
- related tokens: `button`, `button-group`, focus, spacing, color, border, radius

## Intent

Provide an action control that users can identify, focus, and activate with pointer, keyboard, or assistive technology.

## Problem

Interfaces need a reliable way to expose actions without confusing actions with navigation or weakening keyboard and accessibility behavior.

## Use When

- Use for actions that change state, submit, reset, open, close, confirm, or cancel.
- Use solid, outline, and ghost variants to express action hierarchy.
- Use `ButtonGroup` when related actions need a visible and semantic grouping.

## Do Not Use When

- Do not use a button for navigation when a link is the correct native element.
- Do not use multiple solid buttons at the same hierarchy level in the same action group.
- Do not use ghost as the only button in a group when it needs to carry the primary action.

## Standard Basis

Native HTML `button` behavior is the base. WAI-ARIA is not needed for ordinary buttons except for accessible names on icon-only buttons or state attributes for specialized button variants. WCAG constrains focus visibility, text contrast, non-text contrast, and reliance on color.

## Anatomy

- Container: native interactive element with hit target, border, fill, and focus state.
- Label: text that describes the action.
- Optional icon: decorative or supporting icon hidden from assistive technology unless it is the accessible name source.
- Optional loading indicator: decorative spinner or progress affordance that preserves the button accessible name.
- ButtonGroup: out of scope for this base pattern; treat related action grouping as a dependent composition until a ButtonGroup pattern is defined.

## Structure Contract

| Item | Classification | Contract |
|---|---|---|
| Native element | Required | Use `<button>` for actions. |
| Default type | Required | Use `type="button"` unless the component API explicitly sets `submit` or `reset`. |
| Label | Required | Provide visible text or `accessibilityLabel` for icon-only buttons. |
| Icon before label | Optional | Render before the label; hide decorative icons with `aria-hidden="true"`. |
| Icon after label | Optional | Render after the label; hide decorative icons with `aria-hidden="true"`. |
| Loading indicator | Optional | Render without replacing the accessible name; decorative spinner uses `aria-hidden="true"`. |
| Icon-only structure | Optional | Render one icon plus an explicit accessible name; no visible label is required. |
| ButtonGroup structure | Out of scope | Do not derive ButtonGroup HTML from this base spec. |
| Forbidden structures | Required | Do not use `div role="button"` or another generic element unless a documented technical exception exists. |

## Implementation Naming Contract

### CSS Class Contract

- `.uif-button` is the primary public component class.
- Variants use chained classes such as `.uif-button.solid`, `.uif-button.outline`, and `.uif-button.ghost`.
- Authored states use `is-*` chained classes only when the state is not better represented by native attributes or pseudo-classes.
- Native states use pseudo-classes where possible.
- Do not use BEM modifier syntax, BEM element syntax, or unscoped public component classes.

### Token Contract

- Button token slots use `--uif-button-*`.
- Experimental unresolved button tokens use `--uif-proof-*` or `--uif-assumption-*`.
- Do not use unscoped public tokens such as `--button-*`.

### Data Attribute Contract

| Attribute | Classification | Contract |
|---|---|---|
| `data-uif-component="button"` | Optional | May identify the component for metadata, testing, or agent-readable inspection; it must not replace `.uif-button`. |
| `data-loading="true"` | Optional | May mirror loading state when loading is supported. Preserve the accessible name and suppress repeated activation. |

Data attributes are secondary metadata or state hooks. They must not replace public classes, tokens, native button semantics, accessible names, or required ARIA.

### Native / ARIA Precedence

- Use native `<button>` and native `disabled` where applicable.
- Use `type="button"` unless submit or reset behavior is intended.
- Use `aria-busy` only when the chosen loading semantics require busy state communication.
- Data attributes may mirror loading state but must not be the only semantic source.

### Agent Freedom Boundary

- CSS naming, token scoping, native button semantics, and accessibility semantics are not agent freedom.
- New button class names, token names, or data attributes must be marked as proposed or recorded in `Open Questions`.

```html
<button
  class="uif-button solid"
  type="button"
  data-uif-component="button"
>
  <span class="uif-button-label">Continue</span>
</button>
```

```html
<button
  class="uif-button solid"
  type="button"
  data-uif-component="button"
  data-loading="true"
  aria-busy="true"
  disabled
>
  <span class="uif-button-spinner" aria-hidden="true"></span>
  <span class="uif-button-label">Save changes</span>
</button>
```

## Required Semantics

- Use `<button>` for actions.
- Set `type="button"` unless submit or reset behavior is intentionally required.
- Provide visible text or an accessible name for icon-only buttons.
- Use native `disabled` for unavailable actions.
- Use `<a>` for navigation, not a styled button.
- Use `role="group"` plus `aria-label` or `aria-labelledby` for button groups.

## Behaviour

- Width adjusts to label content.
- Long labels wrap when horizontal space is insufficient.
- Focus state must be visible for keyboard users.
- Disabled buttons are not editable or activatable, are removed from the tab order by native behavior, and communicate disabled state to assistive technology.
- Variant hierarchy expresses emphasis without changing action semantics.

## Keyboard Interaction

- `Space` or `Enter`: executes the button action.
- `Tab`: moves focus to the next focusable element.
- `Shift + Tab`: moves focus to the previous focusable element.

## Accessibility Rules

- Use `<button>` for actions and `<a>` for navigation.
- Every button needs visible text or an accessible name.
- Disabled buttons use the native `disabled` attribute.
- Focus indicators meet at least 3:1 contrast against the surrounding background.
- Color must not be the only means of distinguishing variants.
- Button labels must be concise, sentence case, and action-oriented.

## Token Requirements

- Container background by variant and state.
- Text color by variant and state.
- Border color and size by variant and state.
- Overlay slots for hover and active states.
- Focus ring or focus border slot.
- Disabled container, border, and text slots.
- Padding, minimum height, radius, icon spacing, and group gap slots.
- Loading indicator size, color, and motion slots.
- Icon-only minimum size and padding slots.

## Token Slot Matrix

| Part | Property | State / Variant | Required semantic token slot | Notes |
|---|---|---|---|---|
| Button root | Background | Default / variant | Button container background slot by variant | Exact token name must use the `--uif-button-*` scope when public. |
| Button root | Background overlay | Hover / active | Button overlay slot by interaction state | Required for hover and active recipes. |
| Button root | Text color | Default / hover / active / focus | Button text color slot by variant and state | Must preserve contrast. |
| Button root | Border color | Default / hover / active / focus | Button border color slot by variant and state | Required even for low-emphasis variants. |
| Button root | Border width | Default / active | Button border size slot | Use stable slot if exact token differs. |
| Button root | Focus indicator | Focus-visible | Button focus ring slot | Must meet non-text contrast. |
| Button root | Background / text / border | Disabled | Button disabled state slots | Native disabled semantics required. |
| Button root | Padding / minimum size / radius | All states | Button size and shape slots | Includes icon-only sizing. |
| Icon | Size / spacing / color | Icon before / icon after / icon-only | Button icon size, gap, and color slots | Decorative icon remains hidden from assistive tech. |
| Loading indicator | Size / color / motion | Loading | Button loading indicator slots | Exact token names are open if not already defined. |

## States

- Default
- Hover
- Active
- Focus / keyboard focus
- Disabled
- Loading

## State Semantics

| State | Required semantics | User interaction | Notes |
|---|---|---|---|
| Default | Native `<button>` semantics | Activates on pointer, `Enter`, and `Space` | Required. |
| Hover | No ARIA state | Pointer feedback only | Required visual state when pointer hover is available. |
| Active | No ARIA state unless press is momentary native activation | Pointer or keyboard activation feedback | Required visual state. |
| Focus / keyboard focus | Native focus; visible focus indicator | Reached by keyboard or programmatic focus | Required. |
| Disabled | Native `disabled` attribute | Cannot receive focus or activate | Required when disabled. |
| Loading | Accessible name preserved; repeated activation suppressed; optional `aria-busy` on button when implementation uses busy semantics | Initial activation starts pending work; repeated activation does not fire | Optional state. Whether loading also applies `disabled` is an open question. |
| Pressed | `aria-pressed` only for toggle buttons | Toggle activation changes pressed state | Out of scope for this base button spec; define in a future toggle-button pattern before implementation. |

## Variants

- Solid: primary action emphasis.
- Outline: secondary or medium emphasis.
- Ghost: tertiary or low emphasis.
- Icon-only: permitted only with an accessible name.
- Grouped: related actions in a labeled group.

## Responsive / Density Behaviour

Buttons keep stable padding and minimum height from tokens. Optional: labels can wrap instead of overflowing. Button groups are out of scope for this base pattern.

## Component Dependencies

- `Button`
- Icon primitive when icons are used
- ButtonGroup composition pattern: out of scope until defined

## Minimum Component API

| API | Classification | Default | Contract |
|---|---|---|---|
| `variant` | Required | `solid` | Supports `solid`, `outline`, and `ghost`. |
| `size` | Optional | Component default | Size values are implementation-defined until source docs define canonical sizes. |
| `type` | Required | `button` | Supports `button`, `submit`, and `reset`. |
| `disabled` | Required | `false` | Maps to native `disabled`. |
| `loading` | Optional | `false` | Suppresses repeated activation and preserves accessible name. |
| `iconBefore` | Optional | None | Decorative unless it contributes to visible label; hide from assistive tech when decorative. |
| `iconAfter` | Optional | None | Decorative unless it contributes to visible label; hide from assistive tech when decorative. |
| `iconOnly` | Optional | `false` | Requires `accessibilityLabel`. |
| `accessibilityLabel` | Required for icon-only | None | Supplies accessible name when no visible label exists. |
| `pressed` | Out of scope | None | Toggle-button behavior is not defined by this base pattern. |
| `onClick` | Required | None | Fires on activation unless `disabled` or repeated activation during `loading`. |

## Agent Freedom

| Decision Area | Freedom Level | Allowed Choices | Requires Human Review |
|---|---|---|---|
| Native action semantics | none | Use native `<button>` for actions with native keyboard activation. | Yes, for any non-button action control. |
| Button type default | none | Default to `type="button"` unless API explicitly sets `submit` or `reset`. | No. |
| Variant implementation | guided | Implement `solid`, `outline`, and `ghost` through semantic token slots and state rules. | No, unless adding variants. |
| Size scale | guided | Choose framework/runtime size names when they preserve tokenized minimum size and spacing. | Yes, if size changes hit target or density contract. |
| Icon placement | limited | `iconBefore`, `iconAfter`, or icon-only with explicit accessible name. | Yes, for new icon layouts. |
| Loading behavior | limited | Suppress repeated activation and preserve accessible name; disabled mapping and `aria-busy` remain open questions. | Yes, before choosing disabled mapping or `aria-busy` placement. |
| Internal wrappers | guided | Wrappers are allowed when they do not alter name, focus, activation, or token slots. | No. |
| ButtonGroup | none | Do not derive ButtonGroup behavior from this base spec. | Yes, to define a composition pattern. |

## Implementation Contract

- Preserve native `button` semantics and keyboard activation.
- Default action buttons to `type="button"` unless submit/reset is intended.
- Preserve accessible names for all buttons.
- Preserve native disabled behavior.
- Use semantic button tokens for visual states and variants.
- Do not let visual variants change semantics.
- Loading buttons suppress repeated activation.
- Loading indicators are decorative unless they communicate additional status.
- Icon-only buttons require an explicit accessible name.
- Visible tooltip for icon-only buttons is optional unless a future design-system rule requires it.
- Tooltip text must not be the only accessible name source unless technically valid and tested.

## Test Requirements

- Verify native button element and expected `type`.
- Verify accessible name for text and icon-only buttons.
- Verify keyboard activation with `Space` and `Enter`.
- Verify disabled buttons are not focusable or activatable.
- Verify focus indicator is visible and contrast-safe.
- Verify variants and states use token slots rather than hardcoded colors.
- Verify loading state suppresses repeated activation.
- Verify decorative loading indicator uses `aria-hidden="true"`.

## Negative Test Requirements

- Icon-only button without accessible name fails.
- Disabled button firing activation fails.
- Loading button firing repeated activation fails.
- Button used for navigation without an explicit documented exception fails.
- Removed focus indicator fails.
- Generic element with `role="button"` fails unless a documented technical exception exists.

## Documentation Requirements

Human-facing docs must explain variants, disabled state, label content standards, keyboard interactions, accessibility rules, theming, and ButtonGroup scope without copying this contract verbatim.

## Anti-Patterns

- Styling a link as an action button.
- Using a generic element with `role="button"` when `<button>` is available.
- Removing focus indication.
- Hardcoding custom button colors.
- Using vague labels such as `Done` when the action outcome is unclear.
- Scattering related actions without a group where grouping is needed.

## Agent Output

Agents can derive component acceptance criteria, review findings, test plans, token audits, and documentation deltas from this pattern. Agents must not add runtime implementation code to this vault.

Review this pattern against `patterns/checklists/pattern-spec-review-checklist.md` before deriving implementation output.

## Open Questions

- Open question: Does `loading=true` also apply native `disabled`, or only suppress repeated activation while preserving focus?
- Open question: Determine whether `aria-busy`, when used for loading, belongs on the button itself or on a surrounding async region.
- Resolved: Icon-only buttons require an explicit accessible name; visible tooltip is optional.
- Resolved: ButtonGroup is out of scope for this base pattern until a composition pattern is defined.
