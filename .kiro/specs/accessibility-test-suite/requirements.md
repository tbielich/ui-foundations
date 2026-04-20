# Requirements Document

## Introduction

The Accessibility Test Suite is an automated testing system that validates WCAG 2.1 AA conformance evidence for all UI Foundations design system components (Button, Checkbox, Radio, Switch, Slider, Input, Icon, Label, Link). The suite covers six categories of accessibility checks:

1. **Color contrast** — token-resolved foreground/background pairings meet WCAG AA contrast ratios across all mode and brand combinations.
2. **ARIA attributes** — components emit correct ARIA attributes (`aria-label`, `aria-checked`, `aria-pressed`, `role`, `aria-disabled`) for their semantic role and state.
3. **Keyboard operability** — all interactive components are operable via keyboard (Tab, Enter, Space, Arrow keys) and expose visible `:focus-visible` styles.
4. **Focus management** — focus ring tokens (`--shadow-focus`, `--color-focus`) resolve to visible values and focus indicators meet the 3:1 contrast requirement.
5. **Screen reader compatibility** — semantic HTML elements are used correctly, label associations are present, and state changes are announced.
6. **Disabled state handling** — disabled components use correct attributes (`disabled` or `aria-disabled`), suppress pointer interaction, and convey disabled state to assistive technology.

Currently, the project has zero automated accessibility tests. React wrappers for Checkbox and Radio include dev-time warnings for missing `aria-label`/`aria-labelledby`, but these are runtime console warnings only. The Nunjucks macros produce semantic HTML (`<button>`, `<input>`, `<a>`, `<label>`) but no test verifies correctness.

The planned suite will run as `npm run test:a11y` and integrate into the existing `npm run ci:check` pipeline. It provides regression evidence, not WCAG certification — full compliance requires manual testing with assistive technologies.

## Glossary

- **A11y_Test_Runner**: The Node.js test harness (`tests/a11y/` directory) that orchestrates all accessibility checks
- **Static_Analyzer**: The subset of tests that analyze HTML markup, CSS patterns, and token values without rendering in a browser
- **Runtime_Analyzer**: The subset of tests that render components in a headless browser (using axe-core) and evaluate accessibility rules against the live DOM
- **Component_HTML**: The rendered HTML output of a component, produced either from Nunjucks macros or React wrappers
- **Component_Pattern**: A CSS file in `src/ui/patterns/` defining the visual styling for a component
- **Focus_Ring_Token**: The CSS custom properties `--shadow-focus` and `--color-focus` that define the focus indicator appearance
- **Contrast_Pair**: A foreground token and background token within the same component-variant group that must meet a minimum contrast ratio
- **ARIA_Contract**: The set of ARIA attributes and roles that a component must expose for a given state (e.g. a checked checkbox must have `aria-checked="true"` or the native `checked` attribute)
- **Keyboard_Contract**: The set of keyboard interactions a component must support (e.g. Button activates on Enter and Space; Radio group navigates with Arrow keys)
- **Label_Association**: The programmatic link between an interactive element and its accessible name, via wrapping `<label>`, `for`/`id` pairing, `aria-label`, or `aria-labelledby`
- **Mode_Brand_Matrix**: The set of all combinations of color modes (light, dark) and brands (brand-a, brand-b) that must be validated
- **Violation_Report**: The structured JSON output produced by the A11y_Test_Runner summarizing all detected accessibility issues
- **Axe_Core**: The axe-core accessibility testing engine used for runtime DOM analysis against WCAG 2.1 AA rules
- **Component_Fixture**: A minimal HTML document that renders a single component in a specific state for testing purposes
- **Token_Resolution_Chain**: The full reference path from a component token through semantic tokens to core primitive color values (e.g. `--button-solid-text-color-default` → `--color-text-inverse` → `--color-neutral-000`)

## Requirements

### Requirement 1: Static Color Contrast Validation

**User Story:** As a design system maintainer, I want to validate that all token-based foreground/background color pairings meet WCAG AA contrast ratios across all modes and brands, so that color contrast regressions are caught before they reach users.

#### Acceptance Criteria

1. WHEN the A11y_Test_Runner executes contrast checks, THE Static_Analyzer SHALL resolve each Contrast_Pair through the Token_Resolution_Chain (Component → Semantic → Brand → Core) to computed RGB values for every combination in the Mode_Brand_Matrix
2. WHEN a Contrast_Pair involving text tokens (tokens ending in `-text-color-*`) resolves to a contrast ratio below 4.5:1 in any Mode_Brand_Matrix combination, THE Static_Analyzer SHALL report it as a contrast violation with the component name, token names, computed ratio, failing mode, and failing brand
3. WHEN a Contrast_Pair involving non-text UI tokens (border, icon) resolves to a contrast ratio below 3:1 in any Mode_Brand_Matrix combination, THE Static_Analyzer SHALL report it as a contrast violation with the same detail fields
4. THE Static_Analyzer SHALL identify Contrast_Pairs by matching component token naming conventions: tokens ending in `-text-color-*` paired with `-container-background-*` or `-background-*` within the same component-variant group
5. IF a Token_Resolution_Chain cannot be fully resolved to a computed color value, THEN THE Static_Analyzer SHALL report the pairing as unresolvable and include the point in the chain where resolution failed

### Requirement 2: ARIA Attribute Validation

**User Story:** As a design system maintainer, I want to verify that each component's HTML output includes the correct ARIA attributes for its semantic role and state, so that assistive technologies can interpret components correctly.

#### Acceptance Criteria

1. WHEN the A11y_Test_Runner evaluates a Checkbox Component_HTML, THE Runtime_Analyzer SHALL verify that the element has `type="checkbox"`, and WHEN checked, has either the native `checked` attribute or `aria-checked="true"`, and WHEN indeterminate, has `aria-checked="mixed"`
2. WHEN the A11y_Test_Runner evaluates a Radio Component_HTML, THE Runtime_Analyzer SHALL verify that the element has `type="radio"` and a `name` attribute grouping it with related radios
3. WHEN the A11y_Test_Runner evaluates a Switch Component_HTML, THE Runtime_Analyzer SHALL verify that the element has `role="switch"` and `type="checkbox"`
4. WHEN the A11y_Test_Runner evaluates a Button Component_HTML with toggle behavior, THE Runtime_Analyzer SHALL verify that the element has `aria-pressed` set to `"true"` or `"false"`
5. WHEN the A11y_Test_Runner evaluates a Link Component_HTML in disabled state, THE Runtime_Analyzer SHALL verify that the element has `aria-disabled="true"`
6. WHEN the A11y_Test_Runner evaluates an Icon Component_HTML with a label, THE Runtime_Analyzer SHALL verify that the element has `role="img"` and `aria-label` set to the label text, and WHEN decorative, has `aria-hidden="true"`

### Requirement 3: Label Association Validation

**User Story:** As a design system maintainer, I want to verify that every interactive component has a programmatic Label_Association, so that screen readers announce the component's purpose.

#### Acceptance Criteria

1. WHEN the A11y_Test_Runner evaluates a Checkbox, Radio, or Switch Component_HTML, THE Runtime_Analyzer SHALL verify that the input element is wrapped in a `<label>` element containing visible text, OR has a matching `for`/`id` pairing with a `<label>`, OR has an `aria-label` attribute, OR has an `aria-labelledby` attribute pointing to an existing element
2. WHEN the A11y_Test_Runner evaluates an Input Component_HTML, THE Runtime_Analyzer SHALL verify that the input element has a Label_Association via one of the mechanisms listed in criterion 1
3. WHEN the A11y_Test_Runner evaluates a Button Component_HTML, THE Runtime_Analyzer SHALL verify that the button has accessible text content (visible text, `aria-label`, or `aria-labelledby`)
4. WHEN a Component_HTML lacks any Label_Association, THE Runtime_Analyzer SHALL report it as a violation with the component name, the element selector, and the expected association mechanism
5. WHEN the A11y_Test_Runner evaluates a field-label macro output with `required=true`, THE Runtime_Analyzer SHALL verify that the required indicator text "(required)" is present in a visually-hidden span for screen readers

### Requirement 4: Keyboard Operability Validation

**User Story:** As a design system maintainer, I want to verify that all interactive components are operable via keyboard, so that users who cannot use a mouse can still interact with the design system.

#### Acceptance Criteria

1. WHEN the A11y_Test_Runner evaluates a Button Component_HTML, THE Runtime_Analyzer SHALL verify that the button is focusable via Tab and activates on both Enter and Space key presses
2. WHEN the A11y_Test_Runner evaluates a Checkbox or Switch Component_HTML, THE Runtime_Analyzer SHALL verify that the input is focusable via Tab and toggles on Space key press
3. WHEN the A11y_Test_Runner evaluates a Radio Component_HTML within a group, THE Runtime_Analyzer SHALL verify that the group is focusable via Tab and individual radios are navigable via Arrow keys
4. WHEN the A11y_Test_Runner evaluates a Slider Component_HTML, THE Runtime_Analyzer SHALL verify that the slider is focusable via Tab and its value changes on Arrow key presses
5. WHEN the A11y_Test_Runner evaluates a Link Component_HTML, THE Runtime_Analyzer SHALL verify that the link is focusable via Tab and activates on Enter key press
6. WHEN a disabled component receives keyboard focus via Tab, THE Runtime_Analyzer SHALL verify that the component is either removed from the tab order (native `disabled` attribute) or does not respond to activation keys

### Requirement 5: Focus Indicator Validation

**User Story:** As a design system maintainer, I want to verify that all interactive components display a visible focus indicator when focused via keyboard, so that keyboard users can track their position on the page.

#### Acceptance Criteria

1. WHEN the A11y_Test_Runner executes focus checks, THE Static_Analyzer SHALL verify that every Component_Pattern file for interactive components (Button, Checkbox, Radio, Switch, Slider, Input, Link) contains a `:focus-visible` rule or `.is-focus-visible` class rule
2. WHEN the A11y_Test_Runner evaluates focus styles, THE Static_Analyzer SHALL verify that the `:focus-visible` rule references the Focus_Ring_Tokens (`--shadow-focus` and `--color-focus`) via `box-shadow`
3. WHEN the A11y_Test_Runner resolves Focus_Ring_Token values, THE Static_Analyzer SHALL verify that `--shadow-focus` resolves to a non-zero spread value and `--color-focus` resolves to a non-transparent color in every Mode_Brand_Matrix combination
4. WHEN a Component_Pattern file for an interactive component lacks a `:focus-visible` or `.is-focus-visible` rule, THE Static_Analyzer SHALL report it as a missing focus indicator violation

### Requirement 6: Disabled State Accessibility Validation

**User Story:** As a design system maintainer, I want to verify that disabled components correctly convey their disabled state to both visual users and assistive technology, so that disabled controls are not mistaken for interactive ones.

#### Acceptance Criteria

1. WHEN the A11y_Test_Runner evaluates a disabled Button, Checkbox, Radio, Switch, Slider, or Input Component_HTML, THE Runtime_Analyzer SHALL verify that the element has the native `disabled` attribute
2. WHEN the A11y_Test_Runner evaluates a disabled Link Component_HTML, THE Runtime_Analyzer SHALL verify that the element has `aria-disabled="true"` (since `<a>` elements do not support the native `disabled` attribute)
3. WHEN the A11y_Test_Runner evaluates a disabled component's CSS, THE Static_Analyzer SHALL verify that the Component_Pattern includes a `cursor: not-allowed` declaration in the `:disabled` or `.is-disabled` rule
4. WHEN a disabled component uses `aria-disabled="true"` instead of the native `disabled` attribute, THE Runtime_Analyzer SHALL verify that pointer events are suppressed via CSS (`pointer-events: none`) or JavaScript event prevention

### Requirement 7: Semantic HTML Validation

**User Story:** As a design system maintainer, I want to verify that components use the correct semantic HTML elements, so that assistive technologies can infer component roles without relying on ARIA overrides.

#### Acceptance Criteria

1. WHEN the A11y_Test_Runner evaluates Button Component_HTML, THE Runtime_Analyzer SHALL verify that the element is a `<button>` element (not a `<div>` or `<span>` with `role="button"`)
2. WHEN the A11y_Test_Runner evaluates Checkbox and Radio Component_HTML, THE Runtime_Analyzer SHALL verify that the elements are `<input>` elements with the correct `type` attribute (`checkbox` or `radio`)
3. WHEN the A11y_Test_Runner evaluates Link Component_HTML, THE Runtime_Analyzer SHALL verify that the element is an `<a>` element with an `href` attribute
4. WHEN the A11y_Test_Runner evaluates Slider Component_HTML, THE Runtime_Analyzer SHALL verify that the element is an `<input type="range">` element
5. WHEN the A11y_Test_Runner evaluates Switch Component_HTML, THE Runtime_Analyzer SHALL verify that the element is an `<input type="checkbox">` with `role="switch"`

### Requirement 8: Axe-Core Runtime Audit

**User Story:** As a design system maintainer, I want to run axe-core against rendered component fixtures in a headless browser, so that I get comprehensive WCAG 2.1 AA violation detection beyond what static analysis can catch.

#### Acceptance Criteria

1. WHEN the A11y_Test_Runner executes runtime audits, THE Runtime_Analyzer SHALL render each component as a Component_Fixture in a headless browser with the full token stack loaded (core, semantic, mode, brand, component tokens and component CSS)
2. WHEN the Runtime_Analyzer renders a Component_Fixture, THE Runtime_Analyzer SHALL run Axe_Core with the `wcag2a` and `wcag2aa` rule tags enabled
3. WHEN Axe_Core reports one or more violations for a Component_Fixture, THE Runtime_Analyzer SHALL include each violation's rule ID, impact level, affected nodes, and failure summary in the Violation_Report
4. THE Runtime_Analyzer SHALL generate Component_Fixtures for each component in its default state, checked/active state (where applicable), and disabled state
5. THE Runtime_Analyzer SHALL generate Component_Fixtures for each combination in the Mode_Brand_Matrix (light/brand-a, light/brand-b, dark/brand-a, dark/brand-b)

### Requirement 9: Component Fixture Generation

**User Story:** As a design system maintainer, I want component test fixtures to be generated from the Nunjucks macros, so that tests validate the same HTML that the docs site produces.

#### Acceptance Criteria

1. THE A11y_Test_Runner SHALL generate Component_Fixtures by invoking the Nunjucks macros defined in `site/_includes/macros/ui.njk` with representative parameters for each component and state
2. WHEN generating a Component_Fixture, THE A11y_Test_Runner SHALL wrap the macro output in a minimal HTML document that includes all required CSS token files (`core-primitives`, `appearance-modes`, `themes-brands`, `semantics-roles`, `components-ui`) and component CSS from `src/ui/patterns/`
3. THE A11y_Test_Runner SHALL generate fixtures for each component in the following states: default, hover (CSS class `is-hover`), focus (CSS class `is-focus-visible`), disabled, and checked/active (where applicable)
4. WHEN generating fixtures for mode/brand combinations, THE A11y_Test_Runner SHALL set `data-mode` and `data-brand` attributes on the root element to activate the correct token set

### Requirement 10: Violation Report Output

**User Story:** As a design system maintainer, I want the test suite to produce a structured, machine-readable report, so that CI pipelines and agents can consume the results.

#### Acceptance Criteria

1. THE A11y_Test_Runner SHALL write the Violation_Report as a JSON file to `dist/a11y-report.json`
2. THE Violation_Report SHALL contain separate arrays for each validation category: `contrastViolations`, `ariaViolations`, `labelViolations`, `keyboardViolations`, `focusViolations`, `disabledStateViolations`, `semanticViolations`, and `axeViolations`
3. THE Violation_Report SHALL include a `summary` object with counts for each category and a boolean `passed` field that is `true` only when all categories have zero entries
4. THE Violation_Report SHALL include a `metadata` object with the generation timestamp, the list of components tested, the Mode_Brand_Matrix combinations validated, and the Axe_Core version used
5. FOR ALL valid Violation_Reports, parsing the JSON then stringifying then parsing again SHALL produce an equivalent object (round-trip property)

### Requirement 11: CLI Integration

**User Story:** As a design system maintainer, I want to run accessibility tests as an npm script, so that it integrates with the existing build and CI workflow.

#### Acceptance Criteria

1. THE A11y_Test_Runner SHALL be executable via `npm run test:a11y` as a new script in `package.json`
2. WHEN the A11y_Test_Runner completes with zero violations across all categories, THE A11y_Test_Runner SHALL exit with code 0 and print a summary line to stdout indicating all checks passed with the count of components and combinations tested
3. WHEN the A11y_Test_Runner completes with one or more violations, THE A11y_Test_Runner SHALL exit with code 1 and print a summary table to stdout showing counts per category
4. THE A11y_Test_Runner SHALL support a `--report-only` flag that writes the Violation_Report JSON file but always exits with code 0, for use in non-blocking CI stages
5. THE A11y_Test_Runner SHALL complete static analysis checks within 5 seconds for the current component set (9 components)

### Requirement 12: CI Pipeline Integration

**User Story:** As a design system maintainer, I want accessibility tests to run as part of the CI check, so that accessibility regressions are caught before merging.

#### Acceptance Criteria

1. WHEN `npm run ci:check` is executed, THE CI pipeline SHALL include `npm run test:a11y` as a validation step
2. WHEN the A11y_Test_Runner exits with code 1 during CI, THE CI pipeline SHALL fail the check and surface the Violation_Report summary in the output
3. THE CI pipeline SHALL run static analysis checks (contrast, focus indicators, disabled state CSS) independently of runtime checks, so that static checks pass even when a headless browser is unavailable

### Requirement 13: Multi-Mode Multi-Brand Coverage

**User Story:** As a design system maintainer, I want accessibility checks to validate all mode and brand combinations, so that brand-specific or mode-specific accessibility regressions are detected.

#### Acceptance Criteria

1. WHEN the A11y_Test_Runner is invoked, THE A11y_Test_Runner SHALL discover all brand token files matching `dist/tokens/css/themes-brands.tokens.brand-*.css` and all mode files (`mode-light.css`, `mode-dark.css`) and construct the full Mode_Brand_Matrix
2. WHEN a contrast violation or Axe_Core violation is specific to a single mode or brand combination, THE A11y_Test_Runner SHALL include the specific mode and brand identifiers in the violation entry
3. THE A11y_Test_Runner SHALL validate that accessibility properties hold across all Mode_Brand_Matrix combinations: a component that passes in light/brand-a SHALL also be tested in dark/brand-b
