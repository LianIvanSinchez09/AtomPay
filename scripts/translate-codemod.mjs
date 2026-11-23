import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire("C:/Users/aleja/AppData/Local/Temp/opencode/asttools/");
const parser = require("@babel/parser");

const root = process.cwd();
const phrasesModule = fs.readFileSync(path.join(root, "src/i18n/phrases.ts"), "utf8");

const phraseKeys = new Set();
for (const match of phrasesModule.matchAll(
  /^\s{2}(?:"((?:[^"\\]|\\.)*)"|([A-Za-zÁÉÍÓÚÜÑáéíóúüñ][\wÁÉÍÓÚÜÑáéíóúüñ]*)):\s/gm
)) {
  phraseKeys.add(match[1] !== undefined ? match[1].replace(/\\"/g, '"') : match[2]);
}

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
  "shortLabel",
]);

const DATA_PROP_KEYS = new Set([
  "label",
  "shortLabel",
  "description",
  "title",
  "text",
  "message",
  "emptyMessage",
]);

const DATA_KEYS = new Set([
  "status",
  "value",
  "type",
  "kind",
  "action",
  "source",
  "path",
  "href",
  "to",
  "id",
  "code",
  "slug",
  "key",
  "name",
]);

const COMPARISON_OPERATORS = new Set([
  "===",
  "!==",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "in",
  "instanceof",
]);

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

const APPLY = process.argv.includes("--apply");
const report = [];

function normalize(value) {
  return value.replace(/\s+/g, " ").trim();
}

function escapeString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

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
  } catch (error) {
    console.error("PARSE FAIL", relative, error.message);
    continue;
  }

  const replacements = [];
  const alreadyImported = /from\s+["'][^"']*i18n\/translate["']/.test(code);

  function add(start, end, text) {
    replacements.push({ start, end, text });
  }

  function inTr(ancestors) {
    return ancestors.some(
      (parent) =>
        parent.type === "CallExpression" &&
        parent.callee &&
        parent.callee.type === "Identifier" &&
        parent.callee.name === "tr"
    );
  }

  function isDataContext(node, ancestors) {
    const parent = ancestors[ancestors.length - 1];

    if (!parent) return false;

    if (
      (parent.type === "ImportDeclaration" ||
        parent.type === "ExportNamedDeclaration" ||
        parent.type === "ExportAllDeclaration") &&
      parent.source === node
    ) {
      return true;
    }

    if (
      (parent.type === "ObjectProperty" || parent.type === "Property") &&
      parent.key === node
    ) {
      return true;
    }

    if (
      (parent.type === "ObjectProperty" || parent.type === "Property") &&
      parent.value === node
    ) {
      const key =
        parent.key.type === "Identifier" ? parent.key.name : parent.key.value;
      if (DATA_KEYS.has(String(key))) return true;
    }

    if (parent.type === "BinaryExpression" && COMPARISON_OPERATORS.has(parent.operator)) {
      return true;
    }

    if (parent.type === "SwitchCase" && parent.test === node) return true;
    if (parent.type === "TSLiteralType" || parent.type === "TSUnionType") return true;

    if (
      parent.type === "JSXAttribute" &&
      parent.name &&
      parent.name.type === "JSXIdentifier" &&
      DATA_KEYS.has(parent.name.name)
    ) {
      return true;
    }

    return false;
  }

  function wrapLiteral(node, ancestors) {
    if (!node || node.type !== "StringLiteral") return;
    if (inTr(ancestors) || isDataContext(node, ancestors)) return;
    if (!phraseKeys.has(node.value)) return;
    add(node.start, node.end, `tr("${escapeString(node.value)}")`);
  }

  function visit(node, ancestors) {
    if (!node || typeof node.type !== "string") return;

    const next = [...ancestors, node];

    if (node.type === "JSXText") {
      const text = normalize(node.value);
      if (text && phraseKeys.has(text)) {
        const leading = /^\s/.test(node.value) ? '{" "}' : "";
        const trailing = /\s$/.test(node.value) ? '{" "}' : "";
        add(node.start, node.end, `${leading}{tr("${escapeString(text)}")}${trailing}`);
      }
    }

    if (
      node.type === "JSXAttribute" &&
      node.name &&
      node.name.type === "JSXIdentifier" &&
      TEXT_PROPS.has(node.name.name) &&
      node.value
    ) {
      if (node.value.type === "StringLiteral") {
        if (phraseKeys.has(node.value.value)) {
          add(
            node.value.start,
            node.value.end,
            `{tr("${escapeString(node.value.value)}")}`
          );
        }
      } else if (
        node.value.type === "JSXExpressionContainer" &&
        node.value.expression.type === "StringLiteral"
      ) {
        wrapLiteral(node.value.expression, next);
      }
    }

    if (node.type === "StringLiteral") {
      wrapLiteral(node, ancestors);
    }

    if (
      (node.type === "ObjectProperty" || node.type === "Property") &&
      node.key &&
      node.value &&
      node.value.type === "StringLiteral"
    ) {
      const key = node.key.type === "Identifier" ? node.key.name : node.key.value;
      if (DATA_PROP_KEYS.has(key)) wrapLiteral(node.value, next);
    }

    if (
      node.type === "CallExpression" &&
      node.callee &&
      (node.callee.name === "setError" || node.callee.name === "setFeedback") &&
      node.arguments[0]
    ) {
      wrapLiteral(node.arguments[0], next);
    }

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

  if (!replacements.length) continue;

  const unique = [...new Map(replacements.map((r) => [r.start, r])).values()].sort(
    (a, b) => b.start - a.start
  );

  let output = code;
  for (const replacement of unique) {
    output =
      output.slice(0, replacement.start) +
      replacement.text +
      output.slice(replacement.end);
  }

  if (!alreadyImported) {
    const depth = relative.split("/").length - 2;
    const importPath = `${"../".repeat(depth)}i18n/translate`;
    let insertAt = 0;
    if (ast.program.body.length) {
      const first = ast.program.body[0];
      if (first.type === "ImportDeclaration") {
        let lastImport = first;
        for (const statement of ast.program.body) {
          if (statement.type === "ImportDeclaration") lastImport = statement;
        }
        insertAt = lastImport.end;
      }
    }
    output =
      output.slice(0, insertAt) +
      `\nimport { tr } from "${importPath}";` +
      output.slice(insertAt);
  }

  report.push({ file: relative, replacements: unique.length });

  if (APPLY) fs.writeFileSync(file, output, "utf8");
}

console.log(
  (APPLY ? "APLICADO" : "SIMULACIÓN") +
    ": " +
    report.length +
    " archivos, " +
    report.reduce((sum, row) => sum + row.replacements, 0) +
    " reemplazos"
);
for (const row of report.sort((a, b) => b.replacements - a.replacements)) {
  console.log(`${row.replacements}\t${row.file}`);
}
