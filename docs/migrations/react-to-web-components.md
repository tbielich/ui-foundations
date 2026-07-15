# React wrappers to Web Components

**Release boundary:** v1.0  
**Tracking issue:** [#159](https://github.com/tbielich/ui-foundations/issues/159)  
**Namespace authority:** `docs/adr/adr-uif-public-api-namespace.md`

UI Foundations v1 removes the deprecated `ui-foundations/react` aggregate
entry point and every `ui-foundations/react/*` component entry point. This is
an intentional breaking change. CSS, token, macro, asset, and Web Component
entry points remain available.

Do not add a React shim or a deprecated re-export. Consumers can use the
framework-neutral light-DOM Custom Elements or author the documented semantic
HTML and public CSS classes directly.

## Import mapping

The module paths below are the component-specific alternatives. Import
`ui-foundations/elements` once to register every available Custom Element.

| Removed import | Replacement import | Exports and authored markup |
|---|---|---|
| `ui-foundations/react` | `ui-foundations/elements` | Aggregate registration; see the component rows below. |
| `ui-foundations/react/accordion` | `ui-foundations/elements/ui-accordion` | `Accordion`, `AccordionItem` → `<uif-accordion>`, `<uif-accordion-item>` |
| `ui-foundations/react/avatar` | `ui-foundations/elements/ui-avatar` | `Avatar` → `<uif-avatar>` |
| `ui-foundations/react/badge` | `ui-foundations/elements/ui-badge` | `Badge` → `<uif-badge>` |
| `ui-foundations/react/button` | `ui-foundations/elements/ui-button` | `Button`, `ButtonGroup` → `<uif-button>`, `<uif-button-group>` |
| `ui-foundations/react/checkbox` | `ui-foundations/elements/ui-checkbox` | `Checkbox` → `<uif-checkbox>` |
| `ui-foundations/react/divider` | `ui-foundations/elements/ui-divider` | `Divider` → `<uif-divider>` |
| `ui-foundations/react/icon` | `ui-foundations/elements/ui-icon` | `Icon` → `<uif-icon>` |
| `ui-foundations/react/input` | `ui-foundations/elements/ui-input` | `Input` → `<uif-input>` |
| `ui-foundations/react/label` | `ui-foundations/elements/ui-label` | `FieldLabel` → `<uif-field-label>`; `LabelContent` has no standalone Custom Element. |
| `ui-foundations/react/radio` | `ui-foundations/elements/ui-radio` | `Radio` → `<uif-radio>` |
| `ui-foundations/react/switch` | `ui-foundations/elements/ui-switch` | `Switch` → `<uif-switch>` |
| `ui-foundations/react/tabs` | `ui-foundations/elements/ui-tabs` | `TabList`, `Tab`, `TabPanel` → `<uif-tab-list>`, `<uif-tab>`, `<uif-tab-panel>` |
| `ui-foundations/react/textarea` | `ui-foundations/elements/ui-textarea` | `TextArea` → `<uif-textarea>` |
| `ui-foundations/react/tooltip` | `ui-foundations/elements/ui-tooltip` | `Tooltip` → `<uif-tooltip>` |
| `ui-foundations/react/form` | `ui-foundations/elements/ui-form` | `Form` → `<uif-form>`; `FormGroup` → `<uif-form-group>`; `FormField` → `<uif-form-field>`; `FormHelper` → `<uif-form-helper>`; `FormActions` → `<uif-form-actions>`. |
| `ui-foundations/react/link` | `ui-foundations/elements/ui-link` | `Link` → `<uif-link>` |
| `ui-foundations/react/select` | `ui-foundations/elements/ui-select` | `Select` → `<uif-select>` |

`Calendar` was available only from the removed aggregate React entry. There is
no Calendar Custom Element entry point. Use the documented Calendar semantic
HTML and `.calendar*` CSS pattern until Calendar receives an approved Custom
Element API. `LabelContent` is likewise a composition helper: author the
documented label-content markup or use the Nunjucks macro instead of inventing
a Custom Element.

The approved v1 public namespace is `<uif-*>`. At the time this removal was
implemented, the element modules still registered the legacy `<ui-*>` tags.
The v1 namespace migration must register the canonical tags before the release
candidate. Do not interpret the legacy registrations as a compatibility
promise or invent dual registration; compatibility behavior requires separate
approval under the namespace migration.

## API differences

The Custom Elements are not React component adapters and are not one-to-one
prop replacements.

- **Attributes and properties:** pass documented primitive values as HTML
  attributes. Boolean attributes are true when present. Complex React values,
  refs, arbitrary prop spreading, and React nodes are not translated.
- **Events:** listen for native events with `addEventListener` or the consuming
  framework's Custom Element event syntax. Events from the light-DOM native
  controls bubble normally. The current elements do not synthesize React-style
  callbacks such as `onSelect` or `onMonthChange`.
- **Content:** child content is ordinary light-DOM content. Components that
  accept text read their text content; Select accepts native `option` and
  `optgroup` children. There is no shadow-DOM slot API.
- **Form association:** the current form controls render native inputs,
  textareas, selects, and buttons into light DOM. Read or focus the rendered
  native control when an imperative control API is needed. The Custom Element
  host is not form-associated and does not expose `ElementInternals`.
- **Accessibility:** continue to supply visible labels or `aria-label` /
  `aria-labelledby` as documented. Icon-only buttons require an accessible
  name. Do not move ARIA state to the host when the documented API expects it
  on the rendered native control.
- **Classes:** consumer `className` merging from React wrappers is gone. Apply
  public classes to authored semantic HTML, or use the documented Custom
  Element attributes. Remaining class migrations follow #145.

## Framework and rendering guidance

Import the element module only in a browser environment because registration
uses `HTMLElement` and `customElements`. In server-rendered applications, emit
the Custom Element markup during SSR and load the registration module from a
client entry point. Custom Element upgrade is the hydration mechanism; do not
ask React to hydrate the element's generated light-DOM internals.

React consumers can render standards-based Custom Element tags, but React
version and TypeScript configuration determine how custom attributes and event
types are expressed. Wrap a Custom Element locally only when an application
needs framework-specific typing or event adaptation; UI Foundations no longer
ships or owns that wrapper.

## Stable imports

These imports are unaffected by the React removal:

```css
@import "ui-foundations/core.css";
@import "ui-foundations/ui.css";
```

Token files, `ui-foundations/macros/ui.njk`, assets, and the documented element
entry points also remain public. Generated `dist/` artifacts are produced by
the build and must never be edited directly.
