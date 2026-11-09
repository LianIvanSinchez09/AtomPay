import { motion } from "motion/react";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { CategoryExpense } from "../../types/analysis";

interface Props {
  data: CategoryExpense[];
  currency: string;
}

const COLORS = [
  "#4D869C",
  "#7AB2B2",
  "#CDE8E5",
  "#A7D129",
  "#616F39",
];

const money = (value: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export default function CategoryExpenses({ data, currency }: Props) {
  const hasData = data.length > 0 && data.some((item) => item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                 dark:border-[#3E432E] dark:bg-[#000000]"
    >
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Gastos por categoría
      </h2>

      <p className="mb-4 text-sm text-slate-500 dark:text-gray-400">
        Distribución de tus gastos en {currency}.
      </p>

      {hasData ? (
        <>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    money(Number(value), currency),
                    String(name),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {data.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="truncate text-slate-600 dark:text-gray-300">
                    {category.name}
                  </span>

                  {category.percentage !== undefined && (
                    <span className="shrink-0 text-xs text-slate-400 dark:text-gray-500">
                      {category.percentage}%
                    </span>
                  )}
                </div>

                <span className="shrink-0 font-semibold text-slate-900 dark:text-white">
                  {money(category.value, currency)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-[320px] flex-col items-center justify-center gap-2 text-center">
          <PieChartIcon
            size={32}
            className="text-slate-300 dark:text-gray-600"
          />

          <p className="text-sm text-slate-500 dark:text-gray-400">
            Sin gastos para distribuir por categoría.
          </p>
        </div>
      )}
    </motion.div>
  );
}
