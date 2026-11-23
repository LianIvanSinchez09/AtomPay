import fs from "node:fs";
import path from "node:path";

const root = path.resolve("C:/Apps/Atompay/AtomPay");

// 1. Read phrases.ts
const phrasesContent = fs.readFileSync(path.join(root, "src/i18n/phrases.ts"), "utf8");
const phraseKeys = new Set();
for (const match of phrasesContent.matchAll(/^\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d_-]+)):\s/gm)) {
  const k = match[1] !== undefined ? match[1].replace(/\\"/g, '"') : match[2] !== undefined ? match[2] : match[3];
  phraseKeys.add(k);
}
console.log(`Total keys defined in phrases.ts: ${phraseKeys.size}`);

// 2. Find all files
const targets = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) targets.push(full);
  }
}
walk(path.join(root, "src"));

// 3. Find all tr("...") calls in codebase
const trCalls = new Map();
for (const file of targets) {
  if (file.endsWith("phrases.ts")) continue;
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const code = fs.readFileSync(file, "utf8");
  for (const m of code.matchAll(/\btr\(\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g)) {
    const text = m[1] !== undefined ? m[1].replace(/\\"/g, '"') : m[2];
    if (!trCalls.has(text)) trCalls.set(text, []);
    trCalls.get(text).push(relative);
  }
}

console.log(`Unique tr() arguments in codebase: ${trCalls.size}`);

const missingFromPhrases = [];
for (const [text, files] of trCalls) {
  if (!phraseKeys.has(text)) {
    missingFromPhrases.push({ text, files });
  }
}
console.log(`tr() calls MISSING in phrases.ts: ${missingFromPhrases.length}`);
if (missingFromPhrases.length > 0) {
  console.log("Missing tr entries:", JSON.stringify(missingFromPhrases, null, 2));
}

// 4. Find potential untranslated Spanish text across files (excluding i18n, types)
const untranslatedMatches = [];
for (const file of targets) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (relative.startsWith("src/i18n/") || relative.startsWith("src/types/")) continue;
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, idx) => {
    // Check if line contains Spanish chars but not inside tr( or t(
    if (/[áéíóúüñ¿¡]/i.test(line)) {
      // quick check: does the line have tr( or t(?
      // We want to see if there is text outside tr(...)
      untranslatedMatches.push({ file: relative, lineNum: idx + 1, line: line.trim() });
    }
  });
}

console.log(`Total lines containing Spanish characters: ${untranslatedMatches.length}`);
fs.writeFileSync(path.join(root, "scripts/spanish-lines.json"), JSON.stringify(untranslatedMatches, null, 2));
