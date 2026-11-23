import { useEffect } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Gauge,
  Lightbulb,
  X,
} from "lucide-react";

import type {
  DrawerStatProps,
  ServiceHistoryDrawerProps,
} from "../../types/analysisComponents";
import ServiceHistoryChart from "./ServiceHistoryChart";
import {
  anomalySeverityMeta,
  anomalyTypeLabel,
  formatMoney,
  formatNumber,
  formatSignedPercent,
  formatUnitPrice,
  trendMeta,
} from "./analysisMeta";

export default function ServiceHistoryDrawer({
  trend,
  anomalies,
  currency,
  onClose,
}: ServiceHistoryDrawerProps) {
  const meta = trendMeta[trend.trend];
  const serviceAnomalies = anomalies.filter(
    (anomaly) => anomaly.service === trend.service
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Historial de ${trend.service}`}
        className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto
                   border-l border-[#CDE8E5] bg-white shadow-2xl
                   dark:border-[#3E432E] dark:bg-[#0B0B0B]"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#CDE8E5] bg-white/95 px-6 py-5 backdrop-blur dark:border-[#3E432E] dark:bg-[#0B0B0B]/95">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
              {tr("Historial de servicio")}
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {trend.service}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>

              <span className="rounded-full border border-[#CDE8E5] px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-[#3E432E] dark:text-gray-300">
                {tr(trend.category)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={tr("Cerrar historial")}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-[#EEF7FF] hover:text-slate-900 dark:text-gray-400 dark:hover:bg-[#3E432E] dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </header>

        <div className="space-y-6 px-6 py-6">
          {/* RESUMEN */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label={tr("Último importe")}
              value={formatMoney(trend.currentAmount, currency)}
              hint={trend.lastMonth ?? undefined}
            />

            <Stat
              label={tr("Variación")}
              value={formatSignedPercent(trend.variationPercent)}
              hint={tr("vs. mes anterior")}
              tone={
                trend.variationPercent === null
                  ? "neutral"
                  : trend.variationPercent > 0
                    ? "negative"
                    : "positive"
              }
            />

            <Stat
              label="Consumo"
              value={
                trend.lastConsumption === null
                  ? "—"
                  : `${formatNumber(trend.lastConsumption)} ${
                      trend.consumptionUnit ?? ""
                    }`
              }
              hint={
                trend.consumptionVariationPercent === null
                  ? tr("sin dato previo")
                  : tr("{variation} vs. anterior", {
                    variation: formatSignedPercent(trend.consumptionVariationPercent),
                  })
              }
            />

            <Stat
              label="Precio unitario"
              value={
                trend.unitPrice === null
                  ? "—"
                  : `${formatUnitPrice(trend.unitPrice, currency)}/${
                      trend.consumptionUnit ?? "u"
                    }`
              }
              hint="importe ÷ consumo"
            />
          </section>

          {/* GRÁFICO COMPARATIVO */}
          <section>
            <ServiceHistoryChart trend={trend} currency={currency} />
          </section>

          {/* DETALLE MENSUAL */}
          <section>
            <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
              {tr("Detalle mes a mes")}
            </h3>

            <div className="overflow-hidden rounded-xl border border-[#CDE8E5] dark:border-[#3E432E]">
              <table className="w-full text-sm">
                <thead className="bg-[#EEF7FF] text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-[#3E432E] dark:text-gray-400">
                  <tr>
                    <th className="px-3 py-2 font-semibold">{tr("Mes")}</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Importe
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Consumo
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Precio unit.
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#CDE8E5] dark:divide-[#3E432E]">
                  {trend.history.map((point) => (
                    <tr key={point.key}>
                      <td className="px-3 py-2 font-medium text-slate-700 dark:text-gray-200">
                        {point.month}
                      </td>

                      <td className="px-3 py-2 text-right text-slate-700 dark:text-gray-200">
                        {point.amount > 0
                          ? formatMoney(point.amount, currency)
                          : "—"}
                      </td>

                      <td className="px-3 py-2 text-right text-slate-600 dark:text-gray-300">
                        {point.consumption === null
                          ? "—"
                          : `${formatNumber(point.consumption)} ${
                              point.unit ?? ""
                            }`}
                      </td>

                      <td className="px-3 py-2 text-right text-slate-600 dark:text-gray-300">
                        {point.unitPrice === null
                          ? "—"
                          : formatUnitPrice(point.unitPrice, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* DIAGNÓSTICO */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <Gauge size={18} className="text-[#4D869C] dark:text-[#A7D129]" />
              {tr("Diagnóstico")}
            </h3>

            {serviceAnomalies.length > 0 ? (
              <div className="space-y-3">
                {serviceAnomalies.map((anomaly, index) => {
                  const severity = anomalySeverityMeta[anomaly.severity];

                  return (
                    <div
                      key={`${anomaly.type}-${index}`}
                      className="rounded-xl border border-[#CDE8E5] bg-[#EEF7FF]/60 p-4 dark:border-[#3E432E] dark:bg-[#3E432E]/40"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <AlertTriangle
                          size={16}
                          className={
                            anomaly.severity === "high"
                              ? "text-red-500"
                              : anomaly.severity === "medium"
                                ? "text-amber-500"
                                : "text-emerald-500"
                          }
                        />

                        <span className="font-semibold text-slate-900 dark:text-white">
                          {anomalyTypeLabel[anomaly.type]}
                        </span>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${severity.badge}`}
                        >
                          {severity.label}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
                        {anomaly.description}
                      </p>

                      <p className="mt-2 flex items-start gap-2 text-sm text-[#4D869C] dark:text-[#A7D129]">
                        <Lightbulb size={16} className="mt-0.5 shrink-0" />
                        {anomaly.suggestion}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-[#CDE8E5] bg-[#EEF7FF]/60 p-4 text-sm text-slate-600 dark:border-[#3E432E] dark:bg-[#3E432E]/40 dark:text-gray-300">
                {tr("No detectamos anomalías en este servicio. Su comportamiento es consistente con los meses anteriores.")}
              </p>
            )}
          </section>
        </div>
      </motion.aside>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone = "neutral",
}: DrawerStatProps) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "negative"
        ? "text-red-600 dark:text-red-400"
        : "text-slate-900 dark:text-white";

  return (
    <div className="rounded-xl border border-[#CDE8E5] bg-[#EEF7FF]/60 p-3 dark:border-[#3E432E] dark:bg-[#3E432E]/40">
      <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
        {label}
      </p>

      <p className={`mt-1 text-base font-bold ${toneClass}`}>{value}</p>

      {hint && (
        <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}
