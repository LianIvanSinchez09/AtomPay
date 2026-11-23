import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire("C:/Users/aleja/AppData/Local/Temp/opencode/asttools/");
const parser = require("@babel/parser");

const root = process.cwd();
const targets = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts)$/.test(entry.name)) targets.push(full);
  }
}
walk(path.join(root, "src"));

const results = [];

for (const file of targets) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (relative.startsWith("src/i18n/") || relative.startsWith("src/types/")) continue;
  const code = fs.readFileSync(file, "utf8");
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
      errorRecovery: true,
    });
  } catch {
    continue;
  }

  function visit(node, ancestors) {
    if (!node || typeof node.type !== "string") return;

    const inTr = ancestors.some(
      (parent) =>
        parent.type === "CallExpression" &&
        parent.callee &&
        parent.callee.type === "Identifier" &&
        parent.callee.name === "tr"
    );

    if (node.type === "StringLiteral" && !inTr) {
      const value = node.value;
      if (
        value.length >= 4 &&
        /[ÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(value) &&
        !/^(bg|text|border|rounded|flex|grid|shadow|from|to|via|dark|hover)-/.test(value)
      ) {
        results.push({
          file: relative,
          line: node.loc.start.line,
          kind: "string",
          text: value,
        });
      }
    }

    if (node.type === "TemplateLiteral" && !inTr) {
      const value = code.slice(node.start, node.end);
      if (/[ÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(value)) {
        results.push({
          file: relative,
          line: node.loc.start.line,
          kind: "template",
          text: value,
        });
      }
    }

    const next = [...ancestors, node];
    for (const key of Object.keys(node)) {
      if (key === "loc" || key === "leadingComments" || key === "trailingComments") {
        continue;
      }
      const value = node[key];
      if (Array.isArray(value)) {
        for (const child of value) {
          if (child && typeof child.type === "string") visit(child, next);
        }
      } else if (value && typeof value.type === "string") {
        visit(value, next);
      }
    }
  }

  visit(ast.program, []);
}

const unique = [
  ...new Map(results.map((r) => [`${r.file}:${r.line}:${r.text}`, r])).values(),
];
fs.writeFileSync(
  "C:/Users/aleja/AppData/Local/Temp/opencode/dynamic-left.json",
  JSON.stringify(unique, null, 2),
  "utf8"
);
console.log(unique.length);
