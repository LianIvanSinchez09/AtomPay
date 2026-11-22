import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Sparkles, Target } from "lucide-react";

import type { SavingsGoalModalProps } from "../../types/simulatorComponents";
import ModalShell from "./ModalShell";
import {
  formatHorizonEnd,
  formatHorizonLabel,
  formatSimulationMoney,
  savingsPresets,
  simulationActionMeta,
} from "./simulatorMeta";

/**
 * Modal del modo "quiero ahorrar $X por mes".
 *
 * Envía la meta a `onCalculate` (que llama a `POST /api/simulations/goal`) y
 * muestra el plan sugerido. Con `onApply` ese plan se vuelca al simulador
 * manual para que el usuario lo revise.
 *
 * Se usa en `pages/private/dashboard/Simulator.tsx`.
 */
export default function SavingsGoalModal({
  open,
  currency,
  loading,
  suggestion,
  error,
  onClose,
  onCalculate,
  onApply,
}: SavingsGoalModalProps) {
  const [target, setTarget] = useState("");
  const [includeEssential, setIncludeEssential] = useState(false);

  useEffect(() => {
    if (!open) return;

    setTarget("");
    setIncludeEssential(false);
  }, [open]);

  const numericTarget = Number(target);
  const validTarget = Number.isFinite(numericTarget) && numericTarget > 0;
  const changes =
    suggestion?.simulation.services.filter((item) => item.action !== "KEEP") ??
    [];

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      size="lg"
      title="Meta de ahorro"
      description="Decinos cuánto querés recortar por mes y armamos una combinación de servicios."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#CDE8E5] px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[#F7FCFF] dark:border-[#616F39] dark:text-gray-300 dark:hover:bg-[#3E432E]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onApply}
            disabled={changes.length === 0}
            className="rounded-xl bg-[#4D869C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d6f83] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
          >
            Aplicar al simulador
          </button>
        </>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (validTarget) onCalculate(numericTarget, includeEssential);
        }}
      >
        <label
          htmlFor="savings-goal"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400"
        >
          <Target size={13} />
          Ahorro mensual deseado
        </label>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">
            {currency}
          </span>

          <input
            id="savings-goal"
            type="number"
            min={1}
            step="any"
            inputMode="decimal"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="30000"
            className="w-40 rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#4D869C] focus:ring-2 focus:ring-[#4D869C]/20 dark:border-[#616F39] dark:bg-[#3E432E] dark:text-white"
          />

          <button
            type="submit"
            disabled={!validTarget || loading}
            className="flex items-center gap-1.5 rounded-xl bg-[#4D869C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d6f83] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} />
            )}
            Calcular plan
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {savingsPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setTarget(String(preset))}
              className="rounded-full border border-[#CDE8E5] px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-[#4D869C] hover:text-[#4D869C] dark:border-[#616F39] dark:text-gray-300 dark:hover:border-[#A7D129] dark:hover:text-[#A7D129]"
            >
              {formatSimulationMoney(preset, currency)}
            </button>
          ))}
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={includeEssential}
            onChange={(event) => setIncludeEssential(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#4D869C] dark:accent-[#A7D129]"
          />
          <span>
            Incluir servicios esenciales
            <span className="block text-xs text-slate-400 dark:text-gray-500">
              Por defecto solo se recortan servicios flexibles (streaming,
              suscripciones, compras).
            </span>
          </span>
        </label>
      </form>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {suggestion && (
        <div className="mt-5 rounded-xl border border-[#CDE8E5] bg-[#F7FCFF] p-4 dark:border-[#616F39] dark:bg-[#3E432E]/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              className={`flex items-center gap-1.5 text-sm font-semibold ${
                suggestion.feasible
                  ? "text-[#4D869C] dark:text-[#A7D129]"
                  : "text-amber-700 dark:text-amber-300"
              }`}
            >
              <CheckCircle2 size={15} />
              {suggestion.feasible
                ? "Meta alcanzable"
                : "Meta parcialmente alcanzable"}
            </p>

            <span className="text-xs text-slate-500 dark:text-gray-400">
              Objetivo:{" "}
              {formatSimulationMoney(
                suggestion.targetMonthlySaving,
                currency
              )}{" "}
              · Logrado:{" "}
              {formatSimulationMoney(
                suggestion.achievableMonthlySaving,
                currency
              )}{" "}
              · Plazo:{" "}
              {formatHorizonLabel(suggestion.simulation.horizonMonths)}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
            {suggestion.message}
          </p>

          <ul className="mt-3 space-y-2">
            {changes.map((item) => (
              <li
                key={item.serviceId}
                className="flex items-center justify-between gap-2 rounded-lg border border-[#CDE8E5] bg-white px-3 py-2 text-xs dark:border-[#616F39] dark:bg-black"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${simulationActionMeta[item.action].dot}`}
                  />
                  <span className="truncate font-semibold text-slate-800 dark:text-gray-100">
                    {item.service}
                  </span>
                  <span className="shrink-0 text-slate-400 dark:text-gray-500">
                    {simulationActionMeta[item.action].shortLabel}
                  </span>
                </span>

                <span className="shrink-0 text-right text-slate-500 dark:text-gray-400">
                  {formatSimulationMoney(item.currentAmount, currency)} →{" "}
                  <span className="font-semibold text-slate-800 dark:text-gray-100">
                    {formatSimulationMoney(item.simulatedAmount, currency)}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-white p-2 dark:bg-black">
              <p className="text-[11px] uppercase text-slate-400 dark:text-gray-500">
                Ahorro mensual
              </p>
              <p className="font-bold text-[#4D869C] dark:text-[#A7D129]">
                {formatSimulationMoney(
                  suggestion.simulation.monthlyDifference,
                  currency
                )}
              </p>
            </div>

            <div className="rounded-lg bg-white p-2 dark:bg-black">
              <p className="text-[11px] uppercase text-slate-400 dark:text-gray-500">
                Ahorro en {formatHorizonLabel(suggestion.simulation.horizonMonths)}
              </p>
              <p className="font-bold text-[#4D869C] dark:text-[#A7D129]">
                {formatSimulationMoney(
                  suggestion.simulation.horizonDifference,
                  currency
                )}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-gray-500">
                Hasta {formatHorizonEnd(suggestion.simulation.horizonMonths)}
              </p>
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
