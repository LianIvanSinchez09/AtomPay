import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const targets: string[] = [];

function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx$/.test(entry.name)) targets.push(full);
  }
}

walk(path.join(root, "src"));

const ATTRS = new Set([
  "placeholder",
  "title",
  "alt",
  "aria-label",
  "label",
  "description",
]);

const SKIP_PROPS = new Set([
  "className",
  "style",
  "type",
  "role",
  "name",
  "id",
  "htmlFor",
  "href",
  "to",
  "path",
  "key",
  "src",
  "target",
  "rel",
  "method",
  "autoComplete",
  "accept",
  "viewBox",
  "fill",
  "stroke",
  "d",
  "layoutId",
]);

const results = new Map<string, Set<string>>();

function add(value: string, file: string) {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return;
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(text)) return;
  if (/^[\d\s.,:;%$+\-–—/()]+$/.test(text)) return;
  if (text.length < 2) return;
  if (/^https?:\/\//.test(text)) return;
  if (/^[.#/]/.test(text)) return;
  if (/\b(bg|text|border|rounded|flex|grid|px|py|mt|mb|w|h|gap|dark):/.test(text)) return;
  if (/^[a-z0-9-]+$/.test(text) && !["ok"].includes(text)) return;
  if (/^(GET|POST|PATCH|DELETE|PUT)$/.test(text)) return;
  if (/^[A-Za-z]+\.[A-Za-z0-9_.]+$/.test(text)) return;
  if (/^[a-z]+[A-Z]/.test(text)) return;
  if (["div", "span", "button", "input", "form", "svg"].includes(text)) return;
  if (!results.has(text)) results.set(text, new Set());
  results.get(text)!.add(path.relative(root, file));
}

for (const file of targets) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  function visit(node: ts.Node) {
    if (ts.isJsxText(node)) {
      add(node.getText(source), file);
    } else if (ts.isStringLiteral(node)) {
      const parent = node.parent;
      let allowed = false;

      if (ts.isJsxAttribute(parent)) {
        const name = parent.name.getText(source);
        allowed = ATTRS.has(name);
        if (SKIP_PROPS.has(name)) allowed = false;
      } else if (
        ts.isJsxExpression(parent) ||
        ts.isConditionalExpression(parent) ||
        ts.isBinaryExpression(parent) ||
        ts.isArrayLiteralExpression(parent) ||
        ts.isPropertyAssignment(parent) ||
        ts.isReturnStatement(parent) ||
        ts.isCallExpression(parent)
      ) {
        allowed = true;
      }

      if (allowed) add(node.text, file);
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
}

const rows = [...results.entries()]
  .map(([text, files]) => ({ text, count: files.size, files: [...files].slice(0, 3).join(", ") }))
  .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));

console.log("TOTAL UNIQUE:", rows.length);
for (const row of rows) {
  console.log(`[${row.count}] ${JSON.stringify(row.text)}  -> ${row.files}`);
}
