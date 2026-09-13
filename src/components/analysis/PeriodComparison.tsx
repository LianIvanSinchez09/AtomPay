import { motion } from "motion/react";
import { ArrowDown, ArrowUp, CalendarDays } from "lucide-react";

interface Props {
  current: number;
  previous: number;
}

export default function PeriodComparison({
  current,
  previous,
}: Props) {
  const difference = current - previous;

  const percentage =
    previous === 0
      ? 0
      : Math.round((difference / previous) * 100);

  const increased = difference > 0;

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
            ${current.toLocaleString("es-AR")}
          </p>
        </div>

        <div className="rounded-xl bg-[#EEF7FF] p-4 dark:bg-[#3E432E]">
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Mes anterior
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            ${previous.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      <div
        className={`mt-5 flex items-center gap-2 text-sm font-semibold ${
          increased
            ? "text-red-500"
            : "text-[#4D869C] dark:text-[#A7D129]"
        }`}
      >
        {increased ? (
          <ArrowUp size={18} />
        ) : (
          <ArrowDown size={18} />
        )}

        <span>
          {Math.abs(percentage)}%{" "}
          {increased ? "más" : "menos"} que el período anterior
        </span>
      </div>
    </motion.div>
  );
}