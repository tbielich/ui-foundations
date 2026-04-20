---
inclusion: fileMatch
fileMatchPattern: "figma/connections/**"
---

# Code Connect Rules

When working with files in `figma/connections/`, these rules apply:

## File Convention
- Filename: `web-<component>.figma.ts`
- Import: `import figma, { html } from "@figma/code-connect/html";`

## Node ID Format
- Figma URLs use `node-id=1-2` (hyphen)
- Code Connect uses `1:2` (colon) internally, but URLs use hyphens
- Always use the URL format in `figma.connect()` first argument

## Props Mapping
- Use `figma.className([...])` for CSS class composition
- Use `figma.enum()` for variant properties (State, Checked, Disabled)
- Use `figma.boolean()` for boolean properties
- Use `figma.string()` for text properties
- Handle both capitalized and lowercase enum values: `{ True: "is-disabled", true: "is-disabled" }`

## HTML Class Names
- Use bare component name in examples: `class="radio"` not `class="ui-radio"`
- Field wrapper: `class="radio-field"`, text span: `class="radio-field__text"`

## Publishing Requirement
- Components must be published to the team library before Code Connect mappings can be registered in Figma
- Node IDs come from the Figma component set, not individual variants

## Reference
- See `figma/connections/web-checkbox.figma.ts` and `web-radio.figma.ts` for the canonical pattern
