const fs = require("fs");
const path = require("path");

const CONNECTIONS_DIR = path.join(__dirname, "..", "..", "schemas");
const FIGMA_CONNECT_URL_PATTERN = /figma\.connect\(\s*["'`](https?:\/\/[^"'`]+)["'`]/i;

function loadConnections() {
  if (!fs.existsSync(CONNECTIONS_DIR)) return [];

  return fs
    .readdirSync(CONNECTIONS_DIR)
    .filter((file) => /^web-.+\.figma\.ts$/i.test(file))
    .map((file) => {
      const name = file.replace(/^web-/i, "").replace(/\.figma\.ts$/i, "");
      const fullPath = path.join(CONNECTIONS_DIR, file);
      const source = fs.readFileSync(fullPath, "utf8");
      const urlMatch = source.match(FIGMA_CONNECT_URL_PATTERN);
      const url = urlMatch ? String(urlMatch[1]) : "";

      return {
        name,
        url,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = () => {
  const connections = loadConnections();
  const componentNames = connections.map((entry) => entry.name);
  const byName = Object.fromEntries(componentNames.map((name) => [name, true]));
  const urlsByName = Object.fromEntries(
    connections.map((entry) => [entry.name, entry.url]),
  );

  return {
    componentNames,
    byName,
    urlsByName,
    sourceDir: "schemas",
  };
};
