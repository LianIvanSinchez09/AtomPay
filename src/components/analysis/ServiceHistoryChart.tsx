import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ServiceTrendAnalysis } from "../../types/analysis";
import {
  formatCompactMoney,
  formatMoney,
  formatNumber,
} from "./analysisMeta";

interface Props {
  trend: ServiceTrendAnalysis;
  currency: string;
  /** Altura del contenedor (clase de Tailwind). */
  heightClass?: string;
}

/**
 * Compara el importe facturado (barras) con el consumo físico (línea) de los
 * últimos 6 meses. Si el servicio no informa consumo, solo muestra barras.
 */
export default function ServiceHistoryChart({
  trend,
  currency,
  heightClass = "h-72",
}: Props) {
  const hasConsumption = trend.history.some(
    (point) => point.consumption !== null && point.consumption > 0
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Últimos 6 meses
        </h3>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-[#7AB2B2]" />
            Importe
          </span>

          {hasConsumption && (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#A7D129]" />
              Consumo
            </span>
          )}
        </div>
      </div>

      <div className={`${heightClass} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={trend.history}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="month" tick={{ fontSize: 12 }} />

            <YAxis
              yAxisId="amount"
              tick={{ fontSize: 11 }}
              width={64}
              tickFormatter={(value) =>
                formatCompactMoney(Number(value), currency)
              }
            />

            {hasConsumption && (
              <YAxis
                yAxisId="consumption"
                orientation="right"
                tick={{ fontSize: 11 }}
                width={48}
                tickFormatter={(value) => formatNumber(Number(value))}
              />
            )}

            <Tooltip
              formatter={(value, name) => {
                if (name === "Consumo") {
                  return [
                    `${formatNumber(Number(value))} ${
                      trend.consumptionUnit ?? ""
                    }`,
                    "Consumo",
                  ];
                }

                return [formatMoney(Number(value), currency), "Importe"];
              }}
            />

            <Bar
              yAxisId="amount"
              dataKey="amount"
              name="Importe"
              fill="#7AB2B2"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />

            {hasConsumption && (
              <Line
                yAxisId="consumption"
                type="monotone"
                dataKey="consumption"
                name="Consumo"
                stroke="#A7D129"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
