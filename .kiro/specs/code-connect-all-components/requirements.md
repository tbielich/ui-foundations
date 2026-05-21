# Requirements Document

## Introduction

Systematically add Figma Code Connect schemas for all existing UI Foundations components. Code Connect links Figma component variants to production HTML/CSS code snippets so developers inspecting components in Figma see the correct markup, classes, and accessibility attributes. This spec covers auditing existing schemas, creating missing ones, and ensuring consistency across the full component set.

## Glossary

- **Code_Connect**: A Figma integration that maps design component variants to code snippets displayed in the Figma Dev Mode inspect panel.
- **Schema_File**: A TypeScript file in `schemas/` following the naming convention `web-<component>.figma.ts` that defines the Code Connect mapping for a component.
- **Props_Interface**: A TypeScript interface in `schemas/web-<component>.ts` that types the props passed to the Code Connect example template.
- **Variant_Property**: A Figma component property (e.g. State, Disabled, Checked) that controls which visual variant is displayed.
- **Component_Set**: The top-level Figma node that groups all variants of a component; its node ID is used in Code Connect registrations.
- **Figma_File**: The UI Foundations Figma design file at `https://www.figma.com/design/uqMsy8fV1fPbQdAzgwlmBA/UI-Foundations`.
- **CSS_Class_Mapping**: The translation of Figma variant property values to CSS class names using `figma.className([...])`.
- **Field_Pattern**: A compound component pattern where a control (checkbox, radio, switch) is wrapped in a `<label>` with a text span, following the `*-field` class convention.
- **Publishing**: The act of pushing Code Connect schemas to the Figma team library so they appear in Dev Mode for all team members.

## Requirements

### Requirement 1: Switch Schema Creation

**User Story:** As a developer inspecting the Switch component in Figma, I want to see the correct HTML and CSS classes, so that I can implement the switch without guessing the markup structure.

#### Acceptance Criteria

1. WHEN the Switch component set exists in the Figma_File, THE Schema_File `web-switch.figma.ts` SHALL map all Variant_Property values (Checked, State, Disabled) to the corresponding CSS classes (`is-checked`, `is-hover`, `is-active`, `is-disabled`).
2. THE Schema_File for Switch SHALL produce an `<input type="checkbox" role="switch">` element with the correct `class`, `checked`, `disabled`, and `aria-checked` attributes.
3. WHEN the Switch has a Field_Pattern variant in the Figma_File, THE Schema_File SHALL include a second `figma.connect()` call mapping the switch-field wrapper with `<label>`, the switch input, and a `<span class="switch-field__text">` for the label text.
4. THE Schema_File SHALL handle both capitalized and lowercase boolean enum values for the Disabled property.

### Requirement 2: Link Schema Creation

**User Story:** As a developer inspecting the Link component in Figma, I want to see the correct anchor markup and state classes, so that I can implement accessible links consistently.

#### Acceptance Criteria

1. WHEN the Link component set exists in the Figma_File, THE Schema_File `web-link.figma.ts` SHALL map all Variant_Property values (State: Default, Hover, Active, Visited, Disabled) to the corresponding CSS classes.
2. THE Schema_File for Link SHALL produce an `<a>` element with `href`, `class`, and text content attributes.
3. WHEN the Disabled variant is active, THE Schema_File SHALL include `aria-disabled="true"` and `tabindex="-1"` in the example output.
4. THE Schema_File SHALL include a Props_Interface file `web-link.ts` following the established pattern.

### Requirement 3: Existing Schema Audit and Update

**User Story:** As a design system maintainer, I want all existing Code Connect schemas to be consistent with the canonical pattern, so that the developer experience is uniform across all components.

#### Acceptance Criteria

1. THE Schema_File for each existing component (Button, ButtonGroup, Input, Checkbox, Radio, Badge, Icon, Label, Divider, Form) SHALL follow the same structural conventions as `web-checkbox.figma.ts` and `web-radio.figma.ts`.
2. WHEN a Schema_File uses `figma.enum()` for a boolean-like property (Disabled, Checked), THE Schema_File SHALL include both capitalized and lowercase value mappings (e.g. `{ True: "is-disabled", true: "is-disabled" }`).
3. WHEN a component has accessibility-relevant state (checked, disabled, expanded), THE Schema_File SHALL include the corresponding ARIA attributes (`aria-checked`, `aria-disabled`, `aria-label`) in the example output.
4. THE Schema_File for each component SHALL import its Props_Interface from the corresponding `web-<component>.ts` file.

### Requirement 4: Props Interface Completeness

**User Story:** As a developer working on Code Connect schemas, I want typed Props interfaces for every component, so that schema files have compile-time safety.

#### Acceptance Criteria

1. FOR ALL components with a Schema_File, THE Props_Interface file `web-<component>.ts` SHALL export a typed interface covering every prop used in the `figma.connect()` example function.
2. WHEN a component has both a standalone and a Field_Pattern variant, THE Props_Interface file SHALL export separate interfaces for each (e.g. `SwitchProps` and `SwitchFieldProps`).
3. THE Props_Interface SHALL use `string` for className and enum-derived values, `boolean` for `figma.boolean()` values, and `string | undefined` for optional ARIA attributes.

### Requirement 5: Node ID Accuracy

**User Story:** As a design system maintainer, I want each Code Connect schema to reference the correct Figma node ID, so that the mapping registers against the published component set.

#### Acceptance Criteria

1. THE Schema_File for each component SHALL reference the Component_Set node ID from the Figma_File (not an individual variant node ID).
2. WHEN a component has multiple component sets (e.g. standalone control and field wrapper), THE Schema_File SHALL include separate `figma.connect()` calls with distinct node IDs for each component set.
3. THE node ID in the Figma URL SHALL use hyphen format (e.g. `node-id=2329-241`) as required by the Code Connect URL convention.

### Requirement 6: CSS Class Mapping Accuracy

**User Story:** As a developer, I want the Code Connect snippet to show the exact CSS classes used in the pattern file, so that I can copy-paste the output into my project.

#### Acceptance Criteria

1. THE CSS_Class_Mapping in each Schema_File SHALL use bare component names matching the CSS pattern file (e.g. `button`, `checkbox`, `switch`) without prefixes or namespaces.
2. WHEN a Variant_Property value represents the default state, THE CSS_Class_Mapping SHALL map it to `undefined` so no extra class is added.
3. THE CSS_Class_Mapping SHALL produce state classes matching the CSS pattern file conventions: `is-hover`, `is-active`, `is-checked`, `is-disabled`, `is-indeterminate`, `is-focus-visible`.
4. WHEN a component has variant-specific modifiers (e.g. Button `outline`, `ghost`; Badge `brand`, `success`, `danger`), THE CSS_Class_Mapping SHALL map those variant values to the modifier class names used in the CSS pattern file.

### Requirement 7: Publishing Readiness

**User Story:** As a design system maintainer, I want all schemas to be publishable to the Figma team library, so that developers see code snippets in Dev Mode.

#### Acceptance Criteria

1. THE Schema_File for each component SHALL be syntactically valid TypeScript that compiles without errors when processed by the `@figma/code-connect` toolchain.
2. WHEN all Schema_Files are complete, THE system SHALL support running a publish command (e.g. `npx figma connect publish`) that registers all mappings with the Figma_File.
3. IF a Schema_File references a node ID that does not exist in the published Figma team library, THEN THE system SHALL report a clear error identifying the invalid node reference.

### Requirement 8: Accessibility Attribute Coverage

**User Story:** As a developer, I want Code Connect snippets to include accessibility attributes, so that I produce accessible markup by default.

#### Acceptance Criteria

1. WHEN a component is a form control (Checkbox, Radio, Switch, Input), THE Schema_File SHALL include `aria-label` or demonstrate label association in the example output.
2. WHEN a component has a tri-state (Checkbox indeterminate), THE Schema_File SHALL include `aria-checked="mixed"` for the indeterminate state.
3. WHEN a component is decorative (Icon), THE Schema_File SHALL include `aria-hidden="true"` in the example output.
4. WHEN a component uses `role` to override native semantics (Switch using `role="switch"`, ButtonGroup using `role="group"`), THE Schema_File SHALL include the `role` attribute in the example output.
5. WHEN a Link is disabled, THE Schema_File SHALL include `aria-disabled="true"` in the example output.

### Requirement 9: Consistent File Structure

**User Story:** As a contributor, I want a predictable file structure for all Code Connect schemas, so that I can find and maintain them easily.

#### Acceptance Criteria

1. THE Schema_File for each component SHALL be located at `schemas/web-<component>.figma.ts`.
2. THE Props_Interface for each component SHALL be located at `schemas/web-<component>.ts`.
3. THE Schema_File SHALL use the import statement `import figma, { html } from "@figma/code-connect/html"` as its first line.
4. THE Schema_File SHALL import its Props_Interface from the relative path `./web-<component>`.
