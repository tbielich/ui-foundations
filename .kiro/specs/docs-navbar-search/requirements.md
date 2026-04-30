# Requirements Document

## Introduction

Add a search feature to the UI Foundations docs site navbar that lets users search across both token and component documentation. The search input lives in the sidebar, filters results as the user types, and links each match to the correct docs page. This improves discoverability and navigation speed across the docs site without introducing external search services or changing the broader information architecture.

GitHub Issue: [#20](https://github.com/tbielich/ui-foundations/issues/20)

## Glossary

- **Docs_Site**: The Eleventy-based documentation site under `site/`, built to `_site/`, using Nunjucks templates and vanilla JS.
- **Sidebar**: The `aside.docs-sidebar` element in the docs layout (`site/_includes/layouts/docs.njk`) containing the logo and navigation groups.
- **Search_Input**: A text input field placed in the Sidebar that accepts user queries for filtering docs content.
- **Search_Index**: A client-side data structure containing searchable entries for all token and component docs pages, generated at build time and embedded or loaded at runtime.
- **Search_Result**: A single matching entry returned by the search, containing a title, a type label (token or component), and a URL linking to the corresponding docs page.
- **Results_List**: The visible container that displays zero or more Search_Results below the Search_Input.
- **Empty_State**: The message displayed in the Results_List when a query produces zero matches.
- **Token_Doc**: A docs page under the Foundations or Tokens section that documents one or more design tokens (e.g., Color, Typography, All Tokens, Design Tokens).
- **Component_Doc**: A docs page under the Components section that documents a single component (e.g., Button, Input, Icon). Playground pages are excluded from search.
- **Query**: The text string entered by the user into the Search_Input, used to filter the Search_Index.

## Requirements

### Requirement 1: Search Input Placement

**User Story:** As a docs user, I want a search input in the docs sidebar, so that I can quickly start searching without leaving the current page.

#### Acceptance Criteria

1. THE Docs_Site SHALL display a Search_Input in the Sidebar above the navigation groups.
2. THE Search_Input SHALL include a visible placeholder text indicating its purpose (e.g., "Search tokens & components").
3. THE Search_Input SHALL be accessible via keyboard navigation within the Sidebar.
4. THE Search_Input SHALL have a programmatic label accessible to assistive technologies.

### Requirement 2: Search Index Generation

**User Story:** As a docs user, I want search to cover all token and component pages, so that I can find any documented item from one place.

#### Acceptance Criteria

1. THE Docs_Site SHALL generate a Search_Index at build time containing one entry per Token_Doc page and one entry per Component_Doc page.
2. WHEN a Token_Doc page exists in the Eleventy collections, THE Search_Index SHALL include an entry with the page title, description, URL, and a type label of "token".
3. WHEN a Component_Doc page exists in the Eleventy collections, THE Search_Index SHALL include an entry with the page title, description, URL, and a type label of "component".
4. THE Search_Index SHALL exclude playground pages, example pages, and the Getting Started page.
5. THE Search_Index SHALL be available to client-side JavaScript at runtime without requiring a network request beyond the initial page load.

### Requirement 3: Search Filtering

**User Story:** As a docs user, I want results to update as I type, so that I can find what I need without submitting a form.

#### Acceptance Criteria

1. WHEN the user types a Query into the Search_Input, THE Docs_Site SHALL filter the Search_Index and display matching Search_Results in the Results_List.
2. THE Docs_Site SHALL perform case-insensitive matching of the Query against the title and description fields of each Search_Index entry.
3. WHEN the Query is empty or cleared, THE Docs_Site SHALL hide the Results_List.
4. THE Docs_Site SHALL update the Results_List on each input event without requiring a form submission or button press.

### Requirement 4: Results Display

**User Story:** As a docs user, I want to see all matching results with clear labels, so that I can distinguish token pages from component pages at a glance.

#### Acceptance Criteria

1. WHEN one or more Search_Results match the Query, THE Results_List SHALL display each result as a link to the corresponding docs page.
2. THE Results_List SHALL display the title of each Search_Result.
3. THE Results_List SHALL display a type indicator (token or component) for each Search_Result so the user can distinguish result categories.
4. WHEN the user activates a Search_Result link, THE Docs_Site SHALL navigate to the corresponding docs page URL.

### Requirement 5: Empty State

**User Story:** As a docs user, I want to see a clear message when nothing matches, so that I know the search worked but found no results.

#### Acceptance Criteria

1. WHEN the Query is non-empty and zero Search_Results match, THE Results_List SHALL display an Empty_State message.
2. THE Empty_State message SHALL communicate that no results were found for the current Query.

### Requirement 6: Keyboard Accessibility

**User Story:** As a keyboard user, I want to navigate search results without a mouse, so that I can use the feature with assistive technology or keyboard-only workflows.

#### Acceptance Criteria

1. THE Search_Input SHALL be focusable via the Tab key within the normal Sidebar tab order.
2. WHEN the Results_List is visible, THE Docs_Site SHALL allow keyboard navigation through the results using Arrow Down and Arrow Up keys.
3. WHEN a Search_Result has keyboard focus, THE Docs_Site SHALL apply a visible focus indicator that meets the existing docs focus styling.
4. WHEN the user presses Enter on a focused Search_Result, THE Docs_Site SHALL navigate to that result's URL.
5. WHEN the user presses Escape while the Results_List is visible, THE Docs_Site SHALL close the Results_List and return focus to the Search_Input.

### Requirement 7: Visual Consistency

**User Story:** As a docs maintainer, I want the search UI to match the existing docs site styling, so that it feels like a native part of the documentation.

#### Acceptance Criteria

1. THE Search_Input SHALL use docs-specific CSS custom properties (e.g., `--docs-border`, `--docs-surface-1`, `--docs-text-0`) for its styling.
2. THE Results_List SHALL use docs-specific CSS custom properties consistent with the Sidebar and navigation styling.
3. THE Docs_Site SHALL NOT use component-level design system tokens (e.g., `--button-*`, `--input-*`) for the search UI, following Rule 13 (docs UI uses docs-specific CSS).
4. THE Search_Input and Results_List SHALL be responsive and remain usable at the mobile breakpoint (max-width: 980px) where the Sidebar collapses.

### Requirement 8: Dismiss Behavior

**User Story:** As a docs user, I want the results list to close when I click elsewhere, so that it does not obstruct the page content.

#### Acceptance Criteria

1. WHEN the user clicks outside the Search_Input and Results_List, THE Docs_Site SHALL hide the Results_List.
2. WHEN the Results_List is hidden, THE Docs_Site SHALL preserve the current Query text in the Search_Input so the user can resume searching.
