# Implementation Plan: Code Connect All Components

## Overview

Systematically create and audit Figma Code Connect schemas for all UI Foundations components. The implementation proceeds in phases: discover missing node IDs from Figma, create new schemas (Switch, Link), audit/fix existing schemas (Button, ButtonGroup), validate all schemas compile and pass dry-run, then publish to Figma.

## Tasks

- [ ] 1. Discover missing Figma node IDs for Switch and Link
  - [ ] 1.1 Discover Switch component set node IDs from Figma
    - Use Figma MCP tools (`get_metadata`) on file `uqMsy8fV1fPbQdAzgwlmBA` to find the Switch standalone and Switch field component set node IDs
    - Verify each node is a Component Set (not an individual variant) using `get_design_context`
    - Record node IDs in hyphen format for use in `figma.connect()` URLs
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 1.2 Discover Link component set node ID from Figma
    - Use Figma MCP tools (`get_metadata`) on file `uqMsy8fV1fPbQdAzgwlmBA` to find the Link component set node ID
    - Verify the node is a Component Set using `get_design_context`
    - Record node ID in hyphen format
    - _Requirements: 5.1, 5.3_

  - [ ] 1.3 Discover variant properties for Switch and Link
    - Call `get_context_for_code_connect` with the discovered node IDs to extract property definitions (names, types, variant options)
    - Document the exact Figma property names and values for mapping to `figma.enum()`, `figma.boolean()`, and `figma.string()` calls
    - _Requirements: 1.1, 2.1_

- [ ] 2. Create Switch schema (new)
  - [ ] 2.1 Create `schemas/web-switch.ts` props interface file
    - Export `SwitchProps` interface with: `className: string`, `checked: string`, `disabled: boolean`, `ariaChecked: string`, `ariaLabel: string`
    - Export `SwitchFieldProps` interface with: `wrapperClassName: string`, `className: string`, `checked: string`, `disabled: boolean`, `text: string`
    - Use `string` for className/enum-derived values, `boolean` for `figma.boolean()` values
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 2.2 Create `schemas/web-switch.figma.ts` standalone schema
    - Import `figma, { html }` from `@figma/code-connect/html` and `SwitchProps` from `./web-switch`
    - First `figma.connect()` call using the discovered standalone Switch node ID
    - Map Checked (Unchecked → undefined, Checked → `is-checked`), State (Default → undefined, Hover → `is-hover`, Active → `is-active`), Disabled (True/true → `is-disabled`, False/false → undefined) via `figma.className()`
    - Output `<input type="checkbox" role="switch">` with `class`, `checked`, `disabled`, `aria-checked`, `aria-label` attributes
    - Handle both capitalized and lowercase boolean enum values for Disabled
    - _Requirements: 1.1, 1.2, 1.4, 6.1, 6.2, 6.3, 8.1, 8.4_

  - [ ] 2.3 Add Switch field wrapper schema to `schemas/web-switch.figma.ts`
    - Second `figma.connect()` call using the discovered Switch field node ID
    - Map Is Disabled (True/true → `is-disabled`, False/false → undefined) for wrapper class
    - Output `<label class="switch-field">` containing the switch input and `<span class="switch-field__text">`
    - Follow the same compound pattern as `web-checkbox.figma.ts`
    - _Requirements: 1.3, 1.4, 5.2, 8.1_

  - [ ]* 2.4 Write property tests for Switch schema
    - **Property 2: CSS Class Mapping Correctness** — verify `figma.className()` starts with `"switch"`, default maps to `undefined`, states map to `is-*`
    - **Property 3: Boolean Enum Casing Consistency** — verify Disabled mapping includes both `True`/`true` and `False`/`false` keys
    - **Property 5: HTML Output Structure Correctness** — verify root element is `<input>` with `role="switch"`
    - **Validates: Requirements 1.1, 1.4, 6.1, 6.2, 6.3**

- [ ] 3. Create Link schema (new)
  - [ ] 3.1 Create `schemas/web-link.ts` props interface file
    - Export `LinkProps` interface with: `className: string`, `href: string`, `text: string`, `ariaDisabled: string | undefined`, `tabindex: string | undefined`
    - _Requirements: 2.4, 4.1, 4.3_

  - [ ] 3.2 Create `schemas/web-link.figma.ts` schema
    - Import `figma, { html }` from `@figma/code-connect/html` and `LinkProps` from `./web-link`
    - `figma.connect()` call using the discovered Link node ID
    - Map State (Default → undefined, Hover → `is-hover`, Active → `is-active`, Visited → `is-visited`, Disabled → `is-disabled`) via `figma.className()`
    - Output `<a>` element with `href`, `class`, text content, conditional `aria-disabled="true"` and `tabindex="-1"` when disabled
    - _Requirements: 2.1, 2.2, 2.3, 6.1, 6.2, 6.3, 8.5_

  - [ ]* 3.3 Write property tests for Link schema
    - **Property 2: CSS Class Mapping Correctness** — verify `figma.className()` starts with `"link"`, default maps to `undefined`
    - **Property 5: HTML Output Structure Correctness** — verify root element is `<a>`
    - **Property 6: Accessibility Attribute Completeness** — verify disabled state includes `aria-disabled="true"`
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [ ] 4. Checkpoint - Verify new schemas compile
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Audit and fix Button schema
  - [ ] 5.1 Rewrite `schemas/web-button.ts` props interface
    - Replace React-typed interface with plain Code Connect props: `className: string`, `disabled: boolean`, `text: string`, `ariaLabel: string | undefined`
    - Remove all `React.ReactNode`, union type, and optional marker patterns
    - _Requirements: 3.1, 3.4, 4.1, 4.3_

  - [ ] 5.2 Update `schemas/web-button.figma.ts` to use `figma.string()` for text
    - Replace hardcoded `"Book now"` text with `figma.string("Label")` or the correct Figma text property name
    - Ensure Disabled enum includes both capitalized and lowercase mappings (`True`/`true` → `is-disabled`)
    - Verify `aria-label` is included for icon-only variant
    - _Requirements: 3.2, 3.3, 6.4, 8.1_

  - [ ]* 5.3 Write property tests for Button schema
    - **Property 1: Schema Structural Consistency** — verify import pattern and props interface import
    - **Property 3: Boolean Enum Casing Consistency** — verify Disabled/Icon Only mappings include both casings
    - **Property 4: Props Interface Completeness** — verify all destructured props exist in interface
    - **Validates: Requirements 3.1, 3.2, 3.4, 4.1**

- [ ] 6. Audit and fix ButtonGroup schema
  - [ ] 6.1 Rewrite `schemas/web-button-group.ts` props interface
    - Replace React-typed interface with plain Code Connect props: `orientation: string`, `attached: string`
    - Remove `React.ReactNode`, optional markers, and union types not used in the schema
    - _Requirements: 3.1, 3.4, 4.1_

  - [ ] 6.2 Verify `schemas/web-button-group.figma.ts` consistency
    - Confirm `role="group"` and `aria-label` are present in the example output
    - Confirm enum mappings follow the canonical pattern with both casings for Attached
    - _Requirements: 3.1, 3.2, 8.4_

  - [ ]* 6.3 Write property tests for ButtonGroup schema
    - **Property 1: Schema Structural Consistency** — verify import pattern
    - **Property 4: Props Interface Completeness** — verify all destructured props exist in interface
    - **Property 7: Node ID URL Format Correctness** — verify `node-id` uses hyphen format
    - **Validates: Requirements 3.1, 3.4, 5.3**

- [ ] 7. Checkpoint - Verify all audited schemas compile
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Validate all schemas
  - [ ] 8.1 Run TypeScript compilation on all schema files
    - Execute `npx tsc --noEmit` targeting all `schemas/web-*.figma.ts` and `schemas/web-*.ts` files
    - Fix any type errors between schema files and their props interfaces
    - _Requirements: 7.1_

  - [ ] 8.2 Run publish dry-run to validate against Figma
    - Execute `npx figma connect publish --dry-run` to verify all schemas are valid without actually publishing
    - Confirm no invalid node ID references are reported
    - Fix any errors reported by the dry-run
    - _Requirements: 7.2, 7.3_

  - [ ]* 8.3 Run property tests across all schema files
    - **Property 1: Schema Structural Consistency** — all files start with correct import, all import props from companion file
    - **Property 7: Node ID URL Format Correctness** — all `figma.connect()` URLs use hyphen-separated node IDs
    - **Property 8: File Location Correctness** — all components have both `.figma.ts` and `.ts` files in `schemas/`
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**

- [ ] 9. Publish schemas to Figma
  - [ ] 9.1 Publish all Code Connect schemas to the Figma team library
    - Execute `npx figma connect publish` to register all mappings with the Figma file
    - Verify the command completes successfully with no errors
    - Confirm all components are registered (Button, ButtonGroup, Input, Checkbox, Radio, Switch, Badge, Icon, Label, Divider, Link, Form)
    - _Requirements: 7.1, 7.2_

- [ ] 10. Final checkpoint - Verify publication
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The Checkbox, Radio, Badge, Icon, Label, Divider, Input, and Form schemas are already consistent with the canonical pattern per the design audit — no changes needed
- Node IDs for Switch and Link must be discovered from Figma before schema creation can begin
- The `FIGMA_ACCESS_TOKEN` environment variable must be set for publish commands

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3"] },
    { "id": 2, "tasks": ["2.1", "3.1"] },
    { "id": 3, "tasks": ["2.2", "3.2"] },
    { "id": 4, "tasks": ["2.3", "2.4", "3.3"] },
    { "id": 5, "tasks": ["5.1", "6.1"] },
    { "id": 6, "tasks": ["5.2", "5.3", "6.2", "6.3"] },
    { "id": 7, "tasks": ["8.1"] },
    { "id": 8, "tasks": ["8.2", "8.3"] },
    { "id": 9, "tasks": ["9.1"] }
  ]
}
```
