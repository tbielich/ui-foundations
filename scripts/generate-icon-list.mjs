import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const iconsDir = path.join(REPO_ROOT, "src", "assets", "icons");
const outPath = path.join(REPO_ROOT, "schemas", "icon-names.ts");

function getIconNames() {
  return fs
    .readdirSync(iconsDir)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => file.replace(/\.svg$/i, ""))
    .sort((a, b) => a.localeCompare(b));
}

function buildContent(names) {
  const lines = [];
  lines.push("// Auto-generated from src/assets/icons.");
  lines.push("// Re-generate this file after adding or removing icons.");
  lines.push("");
  lines.push("export const ICON_NAMES = [");
  names.forEach((name) => lines.push(`  \"${name}\",`));
  lines.push("] as const;");
  lines.push("");
  lines.push("function toOptionLabel(name: string) {");
  lines.push("  if (name === \"none\") return \"None Icon\";");
  lines.push("");
  lines.push("  return name");
  lines.push("    .split(\"-\")");
  lines.push("    .filter(Boolean)");
  lines.push(
    "    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))",
  );
  lines.push("    .join(\" \");");
  lines.push("}");
  lines.push("");
  lines.push(
    "export const ICON_ENUM_OPTIONS: Record<string, string> = Object.fromEntries(",
  );
  lines.push("  ICON_NAMES.map((name) => [toOptionLabel(name), name]),");
  lines.push(");");
  lines.push("");
  lines.push("export const ICON_ENUM_OPTIONS_WITH_NONE: Record<string, string> = {");
  lines.push("  None: \"\",");
  lines.push("  ...ICON_ENUM_OPTIONS,");
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

const names = getIconNames();
const content = buildContent(names);
fs.writeFileSync(outPath, content);

console.log(`✅ Generated ${path.relative(REPO_ROOT, outPath)} (${names.length} icons)`);
