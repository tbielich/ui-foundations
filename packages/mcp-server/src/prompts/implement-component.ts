/**
 * implement_component prompt handler for the UI Foundations MCP Server.
 *
 * Returns a prompt template that guides component creation following
 * the 10-surface workflow. Includes file path references to governance
 * and naming rules, plus expected file paths using the component name.
 *
 * Requirements: 17.1, 17.2, 17.3, 17.4
 */

import type { PromptResponse } from '../types.js';

/** Pattern for valid component names: lowercase letters and hyphens only, non-empty. */
const VALID_NAME_PATTERN = /^[a-z][a-z-]*$/;

/**
 * Handler for the `implement_component` prompt.
 *
 * @param args - Prompt arguments (must contain `name` string).
 * @param rootPath - Absolute path to the repository root.
 * @returns PromptResponse with messages containing the 10-surface implementation guide.
 */
export async function implementComponentHandler(
  args: Record<string, string>,
  rootPath: string,
): Promise<PromptResponse> {
  const name = args.name;

  // Validate component name: non-empty, lowercase letters and hyphens only
  if (!name || !VALID_NAME_PATTERN.test(name)) {
    throw new Error(
      `Invalid component name: "${name ?? ''}". The component name must be a non-empty string containing only lowercase letters and hyphens.`,
    );
  }

  const lines: string[] = [
    `# Implement Component: ${name}`,
    ``,
    `## Governance References`,
    ``,
    `Before implementing, review:`,
    `- \`docs/agentic/assistant-behavior-rules.md\` — Rules 8–12 (component integration requirements)`,
    `- \`docs/ui-foundations-rules.md\` — Naming Rules section`,
    ``,
    `## 10 Integration Surfaces`,
    ``,
    `Each new component requires all 10 surfaces below. Implement them in order.`,
    ``,
    `### 1. CSS Pattern`,
    ``,
    `File: \`src/ui/patterns/${name}.css\``,
    ``,
    `- Use \`@layer components\` to scope styles`,
    `- Class name is the bare component name: \`.${name}\``,
    `- Use only semantic or core design tokens (\`var(--...)\`)`,
    `- Use logical properties (inline/block instead of left/right/top/bottom)`,
    `- Define all states: default, hover, active, focus, disabled`,
    `- Register the pattern in \`src/ui/index.css\``,
    ``,
    `### 2. Nunjucks Macro`,
    ``,
    `File: \`site/_includes/macros/ui.njk\``,
    ``,
    `- Add a \`macro ui.${name.replace(/-/g, '')}()\` entry to the macros file`,
    `- Accept all variant and state parameters`,
    `- Output semantic HTML with the CSS class`,
    `- Support \`attrs\` catch-all for extra HTML attributes`,
    ``,
    `### 3. Web Component`,
    ``,
    `File: \`src/elements/ui-${name}.js\``,
    ``,
    `- Extend the shared \`UIElement\` base and register with \`define()\``,
    `- Use light DOM — no shadow root`,
    `- Render the semantic markup expected by the pattern CSS`,
    `- Document attributes, properties, events, and content behavior`,
    `- Export from \`src/elements/index.js\` and \`package.json\``,
    ``,
    `### 4. Documentation Page`,
    ``,
    `File: \`site/components/${name}.md\``,
    ``,
    `- Frontmatter with title, description, component status`,
    `- Usage examples with live rendered output`,
    `- Variant showcase`,
    `- Props/attributes table`,
    `- Accessibility notes`,
    `- Related components section`,
    ``,
    `### 5. Playground Page`,
    ``,
    `File: \`site/components/${name}-playground.md\``,
    ``,
    `- Interactive playground with editable props`,
    `- All variants selectable`,
    `- Live preview rendering`,
    `- Code output panel`,
    ``,
    `### 6. Playground Renderer`,
    ``,
    `File: \`site/assets/playground/renderers.js\``,
    ``,
    `- Add a renderer function for \`${name}\``,
    `- Accepts playground state and returns rendered HTML`,
    `- Supports all variants and states`,
    ``,
    `### 7. Code Connect (Figma)`,
    ``,
    `File: \`schemas/web-${name}.figma.ts\``,
    ``,
    `- Maps Figma component properties to code props`,
    `- Covers all variants defined in Figma`,
    `- Aligns naming between Figma and code`,
    ``,
    `### 8. Component Token Layer`,
    ``,
    `File: \`figma/exports/components-ui.tokens.json\` (add entries for this component)`,
    ``,
    `- Token naming: \`--${name}-{variant}-{part}-{property}-{state}\``,
    `- Never reuse another component's tokens`,
    `- All \`$ref\` aliases must point to existing tokens`,
    `- Define tokens for each variant × part × property × state combination`,
    ``,
    `### 9. Unit Tests`,
    ``,
    `File: \`tests/components/${name}.test.ts\``,
    ``,
    `- Test all variants render correctly`,
    `- Test all states apply correct classes`,
    `- Test accessibility attributes (roles, labels, ARIA)`,
    `- Test keyboard interaction where applicable`,
    `- Test Web Component output and documented API behavior`,
    ``,
    `### 10. Accessibility`,
    ``,
    `Requirements:`,
    ``,
    `- Semantic HTML elements (not generic divs/spans for interactive elements)`,
    `- Programmatic names (labels, aria-label, aria-labelledby)`,
    `- Keyboard access for all interactive states`,
    `- Visible focus indicator using \`--color-border-focus\` token`,
    `- ARIA state communication (aria-pressed, aria-expanded, aria-disabled, etc.)`,
    `- Color contrast meeting WCAG 2.1 AA (4.5:1 text, 3:1 UI components)`,
    `- Screen reader announcements for state changes where applicable`,
    ``,
    `## Expected File Paths Summary`,
    ``,
    `| Surface | Path |`,
    `|---------|------|`,
    `| CSS pattern | \`src/ui/patterns/${name}.css\` |`,
    `| Nunjucks macro | \`site/_includes/macros/ui.njk\` |`,
    `| Web Component | \`src/elements/ui-${name}.js\` |`,
    `| Docs page | \`site/components/${name}.md\` |`,
    `| Playground page | \`site/components/${name}-playground.md\` |`,
    `| Playground renderer | \`site/assets/playground/renderers.js\` |`,
    `| Code Connect | \`schemas/web-${name}.figma.ts\` |`,
    `| Token layer | \`figma/exports/components-ui.tokens.json\` |`,
    `| Unit tests | \`tests/components/${name}.test.ts\` |`,
    `| Accessibility | (integrated across all surfaces above) |`,
  ];

  const text = lines.join('\n');

  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text,
        },
      },
    ],
  };
}
