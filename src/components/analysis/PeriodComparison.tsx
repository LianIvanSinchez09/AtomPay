import { motion } from "motion/react";
import { ArrowDown, ArrowUp, CalendarDays, Minus } from "lucide-react";

import type { InvoiceStatus } from "../../types/types";
import { moneyFormat } from "../../utils/billingFormat";

interface Props {
  current: number;
  previous: number;
  currency: string;
  statusBreakdown?: {
    status: InvoiceStatus;
    count: number;
    amount: number;
  }[];
}

const STATUS_DOT: Record<InvoiceStatus, string> = {
  Pagado: "bg-[#4D869C] dark:bg-[#A7D129]",
  Pendiente: "bg-yellow-400",
  Vencido: "bg-red-500",
};

export default function PeriodComparison({
  current,
  previous,
  currency,
  statusBreakdown,
}: Props) {
  const difference = current - previous;

  const percentage =
    previous === 0 ? null : Math.round((difference / previous) * 100);

  const increased = difference > 0;
  const unchanged = difference === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                 dark:border-[#3E432E] dark:bg-[#000000]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF7FF] dark:bg-[#3E432E]">
          <CalendarDays
            size={20}
            className="text-[#4D869C] dark:text-[#A7D129]"
          />
        </div>

        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">
            Comparación mensual
          </h2>

          <p className="text-sm text-slate-500 dark:text-gray-400">
            Este mes vs. mes anterior
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#EEF7FF] p-4 dark:bg-[#3E432E]">
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Este mes
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {moneyFormat(current, currency)}
          </p>
        </div>

        <div className="rounded-xl bg-[#EEF7FF] p-4 dark:bg-[#3E432E]">
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Mes anterior
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {moneyFormat(previous, currency)}
          </p>
        </div>
      </div>

      <div
        className={`mt-5 flex items-center gap-2 text-sm font-semibold ${
          unchanged
            ? "text-slate-500 dark:text-gray-400"
            : increased
              ? "text-red-500"
              : "text-[#4D869C] dark:text-[#A7D129]"
        }`}
      >
        {unchanged ? (
          <Minus size={18} />
        ) : increased ? (
          <ArrowUp size={18} />
        ) : (
          <ArrowDown size={18} />
        )}

        <span>
          {percentage === null
            ? previous === 0
              ? "Sin gastos el mes anterior para comparar"
              : "Sin variación"
            : `${Math.abs(percentage)}% ${
                increased ? "más" : "menos"
              } que el período anterior`}
        </span>
      </div>

      {statusBreakdown && statusBreakdown.length > 0 && (
        <div className="mt-6 border-t border-gray-100 pt-4 dark:border-[#3E432E]">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            Estado de los pagos
          </h3>

          <div className="space-y-2">
            {statusBreakdown.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      STATUS_DOT[item.status]
                    }`}
                  />

                  <span className="text-slate-600 dark:text-gray-300">
                    {item.status}
                  </span>

                  <span className="text-xs text-slate-400 dark:text-gray-500">
                    ({item.count})
                  </span>
                </div>

                <span className="font-semibold text-slate-900 dark:text-white">
                  {moneyFormat(item.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
