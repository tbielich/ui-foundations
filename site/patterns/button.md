---
layout: layouts/docs.njk
title: Button
description: Buttons allow users to perform an action or navigate to another page. They have multiple variants for various needs and are ideal for calling attention to where a user needs to act.
navTitle: Button
order: 10
permalink: /patterns/button/
playgroundUrl: /patterns/button-playground/
playgroundLabel: Open Button Playground
---

{% import "macros/ui.njk" as uif %}

<div class="docs-hero">
  <div class="docs-hero-preview">
    <div class="docs-hero-preview-controls">
      <span class="docs-hero-switch" data-hero-group="brand">
        <button type="button" data-hero-brand="a" aria-pressed="true">Brand A</button>
        <button type="button" data-hero-brand="b" aria-pressed="false">Brand B</button>
        <button type="button" data-hero-brand="c" aria-pressed="false">Brand C</button>
      </span>
      <span class="docs-hero-switch" data-hero-group="mode">
        <button type="button" data-hero-mode="light" aria-pressed="true">Light</button>
        <button type="button" data-hero-mode="dark" aria-pressed="false">Dark</button>
      </span>
    </div>
    <div class="docs-hero-preview-stage">
      {{ uif.button("Get started") }}
    </div>
  </div>
  <div class="docs-hero-meta">
    <span class="docs-status" data-status="stable">Stable</span>
    {% if playgroundUrl %}
    <a class="docs-page-link docs-page-link--playground" href="{{ playgroundUrl }}">{{ playgroundLabel or "Open Playground" }}</a>
    {% endif %}
    {% if figmaConnections and figmaConnections.urlsByName and figmaConnections.urlsByName[page.fileSlug] %}
    <a class="docs-page-link" href="{{ figmaConnections.urlsByName[page.fileSlug] }}" target="_blank" rel="noopener noreferrer">Open in Figma</a>
    {% endif %}
  </div>
</div>

<nav class="docs-toc" aria-label="Table of contents">
  <p class="docs-toc-title">Table of contents</p>
  <ul class="docs-toc-list">
    <li><a href="#anatomy">Anatomy</a></li>
    <li><a href="#options">Options</a></li>
    <li><a href="#behaviors">Behaviors</a></li>
    <li><a href="#usage-guidelines">Usage guidelines</a></li>
    <li><a href="#content-standards">Content standards</a></li>
    <li><a href="#keyboard-interactions">Keyboard interactions</a></li>
    <li><a href="#accessibility">Accessibility</a></li>
    <li><a href="#theming">Theming</a></li>
    <li><a href="#design-checklist">Design checklist</a></li>
  </ul>
</nav>

<h2 id="anatomy">Anatomy</h2>

<div class="docs-anatomy">
  <div class="docs-anatomy-preview">
    <div class="docs-anatomy-subject">
      <span class="docs-anatomy-outline"></span>
      <span class="docs-anatomy-callout" data-dir="top" style="left: 50%; transform: translateX(-50%);">
        <span class="docs-anatomy-badge">1</span>
        <span class="docs-anatomy-callout-line"></span>
      </span>
      <span class="docs-anatomy-callout" data-dir="right" style="top: 50%; transform: translateY(-50%);">
        <span class="docs-anatomy-callout-line"></span>
        <span class="docs-anatomy-badge">2</span>
      </span>
      {{ uif.button("Get started", "") }}
    </div>
  </div>
  <ol class="docs-anatomy-footnotes">
    <li><span class="docs-anatomy-badge-inline">1</span> Container — provides the hit target, border, and fill</li>
    <li><span class="docs-anatomy-badge-inline">2</span> Label — describes the action the button performs</li>
  </ol>
</div>

<h2 id="options">Options</h2>

### Variants

<div class="docs-stack">
  {{ uif.button("Solid") }}
  {{ uif.button("Outline", "outline") }}
  {{ uif.button("Ghost", "ghost") }}
</div>

The **solid** variant communicates strong emphasis and is reserved for primary
actions. **Outline** is for medium emphasis. **Ghost** is for low-emphasis or
tertiary actions and should never be the only button in a group.

### Disabled

<div class="docs-stack">
  {{ uif.button("Disabled", "", true) }}
</div>

A disabled button shows that an action exists but is not available in the
current state. Use it to maintain layout continuity and communicate that the
action may become available later.

### Table of options

<table class="docs-options-table">
  <thead>
    <tr><th>Property</th><th>Values</th><th>Default</th></tr>
  </thead>
  <tbody>
    <tr><td>label</td><td>text</td><td>—</td></tr>
    <tr><td>variant</td><td><code>solid</code> / <code>outline</code> / <code>ghost</code></td><td><code>solid</code></td></tr>
    <tr><td>type</td><td><code>button</code> / <code>submit</code> / <code>reset</code></td><td><code>button</code></td></tr>
    <tr><td>disabled</td><td><code>true</code> / <code>false</code></td><td><code>false</code></td></tr>
    <tr><td>start icon</td><td>icon name / none</td><td>none</td></tr>
  </tbody>
</table>

<h2 id="behaviors">Behaviors</h2>

<div class="docs-behavior-list">
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.button("Agree") }}
      {{ uif.button("Get started") }}
      {{ uif.button("Start experience") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Flexible width</h3>
      <p>The width of a button automatically adjusts to fit the label text. Padding on each side is equal to half the button height.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.button("Start the full experience now") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Text overflow</h3>
      <p>When the button text is too long for the available horizontal space, it wraps to form another line.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.button("Focused", "") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Keyboard focus</h3>
      <p>A button can be navigated using a keyboard. The keyboard focus state takes the hover state and adds a visible focus ring to the button.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.button("Save", "") }}
      {{ uif.button("Cancel", "outline") }}
      {{ uif.button("More", "ghost") }}
    </div>
    <div class="docs-behavior-body">
      <h3>Variant hierarchy</h3>
      <p>Solid, outline, and ghost variants create a visual hierarchy. Use solid for the primary action, outline for secondary, and ghost for tertiary.</p>
    </div>
  </div>
  <div class="docs-behavior-item">
    <div class="docs-behavior-preview">
      {{ uif.button("Disabled", "", true) }}
    </div>
    <div class="docs-behavior-body">
      <h3>Disabled state</h3>
      <p>A disabled button shows that an action exists but is not available. It is removed from the tab order and communicates its state to assistive technology.</p>
    </div>
  </div>
</div>

<h2 id="usage-guidelines">Usage guidelines</h2>

### Use the right variant for the emphasis level

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {{ uif.button("Save", "") }}
      {{ uif.button("Cancel", "outline") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use solid for the primary action and outline or ghost for secondary actions.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ uif.button("Save", "") }}
      {{ uif.button("Cancel", "") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't use multiple solid buttons at the same emphasis level — it removes hierarchy.</p>
    </div>
  </div>
</div>

### Don't override color

Do not use custom colors for buttons. The token-driven colors are designed to be
consistent and accessible across brands and modes.

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {{ uif.button("Continue", "") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use the default token-driven button colors.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      <button class="uif-button solid docs-dont-custom-color" type="button">Continue</button>
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't hardcode custom background colors on buttons.</p>
    </div>
  </div>
</div>

### Use a button group for related actions

Use `ButtonGroup` to keep related actions visually and semantically grouped.

<div class="docs-stack docs-medium-stack">
  {% call uif.buttonGroup(false, "horizontal", "start", "Travel dates") %}
    {{ uif.button("Day 1", "outline") }}
    {{ uif.button("Day 2", "outline") }}
    {{ uif.button("Day 3", "outline") }}
  {% endcall %}
</div>

[Open Button Group Playground](/patterns/button-group-playground/)

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {% call uif.buttonGroup(false, "horizontal", "start", "Actions") %}
        {{ uif.button("Save", "") }}
        {{ uif.button("Discard", "outline") }}
      {% endcall %}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Group related actions in a ButtonGroup to show their relationship.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ uif.button("Save", "") }}
      <span class="docs-guideline-spacer"></span>
      {{ uif.button("Discard", "outline") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Don't scatter related actions without a grouping container.</p>
    </div>
  </div>
</div>

#### Button group markup

```html
<div
  class="uif-button-group"
  role="group"
  aria-label="Travel dates"
  data-orientation="horizontal"
  data-attached="false"
  data-justify="start"
>
  <button class="uif-button outline" type="button">Day 1</button>
  <button class="uif-button outline" type="button">Day 2</button>
  <button class="uif-button outline" type="button">Day 3</button>
</div>
```

- `orientation`: `"horizontal"` (default) or `"vertical"`
- `attached`: `false` (default) removes shared borders/gaps when `true`
- `justify`: `"start"` (default) or `"stretch"`

<h2 id="content-standards">Content standards</h2>

### Be concise

Button text should be 1–4 words, fewer than 20 characters including spaces.
Don't use punctuation.

### Write labels as verbs

A button represents an action, so its label needs to be a verb. Labels written
as nouns or adjectives tend to be unclear.

<div class="docs-guideline">
  <div class="docs-guideline-item" data-type="do">
    <div class="docs-guideline-preview">
      {{ uif.button("Save changes", "") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Do</p>
      <p>Use a verb that describes the outcome of the action.</p>
    </div>
  </div>
  <div class="docs-guideline-item" data-type="dont">
    <div class="docs-guideline-preview">
      {{ uif.button("Done", "") }}
    </div>
    <div class="docs-guideline-body">
      <p class="docs-guideline-label">Don't</p>
      <p>Avoid vague labels that don't describe the specific action.</p>
    </div>
  </div>
</div>

### Use sentence case

Button text should always be in sentence case. Never use all-caps or title case
to emphasize a button.

<h2 id="keyboard-interactions">Keyboard interactions</h2>

<table class="docs-keyboard-table">
  <thead>
    <tr><th>Key</th><th>Interaction</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><kbd>Space</kbd> or <kbd>Enter</kbd></td>
      <td>Executes the button action. Focus remains on the button unless it opens or closes a container.</td>
    </tr>
    <tr>
      <td><kbd>Tab</kbd></td>
      <td>Moves focus to the next focusable element.</td>
    </tr>
    <tr>
      <td><kbd>Shift</kbd> + <kbd>Tab</kbd></td>
      <td>Moves focus to the previous focusable element.</td>
    </tr>
  </tbody>
</table>

<h2 id="accessibility">Accessibility</h2>

- Use `<button>` for actions and `<a>` for navigation — never style a link as a
  button for an action.
- Every button must have a visible text label or an `aria-label` when icon-only.
- Disabled buttons use the native `disabled` attribute, which removes them from
  the tab order and communicates the state to assistive technology.
- Focus indicators meet 3:1 contrast against the surrounding background.
- Color is not the only means of distinguishing variants — shape, border, and
  fill provide additional differentiation.

<h2 id="theming">Theming</h2>

Button adapts automatically across brands and color modes through component
tokens. Use the hero preview switches above to see it in action.

For the full theming architecture — brands, modes, and how tokens cascade — see
[Foundations: Design Tokens](/foundations/design-tokens/).

<h2 id="design-checklist">Design checklist</h2>

<div class="docs-checklist">
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>All interactive states</strong>
      <span>Hover, active, focus, keyboard focus, and disabled states are implemented.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>All brand/mode contexts</strong>
      <span>Works across light and dark modes for all brands.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Accessible use of color</strong>
      <span>Color is not the only visual means of conveying information (WCAG 1.4.1).</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Accessible contrast for text</strong>
      <span>Text contrast ratio of at least 4.5:1 for small text, 3:1 for large text (WCAG 1.4.3).</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Accessible contrast for UI</strong>
      <span>UI component contrast ratio of at least 3:1 (WCAG 1.4.11).</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Content standards</strong>
      <span>Writing guidelines for button labels are documented.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Defined options</strong>
      <span>Variant, disabled, icon, and type options are documented.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Defined behaviors</strong>
      <span>Focus, overflow, and flexible width behaviors are documented.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Usage guidelines</strong>
      <span>Do and don't examples highlight best practices.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Keyboard interactions</strong>
      <span>Keyboard accessibility guidelines and interaction descriptions are included.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Design tokens</strong>
      <span>All visual attributes are available as design tokens.</span>
    </div>
  </div>
  <div class="docs-checklist-item" data-done="true">
    <div class="docs-checklist-icon">✓</div>
    <div class="docs-checklist-text">
      <strong>Figma component</strong>
      <span>Component is available in the Figma library.</span>
    </div>
  </div>
</div>
