import fs from "node:fs";
import path from "node:path";

const root = path.resolve("C:/Apps/Atompay/AtomPay");

// Read phrases.ts
const phrasesContent = fs.readFileSync(path.join(root, "src/i18n/phrases.ts"), "utf8");
const existingKeys = new Set();
for (const match of phrasesContent.matchAll(/^\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d_-]+)):\s/gm)) {
  const k = match[1] !== undefined ? match[1].replace(/\\"/g, '"') : match[2] !== undefined ? match[2] : match[3];
  existingKeys.add(k);
}
console.log(`Currently defined keys in phrases.ts: ${existingKeys.size}`);

// Find all files in src
const targets = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "scripts") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) targets.push(full);
  }
}
walk(path.join(root, "src"));

const trStrings = new Set();
for (const file of targets) {
  if (file.endsWith("phrases.ts")) continue;
  const code = fs.readFileSync(file, "utf8");
  // Match tr("...") or tr('...')
  for (const m of code.matchAll(/\btr\(\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g)) {
    const str = m[1] !== undefined ? m[1].replace(/\\"/g, '"') : m[2];
    trStrings.add(str);
  }
}

console.log(`Unique tr("...") strings in codebase: ${trStrings.size}`);

const missing = [];
for (const s of trStrings) {
  // Ignore examples inside comments in translate.ts: "texto en español", "Hola {nombre}"
  if (s === "texto en español" || s === "Hola {nombre}") continue;
  if (!existingKeys.has(s)) {
    missing.push(s);
  }
}

console.log(`Total missing translations in phrases.ts: ${missing.length}`);
fs.writeFileSync(path.join(root, "scripts/missing-phrases.json"), JSON.stringify(missing.sort(), null, 2));
console.log("Missing keys:", missing);
