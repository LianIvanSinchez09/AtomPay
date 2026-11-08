import { motion } from "motion/react";
import { BarChart3, Loader2, RefreshCw } from "lucide-react";

interface Props {
  updatedAt?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

const formatUpdatedAt = (value: string) =>
  new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));

export default function AnalysisHeader({
  updatedAt,
  onRefresh,
  loading = false,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex flex-wrap items-start justify-between gap-4"
    >
      <div>
        <div className="mb-2 flex items-center gap-3">
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

        {updatedAt && (
          <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
            Actualizado el {formatUpdatedAt(updatedAt)}
          </p>
        )}
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[#CDE8E5] bg-white
                     px-4 py-2 text-sm font-medium text-[#4D869C] shadow-sm transition
                     hover:bg-[#EEF7FF] disabled:cursor-not-allowed disabled:opacity-60
                     dark:border-[#3E432E] dark:bg-[#000000] dark:text-[#A7D129]
                     dark:hover:bg-[#3E432E]"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      )}
    </motion.div>
  );
}
