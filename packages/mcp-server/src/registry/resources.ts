/**
 * Resource registry definitions for the UI Foundations MCP Server.
 *
 * Declarative array of all resource entries. Each entry specifies a URI,
 * name, description, MIME type, category, and handler function.
 *
 * Handler implementations are stubs pending Task 6. They throw
 * "Handler not implemented" to signal that the wiring is in place
 * but the actual file-reading logic is not yet connected.
 *
 * @module registry/resources
 */

import type { ResourceRegistryEntry, ResourceResponse } from '../types.js';
import { handleManifest } from '../resources/manifest.js';
import { handleAgentResource } from '../resources/agents.js';
import { handleTokens } from '../resources/tokens.js';
import { handleComponents } from '../resources/components.js';
import { handleFoundations } from '../resources/foundations.js';
import { handlePatterns } from '../resources/patterns.js';
import { handleGovernanceResource } from '../resources/governance.js';
import { listComponents } from '../resources/components.js';
import { listPatterns } from '../resources/patterns.js';
import { listFoundations } from '../resources/foundations.js';

/** Placeholder handler used until real handlers are wired in Task 6. */
const notImplemented = async (_uri: string, _rootPath: string): Promise<ResourceResponse> => {
  throw new Error('Handler not implemented');
};

/**
 * All registered resource entries covering:
 * - manifest (context manifest, version)
 * - agents (rules, behavior, design contract, implementation)
 * - tokens (core, semantic, component, modes, brands)
 * - components (listing + individual template)
 * - patterns (listing + individual template)
 * - governance (rules, naming, layering)
 * - foundations (listing + individual template)
 */
export const resources: ResourceRegistryEntry[] = [
  // ---------------------------------------------------------------------------
  // Manifest
  // ---------------------------------------------------------------------------
  {
    uri: 'uif://manifest/context',
    name: 'Context Manifest',
    description: 'Machine-readable JSON index of all available context files, directories, and token sources with loading priorities.',
    mimeType: 'application/json',
    category: 'manifest',
    handler: handleManifest,
  },
  {
    uri: 'uif://manifest/version',
    name: 'Package Version',
    description: 'Current package version from the repository root package.json.',
    mimeType: 'application/json',
    category: 'manifest',
    handler: handleManifest,
  },

  // ---------------------------------------------------------------------------
  // Agents
  // ---------------------------------------------------------------------------
  {
    uri: 'uif://agents/rules',
    name: 'Agent Rules',
    description: 'AGENTS.md — core agent behavior rules including context loading order, decision bias, and validation requirements.',
    mimeType: 'text/markdown',
    category: 'agents',
    handler: handleAgentResource,
  },
  {
    uri: 'uif://agents/behavior',
    name: 'Assistant Behavior Rules',
    description: 'Detailed assistant behavior rules covering the 10-surface component workflow, token naming, and implementation standards.',
    mimeType: 'text/markdown',
    category: 'agents',
    handler: handleAgentResource,
  },
  {
    uri: 'uif://agents/design-contract',
    name: 'Design Contract',
    description: 'DESIGN.md — executive design contract defining the system architecture and guiding principles.',
    mimeType: 'text/markdown',
    category: 'agents',
    handler: handleAgentResource,
  },
  {
    uri: 'uif://agents/implementation',
    name: 'Implementation Guide',
    description: 'IMPLEMENTATION.md — repo-specific execution guidance for agents working in the codebase.',
    mimeType: 'text/markdown',
    category: 'agents',
    handler: handleAgentResource,
  },

  // ---------------------------------------------------------------------------
  // Tokens
  // ---------------------------------------------------------------------------
  {
    uri: 'uif://tokens/core',
    name: 'Core Primitives Tokens',
    description: 'Raw design token values (spacing, radii, borders, typography) from the Core/Primitives layer in DTCG format.',
    mimeType: 'application/json',
    category: 'tokens',
    handler: handleTokens,
  },
  {
    uri: 'uif://tokens/semantic',
    name: 'Semantic Role Tokens',
    description: 'Intent-based tokens (color-text-default, color-fill-surface) from the Semantics/Roles layer in DTCG format.',
    mimeType: 'application/json',
    category: 'tokens',
    handler: handleTokens,
  },
  {
    uri: 'uif://tokens/component',
    name: 'Component UI Tokens',
    description: 'Component-specific tokens (button-solid-border-color-default) from the Components/UI layer in DTCG format.',
    mimeType: 'application/json',
    category: 'tokens',
    handler: handleTokens,
  },
  {
    uri: 'uif://tokens/modes',
    name: 'Appearance Mode Tokens',
    description: 'Light and dark color palette tokens combined into a single response with mode-light and mode-dark keys.',
    mimeType: 'application/json',
    category: 'tokens',
    handler: handleTokens,
  },
  {
    uri: 'uif://tokens/brands',
    name: 'Brand Theme Tokens',
    description: 'Brand-specific theme override tokens with one key per brand file found in the themes-brands token directory.',
    mimeType: 'application/json',
    category: 'tokens',
    handler: handleTokens,
  },

  // ---------------------------------------------------------------------------
  // Components
  // ---------------------------------------------------------------------------
  {
    uri: 'uif://components',
    name: 'Component Listing',
    description: 'JSON array of all available UI components with name, description, and resource URI.',
    mimeType: 'application/json',
    category: 'components',
    handler: handleComponents,
  },
  {
    uri: 'uif://components/{name}',
    name: 'Component Detail',
    description: 'Structured JSON for an individual component including documentation, CSS pattern, variants, states, tokens, and Code Connect schema.',
    mimeType: 'application/json',
    category: 'components',
    handler: handleComponents,
    listCallback: listComponents,
  },

  // ---------------------------------------------------------------------------
  // Patterns
  // ---------------------------------------------------------------------------
  {
    uri: 'uif://patterns',
    name: 'Pattern Listing',
    description: 'JSON array of all available composition patterns with name, description, and resource URI.',
    mimeType: 'application/json',
    category: 'patterns',
    handler: handlePatterns,
  },
  {
    uri: 'uif://patterns/{name}',
    name: 'Pattern Detail',
    description: 'Full pattern documentation including composition rules, interaction guidance, accessibility considerations, and related tokens.',
    mimeType: 'application/json',
    category: 'patterns',
    handler: handlePatterns,
    listCallback: listPatterns,
  },

  // ---------------------------------------------------------------------------
  // Governance
  // ---------------------------------------------------------------------------
  {
    uri: 'uif://governance/rules',
    name: 'Governance Rules',
    description: 'Canonical operating rules from docs/ui-foundations-rules.md covering naming, layering, theming, and review standards.',
    mimeType: 'text/markdown',
    category: 'governance',
    handler: handleGovernanceResource,
  },
  {
    uri: 'uif://governance/naming',
    name: 'Naming Conventions',
    description: 'Foundation document on naming and grouping conventions for tokens, components, and patterns.',
    mimeType: 'text/markdown',
    category: 'governance',
    handler: handleGovernanceResource,
  },
  {
    uri: 'uif://governance/layering',
    name: 'Token Layering',
    description: 'Foundation document on the token layer architecture (Core → Semantic → Component) and referencing rules.',
    mimeType: 'text/markdown',
    category: 'governance',
    handler: handleGovernanceResource,
  },

  // ---------------------------------------------------------------------------
  // Foundations
  // ---------------------------------------------------------------------------
  {
    uri: 'uif://foundations',
    name: 'Foundation Document Listing',
    description: 'JSON array of all architecture decision records (foundations) with identifier, title, and resource URI.',
    mimeType: 'application/json',
    category: 'foundations',
    handler: handleFoundations,
  },
  {
    uri: 'uif://foundations/{id}',
    name: 'Foundation Document',
    description: 'Individual architecture decision record from docs/foundations/ as markdown content.',
    mimeType: 'text/markdown',
    category: 'foundations',
    handler: handleFoundations,
    listCallback: listFoundations,
  },
];
