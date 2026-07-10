const { VAULT_NAMING_CONTRACT } = require("./vault-naming-contract.generated.js");

function legacyComponentNames() {
  return VAULT_NAMING_CONTRACT.runtimeCompatibilityInputs.legacyComponentNames;
}

function isComponentName(value) {
  return legacyComponentNames().includes(String(value || ""));
}

function legacyTokenComponent(name) {
  const value = String(name || "");
  if (!value.startsWith("--")) return null;

  const candidate = value.slice(2).split("-").filter(Boolean);
  while (candidate.length > 0) {
    const component = candidate.join("-");
    if (isComponentName(component)) return component;
    candidate.pop();
  }
  return null;
}

function formatMessage(template, replacements) {
  return String(template).replace(/\{([a-zA-Z0-9]+)\}/g, (_match, key) => replacements[key] ?? "");
}

function migrationMessage(kind, value, component) {
  if (kind === "token") {
    const policy = VAULT_NAMING_CONTRACT.customPropertyPrefix.compatibility.legacyComponentTokens;
    return formatMessage(policy.message, {
      value,
      component,
      canonicalTokenWildcard: `${VAULT_NAMING_CONTRACT.customPropertyPrefix.canonical}${component}-*`,
    });
  }
  if (kind === "class") {
    const policy = VAULT_NAMING_CONTRACT.classPrefix.compatibility.bareClasses;
    return formatMessage(policy.message, {
      value,
      component,
      canonicalClass: `${VAULT_NAMING_CONTRACT.classPrefix.canonical}${component}`,
    });
  }
  return `Invalid ${kind} "${value}" does not match the Vault Naming Contract.`;
}

function experimentalTokenPrefixes() {
  return [
    VAULT_NAMING_CONTRACT.customPropertyPrefix.proof,
    VAULT_NAMING_CONTRACT.customPropertyPrefix.assumption,
  ];
}

function classifyPatternTokenName(name) {
  const value = String(name || "");
  const experimentalPrefix = experimentalTokenPrefixes().find((prefix) => value.startsWith(prefix));
  if (experimentalPrefix) {
    return { status: "canonical", prefix: experimentalPrefix, message: null };
  }

  const canonical = VAULT_NAMING_CONTRACT.customPropertyPrefix.canonical;
  if (value.startsWith(canonical)) {
    const component = value.slice(canonical.length).split("-")[0];
    return { status: "canonical", prefix: canonical, component, message: null };
  }

  const component = legacyTokenComponent(value);
  if (component) {
    return {
      status: VAULT_NAMING_CONTRACT.customPropertyPrefix.compatibility.legacyComponentTokens.status,
      prefix: `--${component}-`,
      component,
      message: migrationMessage("token", value, component),
    };
  }

  return {
    status: "invalid",
    prefix: null,
    component: null,
    message: `Invalid pattern token "${value}". Use "${canonical}[component]-*", "${VAULT_NAMING_CONTRACT.customPropertyPrefix.proof}*", or "${VAULT_NAMING_CONTRACT.customPropertyPrefix.assumption}*".`,
  };
}

function classifyPublicClassName(name) {
  const value = String(name || "");
  const canonical = VAULT_NAMING_CONTRACT.classPrefix.canonical;
  if (value.startsWith(canonical)) {
    return { status: "canonical", prefix: canonical, message: null };
  }

  const invalidPrefix = VAULT_NAMING_CONTRACT.classPrefix.invalidPrefixes.find((prefix) => value.startsWith(prefix));
  if (invalidPrefix) {
    return {
      status: "invalid",
      prefix: invalidPrefix,
      message: `Invalid public class "${value}". Vault reserves the canonical public class prefix for "${canonical}*".`,
    };
  }

  const component = legacyComponentNames().find((candidate) => value === candidate || value.startsWith(`${candidate}-`));
  if (component) {
    return {
      status: VAULT_NAMING_CONTRACT.classPrefix.compatibility.bareClasses.status,
      prefix: "",
      component,
      message: migrationMessage("class", value, component),
    };
  }

  return {
    status: "invalid",
    prefix: null,
    message: `Invalid public class "${value}". Use "${canonical}[component]" for public component classes.`,
  };
}

function classifyPatternId(id) {
  const value = String(id || "");
  const prefix = VAULT_NAMING_CONTRACT.patternIdPrefixes.find((candidate) => value.startsWith(candidate));
  if (prefix) return { status: "canonical", prefix, message: null };
  return {
    status: "invalid",
    prefix: null,
    message: `Invalid pattern id "${value}". Use one of: ${VAULT_NAMING_CONTRACT.patternIdPrefixes.join(", ")}.`,
  };
}

module.exports = {
  VAULT_NAMING_CONTRACT,
  classifyPatternId,
  classifyPatternTokenName,
  classifyPublicClassName,
  legacyTokenComponent,
};
