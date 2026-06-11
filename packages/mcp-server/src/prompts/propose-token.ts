/**
 * propose_token prompt handler for the UI Foundations MCP Server.
 *
 * Returns a prompt template that guides token creation proposals with
 * layer-specific naming guidance. Inlines naming convention rules and
 * layering rules as literal text so consuming agents have full context.
 *
 * Requirements: 18.1, 18.2, 18.3, 18.4
 */

import type { PromptResponse } from '../types.js';

/** Valid layer values for the propose_token prompt. */
const VALID_LAYERS = ['core', 'semantic', 'component', 'mode'] as const;

type Layer = (typeof VALID_LAYERS)[number];

/** Maximum allowed length for the purpose argument. */
const MAX_PURPOSE_LENGTH = 500;

/**
 * Layer-specific naming pattern guidance.
 *
 * Each layer uses a distinct naming convention reflecting its role in the
 * token architecture.
 */
const LAYER_GUIDANCE: Record<Layer, string> = {
  component: `### Naming Pattern: Variant-First (Component Layer)

Component tokens follow the variant-first path format:

\`Component.variant.part.property.state\`

Examples:
- \`Button.solid.container.background.default\`
- \`Button.outline.container.border-color.hover\`
- \`Button.ghost.label.text-color.disabled\`
- \`Input.default.container.border-color.focus\`

Structure:
1. **Component** — PascalCase component name (e.g., Button, Input, Slider)
2. **variant** — the visual variant (solid, outline, ghost, default)
3. **part** — the sub-element (container, label, icon, track, thumb)
4. **property** — the CSS property being themed (background, border-color, text-color)
5. **state** — interaction state as last segment (default, hover, active, focus, disabled)

Component tokens MUST reference Semantic or Core tokens — never raw values.`,

  semantic: `### Naming Pattern: Role-Based (Semantic Layer)

Semantic tokens use role-based naming that is component-agnostic:

\`Category.Role.Qualifier\`

Examples:
- \`Color.Text.Default\`
- \`Color.Fill.Surface\`
- \`Color.Fill.Brand\`
- \`Color.Border.Brand\`
- \`Color.Border.Focus\`
- \`Typography.Label\`
- \`Corner.Medium\`

Structure:
1. **Category** — the token domain in PascalCase (Color, Typography, Corner, Spacing)
2. **Role** — the functional grouping (Text, Fill, Border for colors; Label, Body, Heading for typography)
3. **Qualifier** — optional specificity (Default, Brand, Surface, Success, Danger)

Semantic tokens provide meaning without binding to a specific component.
They reference Mode or Core tokens.`,

  core: `### Naming Pattern: Primitives (Core Layer)

Core tokens represent raw physical values with no semantic meaning:

\`Category.Subcategory.Scale\`

Examples:
- \`Size.Spacing.100\`
- \`Size.Spacing.200\`
- \`Size.Radius.Small\`
- \`Size.Radius.Medium\`
- \`Size.Border.Thin\`
- \`Typography.FontSize.100\`
- \`Typography.LineHeight.Tight\`

Structure:
1. **Category** — the measurement domain in PascalCase (Size, Typography)
2. **Subcategory** — the specific dimension (Spacing, Radius, Border, FontSize, LineHeight)
3. **Scale** — a numeric step or named size (100, 200, Small, Medium, Large)

Core tokens are raw values only — never reference other tokens.
They form the base that all other layers build upon.`,

  mode: `### Naming Pattern: Color Palette (Mode Layer)

Mode tokens define raw color palettes for light and dark appearances:

\`Color.Palette.Hue.Step\`

Examples:
- \`Color.Palette.Blue.500\`
- \`Color.Palette.Blue.100\`
- \`Color.Palette.Neutral.900\`
- \`Color.Palette.Neutral.50\`
- \`Color.Palette.Green.600\`
- \`Color.Palette.Red.500\`
- \`Color.Overlay.Light\`
- \`Color.Overlay.Dark\`

Structure:
1. **Color** — always starts with Color in PascalCase
2. **Palette** or **Overlay** — the functional grouping
3. **Hue** — the color family (Blue, Neutral, Green, Red, Brand)
4. **Step** — the lightness/darkness scale step (50, 100, 200, ..., 900)

Mode tokens contain no semantics — they are raw palette values.
Semantic tokens reference Mode tokens to map meaning to color.`,
};

/**
 * Inlined naming convention rules from foundation-002-naming-and-grouping.md.
 *
 * These are embedded directly so the consuming agent has full context
 * without needing additional resource reads.
 */
const NAMING_RULES = `## Naming Convention Rules (Foundation-002)

### Purpose
Keep token naming readable in Figma, searchable in code, and scalable across variants/states.

### Rules

1. Component tokens follow a variant-first path:
   \`Component.variant.part.property.state\`

   Examples:
   - \`Button.solid.container.background.default\`
   - \`Button.outline.container.border-color.hover\`
   - \`Button.ghost.label.text-color.disabled\`

2. Semantic tokens remain role-based and component-agnostic:
   - \`Color.Text.Default\`
   - \`Color.Fill.Surface\`
   - \`Color.Border.Brand\`
   - \`Typography.Label\`
   - \`Corner.Medium\`

3. States are always the last segment:
   \`...property.state\`

   Common states:
   \`default\`, \`hover\`, \`active\`, \`focus\`, \`disabled\`

4. Naming style:
   - Component name in PascalCase; subsequent segments in lowercase
   - Multi-word properties in kebab-case (\`border-color\`, \`line-height\`)
   - No device labels (\`mobile/tablet/desktop\`) in token names`;

/**
 * Inlined layering rules from foundation-001-token-layering.md.
 *
 * Embedded directly for full agent context without additional reads.
 */
const LAYERING_RULES = `## Token Layering Rules (Foundation-001)

### Purpose
Define a stable token architecture that:
- aligns Figma Variables with CSS custom properties
- supports Light/Dark modes and multiple brands
- scales across components without duplication
- remains maintainable and code-aligned

### Rules

1. Use four layers:
   - **Core (Primitives)**: raw physical values (spacing, radii, borders, typography primitives, layout constants)
   - **Color Modes (Light/Dark)**: raw color palettes (brand, neutral, overlays), no semantics
   - **Semantics (Roles)**: meaning-based roles (\`Color.Text.*\`, \`Color.Fill.*\`, \`Color.Border.*\`, \`Typography.*\`, \`Corner.*\`)
   - **Components (APIs)**: variants/parts/properties/states, referencing Semantic/Core tokens

2. Components must not introduce raw values for color, typography, or layout fundamentals.

3. Typography color must stay in semantic color roles, not inside typography role definitions.

### Implications
- Brand/mode changes happen primarily in Semantic/Mode mappings.
- Component APIs remain stable while references evolve.
- Layout constants (breakpoints, containers, z-index) stay centralized in Core.`;

/**
 * Handler for the `propose_token` prompt.
 *
 * @param args - Prompt arguments (must contain `layer` and `purpose` strings).
 * @param rootPath - Absolute path to the repository root.
 * @returns PromptResponse with messages containing the token proposal guide.
 */
export async function proposeTokenHandler(
  args: Record<string, string>,
  rootPath: string,
): Promise<PromptResponse> {
  const layer = args.layer;
  const purpose = args.purpose;

  // Validate layer argument
  if (!layer || !VALID_LAYERS.includes(layer as Layer)) {
    throw new Error(
      `Invalid layer: "${layer ?? ''}". Valid values are: ${VALID_LAYERS.join(', ')}`,
    );
  }

  // Validate purpose argument
  if (!purpose) {
    throw new Error(
      'The purpose argument is required. Provide a description of the token\'s intended use (max 500 characters).',
    );
  }

  if (purpose.length > MAX_PURPOSE_LENGTH) {
    throw new Error(
      `The purpose argument exceeds the maximum length of ${MAX_PURPOSE_LENGTH} characters (received ${purpose.length}).`,
    );
  }

  const validatedLayer = layer as Layer;

  // Build the prompt content
  const lines: string[] = [
    `# Token Proposal: ${validatedLayer} layer`,
    ``,
    `## Purpose`,
    ``,
    purpose,
    ``,
    `---`,
    ``,
    NAMING_RULES,
    ``,
    `---`,
    ``,
    LAYERING_RULES,
    ``,
    `---`,
    ``,
    LAYER_GUIDANCE[validatedLayer],
    ``,
    `---`,
    ``,
    `## Section 1: Layer Placement Rationale`,
    ``,
    `Based on the purpose described above, confirm this token belongs in the **${validatedLayer}** layer:`,
    ``,
  ];

  // Layer-specific placement rationale guidance
  switch (validatedLayer) {
    case 'core':
      lines.push(
        `- Core tokens store raw physical values with no semantic meaning.`,
        `- Ask: Is this a fundamental measurement (spacing, radius, border width, font size) that other layers will reference?`,
        `- Ask: Does this value make sense without any component or role context?`,
        `- If the value carries meaning (e.g., "brand color", "error state"), it belongs in Semantic instead.`,
      );
      break;
    case 'mode':
      lines.push(
        `- Mode tokens define raw color palettes for light/dark appearance switching.`,
        `- Ask: Is this a palette color that exists purely as a hue/shade without role assignment?`,
        `- Ask: Will this be referenced by Semantic tokens to assign meaning?`,
        `- If the color already implies a role (e.g., "error red"), it belongs in Semantic instead.`,
      );
      break;
    case 'semantic':
      lines.push(
        `- Semantic tokens assign meaning to values without binding to specific components.`,
        `- Ask: Does this token describe a role or intent (text color, fill surface, border focus)?`,
        `- Ask: Could multiple components use this token for the same purpose?`,
        `- If the token is specific to one component's variant/part/state, it belongs in Component instead.`,
      );
      break;
    case 'component':
      lines.push(
        `- Component tokens are scoped to a specific component's API surface.`,
        `- Ask: Is this token bound to a specific component, variant, part, and state?`,
        `- Ask: Does the token reference Semantic or Core tokens (never raw values)?`,
        `- If the token could apply across multiple unrelated components, it belongs in Semantic instead.`,
      );
      break;
  }

  lines.push(
    ``,
    `## Section 2: Reference Checks`,
    ``,
    `Before finalizing the token name, verify:`,
    ``,
    `1. **No duplicates** — Search existing tokens to confirm this name doesn't already exist.`,
    `   Use the \`get_token\` tool with a partial name query to check.`,
    ``,
    `2. **Correct references** — If this token references other tokens:`,
    `   - Component tokens must reference Semantic or Core tokens only.`,
    `   - Semantic tokens must reference Mode or Core tokens only.`,
    `   - Core tokens must not reference other tokens (they are raw values).`,
    `   - Mode tokens must not reference other tokens (they are raw palette values).`,
    ``,
    `3. **Naming alignment** — Ensure the proposed name aligns with existing naming patterns in the same layer.`,
    `   Use the \`get_token\` tool with a layer filter to review existing tokens in the **${validatedLayer}** layer.`,
    ``,
    `## Section 3: Validation Step`,
    ``,
    `After composing the token name, validate it using the \`validate_token_name\` tool:`,
    ``,
    '```',
    `validate_token_name({ name: "<your-proposed-token-name>" })`,
    '```',
    ``,
    `The validator checks:`,
    `- First segment is PascalCase`,
    `- Subsequent segments are lowercase/kebab-case`,
    `- Layer prefix matches a known token layer`,
    `- State value (if present as last segment) is recognized (default, hover, active, focus, disabled)`,
    `- No device labels (mobile, tablet, desktop)`,
    `- At least 2 dot-separated segments`,
    `- Maximum 200 characters`,
    ``,
    `If validation fails, review the violations and adjust the name accordingly.`,
    `If validation passes, the token name is ready for proposal.`,
  );

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
