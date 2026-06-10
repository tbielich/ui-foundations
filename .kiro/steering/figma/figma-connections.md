---
inclusion: fileMatch
fileMatchPattern: "schemas/**"
---

# Code Connect Rules

When working with files in `schemas/`, these rules apply:

## File Convention
- Filename: `web-<component>.figma.ts`
- Import: `import figma, { html } from "@figma/code-connect/html";`

## Node ID Format
- Figma URLs use `node-id=1-2` (hyphen)
- Code Connect uses `1:2` (colon) internally, but URLs use hyphens
- Always use the URL format in `figma.connect()` first argument

## Props Mapping
- Use `figma.className([...])` for CSS class composition
- Use `figma.enum()` for variant properties with 3+ values (State, Checked, Variant)
- Use `figma.boolean()` for boolean variant properties (Disabled, Open, Selected, Attached, Has Text)
- Use `figma.string()` for text properties
- Never use `figma.enum()` for True/False-only properties — always use `figma.boolean()`

## Boolean vs Enum Rule (CRITICAL)
- If a Figma variant property has exactly two values `True`/`False`, it is a **boolean** → use `figma.boolean("Prop", { true: "class", false: undefined })`
- If a property has 3+ values (e.g. Default/Hover/Active), it is an **enum** → use `figma.enum("Prop", { ... })`
- Never write `figma.enum("Disabled", { True: ..., true: ..., False: ..., false: ... })` — this is always wrong
- The `{ true: ..., false: ... }` object in `figma.boolean()` uses lowercase keys only

## HTML Class Names
- Use bare component name in examples: `class="radio"` not `class="ui-radio"`
- Field wrapper: `class="radio-field"`, text span: `class="radio-field__text"`

## Publishing Requirement
- Components must be published to the team library before Code Connect mappings can be registered in Figma
- Node IDs come from the Figma component set, not individual variants

## Reference
- See `schemas/web-checkbox.figma.ts` and `web-radio.figma.ts` for the canonical pattern