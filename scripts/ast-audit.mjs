import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire("C:/Users/aleja/AppData/Local/Temp/opencode/asttools/");
const parser = require("@babel/parser");

const root = path.resolve("C:/Apps/Atompay/AtomPay");
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

const SPANISH_PATTERN = /[áéíóúüñ¿¡]|(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|factura|cuenta|servicio|gasto|ahorro|simulador|comprobante|ajustes|notificaci|iniciar|sesi|cerrar|guardar|eliminar|editar|cancelar|anterior|siguiente|total|periodo|mes|dias|hora|buscar|descargar|subir|volver|ingres|cambiar)/i;

const untranslated = [];

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
  } catch (e) {
    console.error("Failed to parse:", relative, e.message);
    continue;
  }

  function visit(node, ancestors) {
    if (!node || typeof node.type !== "string") return;

    const inTrOrT = ancestors.some(
      (p) =>
        p.type === "CallExpression" &&
        p.callee &&
        p.callee.type === "Identifier" &&
        (p.callee.name === "tr" || p.callee.name === "t")
    );

    if (!inTrOrT) {
      if (node.type === "JSXText") {
        const text = node.value.trim();
        if (text && SPANISH_PATTERN.test(text)) {
          untranslated.push({
            file: relative,
            line: node.loc.start.line,
            type: "JSXText",
            text,
          });
        }
      } else if (node.type === "StringLiteral") {
        const text = node.value.trim();
        // Ignore imports
        const parent = ancestors[ancestors.length - 1];
        if (
          parent &&
          (parent.type === "ImportDeclaration" ||
            parent.type === "ExportNamedDeclaration" ||
            (parent.type === "JSXAttribute" && parent.name && parent.name.name === "className"))
        ) {
          // ignore
        } else if (text && SPANISH_PATTERN.test(text)) {
          untranslated.push({
            file: relative,
            line: node.loc.start.line,
            type: "StringLiteral",
            text,
            prop: parent && parent.type === "JSXAttribute" ? parent.name?.name : undefined,
          });
        }
      } else if (node.type === "TemplateLiteral") {
        const raw = code.slice(node.start, node.end);
        if (SPANISH_PATTERN.test(raw)) {
          untranslated.push({
            file: relative,
            line: node.loc.start.line,
            type: "TemplateLiteral",
            text: raw,
          });
        }
      }
    }

    const nextAncestors = [...ancestors, node];
    for (const key of Object.keys(node)) {
      if (key === "loc" || key === "leadingComments" || key === "trailingComments") continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item.type === "string") visit(item, nextAncestors);
        }
      } else if (child && typeof child.type === "string") {
        visit(child, nextAncestors);
      }
    }
  }

  visit(ast.program, []);
}

console.log(`Found ${untranslated.length} untranslated items.`);
fs.writeFileSync(path.join(root, "scripts/ast-untranslated.json"), JSON.stringify(untranslated, null, 2));
for (const item of untranslated) {
  console.log(`${item.file}:${item.line} [${item.type}] ${item.prop ? `(prop: ${item.prop}) ` : ""}${item.text}`);
}
