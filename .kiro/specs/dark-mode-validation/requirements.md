# Requirements Document

## Introduction

Dark Mode Validation is an automated validation system that ensures all components in the UI Foundations design system render correctly in both light and dark modes. The system performs four categories of checks:

1. **Token parity** — every semantic color token defined in the light mode file also exists in the dark mode file, and vice versa.
2. **Component var() resolution** — every `var()` reference in component CSS resolves to a token that has values defined in both modes.
3. **Color contrast** — foreground/background token pairings in both modes meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text and UI components).
4. **Hardcoded color detection** — no raw color values (hex, rgb, hsl, named colors) appear in component CSS, bypassing the mode system.

Currently, the project has `validate-tokens.mjs` (JSON schema compliance) and `smoke-check.mjs` (file existence), but neither checks mode parity, cross-mode token resolution, contrast compliance, or hardcoded color usage. The mode architecture is defined in Foundation-008: light tokens at `:root`, dark tokens at `:root[data-mode="dark"]`, with brand and mode as orthogonal concerns.

The planned validator will run as `npm run validate:modes` and integrate into the existing `npm run ci:check` pipeline.

## Glossary

- **Mode_Validator**: The Node.js script (`scripts/validate-modes.mjs`) that performs all dark mode validation checks
- **Light_Token_File**: The CSS file `dist/tokens/css/appearance-modes.tokens.mode-light.css` containing semantic color token definitions scoped to `:root`
- **Dark_Token_File**: The CSS file `dist/tokens/css/appearance-modes.tokens.mode-dark.css` containing semantic color token definitions scoped to `:root[data-mode="dark"]`
- **Semantic_Color_Token**: A CSS custom property defined in the mode token files that maps a role-based name (e.g. `--color-text-default`) to a core or brand primitive value
- **Component_CSS**: A CSS file in `src/ui/patterns/` that consumes tokens via `var(--token-name)` references
- **Component_Token_File**: The CSS file `dist/tokens/css/components-ui.tokens.css` containing component-layer token definitions
- **Brand_Token_File**: A CSS file matching `dist/tokens/css/themes-brands.tokens.brand-*.css` containing brand-specific primitive mappings
- **Core_Token_File**: The CSS file `dist/tokens/css/core-primitives.tokens.css` containing primitive color values
- **Token_Parity_Violation**: A semantic color token that exists in one mode file but is absent from the other
- **Unresolved_Mode_Reference**: A component `var()` reference that resolves to a semantic color token lacking a definition in one or both modes
- **Contrast_Violation**: A foreground/background token pairing that fails to meet the required WCAG AA contrast ratio in a given mode
- **Hardcoded_Color**: A raw color value (hex, rgb, rgba, hsl, hsla, or CSS named color) used directly in component CSS instead of a token reference
- **Validation_Report**: The structured JSON output produced by the Mode_Validator summarizing all detected issues
- **Token_Resolution_Chain**: The full reference path from a component token through semantic tokens to core primitives (e.g. `--button-solid-text-color-default` → `--color-text-inverse` → `--color-neutral-000`)

## Requirements


### Requirement 1: Light/Dark Token Parity Check

**User Story:** As a design system maintainer, I want to verify that every semantic color token defined in the light mode file also exists in the dark mode file (and vice versa), so that no token is silently missing when the mode switches.

#### Acceptance Criteria

1. WHEN the Mode_Validator is invoked, THE Mode_Validator SHALL parse the Light_Token_File and the Dark_Token_File and extract all Semantic_Color_Token names from each
2. WHEN a Semantic_Color_Token exists in the Light_Token_File but is absent from the Dark_Token_File, THE Mode_Validator SHALL report it as a Token_Parity_Violation with the token name and the mode where it is missing ("dark")
3. WHEN a Semantic_Color_Token exists in the Dark_Token_File but is absent from the Light_Token_File, THE Mode_Validator SHALL report it as a Token_Parity_Violation with the token name and the mode where it is missing ("light")
4. WHEN zero Token_Parity_Violations are detected, THE Mode_Validator SHALL report the parity check as passed with the count of tokens verified in each mode

### Requirement 2: Component Token Mode Coverage Check

**User Story:** As a design system maintainer, I want to verify that every component token referencing a semantic color token resolves in both modes, so that components do not have missing colors when the mode switches.

#### Acceptance Criteria

1. WHEN the Mode_Validator is invoked, THE Mode_Validator SHALL parse the Component_Token_File and extract all `var()` references that point to Semantic_Color_Tokens (tokens matching the `--color-*` prefix pattern)
2. WHEN a component token references a Semantic_Color_Token via `var()` that is absent from the Light_Token_File, THE Mode_Validator SHALL report it as an Unresolved_Mode_Reference with the component token name, the referenced Semantic_Color_Token, and the missing mode ("light")
3. WHEN a component token references a Semantic_Color_Token via `var()` that is absent from the Dark_Token_File, THE Mode_Validator SHALL report it as an Unresolved_Mode_Reference with the component token name, the referenced Semantic_Color_Token, and the missing mode ("dark")
4. THE Mode_Validator SHALL follow one level of indirection: if a component token references another component token that in turn references a Semantic_Color_Token, the validator SHALL check the final Semantic_Color_Token against both mode files

### Requirement 3: Component CSS var() Mode Resolution Check

**User Story:** As a design system maintainer, I want to verify that every `var()` reference in component CSS pattern files resolves through the token chain to values defined in both modes, so that no component has broken styling in either mode.

#### Acceptance Criteria

1. WHEN the Mode_Validator is invoked, THE Mode_Validator SHALL scan all Component_CSS files in `src/ui/patterns/*.css` and extract all `var(--token-name)` references
2. WHEN a Component_CSS `var()` reference points to a color-related token (component or semantic) that cannot be resolved to a Semantic_Color_Token with definitions in both mode files, THE Mode_Validator SHALL report it as an Unresolved_Mode_Reference with the Component_CSS file path, the line number, and the unresolved token name
3. THE Mode_Validator SHALL skip `var()` references to non-color tokens (spacing, typography, radius, border-size, layout tokens) since these are mode-independent
4. THE Mode_Validator SHALL skip `var()` references that include a CSS fallback value as the second argument

### Requirement 4: Hardcoded Color Detection in Component CSS

**User Story:** As a design system maintainer, I want to detect raw color values in component CSS files, so that all colors flow through the token system and respond correctly to mode switching.

#### Acceptance Criteria

1. WHEN the Mode_Validator scans a Component_CSS file, THE Mode_Validator SHALL detect any hardcoded hex color values (e.g. `#fff`, `#333333`), `rgb()` / `rgba()` values, `hsl()` / `hsla()` values, and CSS named colors (e.g. `red`, `white`, `transparent`) used as property values
2. WHEN a Hardcoded_Color is detected in a Component_CSS file, THE Mode_Validator SHALL report the file path, line number, the property name, and the hardcoded value
3. THE Mode_Validator SHALL exclude the CSS keyword `transparent` and the token `var(--color-transparent)` from Hardcoded_Color detection, since `transparent` is mode-independent
4. THE Mode_Validator SHALL exclude `currentColor` and `inherit` from Hardcoded_Color detection, since these are CSS cascade keywords
5. THE Mode_Validator SHALL exclude color values inside CSS comments from Hardcoded_Color detection

### Requirement 5: Color Contrast Validation

**User Story:** As a design system maintainer, I want to verify that foreground/background color pairings meet WCAG AA contrast ratios in both light and dark modes, so that text and UI elements remain readable after mode switching.

#### Acceptance Criteria

1. WHEN the Mode_Validator is invoked, THE Mode_Validator SHALL resolve the Token_Resolution_Chain for each text-color and background-color token pairing in the Component_Token_File to their final computed `rgb()` values in both modes, for each Brand_Token_File
2. WHEN a text-color/background-color pairing resolves to a contrast ratio below 4.5:1 in either mode for any brand, THE Mode_Validator SHALL report it as a Contrast_Violation with the component name, the foreground token, the background token, the computed contrast ratio, the failing mode, and the failing brand
3. WHEN a non-text UI component color (e.g. border, icon) paired with its background resolves to a contrast ratio below 3:1 in either mode for any brand, THE Mode_Validator SHALL report it as a Contrast_Violation with the same detail fields
4. THE Mode_Validator SHALL identify text/background pairings by matching component token naming conventions: tokens ending in `-text-color-*` are foreground, tokens ending in `-container-background-*` or `-background-*` within the same component-variant group are background
5. IF a Token_Resolution_Chain cannot be fully resolved to a computed color value (e.g. due to a missing intermediate token), THEN THE Mode_Validator SHALL report the pairing as unresolvable instead of a Contrast_Violation and include the point in the chain where resolution failed

### Requirement 6: Token Resolution Chain Parser

**User Story:** As a design system maintainer, I want the validator to resolve the full token reference chain from component tokens through semantic and brand tokens down to core primitive `rgb()` values, so that contrast calculations use accurate computed colors.

#### Acceptance Criteria

1. THE Mode_Validator SHALL resolve `var(--token-name)` references by looking up the token in the Component_Token_File, then the relevant mode file (Light_Token_File or Dark_Token_File), then the Brand_Token_File, then the Core_Token_File, following each `var()` reference until a literal color value is reached
2. THE Mode_Validator SHALL support resolution across all four token layers: Core → Brand → Semantic (Mode) → Component, respecting the layered architecture defined in Foundation-008
3. IF a resolution chain contains a circular reference (token A references token B which references token A), THEN THE Mode_Validator SHALL detect the cycle, report it as an error, and stop resolution for that chain
4. FOR ALL token names that resolve to a literal color value, resolving the chain then formatting the result then resolving again SHALL produce the same computed value (round-trip property)

### Requirement 7: Validation Report Output

**User Story:** As a design system maintainer, I want the validator to produce a structured, machine-readable report, so that CI pipelines and agents can consume the results.

#### Acceptance Criteria

1. THE Mode_Validator SHALL write the Validation_Report as a JSON file to `dist/tokens/mode-validation-report.json`
2. THE Validation_Report SHALL contain separate arrays for each validation category: `parityViolations`, `unresolvedModeReferences`, `hardcodedColors`, `contrastViolations`, and `resolutionErrors`
3. THE Validation_Report SHALL include a `summary` object with counts for each category and a boolean `passed` field that is `true` only when all categories have zero entries
4. THE Validation_Report SHALL include a `metadata` object with the generation timestamp, the list of files scanned, and the brands and modes validated
5. FOR ALL valid Validation_Reports, parsing the JSON then stringifying then parsing again SHALL produce an equivalent object (round-trip property)

### Requirement 8: CLI Integration

**User Story:** As a design system maintainer, I want to run mode validation as an npm script, so that it integrates with the existing build and CI workflow.

#### Acceptance Criteria

1. THE Mode_Validator SHALL be executable via `npm run validate:modes` as a new script in `package.json`
2. WHEN the Mode_Validator completes with zero issues across all categories, THE Mode_Validator SHALL exit with code 0 and print a summary line to stdout indicating all checks passed
3. WHEN the Mode_Validator completes with one or more issues, THE Mode_Validator SHALL exit with code 1 and print a summary table to stdout showing counts per category
4. THE Mode_Validator SHALL support a `--report-only` flag that writes the Validation_Report JSON file but always exits with code 0, for use in non-blocking CI stages
5. THE Mode_Validator SHALL complete execution within 5 seconds for a repository with up to 500 tokens across all collections

### Requirement 9: CI Pipeline Integration

**User Story:** As a design system maintainer, I want mode validation to run as part of the CI check, so that mode issues are caught before merging.

#### Acceptance Criteria

1. WHEN `npm run ci:check` is executed, THE CI pipeline SHALL include `npm run validate:modes` as a validation step after `npm run tokens:validate`
2. WHEN the Mode_Validator exits with code 1 during CI, THE CI pipeline SHALL fail the check and surface the Validation_Report summary in the output

### Requirement 10: Multi-Brand Mode Validation

**User Story:** As a design system maintainer, I want the validator to check mode correctness across all configured brands, so that brand-specific token overrides do not break dark mode for any brand.

#### Acceptance Criteria

1. WHEN the Mode_Validator is invoked, THE Mode_Validator SHALL discover all Brand_Token_Files matching `dist/tokens/css/themes-brands.tokens.brand-*.css` and validate mode correctness for each brand independently
2. WHEN a Contrast_Violation or Unresolved_Mode_Reference is specific to a single brand (due to brand-specific token overrides), THE Mode_Validator SHALL include the brand identifier in the report entry
3. THE Mode_Validator SHALL validate that brand and mode remain orthogonal: a brand token override SHALL resolve correctly in both light and dark modes without requiring mode-specific brand overrides
