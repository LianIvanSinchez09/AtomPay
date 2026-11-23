import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts)$/.test(entry.name)) files.push(full);
  }
}
walk(path.join(root, "src"));

let fixed = 0;
for (const file of files) {
  const code = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (relative.startsWith("src/i18n/")) continue;

  const depth = relative.split("/").length - 2;
  const expected = `${"../".repeat(depth)}i18n/translate`;
  const re = /from\s+"([^"]*i18n\/translate)"/g;
  let changed = false;
  const output = code.replace(re, (match, current) => {
    if (current === expected) return match;
    changed = true;
    return `from "${expected}"`;
  });

  if (changed) {
    fs.writeFileSync(file, output, "utf8");
    fixed++;
  }
}

console.log("Imports corregidos:", fixed);
