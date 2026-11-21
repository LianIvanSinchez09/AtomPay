import { motion } from "motion/react";
import { Gauge, Info } from "lucide-react";

import type {
  ConsumptionBreakdownProps,
  ConsumptionCellProps,
  ConsumptionVerdict,
  ConsumptionVerdictInput,
} from "../../types/analysisComponents";
import {
  formatMoney,
  formatNumber,
  formatSignedPercent,
  formatUnitPrice,
} from "./analysisMeta";

function verdictFor(item: ConsumptionVerdictInput): ConsumptionVerdict {
  const consumption = item.consumptionVariation ?? 0;
  const price = item.priceVariation ?? 0;

  if (price > 10 && consumption <= 5) {
    return {
      label: "Subió la tarifa",
      badge:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    };
  }

  if (consumption > 10 && price <= 5) {
    return {
      label: "Subió el consumo",
      badge:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    };
  }

  if (consumption > 10 && price > 10) {
    return {
      label: "Subieron ambos",
      badge:
        "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
    };
  }

  if ((item.amountVariation ?? 0) < -5) {
    return {
      label: "Bajó el gasto",
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    };
  }

  return {
    label: "Sin cambios relevantes",
    badge:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  };
}

export default function ConsumptionBreakdown({
  consumption,
  currency,
}: ConsumptionBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                 dark:border-[#3E432E] dark:bg-[#000000]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF7FF] dark:bg-[#3E432E]">
            <Gauge
              size={20}
              className="text-[#4D869C] dark:text-[#A7D129]"
            />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Consumo vs. importe
            </h2>

            <p className="text-sm text-slate-500 dark:text-gray-400">
              ¿La factura subió por consumir más o porque aumentó la tarifa?
            </p>
          </div>
        </div>

        <span className="rounded-full border border-[#CDE8E5] px-3 py-1 text-xs font-semibold text-slate-600 dark:border-[#3E432E] dark:text-gray-300">
          {consumption.servicesWithConsumption} de {consumption.totalServices}{" "}
          con consumo
        </span>
      </div>

      {consumption.hasConsumption ? (
        <div className="mt-5 space-y-3">
          {consumption.services.map((item) => {
            const verdict = verdictFor({
              consumptionVariation: item.variationPercent,
              priceVariation: item.unitPriceVariationPercent,
              amountVariation: item.amountVariationPercent,
            });

            return (
              <div
                key={item.service}
                className="rounded-xl border border-[#CDE8E5] bg-[#EEF7FF]/60 p-4 dark:border-[#3E432E] dark:bg-[#3E432E]/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.service}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      {item.category} · último período: {item.lastMonth}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${verdict.badge}`}
                  >
                    {verdict.label}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Cell
                    label="Consumo"
                    value={`${formatNumber(item.current)} ${item.unit}`}
                    hint={
                      item.previous === null
                        ? "sin período previo"
                        : `${formatSignedPercent(
                            item.variationPercent
                          )} vs. ${formatNumber(item.previous)} ${item.unit}`
                    }
                  />

                  <Cell
                    label="Importe"
                    value={formatMoney(item.amount, currency)}
                    hint={
                      item.previousAmount === null
                        ? "sin período previo"
                        : `${formatSignedPercent(
                            item.amountVariationPercent
                          )} vs. ${formatMoney(item.previousAmount, currency)}`
                    }
                  />

                  <Cell
                    label="Precio unitario"
                    value={
                      item.unitPrice === null
                        ? "—"
                        : `${formatUnitPrice(item.unitPrice, currency)}/${
                            item.unit
                          }`
                    }
                    hint={
                      item.previousUnitPrice === null
                        ? "sin período previo"
                        : `${formatSignedPercent(
                            item.unitPriceVariationPercent
                          )} vs. ${formatUnitPrice(
                            item.previousUnitPrice,
                            currency
                          )}`
                    }
                  />

                  <Cell
                    label="Consumo promedio"
                    value={`${formatNumber(item.average)} ${item.unit}`}
                    hint="histórico registrado"
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-dashed border-[#CDE8E5] p-4 text-sm text-slate-500 dark:border-[#3E432E] dark:text-gray-400">
          <Info size={18} className="mt-0.5 shrink-0" />

          <p>
            Todavía no hay comprobantes con consumo físico (kWh, m³, GB…).
            Cuando los servicios lo informen vas a poder distinguir si el
            aumento viene del uso o de la tarifa.
          </p>
        </div>
      )}
    </motion.div>
  );
}

function Cell({ label, value, hint }: ConsumptionCellProps) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="text-[11px] text-slate-500 dark:text-gray-400">{hint}</p>
    </div>
  );
}
