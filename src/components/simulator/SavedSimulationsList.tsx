import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  FolderOpen,
  GitCompareArrows,
  Loader2,
  Trash2,
} from "lucide-react";

import type {
  SavedSimulationsListProps,
  SimulationCompareRowProps,
} from "../../types/simulatorComponents";
import {
  formatSimulationDate,
  formatSimulationMoney,
  formatSimulationPercent,
} from "./simulatorMeta";

/**
 * Panel de escenarios guardados.
 *
 * Permite cargar un escenario en el simulador, eliminarlo y comparar dos a la
 * vez. Se usa en `pages/private/dashboard/Simulator.tsx` y se alimenta con
 * `getSavedSimulations` (`GET /api/simulations`).
 */
export default function SavedSimulationsList({
  simulations,
  currency,
  loading,
  deletingId,
  onLoad,
  onDelete,
}: SavedSimulationsListProps) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const selected = useMemo(
    () => simulations.filter((item) => compareIds.includes(item.id)),
    [simulations, compareIds]
  );

  const comparison = selected.length === 2 ? selected : [];
  const bestId =
    comparison.length === 2
      ? comparison[0].monthlyDifference >= comparison[1].monthlyDifference
        ? comparison[0].id
        : comparison[1].id
      : null;

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) {
        return current.filter((value) => value !== id);
      }

      return current.length >= 2 ? [current[1], id] : [...current, id];
    });
  };

  return (
    <section className="rounded-2xl border border-[#CDE8E5] bg-white p-4 shadow-sm dark:border-[#3E432E] dark:bg-black">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <FolderOpen
              size={17}
              className="text-[#4D869C] dark:text-[#A7D129]"
            />
            Escenarios guardados
          </h2>

          <p className="text-xs text-slate-500 dark:text-gray-400">
            {simulations.length === 0
              ? "Todavía no guardaste ninguno"
              : `${simulations.length} escenario${
                  simulations.length === 1 ? "" : "s"
                }`}
          </p>
        </div>

        {compareIds.length > 0 && (
          <button
            type="button"
            onClick={() => setCompareIds([])}
            className="text-xs font-semibold text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline dark:hover:text-gray-200"
          >
            Limpiar comparación
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400 dark:text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          Cargando escenarios...
        </div>
      )}

      {!loading && simulations.length === 0 && (
        <p className="mt-4 rounded-xl border border-dashed border-[#CDE8E5] p-6 text-center text-sm text-slate-500 dark:border-[#616F39] dark:text-gray-400">
          Cuando tengas un plan que te guste, guardalo con
          <span className="font-semibold text-slate-700 dark:text-gray-200">
            {" "}
            Guardar escenario
          </span>{" "}
          y va a aparecer acá.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {simulations.map((simulation) => {
          const comparing = compareIds.includes(simulation.id);
          const isBest = bestId === simulation.id;

          return (
            <motion.article
              key={simulation.id}
              layout
              className={`rounded-xl border p-3 transition ${
                comparing
                  ? "border-[#4D869C] bg-[#EEF7FF] dark:border-[#A7D129] dark:bg-[#3E432E]"
                  : "border-[#CDE8E5] dark:border-[#3E432E]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {simulation.name}
                    </h3>

                    {isBest && (
                      <span className="rounded-full bg-[#CDE8E5] px-2 py-0.5 text-[10px] font-bold uppercase text-[#2f6477] dark:bg-[#A7D129] dark:text-black">
                        Más conveniente
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-gray-500">
                    {formatSimulationDate(simulation.createdAt)} ·{" "}
                    {simulation.items.length} cambio
                    {simulation.items.length === 1 ? "" : "s"}
                  </p>

                  {simulation.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-gray-400">
                      {simulation.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleCompare(simulation.id)}
                  aria-pressed={comparing}
                  title="Comparar escenario"
                  className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold transition ${
                    comparing
                      ? "border-[#4D869C] bg-[#4D869C] text-white dark:border-[#A7D129] dark:bg-[#A7D129] dark:text-black"
                      : "border-[#CDE8E5] text-slate-500 hover:border-[#4D869C] dark:border-[#616F39] dark:text-gray-300"
                  }`}
                >
                  {comparing ? <Check size={11} /> : <GitCompareArrows size={11} />}
                  Comparar
                </button>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-[#F7FCFF] p-1.5 dark:bg-[#111111]">
                  <dt className="text-[10px] uppercase text-slate-400 dark:text-gray-500">
                    Mensual
                  </dt>
                  <dd className="font-bold text-slate-800 dark:text-gray-100">
                    {formatSimulationMoney(
                      simulation.simulatedMonthlyExpense,
                      currency
                    )}
                  </dd>
                </div>

                <div className="rounded-lg bg-[#F7FCFF] p-1.5 dark:bg-[#111111]">
                  <dt className="text-[10px] uppercase text-slate-400 dark:text-gray-500">
                    Ahorro
                  </dt>
                  <dd className="font-bold text-[#4D869C] dark:text-[#A7D129]">
                    {formatSimulationMoney(
                      simulation.monthlyDifference,
                      currency
                    )}
                  </dd>
                </div>

                <div className="rounded-lg bg-[#F7FCFF] p-1.5 dark:bg-[#111111]">
                  <dt className="text-[10px] uppercase text-slate-400 dark:text-gray-500">
                    Recorte
                  </dt>
                  <dd className="font-bold text-slate-800 dark:text-gray-100">
                    {formatSimulationPercent(simulation.savingsPercent)}
                  </dd>
                </div>
              </dl>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onLoad(simulation)}
                  className="flex-1 rounded-lg bg-[#4D869C] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3d6f83] dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
                >
                  Cargar en el simulador
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(simulation)}
                  disabled={deletingId === simulation.id}
                  aria-label={`Eliminar ${simulation.name}`}
                  className="flex items-center justify-center rounded-lg border border-[#CDE8E5] px-2.5 text-slate-400 transition hover:border-red-300 hover:text-red-500 disabled:opacity-40 dark:border-[#616F39]"
                >
                  {deletingId === simulation.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>

      {comparison.length === 2 && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-[#CDE8E5] dark:border-[#616F39]">
          <table className="w-full min-w-[320px] text-xs">
            <thead>
              <tr className="border-b border-[#CDE8E5] bg-[#F7FCFF] text-left dark:border-[#616F39] dark:bg-[#3E432E]">
                <th className="p-2 font-semibold text-slate-500 dark:text-gray-400">
                  Comparación
                </th>
                {comparison.map((item) => (
                  <th
                    key={item.id}
                    className="p-2 font-semibold text-slate-700 dark:text-gray-200"
                  >
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <CompareRow
                label="Gasto mensual"
                values={comparison.map((item) =>
                  formatSimulationMoney(item.simulatedMonthlyExpense, currency)
                )}
              />
              <CompareRow
                label="Ahorro mensual"
                values={comparison.map((item) =>
                  formatSimulationMoney(item.monthlyDifference, currency)
                )}
              />
              <CompareRow
                label="Ahorro anual"
                values={comparison.map((item) =>
                  formatSimulationMoney(item.yearlyDifference, currency)
                )}
              />
              <CompareRow
                label="Recorte"
                values={comparison.map((item) =>
                  formatSimulationPercent(item.savingsPercent)
                )}
              />
            </tbody>
          </table>
        </div>
      )}

      {compareIds.length === 1 && (
        <p className="mt-3 text-center text-xs text-slate-400 dark:text-gray-500">
          Elegí un segundo escenario para compararlos.
        </p>
      )}
    </section>
  );
}

function CompareRow({ label, values }: SimulationCompareRowProps) {
  return (
    <tr className="border-b border-[#CDE8E5] last:border-0 dark:border-[#3E432E]">
      <th className="p-2 text-left font-medium text-slate-500 dark:text-gray-400">
        {label}
      </th>

      {values.map((value, index) => (
        <td
          key={`${label}-${index}`}
          className="p-2 font-semibold text-slate-800 dark:text-gray-100"
        >
          {value}
        </td>
      ))}
    </tr>
  );
}
