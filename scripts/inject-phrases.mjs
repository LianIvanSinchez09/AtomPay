import fs from "node:fs";
import path from "node:path";

const root = path.resolve("C:/Apps/Atompay/AtomPay");
const filePath = path.join(root, "src/i18n/phrases.ts");

const newPhrases = {
  // Missing phrases identified by audit
  " Además, {count} {mails} a la cola para el próximo escaneo.":
    " In addition, {count} {mails} to the queue for the next scan.",
  " · {count} factura(s)": " · {count} invoice(s)",
  " · {percentage}% del total": " · {percentage}% of total",
  " · Última sincronización: {date}": " · Last synced: {date}",
  " · última {period}": " · latest {period}",
  '"{name}" quedó agregado. Los próximos mails que coincidan van a aparecer en {category}.':
    '"{name}" was added. Matching emails will now appear in {category}.',
  ", {failed} con error": ", {failed} with errors",
  Activa: "Active",
  "Ahorro de {amount}": "Savings of {amount}",
  "Ahorrás {money} en {horizon}": "You save {money} in {horizon}",
  "Ajustar el gasto mensual de {name}": "Adjust monthly spending for {name}",
  "Buscando facturas...": "Searching invoices...",
  "Buscando...": "Searching...",
  "Cambiar la categoría de {service}": "Change category for {service}",
  "Conectando con Google…": "Connecting to Google…",
  "Creando cuenta...": "Creating account...",
  "Crear cuenta": "Create account",
  "Detectamos {count} anomalías de prioridad alta":
    "We detected {count} high-priority anomalies",
  "El comprobante de {service} ahora está en {category}.":
    "The invoice for {service} is now in {category}.",
  "El comprobante de {service} ahora está en {category}. Los próximos de {sender} van a ir directo a {category}.":
    "The invoice for {service} is now in {category}. Future invoices from {sender} will go directly to {category}.",
  "El importe y las fechas los lee la app: no se editan a mano.":
    "Amounts and dates are read by the app: they cannot be edited manually.",
  "Eliminar {name}": "Delete {name}",
  "Error desconocido del servidor.": "Unknown server error.",
  "Estamos leyendo el archivo. Puede tardar unos segundos.":
    "We are reading the file. This may take a few seconds.",
  Gasto: "Expense",
  Gastos: "Expenses",
  "Gmail conectado: {email}": "Gmail connected: {email}",
  "Guardar este escenario": "Save this scenario",
  "Ingresando...": "Signing in...",
  "Leer comprobante": "Read receipt",
  "Leyendo…": "Reading…",
  "Mes anterior: {amount}": "Previous month: {amount}",
  "Mi escenario": "My scenario",
  "No existe una cuenta AtomPay asociada a esta cuenta de Google. Registrate primero.":
    "No AtomPay account is associated with this Google account. Please register first.",
  "No hay aumentos relevantes para mostrar.":
    "No relevant increases to display.",
  "No hay facturas con esos filtros.": "No invoices matching these filters.",
  "No hay observaciones por ahora.": "No observations for now.",
  "No se pudo autenticar con Google.": "Could not authenticate with Google.",
  "No se pudo completar el registro.": "Could not complete registration.",
  "No se pudo conectar Gmail": "Could not connect Gmail",
  "No se pudo conectar con el servidor.": "Could not connect to the server.",
  "Precio cargado en el servicio": "Price set in the service",
  "Promedio de {count} {facturas}{last}": "Average of {count} {facturas}{last}",
  "Recortás el {percent}% de tu gasto mensual estimado.":
    "You cut {percent}% of your estimated monthly spending.",
  "Requiere reconectar": "Reconnect required",
  "Revisados {queued} correos: {created} nuevos, {merged} duplicados, {ignored} ignorados{failed}.":
    "Checked {queued} emails: {created} new, {merged} duplicate, {ignored} ignored{failed}.",
  "Se desconectó {email}": "{email} was disconnected",
  "Se eliminó el comprobante de {service} del {date}.":
    "The invoice for {service} dated {date} was deleted.",
  'Se quitó "{name}". Los comprobantes que ya estaban cargados no se tocan.':
    '"{name}" was removed. Previously uploaded invoices were not touched.',
  "Sin gasto registrado": "No spending recorded",
  "Sin gastos el mes anterior para comparar":
    "No spending in previous month to compare",
  "Sin mes anterior para comparar": "No previous month to compare",
  "Sin proveedor": "No provider",
  "Ver todas": "View all",
  ahora: "now",
  comprobante: "receipt",
  comprobantes: "receipts",
  factura: "invoice",
  facturas: "invoices",
  "mail descartado vuelve": "discarded email returns",
  "mails descartados vuelven": "discarded emails return",
  "servicio propio": "custom service",
  "servicios propios": "custom services",
  "sin dato previo": "no prior data",
  "vs. mes anterior": "vs. previous month",
  "{count} facturas registradas": "{count} registered invoices",
  "{count} notificaciones sin leer": "{count} unread notifications",
  "{count} {label}": "{count} {label}",
  "{months} meses": "{months} months",
  "{percent} del gasto actual": "{percent} of current spending",
  "{percent}% menos que el período anterior":
    "{percent}% less than previous period",
  "{percent}% más que el período anterior":
    "{percent}% more than previous period",
  "{total} {facturas}": "{total} {facturas}",
  "{variation} vs. anterior": "{variation} vs. previous",
  "¡Hola! 👋": "Hello! 👋",
  "· Proyección: {months} {label}.": "· Projection: {months} {label}.",
  '¿Eliminar el escenario "{name}"? Esta acción no se puede deshacer.':
    'Delete scenario "{name}"? This action cannot be undone.',
  "Última carga: {date}": "Last upload: {date}",

  // Source labels
  "PDF adjunto": "Attached PDF",
  "Factura escaneada (OCR)": "Scanned invoice (OCR)",
  "Cuerpo del mail": "Email body",
  "Carga manual (PDF)": "Manual upload (PDF)",
  "Carga manual (foto)": "Manual upload (photo)",

  // Service categories
  Luz: "Electricity",
  Gas: "Gas",
  Agua: "Water",
  Internet: "Internet",
  Multimedia: "Streaming & Media",
  Compras: "Shopping",
  Pagos: "Payments",
  Otros: "Other",

  // Drawer & table headers
  Mes: "Month",
  "Precio unit.": "Unit price",
  "Historial de servicio": "Service history",
  "Detalle mes a mes": "Month-by-month breakdown",
  "Cerrar historial": "Close history",
  "Último importe": "Last amount",
  "No detectamos anomalías en este servicio. Su comportamiento es consistente con los meses anteriores.":
    "No anomalies detected in this service. Its behavior is consistent with previous months.",
  "Ahorro en {months} meses": "Savings in {months} months",
};

let content = fs.readFileSync(filePath, "utf8");

// Check existing keys
const existingKeys = new Set();
for (const match of content.matchAll(/^\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d_-]+)):\s/gm)) {
  const k = match[1] !== undefined ? match[1].replace(/\\"/g, '"') : match[2] !== undefined ? match[2] : match[3];
  existingKeys.add(k);
}

const entriesToAdd = [];
for (const [key, val] of Object.entries(newPhrases)) {
  if (!existingKeys.has(key)) {
    entriesToAdd.push(`  ${JSON.stringify(key)}: ${JSON.stringify(val)},`);
  }
}

console.log(`Adding ${entriesToAdd.length} phrases to phrases.ts`);

if (entriesToAdd.length > 0) {
  const insertIndex = content.lastIndexOf("};");
  if (insertIndex === -1) {
    throw new Error("Could not find closing '};' in phrases.ts");
  }
  const before = content.slice(0, insertIndex);
  const after = content.slice(insertIndex);
  const addition = "\n  /* ------------------------------ Nuevas adiciones ------------------------------ */\n" + entriesToAdd.join("\n") + "\n";
  const updated = before + addition + after;
  fs.writeFileSync(filePath, updated, "utf8");
  console.log("phrases.ts updated successfully!");
}
