import fs from "node:fs";
import path from "node:path";

const root = path.resolve("C:/Apps/Atompay/AtomPay");

function updateFile(relativePath, transform) {
  const fullPath = path.join(root, relativePath);
  const original = fs.readFileSync(fullPath, "utf8");
  const modified = transform(original);
  if (original !== modified) {
    fs.writeFileSync(fullPath, modified, "utf8");
    console.log(`Updated: ${relativePath}`);
  } else {
    console.log(`No change (already updated?): ${relativePath}`);
  }
}

// 1. TopServices.tsx
updateFile("src/components/analysis/TopServices.tsx", (code) => {
  return code
    .replace('` · ${percentage}% del total`', 'tr(" · {percentage}% del total", { percentage })')
    .replace('"Gasto",', 'tr("Gasto"),');
});

// 2. ServiceHistoryDrawer.tsx
updateFile("src/components/analysis/ServiceHistoryDrawer.tsx", (code) => {
  let c = code.replace('hint="vs. mes anterior"', 'hint={tr("vs. mes anterior")}');
  c = c.replace('? "sin dato previo"', '? tr("sin dato previo")');
  c = c.replace(
    /`\$\{formatSignedPercent\(\s*trend\.consumptionVariationPercent\s*\)\}\s*vs\.\s*anterior`/,
    'tr("{variation} vs. anterior", {\n                    variation: formatSignedPercent(trend.consumptionVariationPercent),\n                  })'
  );
  c = c.replace('{trend.category}', '{tr(trend.category)}');
  return c;
});

// 3. CategoryExpenses.tsx
updateFile("src/components/analysis/CategoryExpenses.tsx", (code) => {
  return code.replace('<p className="font-medium text-slate-800 dark:text-gray-200">\n                    {category.name}\n                  </p>',
    '<p className="font-medium text-slate-800 dark:text-gray-200">\n                    {tr(category.name)}\n                  </p>'
  ).replace('{category.name}', '{tr(category.name)}');
});

// 4. ConsumptionBreakdown.tsx
updateFile("src/components/analysis/ConsumptionBreakdown.tsx", (code) => {
  return code.replace('{item.category}{" "}', '{tr(item.category)}{" "}');
});

// 5. RecentInvoices.tsx
updateFile("src/components/analysis/RecentInvoices.tsx", (code) => {
  return code
    .replace('{invoice.category}', '{tr(invoice.category)}')
    .replace('? "Buscando..."', '? tr("Buscando...")')
    .replace('`${total} factura${total === 1 ? "" : "s"}`', 'tr("{total} {facturas}", { total, facturas: total === 1 ? tr("factura") : tr("facturas") })')
    .replace('? "Buscando facturas..."', '? tr("Buscando facturas...")')
    .replace(': "No hay facturas con esos filtros."', ': tr("No hay facturas con esos filtros.")');
});

// 6. ServiceTrendsExplorer.tsx
updateFile("src/components/analysis/ServiceTrendsExplorer.tsx", (code) => {
  return code.replace('{trend.category} ·', '{tr(trend.category)} ·');
});

// 7. ManageInvoicesPanel.tsx
updateFile("src/components/billing/ManageInvoicesPanel.tsx", (code) => {
  return code.replace(
    '{invoiceState.length === 1 ? "comprobante" : "comprobantes"}',
    '{invoiceState.length === 1 ? tr("comprobante") : tr("comprobantes")}'
  );
});

// 8. ManualInvoicePanel.tsx
updateFile("src/components/billing/ManualInvoicePanel.tsx", (code) => {
  return code
    .replace('{busy ? "Leyendo…" : "Leer comprobante"}', '{busy ? tr("Leyendo…") : tr("Leer comprobante")}')
    .replace('? "Estamos leyendo el archivo. Puede tardar unos segundos."', '? tr("Estamos leyendo el archivo. Puede tardar unos segundos.")')
    .replace(': "El importe y las fechas los lee la app: no se editan a mano."', ': tr("El importe y las fechas los lee la app: no se editan a mano.")')
    .replace('<optgroup key={category} label={category}>', '<optgroup key={category} label={tr(category)}>')
    .replace('{result.category}', '{tr(result.category)}');
});

// 9. Notification.tsx
updateFile("src/components/Notifications/Notification.tsx", (code) => {
  let c = code;
  if (!c.includes("getLocale")) {
    c = c.replace('import { tr } from "../../i18n/translate";', 'import { tr, getLocale, getCurrentLanguage } from "../../i18n/translate";');
  }
  c = c.replace('date.toLocaleDateString("es-AR")', 'date.toLocaleDateString(getLocale())');
  c = c.replace('new Intl.RelativeTimeFormat("es", { numeric: "auto" })', 'new Intl.RelativeTimeFormat(getCurrentLanguage(), { numeric: "auto" })');
  c = c.replace('return "ahora";', 'return tr("ahora");');
  return c;
});

// 10. NotificationsButton.tsx
updateFile("src/components/Notifications/NotificationsButton.tsx", (code) => {
  return code.replace('aria-label={`${unreadCount} notificaciones sin leer`}', 'aria-label={tr("{count} notificaciones sin leer", { count: unreadCount })}');
});

// 11. NotificationsLoader.tsx
updateFile("src/components/Notifications/NotificationsLoader.tsx", (code) => {
  return code.replace('{onlyUnread ? "Ver todas" : tr("Solo no leídas")}', '{onlyUnread ? tr("Ver todas") : tr("Solo no leídas")}');
});

// 12. SavedSimulationsList.tsx
updateFile("src/components/simulator/SavedSimulationsList.tsx", (code) => {
  return code.replace('aria-label={`Eliminar ${simulation.name}`}', 'aria-label={tr("Eliminar {name}", { name: simulation.name })}');
});

// 13. ServiceSimulationCard.tsx
updateFile("src/components/simulator/ServiceSimulationCard.tsx", (code) => {
  let c = code;
  const oldText = /\{service\.invoiceCount > 0\s*\?\s*`Promedio de \$\{service\.invoiceCount\} factura\$\{\s*service\.invoiceCount === 1 \? "" : "s"\s*\}\$\{\s*service\.lastPeriod \? ` · última \$\{service\.lastPeriod\}` : ""\s*\}`\s*:\s*service\.lastAmount\s*\?\s*"Precio cargado en el servicio"\s*:\s*"Sin gasto registrado"\}/;
  const newText = `{service.invoiceCount > 0
              ? tr("Promedio de {count} {facturas}{last}", {
                  count: service.invoiceCount,
                  facturas:
                    service.invoiceCount === 1
                      ? tr("factura")
                      : tr("facturas"),
                  last: service.lastPeriod
                    ? tr(" · última {period}", { period: service.lastPeriod })
                    : "",
                })
              : service.lastAmount
                ? tr("Precio cargado en el servicio")
                : tr("Sin gasto registrado")}`;
  c = c.replace(oldText, newText);
  c = c.replace('aria-label={`Ajustar el gasto mensual de ${service.name}`}', 'aria-label={tr("Ajustar el gasto mensual de {name}", { name: service.name })}');
  c = c.replace('{service.category}', '{tr(service.category)}');
  return c;
});

// 14. SimulationMetricsHeader.tsx
updateFile("src/components/simulator/SimulationMetricsHeader.tsx", (code) => {
  let c = code;
  const oldSavings = /\{hasSavings\s*\?\s*`Ahorrás \$\{formatSimulationMoney\(\s*simulation\.horizonDifference,\s*base\.currency\s*\)\} en \$\{formatHorizonLabel\(simulation\.horizonMonths\)\}`\s*:\s*tr\("Todavía sin ahorro"\)\}/;
  const newSavings = `{hasSavings
              ? tr("Ahorrás {money} en {horizon}", {
                  money: formatSimulationMoney(
                    simulation.horizonDifference,
                    base.currency
                  ),
                  horizon: formatHorizonLabel(simulation.horizonMonths),
                })
              : tr("Todavía sin ahorro")}`;
  c = c.replace(oldSavings, newSavings);

  c = c.replace(
    'hint={`${formatSimulationPercent(\n            simulation.savingsPercent\n          )} del gasto actual`}',
    'hint={tr("{percent} del gasto actual", {\n            percent: formatSimulationPercent(simulation.savingsPercent),\n          })}'
  );

  const oldRecortas = /Recortás el \$\{simulation\.savingsPercent\.toFixed\(\s*1\s*\)\}% de tu gasto mensual estimado\./;
  c = c.replace(
    oldRecortas,
    '{tr("Recortás el {percent}% de tu gasto mensual estimado.", { percent: simulation.savingsPercent.toFixed(1) })}'
  );
  return c;
});

// 15. simulatorMeta.ts
updateFile("src/components/simulator/simulatorMeta.ts", (code) => {
  let c = code;
  if (!c.includes("getLocale")) {
    c = c.replace('import { tr } from "../../i18n/translate";', 'import { tr, getLocale } from "../../i18n/translate";');
  }
  c = c.replace('return `${months} meses`;', 'return tr("{months} meses", { months });');
  c = c.replace('new Intl.DateTimeFormat("es-AR"', 'new Intl.DateTimeFormat(getLocale()');
  c = c.replace('`Ahorro en ${months} meses`', 'tr("Ahorro en {months} meses", { months })');
  return c;
});

// 16. AdminAddService.tsx
updateFile("src/pages/private/dashboard/AdminServices/AdminAddService.tsx", (code) => {
  return code.replace(
    /badge=\{`\$\{sources\.length\}\s*\$\{\s*sources\.length === 1 \? "servicio propio" : "servicios propios"\s*\}`\}/,
    'badge={tr("{count} {label}", { count: sources.length, label: sources.length === 1 ? tr("servicio propio") : tr("servicios propios") })}'
  );
});

// 17. AdminServices.tsx
updateFile("src/pages/private/dashboard/AdminServices/AdminServices.tsx", (code) => {
  return code
    .replace('sources.length === 1\n                        ? "servicio propio"\n                        : "servicios propios"',
             'sources.length === 1 ? tr("servicio propio") : tr("servicios propios")')
    .replace('invoices.length === 1\n                            ? "comprobante"\n                            : "comprobantes"',
             'invoices.length === 1 ? tr("comprobante") : tr("comprobantes")');
});

// 18. AdminUploadInvoice.tsx
updateFile("src/pages/private/dashboard/AdminServices/AdminUploadInvoice.tsx", (code) => {
  return code.replace(
    /badge=\{`Última carga: \$\{\s*lastManual \? dateFormat\(lastManual\.issueDate\) : "—"\s*\}`\}/,
    'badge={tr("Última carga: {date}", { date: lastManual ? dateFormat(lastManual.issueDate) : "—" })}'
  );
});

// 19. Analysis.tsx
updateFile("src/pages/private/dashboard/Analysis.tsx", (code) => {
  let c = code.replace(
    '`Detectamos ${highAnomalies.length} anomalías de prioridad alta`',
    'tr("Detectamos {count} anomalías de prioridad alta", { count: highAnomalies.length })'
  );
  c = c.replace(
    'description={`${data.summary.invoiceCount} facturas registradas`}',
    'description={tr("{count} facturas registradas", { count: data.summary.invoiceCount })}'
  );
  c = c.replace(
    '`Mes anterior: ${moneyFormat(\n                        data.summary.previousMonth,\n                        data.currency\n                      )}`',
    'tr("Mes anterior: {amount}", { amount: moneyFormat(data.summary.previousMonth, data.currency) })'
  );
  c = c.replace('"Sin mes anterior para comparar"', 'tr("Sin mes anterior para comparar")');
  return c;
});

// 20. Simulator.tsx
updateFile("src/pages/private/dashboard/Simulator.tsx", (code) => {
  let c = code.replace(
    '`¿Eliminar el escenario "${value.name}"? Esta acción no se puede deshacer.`',
    'tr("¿Eliminar el escenario \\"{name}\\"? Esta acción no se puede deshacer.", { name: value.name })'
  );
  c = c.replace(
    '`Ahorro de ${formatSimulationMoney(\n          simulation.monthlyDifference,\n          simulation.currency\n        )}`',
    'tr("Ahorro de {amount}", { amount: formatSimulationMoney(simulation.monthlyDifference, simulation.currency) })'
  );
  c = c.replace('"Mi escenario"', 'tr("Mi escenario")');
  c = c.replace('"Guardar este escenario"', 'tr("Guardar este escenario")');
  c = c.replace(
    '{horizonMonths}{" "}{tr("mes")}{" "}{horizonMonths === 1 ? "" : "es"}.',
    '{tr("· Proyección: {months} {label}.", { months: horizonMonths, label: horizonMonths === 1 ? tr("mes") : tr("meses") })}'
  );
  return c;
});

// 21. StepperForm.tsx
updateFile("src/pages/public/Home/StepperForm/StepperForm.tsx", (code) => {
  return code.replace(
    '{isSubmitting ? "Creando cuenta..." : "Crear cuenta"}',
    '{isSubmitting ? tr("Creando cuenta...") : tr("Crear cuenta")}'
  );
});

// 22. Login.tsx
updateFile("src/pages/public/Login/Login.tsx", (code) => {
  let c = code.replace('}X\n                    className=', '}\n                    className=');
  c = c.replace(
    '"No existe una cuenta AtomPay asociada a esta cuenta de Google. Registrate primero."',
    'tr("No existe una cuenta AtomPay asociada a esta cuenta de Google. Registrate primero.")'
  );
  c = c.replace(
    '{isSubmitting ? "Ingresando..." : tr("Iniciar sesión")}',
    '{isSubmitting ? tr("Ingresando...") : tr("Iniciar sesión")}'
  );
  c = c.replace(
    'setErrorMessage("No se pudo autenticar con Google.");',
    'setErrorMessage(tr("No se pudo autenticar con Google."));'
  );
  return c;
});

// 23. Register.tsx
updateFile("src/pages/public/Register.tsx", (code) => {
  let c = code;
  c = c.replace('return "No se pudo conectar con el servidor.";', 'return tr("No se pudo conectar con el servidor.");');
  c = c.replace('return error.response.data?.message ?? "Error desconocido del servidor.";', 'return error.response.data?.message ?? tr("Error desconocido del servidor.");');
  c = c.replace('return "No se pudo completar el registro.";', 'return tr("No se pudo completar el registro.");');
  c = c.replace(
    '{isSubmitting ? "Creando cuenta..." : "Crear cuenta"}',
    '{isSubmitting ? tr("Creando cuenta...") : tr("Crear cuenta")}'
  );
  c = c.replace(
    'setErrorMessage("No se pudo autenticar con Google.");',
    'setErrorMessage(tr("No se pudo autenticar con Google."));'
  );
  return c;
});

// 24. GmailConnection.tsx
updateFile("src/components/gmail/GmailConnection.tsx", (code) => {
  let c = code;
  c = c.replace('setFeedback({ ok: true, text: `Gmail conectado: ${data.email}` });', 'setFeedback({ ok: true, text: tr("Gmail conectado: {email}", { email: data.email }) });');
  c = c.replace('text: data.message ?? "No se pudo conectar Gmail",', 'text: data.message ?? tr("No se pudo conectar Gmail"),');
  c = c.replace(
    '"<p style=\'font-family:system-ui;padding:2rem\'>Conectando con Google…</p>"',
    '`<p style=\'font-family:system-ui;padding:2rem\'>${tr("Conectando con Google…")}</p>`'
  );
  c = c.replace(
    /text:\s*`Revisados \$\{result\.queued\} correos: \$\{result\.created\} nuevos, \$\{result\.merged\} duplicados, \$\{result\.ignored\} ignorados\$\{\s*result\.failed > 0 \? `, \$\{result\.failed\} con error` : ""\s*\}\.`/,
    `text: tr("Revisados {queued} correos: {created} nuevos, {merged} duplicados, {ignored} ignorados{failed}.", {
            queued: result.queued,
            created: result.created,
            merged: result.merged,
            ignored: result.ignored,
            failed:
              result.failed > 0
                ? tr(", {failed} con error", { failed: result.failed })
                : "",
          })`
  );
  return c;
});

// 25. Chatbot.tsx
updateFile("src/components/chatbot/Chatbot.tsx", (code) => {
  let c = code;
  if (!c.includes("getCurrentLanguage")) {
    c = c.replace('import { tr } from "../../i18n/translate";', 'import { tr, getCurrentLanguage } from "../../i18n/translate";');
  }
  c = c.replace("defaultLanguage: 'en'", 'defaultLanguage: getCurrentLanguage() === "es" ? "es" : "en"');
  c = c.replace("'Hola! 👋'", 'tr("¡Hola! 👋")');
  return c;
});

// 26. AddServicePanel.tsx (category select and badge)
updateFile("src/components/billing/AddServicePanel.tsx", (code) => {
  let c = code.replace('{source.category}', '{tr(source.category)}');
  c = c.replace('{category.name}', '{tr(category.name)}');
  return c;
});
