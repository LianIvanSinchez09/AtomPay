import { useEffect, useId, useRef } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

import type { SimulatorModalShellProps } from "../../types/simulatorComponents";

/**
 * Contenedor común de los modales del simulador.
 *
 * Cierra con Escape o con clic en el fondo y bloquea el scroll del body
 * mientras está abierto. Lo usan `SavingsGoalModal` y `SaveSimulationModal`.
 */
export default function ModalShell({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  size = "md",
}: SimulatorModalShellProps) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`my-auto w-full rounded-2xl border border-[#CDE8E5] bg-white shadow-xl dark:border-[#3E432E] dark:bg-black ${
          size === "lg" ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#CDE8E5] p-5 dark:border-[#3E432E]">
          <div>
            <h2
              id={titleId}
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#3E432E] dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#CDE8E5] p-4 dark:border-[#3E432E]">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
}
