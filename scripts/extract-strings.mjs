import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targets = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx$/.test(entry.name)) targets.push(full);
  }
}

walk(path.join(root, "src"));

const results = new Map();

function add(value, file) {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return;
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(text)) return;
  if (/^[\d\s.,:;%$+\-–—/()]+$/.test(text)) return;
  if (text.length < 2) return;
  if (/^https?:\/\//.test(text)) return;
  if (/^[.#/]/.test(text)) return;
  if (/\b(bg|text|border|rounded|flex|grid|px|py|mt|mb|gap|dark):/.test(text)) return;
  if (/^[a-z0-9-]+$/.test(text)) return;
  if (/^(GET|POST|PATCH|DELETE|PUT)$/.test(text)) return;
  if (/^[A-Za-z]+\.[A-Za-z0-9_.]+$/.test(text)) return;
  if (/^[a-z]+[A-Z]/.test(text)) return;
  if (["div", "span", "button", "input", "form", "svg"].includes(text)) return;
  if (!results.has(text)) results.set(text, new Set());
  results.get(text).add(path.relative(root, file));
}

const ATTR_RE = /(placeholder|title|alt|aria-label|label|description)\s*=\s*["']([^"']+)["']/g;

for (const file of targets) {
  const source = fs.readFileSync(file, "utf8");

  // JSX text nodes between > and <
  const textRe = />\s*([^<>{}\n][^<>{}]*?)\s*</g;
  let match;
  while ((match = textRe.exec(source))) add(match[1], file);

  // Multi-line JSX text: lines that look like plain prose
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^[<>{}\[\]()/*]/.test(trimmed)) continue;
    if (/[=;]/.test(trimmed)) continue;
    if (/^import |^export |^const |^let |^var |^function |^return |^if |^else |^type |^interface /.test(trimmed)) continue;
    if (!/[ÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(trimmed)) continue;
    add(trimmed, file);
  }

  while ((match = ATTR_RE.exec(source))) add(match[2], file);

  // String literals that contain Spanish accents or common Spanish words
  const litRe = /(["'`])((?:[^"'`\\]|\\.){3,}?)\1/g;
  while ((match = litRe.exec(source))) {
    const value = match[2];
    if (!/[ÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(value) && !/\b(de|el|la|los|las|una|con|para|por|que|del|al|en)\b/i.test(value)) continue;
    add(value, file);
  }
}

const rows = [...results.entries()]
  .map(([text, files]) => ({
    text,
    count: files.size,
    files: [...files].slice(0, 3).join(", "),
  }))
  .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));

console.log("TOTAL UNIQUE:", rows.length);
for (const row of rows) {
  console.log(`[${row.count}] ${JSON.stringify(row.text)}  -> ${row.files}`);
}

fs.writeFileSync(
  "C:/Users/aleja/AppData/Local/Temp/opencode/strings.json",
  JSON.stringify(rows, null, 2),
  "utf8"
);
