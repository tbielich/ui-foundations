/**
 * Figma Plugin API script — Add Brand C to the UI Foundations library
 *
 * Run via: Plugins → Development → Brand C Sync
 *
 * This script:
 * 1. Adds the full Brand C color palette to "Core (Primitives)"
 * 2. Adds a "Brand C" mode to "Themes (Brands)"
 * 3. Sets alias values for all 17 brand tokens in the new mode
 * 4. Closes the plugin when done
 */

// ── Full Brand C Color Palette (from @tui/design-system) ────────────
const BRAND_C_PRIMITIVES = [
  { name: "Color/Brand C/Blue/10",  hex: "#1B115C" },
  { name: "Color/Brand C/Blue/20",  hex: "#072D92" },
  { name: "Color/Brand C/Blue/30",  hex: "#0A3CC2" },
  { name: "Color/Brand C/Blue/40",  hex: "#0C4BF3" },
  { name: "Color/Brand C/Blue/50",  hex: "#3567F6" },
  { name: "Color/Brand C/Blue/60",  hex: "#6D93F8" },
  { name: "Color/Brand C/Blue/70",  hex: "#94B0FA" },
  { name: "Color/Brand C/Blue/80",  hex: "#B6C8FC" },
  { name: "Color/Brand C/Blue/90",  hex: "#D8E2FD" },
  { name: "Color/Brand C/Blue/100", hex: "#ECF1FE" },
  { name: "Color/Brand C/Coolblue/10",  hex: "#054461" },
  { name: "Color/Brand C/Coolblue/20",  hex: "#076692" },
  { name: "Color/Brand C/Coolblue/30",  hex: "#0A88C2" },
  { name: "Color/Brand C/Coolblue/40",  hex: "#0CAAF3" },
  { name: "Color/Brand C/Coolblue/50",  hex: "#38B9F5" },
  { name: "Color/Brand C/Coolblue/60",  hex: "#70CBF4" },
  { name: "Color/Brand C/Coolblue/70",  hex: "#A9DFF8" },
  { name: "Color/Brand C/Coolblue/80",  hex: "#C6EAFB" },
  { name: "Color/Brand C/Coolblue/90",  hex: "#E2F4FD" },
  { name: "Color/Brand C/Coolblue/100", hex: "#F0FAFE" },
  { name: "Color/Brand C/Green/10",  hex: "#05423D" },
  { name: "Color/Brand C/Green/20",  hex: "#246F49" },
  { name: "Color/Brand C/Green/30",  hex: "#2BA168" },
  { name: "Color/Brand C/Green/40",  hex: "#30B675" },
  { name: "Color/Brand C/Green/50",  hex: "#61C48D" },
  { name: "Color/Brand C/Green/60",  hex: "#87D2A6" },
  { name: "Color/Brand C/Green/70",  hex: "#A9E0BF" },
  { name: "Color/Brand C/Green/80",  hex: "#C5E4CD" },
  { name: "Color/Brand C/Green/90",  hex: "#DFF6EB" },
  { name: "Color/Brand C/Green/100", hex: "#EFFBF5" },
  { name: "Color/Brand C/Red/10",  hex: "#600609" },
  { name: "Color/Brand C/Red/20",  hex: "#90090E" },
  { name: "Color/Brand C/Red/30",  hex: "#C00C12" },
  { name: "Color/Brand C/Red/40",  hex: "#F00F17" },
  { name: "Color/Brand C/Red/50",  hex: "#F23A41" },
  { name: "Color/Brand C/Red/60",  hex: "#F66F74" },
  { name: "Color/Brand C/Red/70",  hex: "#F89699" },
  { name: "Color/Brand C/Red/80",  hex: "#FAB7B9" },
  { name: "Color/Brand C/Red/90",  hex: "#FDE2E3" },
  { name: "Color/Brand C/Red/100", hex: "#FEECEC" },
  { name: "Color/Brand C/Orange/10",  hex: "#663D00" },
  { name: "Color/Brand C/Orange/20",  hex: "#995C00" },
  { name: "Color/Brand C/Orange/30",  hex: "#CC7A00" },
  { name: "Color/Brand C/Orange/40",  hex: "#FF9900" },
  { name: "Color/Brand C/Orange/50",  hex: "#FFAB2E" },
  { name: "Color/Brand C/Orange/60",  hex: "#FFC266" },
  { name: "Color/Brand C/Orange/70",  hex: "#FFD28F" },
  { name: "Color/Brand C/Orange/80",  hex: "#FFE0B2" },
  { name: "Color/Brand C/Orange/90",  hex: "#FFEFD6" },
  { name: "Color/Brand C/Orange/100", hex: "#FFF7EB" },
  { name: "Color/Brand C/Purple/10",  hex: "#39115C" },
  { name: "Color/Brand C/Purple/20",  hex: "#510792" },
  { name: "Color/Brand C/Purple/30",  hex: "#6C0AC2" },
  { name: "Color/Brand C/Purple/40",  hex: "#870CF3" },
  { name: "Color/Brand C/Purple/50",  hex: "#9C35F6" },
  { name: "Color/Brand C/Purple/60",  hex: "#B76DF8" },
  { name: "Color/Brand C/Purple/70",  hex: "#CA94FA" },
  { name: "Color/Brand C/Purple/80",  hex: "#DBB6FC" },
  { name: "Color/Brand C/Purple/90",  hex: "#ECD8FD" },
  { name: "Color/Brand C/Purple/100", hex: "#F5ECFE" },
  { name: "Color/Brand C/Midnight/10", hex: "#0B092D" },
];

// ── Brand C Theme Aliases (updated step names) ─────────────────────
const BRAND_C_ALIASES = [
  { brandToken: "Brand/Color/Functional/Success",   target: "Color/Brand C/Green/30" },
  { brandToken: "Brand/Color/Functional/Danger",    target: "Color/Brand C/Red/30" },
  { brandToken: "Brand/Color/Functional/Base",      target: "Color/Brand C/Blue/10" },
  { brandToken: "Brand/Color/Functional/Base Dark", target: "Color/Brand C/Midnight/10" },
  { brandToken: "Brand/Color/Primary",              target: "Color/Brand C/Blue/40" },
  { brandToken: "Brand/Color/Accent",               target: "Color/Brand C/Coolblue/60" },
  { brandToken: "Brand/Color/Primary Dark",         target: "Color/Brand C/Blue/10" },
  { brandToken: "Brand/Color/Accent Dark",          target: "Color/Brand C/Coolblue/10" },
  { brandToken: "Brand/Color/Subtle",               target: "Color/Neutral/500" },
  { brandToken: "Brand/Color/Subtle Dark",          target: "Color/Neutral/800" },
  { brandToken: "Brand/Color/Subtle Light",         target: "Color/Neutral/200" },
  { brandToken: "Brand/Font/Base",                  target: "Font/Family/Sans" },
  { brandToken: "Brand/Font/Lead",                  target: "Font/Family/Serif" },
  { brandToken: "Brand/Corner/Button",              target: "Size/Radius/full" },
  { brandToken: "Brand/Corner/Card",                target: "Size/Radius/300" },
  { brandToken: "Brand/Corner/Modal",               target: "Size/Radius/400" },
  { brandToken: "Brand/Corner/Input",               target: "Size/Radius/200" },
];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.substring(0, 2), 16) / 255, g: parseInt(h.substring(2, 4), 16) / 255, b: parseInt(h.substring(4, 6), 16) / 255 };
}

function cssVarName(n) { return "--" + n.replace(/\//g, "-").replace(/ /g, "-").toLowerCase(); }

function iosName(n) {
  const p = n.split("/");
  return p[0] + "." + p.slice(1).map((s, i) => { const c = s.replace(/[- ]/g, ""); return i === 0 ? c.charAt(0).toLowerCase() + c.slice(1) : c; }).join("");
}

function androidName(n) { return n.replace(/\//g, "_").replace(/[- ]/g, "_").toLowerCase(); }

async function syncBrandC() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const coreCollection = collections.find(c => c.name === "Core (Primitives)");
  const brandsCollection = collections.find(c => c.name === "Themes (Brands)");
  if (!coreCollection) { figma.notify('❌ "Core (Primitives)" not found', { error: true }); return; }
  if (!brandsCollection) { figma.notify('❌ "Themes (Brands)" not found', { error: true }); return; }

  const allVars = await figma.variables.getLocalVariablesAsync();
  const varByName = new Map();
  for (const v of allVars) varByName.set(v.name, v);
  const coreModeId = coreCollection.modes[0].modeId;

  let created = 0, skipped = 0;
  for (const prim of BRAND_C_PRIMITIVES) {
    if (varByName.has(prim.name)) { skipped++; continue; }
    const v = figma.variables.createVariable(prim.name, coreCollection, "COLOR");
    const rgb = hexToRgb(prim.hex);
    v.setValueForMode(coreModeId, { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });
    v.setVariableCodeSyntax("WEB", cssVarName(prim.name));
    v.setVariableCodeSyntax("iOS", iosName(prim.name));
    v.setVariableCodeSyntax("ANDROID", androidName(prim.name));
    varByName.set(prim.name, v);
    created++;
  }
  console.log("Primitives: " + created + " created, " + skipped + " skipped");

  const existingModes = brandsCollection.modes.map(m => m.name);
  let brandCModeId;
  if (existingModes.includes("Brand C")) {
    brandCModeId = brandsCollection.modes.find(m => m.name === "Brand C").modeId;
  } else {
    brandCModeId = brandsCollection.addMode("Brand C");
  }

  let setCount = 0;
  const missing = [];
  for (const alias of BRAND_C_ALIASES) {
    const brandVar = varByName.get(alias.brandToken);
    const targetVar = varByName.get(alias.target);
    if (!brandVar) { missing.push("brand: " + alias.brandToken); continue; }
    if (!targetVar) { missing.push("target: " + alias.target); continue; }
    brandVar.setValueForMode(brandCModeId, { type: "VARIABLE_ALIAS", id: targetVar.id });
    setCount++;
  }
  console.log("Aliases: " + setCount + "/" + BRAND_C_ALIASES.length);
  if (missing.length) console.warn("Missing:", missing);
  figma.notify("✅ Brand C: " + created + " primitives, " + setCount + " aliases");
}

syncBrandC().then(() => figma.closePlugin());
