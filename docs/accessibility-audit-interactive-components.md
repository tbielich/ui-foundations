# Accessibility Audit — Interactive Components

Date: 2026-05-04  
Mode: Audit (read-only analysis; no component implementation changes)

## Scope

Included components requested:
- Button
- Icon Button
- Link
- Input
- Select
- Checkbox
- Radio
- Switch
- Tabs
- Accordion
- Modal
- Flyout
- Dropdown
- Tooltip
- Pagination
- Show More / Show Less
- Tags

Excluded (per request): Divider, Grid, Image, Skeleton, Loader, Typography utilities.

## Inventory summary

Implemented interactive components in this repository today: **Button, Link, Input, Checkbox, Radio, Switch** via CSS patterns + docs + Nunjucks + React wrappers.  
Not implemented as reusable components in this repository today: **Icon Button (standalone), Select, Tabs, Accordion, Modal, Flyout, Dropdown, Tooltip, Pagination, Show More / Show Less, Tags**.

---

## Detailed audit

### 1) Button
- **Semantic role check:** ✅ Uses native `<button>` in Nunjucks and React wrappers.
- **Accessible name check:** ⚠️ Text labels are supported; icon-only enforcement is incomplete in templates. React warns for missing label but does not enforce.
- **Keyboard interaction check:** ✅ Native button keyboard semantics preserved (Enter/Space).
- **Focus behavior check:** ✅ Focus-visible styles are implemented in CSS.
- **ARIA/state check:** ⚠️ Toggle semantics are only present in `toggleButton` helper (`aria-pressed`), but the main button macro has no explicit toggle API guidance.
- **Form association check:** ✅ `type` attribute supported (`button`/`submit`/`reset`) in docs and macros.
- **Test coverage gaps:** ❌ No component-level unit/a11y tests found for button behavior, icon-only labeling, disabled focus/tab behavior.
- **Documentation gaps:** ⚠️ No dedicated icon-only accessibility contract (required `aria-label`) in the component doc.
- **Severity:** **medium**
- **Recommended fix:** Add automated a11y tests (accessible-name requirements, keyboard activation, disabled/tab order) and document icon-only requirement explicitly.

### 2) Icon Button
- **Semantic role check:** ⚠️ No first-class Icon Button component; behavior piggybacks on generic Button + icon-only state.
- **Accessible name check:** ❌ Risk of unnamed controls in Nunjucks macro path (no guard for icon-only without label).
- **Keyboard interaction check:** ⚠️ Inherits button semantics where used, but no formal API contract/component.
- **Focus behavior check:** ⚠️ Inherits button focus styles where used.
- **ARIA/state check:** ⚠️ React warns in dev for missing aria label; not a runtime guarantee.
- **Form association check:** ✅ Same as button where implemented.
- **Test coverage gaps:** ❌ No dedicated tests for icon-only button naming.
- **Documentation gaps:** ❌ No standalone Icon Button doc/API and no explicit accessibility checklist for icon-only actions.
- **Severity:** **high**
- **Recommended fix:** Introduce explicit Icon Button API requiring accessible name (compile/runtime assertion), plus tests and docs.

### 3) Link
- **Semantic role check:** ✅ Uses native `<a>`.
- **Accessible name check:** ✅ Text content provides name by default.
- **Keyboard interaction check:** ⚠️ Native behavior applies for valid `href`, but disabled pattern keeps `href` and does not remove from tab order.
- **Focus behavior check:** ✅ Focus-visible styling exists in CSS link pattern.
- **ARIA/state check:** ⚠️ `aria-disabled="true"` is set for disabled state, but interaction suppression (`tabindex="-1"`, click prevention) is not implemented in macro.
- **Form association check:** N/A
- **Test coverage gaps:** ❌ No tests for disabled-link keyboard/tab/click behavior.
- **Documentation gaps:** ❌ Docs state disabled links should have `tabindex="-1"`, but macro does not implement it (doc/implementation drift).
- **Severity:** **high**
- **Recommended fix:** Align implementation with docs for disabled links (`tabindex=-1`, prevent activation) or remove disabled-link pattern and recommend button for disabled actions.

### 4) Input
- **Semantic role check:** ✅ Uses native `<input>`.
- **Accessible name check:** ⚠️ Supports `id/name`, but no built-in label coupling; relies on consumer to provide `<label>`/`aria-label`.
- **Keyboard interaction check:** ✅ Native text input keyboard behavior retained.
- **Focus behavior check:** ✅ Focus-visible state styling is present.
- **ARIA/state check:** ⚠️ No first-class invalid/error ARIA guidance (`aria-invalid`, `aria-describedby`) in component API.
- **Form association check:** ⚠️ Possible via `id`/`name`, but not enforced.
- **Test coverage gaps:** ❌ No tests for accessible labeling and error semantics.
- **Documentation gaps:** ⚠️ Guidance exists generally, but no strict API examples requiring label association in all snippets.
- **Severity:** **medium**
- **Recommended fix:** Add examples and tests requiring label association + error/help text semantics.

### 5) Select
- **Semantic role check:** ❌ No reusable Select component implementation found.
- **Accessible name check:** ❌ No component contract.
- **Keyboard interaction check:** ❌ No component contract.
- **Focus behavior check:** ❌ No component contract.
- **ARIA/state check:** ❌ No component contract.
- **Form association check:** ❌ No component contract.
- **Test coverage gaps:** ❌ No tests.
- **Documentation gaps:** ❌ No component doc.
- **Severity:** **blocker**
- **Recommended fix:** Define and implement native `<select>` component with documented labeling/error patterns and keyboard expectations.

### 6) Checkbox
- **Semantic role check:** ✅ Native `<input type="checkbox">` used.
- **Accessible name check:** ✅ Wrapped in `<label>` when label text provided; React warns if unnamed.
- **Keyboard interaction check:** ✅ Native checkbox keyboard semantics preserved.
- **Focus behavior check:** ✅ Focus-visible styles included.
- **ARIA/state check:** ✅/⚠️ Indeterminate is supported (`aria-checked="mixed"` + React `indeterminate` property), but requires careful sync when controlled externally.
- **Form association check:** ✅ `name/value/id` supported.
- **Test coverage gaps:** ❌ No tests for indeterminate semantics and keyboard behavior.
- **Documentation gaps:** ⚠️ Could better specify grouping with `<fieldset>/<legend>` in all form examples.
- **Severity:** **medium**
- **Recommended fix:** Add unit/a11y tests for mixed state, labeling, and keyboard behavior; tighten docs with grouped-form examples.

### 7) Radio
- **Semantic role check:** ✅ Native `<input type="radio">` used.
- **Accessible name check:** ✅ Labeled via wrapper label.
- **Keyboard interaction check:** ⚠️ Native behavior depends on correct same-`name` grouping; examples include names, but enforcement is consumer-driven.
- **Focus behavior check:** ✅ Focus-visible styles included.
- **ARIA/state check:** ✅ Native radio semantics are used.
- **Form association check:** ⚠️ Requires `name` for proper group behavior; not enforced by API.
- **Test coverage gaps:** ❌ No tests for arrow-key movement/group semantics.
- **Documentation gaps:** ⚠️ Docs correctly call for `<fieldset>/<legend>`, but reusable grouped abstraction is absent.
- **Severity:** **medium**
- **Recommended fix:** Add `RadioGroup` abstraction or validation helper + tests for group keyboard behavior and naming.

### 8) Switch
- **Semantic role check:** ✅ Uses `<input type="checkbox" role="switch">`.
- **Accessible name check:** ✅ Label wrapper present; React warns if unlabeled.
- **Keyboard interaction check:** ✅ Native checkbox keyboard behavior (Space toggle) retained.
- **Focus behavior check:** ✅ Focus-visible styles included.
- **ARIA/state check:** ✅ Uses role switch with native checked state.
- **Form association check:** ✅ Supports `name/value/id`.
- **Test coverage gaps:** ❌ No tests for role/state announcements and keyboard toggling.
- **Documentation gaps:** ⚠️ Draft status; needs stronger screen reader expectation examples.
- **Severity:** **low**
- **Recommended fix:** Add focused a11y tests and finalize docs from draft to stable once verified.

### 9) Tabs
- **Semantic role check:** ❌ No reusable Tabs component.
- **Accessible name check:** ❌ Missing component contract.
- **Keyboard interaction check:** ❌ Missing roving tabindex/arrow-key pattern.
- **Focus behavior check:** ❌ Missing.
- **ARIA/state check:** ❌ Missing `tablist/tab/tabpanel` relationships.
- **Form association check:** N/A
- **Test coverage gaps:** ❌ None.
- **Documentation gaps:** ❌ None.
- **Severity:** **blocker**
- **Recommended fix:** Implement APG-aligned tabs with full keyboard and ARIA relationships.

### 10) Accordion
- **Severity:** **blocker**
- **Findings:** No reusable implementation/tests/docs; no verified heading/button/`aria-expanded`/`aria-controls` pattern.
- **Recommended fix:** Implement APG accordion pattern and tests.

### 11) Modal
- **Severity:** **blocker**
- **Findings:** No reusable implementation/tests/docs; no focus trap, initial focus, escape handling, restore-focus contract verified.
- **Recommended fix:** Implement dialog with robust focus management and inert/background interaction strategy.

### 12) Flyout
- **Severity:** **blocker**
- **Findings:** No reusable implementation/tests/docs.
- **Recommended fix:** Define flyout semantics (menu/dialog/popover) first, then implement with matching keyboard/ARIA behavior.

### 13) Dropdown
- **Severity:** **blocker**
- **Findings:** No reusable implementation/tests/docs; ambiguous whether it means select-like or menu-like behavior.
- **Recommended fix:** Split into explicit components (Select vs MenuButton) and implement each with proper patterns.

### 14) Tooltip
- **Severity:** **blocker**
- **Findings:** No reusable implementation/tests/docs; no trigger/focus/escape semantics.
- **Recommended fix:** Implement non-interactive tooltip pattern (`role=tooltip`, `aria-describedby`) and keyboard/focus behavior.

### 15) Pagination
- **Severity:** **blocker**
- **Findings:** No reusable implementation/tests/docs.
- **Recommended fix:** Implement nav landmark + current page semantics (`aria-current="page"`) + keyboard/focus checks.

### 16) Show More / Show Less
- **Severity:** **blocker**
- **Findings:** No reusable implementation/tests/docs.
- **Recommended fix:** Implement as disclosure button with `aria-expanded` + controlled region.

### 17) Tags
- **Severity:** **high**
- **Findings:** Only non-interactive `badge` exists; no interactive tag/chip with remove/action semantics.
- **Recommended fix:** Define Tag vs Badge distinction and implement interactive Tag API with button semantics and accessible names.

---

## Cross-cutting gaps

1. **Automated accessibility test coverage is effectively absent for interactive components.**  
   Severity: **high**
2. **Documentation-to-implementation drift exists (notably Link disabled behavior).**  
   Severity: **high**
3. **Large portion of requested interactive catalog is not implemented as system components.**  
   Severity: **blocker**

## Recommended remediation order

1. **Blockers first:** implement missing high-impact primitives (Select, Tabs, Accordion, Modal, Tooltip, Pagination, disclosure).
2. **Close current high-risk defects:** Icon Button naming contract; Link disabled behavior parity.
3. **Add baseline a11y test harness:** component-level keyboard, role/name/state assertions.
4. **Promote draft docs/components after verification:** Link/Switch and newly added components.

