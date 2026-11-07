import type { ReactNode } from "react";
import { motion } from "motion/react";
import { AlertCircle, Loader2 } from "lucide-react";

type Props = {
  title: string;
  description: string;
  /** Dato resumido que antes aparecía en la tarjeta (ej. "3 sin importe"). */
  badge?: ReactNode;
  error?: string | null;
  loading?: boolean;
  children: ReactNode;
};

/** Marco común de las páginas de "Administrar Servicios". */
export default function AdminPageLayout({
  title,
  description,
  badge,
  error,
  loading,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#EEF7FF] p-5 text-[#4D869C] dark:bg-black dark:text-white md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl"
      >
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider opacity-60">
            Administrar Servicios
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
            {badge && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold dark:bg-[#3E432E]">
                {badge}
              </span>
            )}
          </div>

          <p className="mt-3 max-w-2xl text-sm opacity-70 md:text-base">
            {description}
          </p>
        </header>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
}
