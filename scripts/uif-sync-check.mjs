#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const promotionStatuses = ["draft", "proposed", "approved", "rejected", "promoted"];
const versionStatuses = ["stable", "snapshot", "experimental"];
const refTypes = ["tag", "sha", "branch"];
const statusToRefType = {
  stable: "tag",
  snapshot: "sha",
  experimental: "branch",
};

const requiredPaths = [
  ".uif/registry",
  ".uif/registry/source.yml",
  ".uif/registry/sync-policy.yml",
  ".uif/registry/governance-hierarchy.md",
  ".uif/schemas",
  ".uif/schemas/source.schema.json",
  ".uif/schemas/sync-policy.schema.json",
  ".uif/schemas/workspace-decision.schema.json",
  ".uif/schemas/workspace-override.schema.json",
  ".uif/schemas/workspace-lesson.schema.json",
  ".uif/schemas/workspace-reflection.schema.json",
  ".uif/packs",
  ".uif/packs/agent",
  ".uif/packs/governance",
  ".uif/packs/runtime",
  ".uif/workspace",
  ".uif/workspace/decisions",
  ".uif/workspace/overrides",
  ".uif/workspace/lessons",
  ".uif/workspace/reflection",
];

const errors = [];

for (const relativePath of requiredPaths) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    errors.push(`Missing: ${relativePath}`);
  }
}

function requireField(object, fieldPath) {
  const parts = fieldPath.split(".");
  let current = object;

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      errors.push(`Missing required field: ${fieldPath}`);
      return undefined;
    }
    current = current[part];
  }

  return current;
}

function requireEnum(value, allowed, fieldPath) {
  if (!allowed.includes(value)) {
    errors.push(`Invalid enum value at ${fieldPath}: ${String(value)}`);
  }
}

function requireArray(value, fieldPath) {
  if (!Array.isArray(value)) {
    errors.push(`Expected array at ${fieldPath}`);
  }
}

async function readYaml(relativePath) {
  const content = await readFile(path.join(root, relativePath), "utf8");
  return yaml.load(content);
}

function validateSource(source) {
  requireField(source, "schemaVersion");
  requireField(source, "kind");
  requireField(source, "metadata.repository");
  requireField(source, "metadata.repositoryType");
  requireField(source, "metadata.version");
  requireField(source, "vault.repository");
  requireField(source, "vault.remote");
  requireField(source, "vault.ref.strategy.stable");
  requireField(source, "vault.ref.strategy.snapshot");
  requireField(source, "vault.ref.strategy.experimental");

  const currentRefType = requireField(source, "vault.ref.current.type");
  const currentRefStatus = requireField(source, "vault.ref.current.status");
  requireField(source, "vault.ref.current.value");
  requireEnum(currentRefType, refTypes, "vault.ref.current.type");
  requireEnum(currentRefStatus, versionStatuses, "vault.ref.current.status");

  if (currentRefStatus && currentRefType && statusToRefType[currentRefStatus] !== currentRefType) {
    errors.push("Vault current ref type must match its status strategy.");
  }

  const consumedPacks = requireField(source, "consumption.consumedPacks");
  requireArray(consumedPacks, "consumption.consumedPacks");

  for (const [index, pack] of (consumedPacks || []).entries()) {
    const prefix = `consumption.consumedPacks[${index}]`;
    for (const field of ["id", "path", "lastKnownVersion", "versionStatus", "versionRef", "description"]) {
      requireField(pack, field);
    }

    requireEnum(pack.versionStatus, versionStatuses, `${prefix}.versionStatus`);
    requireEnum(pack.versionRef?.type, refTypes, `${prefix}.versionRef.type`);

    if (pack.versionStatus && pack.versionRef?.type && statusToRefType[pack.versionStatus] !== pack.versionRef.type) {
      errors.push(`${prefix}.versionRef.type must match versionStatus.`);
    }

    if (pack.lastKnownVersion === "unknown" && pack.versionStatus !== "experimental") {
      errors.push(`${prefix}.lastKnownVersion may be unknown only when versionStatus is experimental.`);
    }
  }
}

function validatePolicy(policy) {
  requireField(policy, "schemaVersion");
  requireField(policy, "kind");
  requireField(policy, "metadata.repository");
  requireField(policy, "metadata.repositoryType");
  requireField(policy, "metadata.mode");
  requireField(policy, "policy.automaticSyncAllowed");
  requireField(policy, "policy.fileMutationAllowed");
  requireField(policy, "versioning.packVersioning.stable.refType");
  requireField(policy, "versioning.packVersioning.snapshot.refType");
  requireField(policy, "versioning.packVersioning.experimental.refType");
  requireField(policy, "versioning.unknownVersionAllowedOnlyWhenStatus");
  requireField(policy, "review.owners.governance");
  requireField(policy, "review.owners.runtime");
  requireField(policy, "review.owners.agent");

  if (policy.policy?.automaticSyncAllowed !== false) {
    errors.push("policy.automaticSyncAllowed must be false.");
  }

  if (policy.policy?.fileMutationAllowed !== false) {
    errors.push("policy.fileMutationAllowed must be false.");
  }

  const statuses = requireField(policy, "promotion.candidateStatuses");
  requireArray(statuses, "promotion.candidateStatuses");
  if (Array.isArray(statuses) && statuses.join("|") !== promotionStatuses.join("|")) {
    errors.push("promotion.candidateStatuses must be draft, proposed, approved, rejected, promoted.");
  }

  const conflictPriority = requireField(policy, "conflicts.priority");
  requireArray(conflictPriority, "conflicts.priority");
  const requiredPriority = [
    "local-runtime-safety-rules",
    "local-documented-overrides",
    "consumed-vault-packs",
    "generic-agent-rules",
  ];
  if (Array.isArray(conflictPriority) && conflictPriority.join("|") !== requiredPriority.join("|")) {
    errors.push("conflicts.priority does not match the required priority order.");
  }
}

function parseFrontmatter(content, relativePath) {
  if (!content.startsWith("---\n")) {
    errors.push(`Missing YAML frontmatter: ${relativePath}`);
    return {};
  }

  const end = content.indexOf("\n---", 4);
  if (end === -1) {
    errors.push(`Unclosed YAML frontmatter: ${relativePath}`);
    return {};
  }

  return yaml.load(content.slice(4, end)) || {};
}

function validateWorkspaceFrontmatter(frontmatter, relativePath, expectedKind) {
  const required = ["schemaVersion", "kind", "id", "status", "date", "owner"];
  for (const field of required) {
    requireField(frontmatter, field);
  }

  if (frontmatter.kind !== expectedKind) {
    errors.push(`${relativePath} kind must be ${expectedKind}.`);
  }

  requireEnum(frontmatter.status, promotionStatuses, `${relativePath}.status`);

  const requiredByKind = {
    UIFDecisionRecord: ["relatedPacks", "affectedArtifacts", "promotionCandidate"],
    UIFOverride: ["sourcePack", "sourceRule", "affectedArtifacts", "reviewRequired", "promotionCandidate"],
    UIFLesson: ["relatedPacks", "affectedArtifacts", "shouldPromoteToVault"],
    UIFReflection: ["trigger", "relatedPacks", "promotionCandidate"],
  };

  for (const field of requiredByKind[expectedKind] || []) {
    requireField(frontmatter, field);
  }

  for (const field of ["relatedPacks", "affectedArtifacts"]) {
    if (field in frontmatter) {
      requireArray(frontmatter[field], `${relativePath}.${field}`);
    }
  }

  for (const field of ["promotionCandidate", "reviewRequired"]) {
    if (field in frontmatter && typeof frontmatter[field] !== "boolean") {
      errors.push(`Expected boolean at ${relativePath}.${field}`);
    }
  }
}

async function validateWorkspaceDirectory(directory, expectedKind) {
  const fullDirectory = path.join(root, ".uif/workspace", directory);
  const entries = await readdir(fullDirectory);

  for (const entry of entries) {
    if (!entry.endsWith(".md")) {
      continue;
    }

    const relativePath = `.uif/workspace/${directory}/${entry}`;
    const content = await readFile(path.join(root, relativePath), "utf8");
    validateWorkspaceFrontmatter(parseFrontmatter(content, relativePath), relativePath, expectedKind);
  }
}

if (errors.length === 0) {
  validateSource(await readYaml(".uif/registry/source.yml"));
  validatePolicy(await readYaml(".uif/registry/sync-policy.yml"));
  await validateWorkspaceDirectory("decisions", "UIFDecisionRecord");
  await validateWorkspaceDirectory("overrides", "UIFOverride");
  await validateWorkspaceDirectory("lessons", "UIFLesson");
  await validateWorkspaceDirectory("reflection", "UIFReflection");
}

if (errors.length > 0) {
  console.error("UIF governance structure check failed.");
  for (const error of errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log("UIF governance structure and registry check passed.");
