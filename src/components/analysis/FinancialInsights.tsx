import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Minus,
} from "lucide-react";

import type { FinancialInsight } from "../../types/analysis";

interface Props {
  insights: FinancialInsight[];
}

export default function FinancialInsights({ insights }: Props) {
  const getIcon = (type: FinancialInsight["type"]) => {
    if (type === "up") {
      return (
        <ArrowUp
          size={18}
          className="text-red-500"
        />
      );
    }

    if (type === "down") {
      return (
        <ArrowDown
          size={18}
          className="text-[#4D869C] dark:text-[#A7D129]"
        />
      );
    }

    return (
      <Minus
        size={18}
        className="text-slate-500"
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                 dark:border-[#3E432E] dark:bg-[#000000]"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF7FF] dark:bg-[#3E432E]">
          <AlertTriangle
            size={20}
            className="text-[#4D869C] dark:text-[#A7D129]"
          />
        </div>

        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">
            Insights financieros
          </h2>

          <p className="text-sm text-slate-500 dark:text-gray-400">
            Información relevante sobre tus gastos.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
            }}
            className="flex gap-4 rounded-xl bg-[#EEF7FF] p-4 dark:bg-[#3E432E]"
          >
            <div className="mt-0.5">
              {getIcon(insight.type)}
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {insight.title}
              </h3>

              <p className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                {insight.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}