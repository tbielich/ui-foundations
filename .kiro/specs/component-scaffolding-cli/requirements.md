# Requirements Document

## Introduction

The Component Scaffolding CLI is a planned npm script that auto-generates all required files when creating a new design system component in the ui-foundations repository. Creating a component currently requires 10+ files across CSS, React, Nunjucks, playground, docs, Code Connect, and token surfaces. Agents and humans routinely forget surfaces (missing playground renderers, wrong CSS class prefixes, missing `@layer` wrappers, CSS imports in React files). This CLI will eliminate that class of error by generating correct skeleton files from templates derived from the cleanest existing components (radio, checkbox, switch).

## Glossary

- **CLI**: The Node.js command-line script invoked via `npm run new:component -- --name <component>`
- **Component_Name**: The kebab-case identifier for the component (e.g. `slider`, `toggle-button`)
- **Surface**: A single file or file-insertion that must exist for a component to be fully integrated (CSS pattern, React wrapper, playground renderer, etc.)
- **Surface_Manifest**: The complete list of 10 surfaces defined in assistant-behavior-rules.md rule 8, plus the token definition surface
- **Template**: A string template embedded in the CLI source that produces a skeleton file for a given surface, with placeholders replaced by Component_Name
- **Skeleton_File**: A generated file containing the correct structural patterns (class names, layer wrappers, export style) with TODO placeholders for component-specific logic
- **PascalCase_Name**: The Component_Name converted to PascalCase for use in React export function names (e.g. `toggle-button` → `ToggleButton`)
- **Renderers_Map**: The `renderers` object in `site/assets/playground/renderers.js` that maps component keys to render functions
- **Dry_Run**: A mode where the CLI prints what it would do without writing any files

## Requirements

### Requirement 1: CLI Invocation

**User Story:** As a developer, I want to run a single npm script to scaffold a new component, so that I do not need to remember or manually create each integration surface.

#### Acceptance Criteria

1. WHEN the developer runs `npm run new:component -- --name <component>`, THE CLI SHALL parse the `--name` argument and use it as the Component_Name for all generated files
2. IF the `--name` argument is missing, THEN THE CLI SHALL exit with a non-zero exit code and print a usage message to stderr explaining the required argument
3. IF the `--name` value is not valid kebab-case (lowercase letters, digits, and hyphens only, not starting or ending with a hyphen), THEN THE CLI SHALL exit with a non-zero exit code and print an error message identifying the invalid name

### Requirement 2: Conflict Detection

**User Story:** As a developer, I want the CLI to detect existing files before writing, so that I do not accidentally overwrite work already done on a component.

#### Acceptance Criteria

1. WHEN the CLI is invoked with a Component_Name, THE CLI SHALL check whether any of the target files or insertion points already exist for that Component_Name before writing
2. IF any target file already exists on disk, THEN THE CLI SHALL exit with a non-zero exit code and print a message listing each conflicting file path
3. IF the Component_Name already appears as an import in `src/ui/index.css`, THEN THE CLI SHALL include that file in the conflict list
4. IF the Component_Name already appears as an export in `src/react/index.js`, THEN THE CLI SHALL include that file in the conflict list

### Requirement 3: CSS Pattern Generation

**User Story:** As a developer, I want the CLI to generate a correctly structured CSS pattern file, so that the component starts with the right layer wrapper and class naming conventions.

#### Acceptance Criteria

1. WHEN the CLI generates the CSS pattern, THE CLI SHALL create the file at `src/ui/patterns/<Component_Name>.css`
2. THE CLI SHALL wrap all CSS rules inside `@layer components { }` in the generated CSS file
3. THE CLI SHALL use bare class names (e.g. `.slider`, `.toggle-button`) without any namespace prefix in the generated CSS
4. THE CLI SHALL include a skeleton rule for the base class and a `TODO` comment indicating where component-specific styles go
5. WHEN the CSS pattern file is created, THE CLI SHALL append an import line `@import url("./patterns/<Component_Name>.css") layer(components);` to `src/ui/index.css`

### Requirement 4: React Wrapper Generation

**User Story:** As a developer, I want the CLI to generate a React wrapper that follows the project's established patterns, so that I avoid common mistakes like using JSX or `export const`.

#### Acceptance Criteria

1. WHEN the CLI generates the React wrapper, THE CLI SHALL create the file at `src/react/<Component_Name>.js`
2. THE CLI SHALL use a named `export function` declaration (not `export const` with an arrow function) for the component
3. THE CLI SHALL use `React.createElement` calls instead of JSX syntax in the generated file
4. THE CLI SHALL not include any CSS import statements in the generated React file
5. THE CLI SHALL include the class array pattern: `const classes = ["<Component_Name>"]; if (className) classes.push(className);`
6. THE CLI SHALL derive the function name as the PascalCase_Name of the Component_Name (e.g. `toggle-button` → `ToggleButton`)
7. WHEN the React wrapper file is created, THE CLI SHALL append an export line `export { <PascalCase_Name> } from "./<Component_Name>.js";` to `src/react/index.js`

### Requirement 5: Nunjucks Macro Generation

**User Story:** As a developer, I want the CLI to add a Nunjucks macro skeleton for the new component, so that the docs site can render it via the standard macro system.

#### Acceptance Criteria

1. WHEN the CLI generates the Nunjucks macro, THE CLI SHALL append a new macro block to `site/_includes/macros/ui.njk`
2. THE CLI SHALL name the macro using the camelCase form of the Component_Name (e.g. `toggle-button` → `toggleButton`)
3. THE CLI SHALL include standard parameters (`label`, `disabled`, `state`, `className`) and a `TODO` comment for component-specific parameters
4. THE CLI SHALL use the bare class name in the generated macro markup (e.g. `<Component_Name>` class, not `ui-<Component_Name>`)

### Requirement 6: Playground Renderer Generation

**User Story:** As a developer, I want the CLI to generate a playground renderer function and register it in the renderers map, so that the playground page works immediately without a broken page.

#### Acceptance Criteria

1. WHEN the CLI generates the playground renderer, THE CLI SHALL add a render function to `site/assets/playground/renderers.js`
2. THE CLI SHALL name the render function `renderVanilla<PascalCase_Name>` following the existing naming convention
3. THE CLI SHALL register the render function in the `renderers` map object using the Component_Name as the key
4. THE CLI SHALL include a skeleton implementation that creates a DOM element and returns both `element` and `code` properties
5. THE CLI SHALL insert the new renderer function before the `global.UIPlaygroundRenderers` assignment and add the map entry inside the existing `renderers` object

### Requirement 7: Playground Page Generation

**User Story:** As a developer, I want the CLI to generate a playground markdown page, so that the component has an interactive preview page on the docs site.

#### Acceptance Criteria

1. WHEN the CLI generates the playground page, THE CLI SHALL create the file at `site/components/<Component_Name>-playground.md`
2. THE CLI SHALL include correct frontmatter with `renderer: <Component_Name>` matching the key registered in the Renderers_Map
3. THE CLI SHALL include the standard playground macro call `{{ uiPlayground(playground) }}`
4. THE CLI SHALL include default playground controls for `label`, `disabled`, and `state`
5. THE CLI SHALL set the `permalink` to `/components/<Component_Name>-playground/`

### Requirement 8: Documentation Page Generation

**User Story:** As a developer, I want the CLI to generate a docs page skeleton, so that the component has a documentation page with the standard structure.

#### Acceptance Criteria

1. WHEN the CLI generates the docs page, THE CLI SHALL create the file at `site/components/<Component_Name>.md`
2. THE CLI SHALL include frontmatter with `title`, `description`, `permalink`, and `playgroundUrl` fields
3. THE CLI SHALL include a Preview section, a Usage section with code-tabs (HTML, Nunjucks, React), and a Used Tokens section using the `componentTokenTable` shortcode
4. THE CLI SHALL reference the correct playground URL `/components/<Component_Name>-playground/`

### Requirement 9: Code Connect File Generation

**User Story:** As a developer, I want the CLI to generate a Code Connect skeleton file, so that the Figma-to-code mapping surface is not forgotten.

#### Acceptance Criteria

1. WHEN the CLI generates the Code Connect file, THE CLI SHALL create the file at `figma/connections/web-<Component_Name>.figma.ts`
2. THE CLI SHALL include the standard `import figma, { html } from "@figma/code-connect/html"` import
3. THE CLI SHALL include a skeleton `figma.connect()` call with a `TODO` comment for the Figma node URL and props mapping
4. THE CLI SHALL use the correct HTML class name (bare Component_Name) in the example template

### Requirement 10: Token Definition Stub

**User Story:** As a developer, I want the CLI to add a token stub to the component tokens file, so that the component has its own token namespace from the start.

#### Acceptance Criteria

1. WHEN the CLI generates the token stub, THE CLI SHALL add a new top-level key to `figma/exports/Components (UI).tokens.json` using the PascalCase form of the Component_Name (matching the existing convention where keys are like `Button`, `Input Radio`, `Input Checkbox`)
2. THE CLI SHALL include a single placeholder token entry with a `TODO` comment indicating tokens should be defined from Figma
3. IF the PascalCase key already exists in the tokens file, THEN THE CLI SHALL skip the token stub and print a notice that tokens already exist

### Requirement 11: Dry Run Mode

**User Story:** As a developer, I want a dry-run mode that shows what the CLI would generate without writing files, so that I can preview the scaffolding before committing to it.

#### Acceptance Criteria

1. WHEN the developer passes the `--dry-run` flag, THE CLI SHALL print the list of files that would be created and files that would be modified, without writing to disk
2. WHEN in dry-run mode, THE CLI SHALL print the content that would be appended to existing files (`src/ui/index.css`, `src/react/index.js`, `site/_includes/macros/ui.njk`, `site/assets/playground/renderers.js`, `figma/exports/Components (UI).tokens.json`)
3. THE CLI SHALL exit with exit code 0 after a successful dry run

### Requirement 12: Summary Output

**User Story:** As a developer, I want the CLI to print a summary of everything it created, so that I can verify completeness at a glance.

#### Acceptance Criteria

1. WHEN the CLI completes successfully, THE CLI SHALL print a summary listing every file created and every file modified
2. THE CLI SHALL print a checklist of next steps (e.g. "Add component-specific CSS styles", "Define tokens in Figma", "Add Figma node URL to Code Connect file")
3. THE CLI SHALL exit with exit code 0 after successful generation

### Requirement 13: No External Dependencies

**User Story:** As a developer, I want the CLI to use only Node.js built-in modules, so that it does not add dependencies to the project.

#### Acceptance Criteria

1. THE CLI SHALL use only Node.js built-in modules (`fs`, `path`, `process`) and not require any external npm packages
2. THE CLI SHALL be implemented as a single script file at `scripts/new-component.mjs`
