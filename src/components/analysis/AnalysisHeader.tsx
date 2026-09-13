import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";

export default function AnalysisHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CDE8E5] dark:bg-[#3E432E]">
          <BarChart3
            size={23}
            className="text-[#4D869C] dark:text-[#A7D129]"
          />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Análisis
        </h1>
      </div>

      <p className="text-slate-500 dark:text-gray-400">
        Analizá tus gastos y obtené información sobre tu comportamiento
        financiero.
      </p>
    </motion.div>
  );
}