import { motion } from "motion/react";
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
}

const COLORS = [
  "#4D869C",
  "#7AB2B2",
  "#CDE8E5",
  "#A7D129",
  "#616F39",
];

export default function CategoryExpenses({ data }: Props) {
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
        Distribución de tus gastos.
      </p>

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
              formatter={(value) => [
                `$${Number(value).toLocaleString("es-AR")}`,
                "Gasto",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {data.map((category, index) => (
          <div
            key={category.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />

              <span className="text-slate-600 dark:text-gray-300">
                {category.name}
              </span>
            </div>

            <span className="font-semibold text-slate-900 dark:text-white">
              ${category.value.toLocaleString("es-AR")}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}