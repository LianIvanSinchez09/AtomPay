import { useState } from "react";
import { motion } from "motion/react";
import { BarChart3, ChevronRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TopServicesProps, TopServicesBarClickEntry } from "../../types/analysisComponents";
import ServiceHistoryDrawer from "./ServiceHistoryDrawer";
import { formatMoney } from "./analysisMeta";

export default function TopServices({
  data,
  currency,
  trends = [],
  anomalies = [],
}: TopServicesProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const hasData = data.length > 0 && data.some((item) => item.amount > 0);
  const selectedTrend =
    trends.find((trend) => trend.service === selected) ?? null;

  const openService = (service: string) => {
    if (trends.some((trend) => trend.service === service)) {
      setSelected(service);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                   dark:border-[#3E432E] dark:bg-[#000000]"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Servicios con mayor gasto
        </h2>

        <p className="mb-6 text-sm text-slate-500 dark:text-gray-400">
          Los servicios que más impactan en tu presupuesto. Tocá uno para ver
          su historial.
        </p>

        {hasData ? (
          <>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis type="number" tick={{ fontSize: 12 }} />

                  <YAxis
                    type="category"
                    dataKey="service"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value, _name, item) => {
                      const percentage = item?.payload?.percentage as
                        | number
                        | undefined;

                      return [
                        formatMoney(Number(value), currency) +
                          (percentage !== undefined
                            ? ` · ${percentage}% del total`
                            : ""),
                        "Gasto",
                      ];
                    }}
                  />

                  <Bar
                    dataKey="amount"
                    fill="#7AB2B2"
                    radius={[0, 6, 6, 0]}
                    className="cursor-pointer"
                    onClick={(entry: unknown) => {
                      const record = entry as TopServicesBarClickEntry;

                      const service =
                        record.payload?.service ?? record.service;

                      if (service) openService(service);
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {data.map((item) => (
                <button
                  key={item.service}
                  type="button"
                  onClick={() => openService(item.service)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#CDE8E5] px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-[#4D869C] hover:text-[#4D869C] dark:border-[#3E432E] dark:text-gray-300 dark:hover:border-[#A7D129] dark:hover:text-[#A7D129]"
                >
                  {item.service}
                  <ChevronRight size={13} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-[320px] flex-col items-center justify-center gap-2 text-center">
            <BarChart3
              size={32}
              className="text-slate-300 dark:text-gray-600"
            />

            <p className="text-sm text-slate-500 dark:text-gray-400">
              Sin servicios con gastos registrados.
            </p>
          </div>
        )}
      </motion.div>

      {selectedTrend && (
        <ServiceHistoryDrawer
          trend={selectedTrend}
          anomalies={anomalies}
          currency={currency}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
