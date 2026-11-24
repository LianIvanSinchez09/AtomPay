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
    console.log(`No change: ${relativePath}`);
  }
}

// 1. ServiceHistoryDrawer.tsx
updateFile("src/components/analysis/ServiceHistoryDrawer.tsx", (code) => {
  let c = code;
  c = c.replace(
    '<p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">\n              Historial de servicio\n            </p>',
    '<p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">\n              {tr("Historial de servicio")}\n            </p>'
  );
  c = c.replace('aria-label="Cerrar historial"', 'aria-label={tr("Cerrar historial")}');
  c = c.replace('label="Último importe"', 'label={tr("Último importe")}');
  c = c.replace('label="Variación"', 'label={tr("Variación")}');
  c = c.replace(
    '<h3 className="mb-3 font-semibold text-slate-900 dark:text-white">\n              Detalle mes a mes\n            </h3>',
    '<h3 className="mb-3 font-semibold text-slate-900 dark:text-white">\n              {tr("Detalle mes a mes")}\n            </h3>'
  );
  c = c.replace(
    '<th className="px-3 py-2 font-semibold">Mes</th>',
    '<th className="px-3 py-2 font-semibold">{tr("Mes")}</th>'
  );
  c = c.replace(
    '<th className="px-3 py-2 text-right font-semibold">\n                      Importe\n                    </th>',
    '<th className="px-3 py-2 text-right font-semibold">\n                      {tr("Importe")}\n                    </th>'
  );
  c = c.replace(
    '<th className="px-3 py-2 text-right font-semibold">\n                      Consumo\n                    </th>',
    '<th className="px-3 py-2 text-right font-semibold">\n                      {tr("Consumo")}\n                    </th>'
  );
  c = c.replace(
    '<th className="px-3 py-2 text-right font-semibold">\n                      Precio unit.\n                    </th>',
    '<th className="px-3 py-2 text-right font-semibold">\n                      {tr("Precio unit.")}\n                    </th>'
  );
  c = c.replace(
    '<h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">\n              <Gauge size={18} className="text-[#4D869C] dark:text-[#A7D129]" />\n              Diagnóstico\n            </h3>',
    '<h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">\n              <Gauge size={18} className="text-[#4D869C] dark:text-[#A7D129]" />\n              {tr("Diagnóstico")}\n            </h3>'
  );
  c = c.replace(
    /No detectamos anomalías en este servicio\. Su comportamiento es\s*consistente con los meses anteriores\./,
    '{tr("No detectamos anomalías en este servicio. Su comportamiento es consistente con los meses anteriores.")}'
  );
  return c;
});

// 2. SimulationMetricsHeader.tsx
updateFile("src/components/simulator/SimulationMetricsHeader.tsx", (code) => {
  let c = code;
  c = c.replace(
    /hint=\{`\$\{formatSimulationPercent\(\s*simulation\.savingsPercent\s*\)\} del gasto actual`\}/,
    'hint={tr("{percent} del gasto actual", { percent: formatSimulationPercent(simulation.savingsPercent) })}'
  );
  c = c.replace(
    '? `{tr("Recortás el {percent}% de tu gasto mensual estimado.", { percent: simulation.savingsPercent.toFixed(1) })}`',
    '? tr("Recortás el {percent}% de tu gasto mensual estimado.", { percent: simulation.savingsPercent.toFixed(1) })'
  );
  return c;
});

// 3. Analysis.tsx
updateFile("src/pages/private/dashboard/Analysis.tsx", (code) => {
  let c = code;
  c = c.replace(
    /`Mes anterior: \$\{moneyFormat\(\s*data\.summary\.previousMonth,\s*data\.currency\s*\)\}`/,
    'tr("Mes anterior: {amount}", { amount: moneyFormat(data.summary.previousMonth, data.currency) })'
  );
  return c;
});

// 4. Simulator.tsx
updateFile("src/pages/private/dashboard/Simulator.tsx", (code) => {
  let c = code;
  c = c.replace(
    /`Ahorro de \$\{formatSimulationMoney\(\s*simulation\.monthlyDifference,\s*simulation\.currency\s*\)\}`/,
    'tr("Ahorro de {amount}", { amount: formatSimulationMoney(simulation.monthlyDifference, simulation.currency) })'
  );
  return c;
});
