# Requirements Document

## Introduction

Token Drift Detection is a planned automated system that detects divergence between Figma token exports (`figma/exports/*.tokens.json`) and the generated code artifacts (`dist/tokens/`) consumed by components (`src/ui/patterns/*.css`). The system will ensure that the single source of truth (Figma) stays faithfully represented across all generated CSS, TypeScript, and JSON outputs, and that component CSS only references tokens that actually exist.

The project currently has `extract-tokens.js` (which reports missing alias targets) and `validate-tokens.mjs` (which checks JSON schema compliance), but neither performs systematic drift detection across the full pipeline: Figma export → generated dist → component consumption.

## Glossary

- **Drift_Detector**: The Node.js script (`scripts/detect-token-drift.mjs`) that performs all drift analysis
- **Figma_Export**: A JSON file in `figma/exports/` containing token definitions exported from Figma Variables, following the DTCG-like schema with `$type`, `$value`, and `$extensions` (including `com.figma.codeSyntax.WEB`)
- **Generated_Artifact**: A file in `dist/tokens/` (CSS, JSON, or TypeScript) produced by `extract-tokens.js` from Figma exports
- **Component_CSS**: A CSS file in `src/ui/patterns/` that consumes tokens via `var(--token-name)` references
- **Token_Name**: The CSS custom property name (e.g. `--button-solid-border-color-default`) derived from the Figma variable path and `codeSyntax.WEB` value
- **Alias_Target**: A token referenced via `$ref` in a Figma export (e.g. `Color/Border/Brand`), pointing to a token in another collection
- **Orphaned_Token**: A token present in generated code but absent from the corresponding Figma export
- **Missing_Token**: A token present in a Figma export but absent from the corresponding generated artifact
- **Naming_Mismatch**: A discrepancy between the `codeSyntax.WEB` value in a Figma export and the CSS custom property name in the generated CSS
- **Value_Drift**: A difference between the resolved `$value` (or alias `$ref`) in a Figma export and the value assigned in the generated CSS/JSON
- **Coverage_Gap**: A component that lacks one or more expected interaction states (default, hover, active, focus, disabled) for a given property
- **Drift_Report**: The structured JSON output produced by the Drift_Detector summarizing all detected issues
- **Token_Layer**: One of the four architectural layers: Core (Primitives), Color Modes (Appearance), Semantics (Roles), Components (UI)

## Requirements

### Requirement 1: Figma Export Parsing

**User Story:** As a design system maintainer, I want the drift detector to parse all Figma token export files, so that it has a complete inventory of the source-of-truth tokens.

#### Acceptance Criteria

1. WHEN the Drift_Detector is invoked, THE Drift_Detector SHALL read all JSON files matching `figma/exports/*.tokens.json` and parse each token node that contains `$type`, `$value`, and `$extensions` fields
2. WHEN a Figma_Export contains a `com.figma.codeSyntax.WEB` extension, THE Drift_Detector SHALL extract the Token_Name from that extension value
3. WHEN a Figma_Export contains a `$value` with a `$ref` field, THE Drift_Detector SHALL record the Alias_Target reference for later cross-collection validation
4. IF a Figma_Export file cannot be parsed as valid JSON, THEN THE Drift_Detector SHALL report the file path and parsing error in the Drift_Report and continue processing remaining files
5. FOR ALL valid token nodes parsed from Figma exports, parsing then serializing the token inventory then parsing it again SHALL produce an equivalent token inventory (round-trip property)

### Requirement 2: Generated Artifact Parsing

**User Story:** As a design system maintainer, I want the drift detector to parse all generated token files, so that it can compare them against Figma exports.

#### Acceptance Criteria

1. WHEN the Drift_Detector is invoked, THE Drift_Detector SHALL read all CSS files in `dist/tokens/css/` and extract CSS custom property declarations (name and value pairs)
2. WHEN the Drift_Detector is invoked, THE Drift_Detector SHALL read all JSON files in `dist/tokens/json/` and extract token definitions
3. IF a Generated_Artifact file is missing or unreadable, THEN THE Drift_Detector SHALL report the file path and error in the Drift_Report and continue processing remaining files

### Requirement 3: Missing Token Detection

**User Story:** As a design system maintainer, I want to know when a token exists in Figma but is missing from generated code, so that I can regenerate or fix the pipeline.

#### Acceptance Criteria

1. WHEN a token exists in a Figma_Export but the corresponding Token_Name is absent from the matching Generated_Artifact CSS file, THE Drift_Detector SHALL report it as a Missing_Token in the Drift_Report
2. WHEN a Missing_Token is detected, THE Drift_Detector SHALL include the Figma variable path, the expected Token_Name, and the source Figma_Export file name in the report entry
3. THE Drift_Detector SHALL classify each Missing_Token by its Token_Layer (Core, Color Modes, Semantics, or Components)

### Requirement 4: Orphaned Token Detection

**User Story:** As a design system maintainer, I want to know when a token exists in generated code but not in Figma, so that I can remove stale tokens.

#### Acceptance Criteria

1. WHEN a CSS custom property exists in a Generated_Artifact but no corresponding token exists in any Figma_Export, THE Drift_Detector SHALL report it as an Orphaned_Token in the Drift_Report
2. WHEN an Orphaned_Token is detected, THE Drift_Detector SHALL include the Token_Name, the Generated_Artifact file path, and the Token_Layer in the report entry
3. THE Drift_Detector SHALL exclude CSS custom properties that are not design tokens (e.g. browser defaults, local component overrides not following the token naming convention)

### Requirement 5: Naming Mismatch Detection

**User Story:** As a design system maintainer, I want to detect when the CSS variable name in generated code does not match the `codeSyntax.WEB` value from Figma, so that code references stay aligned with Figma.

#### Acceptance Criteria

1. WHEN a token in a Figma_Export has a `codeSyntax.WEB` value that differs from the CSS custom property name used in the corresponding Generated_Artifact, THE Drift_Detector SHALL report it as a Naming_Mismatch in the Drift_Report
2. WHEN a Naming_Mismatch is detected, THE Drift_Detector SHALL include the Figma variable path, the expected name from `codeSyntax.WEB`, and the actual name found in the Generated_Artifact
3. THE Drift_Detector SHALL perform case-insensitive comparison after normalizing both names to kebab-case with `--` prefix to avoid false positives from trivial formatting differences

### Requirement 6: Value Drift Detection

**User Story:** As a design system maintainer, I want to detect when a token's value in generated code does not match the Figma export, so that visual regressions are caught before they reach components.

#### Acceptance Criteria

1. WHEN a token in a Figma_Export has a `$ref` alias and the corresponding Generated_Artifact CSS value does not reference the expected semantic token via `var(--...)`, THE Drift_Detector SHALL report it as a Value_Drift in the Drift_Report
2. WHEN a token in a Figma_Export has a literal `$value` (non-alias) and the corresponding Generated_Artifact value differs after unit normalization, THE Drift_Detector SHALL report it as a Value_Drift in the Drift_Report
3. WHEN a Value_Drift is detected, THE Drift_Detector SHALL include the Figma variable path, the expected value, the actual value, and the Token_Layer in the report entry

### Requirement 7: Broken Alias Detection

**User Story:** As a design system maintainer, I want to detect when a token references an alias target that does not exist in any Figma export collection, so that broken references are caught early.

#### Acceptance Criteria

1. WHEN a token in a Figma_Export has a `$ref` pointing to an Alias_Target that does not exist in any loaded Figma_Export collection, THE Drift_Detector SHALL report it as a broken alias in the Drift_Report
2. WHEN a broken alias is detected, THE Drift_Detector SHALL include the referencing token path, the missing Alias_Target path, and the expected target collection name from `aliasData.targetVariableSetName`
3. THE Drift_Detector SHALL cross-reference alias targets across all five Figma_Export collections (Core Primitives, Appearance Modes, Semantics Roles, Components UI, Themes Brands)

### Requirement 8: Component CSS Token Reference Validation

**User Story:** As a design system maintainer, I want to detect when component CSS files reference tokens that do not exist in any generated artifact, so that broken `var()` references are caught.

#### Acceptance Criteria

1. WHEN a Component_CSS file contains a `var(--token-name)` reference where the token name does not exist in any Generated_Artifact CSS file, THE Drift_Detector SHALL report it as an unresolved reference in the Drift_Report
2. WHEN an unresolved reference is detected, THE Drift_Detector SHALL include the Component_CSS file path, the line number, and the unresolved Token_Name
3. THE Drift_Detector SHALL scan all CSS files matching `src/ui/patterns/*.css` for `var(--...)` references
4. THE Drift_Detector SHALL ignore `var()` references that include a fallback value as their second argument, since these are intentionally self-resolving

### Requirement 9: State Coverage Gap Detection

**User Story:** As a design system maintainer, I want to detect when a component token set is missing expected interaction states, so that incomplete token definitions are caught before they cause visual inconsistencies.

#### Acceptance Criteria

1. WHEN a component token group in a Figma_Export defines tokens for some interaction states (from the set: default, hover, active, focus, disabled) but omits others for the same variant-part-property combination, THE Drift_Detector SHALL report it as a Coverage_Gap in the Drift_Report
2. WHEN a Coverage_Gap is detected, THE Drift_Detector SHALL include the component name, variant, part, property, the states that are present, and the states that are missing
3. THE Drift_Detector SHALL use the naming convention `Component.variant.part.property.state` from Foundation-002 to identify state groups

### Requirement 10: Drift Report Output

**User Story:** As a design system maintainer, I want the drift detector to produce a structured, machine-readable report, so that CI pipelines and agents can consume the results.

#### Acceptance Criteria

1. THE Drift_Detector SHALL write the Drift_Report as a JSON file to `dist/tokens/drift-report.json`
2. THE Drift_Report SHALL contain separate arrays for each drift category: `missingTokens`, `orphanedTokens`, `namingMismatches`, `valueDrifts`, `brokenAliases`, `unresolvedReferences`, and `coverageGaps`
3. THE Drift_Report SHALL include a `summary` object with counts for each drift category and a boolean `hasDrift` field that is `true` when any category has one or more entries
4. THE Drift_Report SHALL include a `metadata` object with the generation timestamp, the list of Figma_Export files processed, and the list of Generated_Artifact files processed
5. FOR ALL valid Drift_Reports, parsing the JSON then stringifying then parsing again SHALL produce an equivalent object (round-trip property)

### Requirement 11: CLI Integration

**User Story:** As a design system maintainer, I want to run drift detection as an npm script, so that it integrates with the existing build and CI workflow.

#### Acceptance Criteria

1. THE Drift_Detector SHALL be executable via `npm run tokens:drift` as a new script in `package.json`
2. WHEN the Drift_Detector completes with zero drift issues, THE Drift_Detector SHALL exit with code 0 and print a summary line to stdout
3. WHEN the Drift_Detector completes with one or more drift issues, THE Drift_Detector SHALL exit with code 1 and print a summary table to stdout showing counts per category
4. THE Drift_Detector SHALL support a `--json-only` flag that suppresses stdout output and only writes the Drift_Report JSON file
5. THE Drift_Detector SHALL complete execution within 5 seconds for a repository with up to 500 tokens across all collections

### Requirement 12: CI Pipeline Integration

**User Story:** As a design system maintainer, I want drift detection to run as part of the CI check, so that drift is caught before merging.

#### Acceptance Criteria

1. WHEN `npm run ci:check` is executed, THE CI pipeline SHALL include `npm run tokens:drift` as a validation step after `npm run tokens:validate`
2. WHEN the Drift_Detector exits with code 1 during CI, THE CI pipeline SHALL fail the check and surface the Drift_Report summary in the output

### Requirement 13: Layer Violation Detection

**User Story:** As a design system maintainer, I want to detect when component tokens reference tokens outside the allowed layers, so that the Core → Semantic → Component architecture is enforced.

#### Acceptance Criteria

1. WHEN a Components (UI) token has an Alias_Target that references another Components (UI) token instead of a Semantic or Core token, THE Drift_Detector SHALL report it as a layer violation in the Drift_Report
2. WHEN a Semantics (Roles) token has an Alias_Target that references a Components (UI) token, THE Drift_Detector SHALL report it as a layer violation in the Drift_Report
3. WHEN a layer violation is detected, THE Drift_Detector SHALL include the violating token path, the target token path, the source Token_Layer, and the target Token_Layer
