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
    else if (/\.tsx$/.test(entry.name)) targets.push(full);
  }
}

walk(path.join(root, "src"));

const TEXT_PROPS = new Set([
  "placeholder",
  "title",
  "alt",
  "aria-label",
  "label",
  "description",
  "text",
  "message",
  "emptyMessage",
]);

const records = [];

function push(kind, value, file, line) {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return;
  records.push({
    kind,
    text,
    raw: value,
    file: path.relative(root, file),
    line,
  });
}

for (const file of targets) {
  const code = fs.readFileSync(file, "utf8");
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
      errorRecovery: true,
    });
  } catch (error) {
    console.error("PARSE FAIL", file, error.message);
    continue;
  }

  function visit(node) {
    if (!node || typeof node.type !== "string") return;

    if (node.type === "JSXText") {
      push("jsx", node.value, file, node.loc.start.line);
    }

    if (
      node.type === "JSXAttribute" &&
      node.name &&
      node.name.type === "JSXIdentifier" &&
      TEXT_PROPS.has(node.name.name) &&
      node.value
    ) {
      if (node.value.type === "StringLiteral") {
        push("attr", node.value.value, file, node.value.loc.start.line);
      } else if (
        node.value.type === "JSXExpressionContainer" &&
        node.value.expression.type === "StringLiteral"
      ) {
        push("attr", node.value.expression.value, file, node.value.expression.loc.start.line);
      }
    }

    if (
      node.type === "JSXExpressionContainer" &&
      node.expression.type === "StringLiteral"
    ) {
      push("expr", node.expression.value, file, node.expression.loc.start.line);
    }

    if (
      (node.type === "ObjectProperty" || node.type === "Property") &&
      node.key &&
      (node.key.type === "Identifier" || node.key.type === "StringLiteral")
    ) {
      const key = node.key.type === "Identifier" ? node.key.name : node.key.value;
      if (TEXT_PROPS.has(key) && node.value && node.value.type === "StringLiteral") {
        push("prop", node.value.value, file, node.value.loc.start.line);
      }
    }

    if (
      node.type === "CallExpression" &&
      node.callee &&
      (node.callee.name === "setError" ||
        node.callee.name === "setFeedback") &&
      node.arguments[0] &&
      node.arguments[0].type === "StringLiteral"
    ) {
      push("call", node.arguments[0].value, file, node.arguments[0].loc.start.line);
    }

    if (node.type === "TSLiteralType" && node.literal && node.literal.type === "StringLiteral") {
      // union type keys, ignore
    }

    for (const key of Object.keys(node)) {
      if (key === "loc" || key === "leadingComments" || key === "trailingComments") continue;
      const value = node[key];
      if (Array.isArray(value)) {
        for (const child of value) {
          if (child && typeof child.type === "string") visit(child);
        }
      } else if (value && typeof value.type === "string") {
        visit(value);
      }
    }
  }

  visit(ast.program);
}

const byText = new Map();
for (const record of records) {
  if (!byText.has(record.text)) byText.set(record.text, []);
  byText.get(record.text).push(record);
}

const rows = [...byText.entries()]
  .map(([text, list]) => ({
    text,
    kinds: [...new Set(list.map((r) => r.kind))],
    count: list.length,
    files: [...new Set(list.map((r) => r.file))].slice(0, 4),
  }))
  .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));

fs.writeFileSync(
  "C:/Users/aleja/AppData/Local/Temp/opencode/strings-clean.json",
  JSON.stringify(rows, null, 2),
  "utf8"
);

console.log("TOTAL:", rows.length);
