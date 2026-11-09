import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ServiceExpense } from "../../types/analysis";

interface Props {
  data: ServiceExpense[];
  currency: string;
}

const money = (value: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export default function TopServices({ data, currency }: Props) {
  const hasData = data.length > 0 && data.some((item) => item.amount > 0);

  return (
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
        Los servicios que más impactan en tu presupuesto.
      </p>

      {hasData ? (
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
                    money(Number(value), currency) +
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
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
  );
}
