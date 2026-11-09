import { motion } from "motion/react";
import { LineChart as LineChartIcon } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlyExpense } from "../../types/analysis";

interface Props {
  data: MonthlyExpense[];
  currency?: string;
}

const money = (value: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const compact = (value: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function ExpenseEvolutionChart({
  data,
  currency = "ARS",
}: Props) {
  const hasData = data.some((month) => month.amount > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                 dark:border-[#3E432E] dark:bg-[#000000]"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Evolución de gastos
        </h2>

        <p className="text-sm text-slate-500 dark:text-gray-400">
          Gastos totales durante los últimos meses en {currency}.
        </p>
      </div>

      {hasData ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" tick={{ fontSize: 12 }} />

              <YAxis
                tick={{ fontSize: 12 }}
                width={70}
                tickFormatter={(value) => compact(Number(value), currency)}
              />

              <Tooltip
                formatter={(value, _name, item) => {
                  const count = item?.payload?.count as number | undefined;

                  return [
                    money(Number(value), currency) +
                      (count !== undefined ? ` · ${count} factura(s)` : ""),
                    "Gastos",
                  ];
                }}
              />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4D869C"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-80 flex-col items-center justify-center gap-2 text-center">
          <LineChartIcon
            size={32}
            className="text-slate-300 dark:text-gray-600"
          />

          <p className="text-sm text-slate-500 dark:text-gray-400">
            Todavía no hay gastos en los últimos meses.
          </p>
        </div>
      )}
    </motion.div>
  );
}
