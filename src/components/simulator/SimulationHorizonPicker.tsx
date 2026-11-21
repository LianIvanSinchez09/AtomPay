import { CalendarRange } from "lucide-react";

import type { SimulationHorizonPickerProps } from "../../types/simulatorComponents";
import {
  clampHorizonMonths,
  formatHorizonEnd,
  formatHorizonLabel,
  horizonPresets,
  MAX_HORIZON_MONTHS,
  MIN_HORIZON_MONTHS,
} from "./simulatorMeta";

/**
 * Selector del plazo de la proyección.
 *
 * Permite elegir cuántos meses quiere mirar el usuario (3, 6, 12, 24, 60 o un
 * valor propio entre 1 y 120). El cambio se informa con `onChange` y la página
 * `Simulator.tsx` vuelve a calcular contra el backend.
 */
export default function SimulationHorizonPicker({
  months,
  disabled = false,
  onChange,
}: SimulationHorizonPickerProps) {
  return (
    <section className="rounded-2xl border border-[#CDE8E5] bg-white p-4 shadow-sm dark:border-[#3E432E] dark:bg-black">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF7FF] dark:bg-[#3E432E]">
            <CalendarRange
              size={17}
              className="text-[#4D869C] dark:text-[#A7D129]"
            />
          </span>

          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Plazo de la proyección
            </h2>

            <p className="text-xs text-slate-500 dark:text-gray-400">
              Ves el ahorro de {formatHorizonLabel(months)} · hasta{" "}
              {formatHorizonEnd(months)}.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {horizonPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                disabled={disabled}
                aria-pressed={months === preset}
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition disabled:opacity-40 ${
                  months === preset
                    ? "border-[#4D869C] bg-[#4D869C] text-white dark:border-[#A7D129] dark:bg-[#A7D129] dark:text-black"
                    : "border-[#CDE8E5] bg-white text-slate-600 hover:border-[#4D869C] hover:text-[#4D869C] dark:border-[#616F39] dark:bg-black dark:text-gray-300 dark:hover:border-[#A7D129] dark:hover:text-[#A7D129]"
                }`}
              >
                {preset} m
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 border-l border-[#CDE8E5] pl-2 dark:border-[#616F39]">
            <label
              htmlFor="simulation-horizon"
              className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500"
            >
              Otro
            </label>

            <input
              id="simulation-horizon"
              type="number"
              min={MIN_HORIZON_MONTHS}
              max={MAX_HORIZON_MONTHS}
              step={1}
              inputMode="numeric"
              value={months}
              disabled={disabled}
              onChange={(event) =>
                onChange(clampHorizonMonths(Number(event.target.value)))
              }
              aria-label="Meses de la proyección"
              className="w-16 rounded-lg border border-[#CDE8E5] bg-white px-2 py-1 text-right text-xs font-semibold text-slate-900 outline-none transition focus:border-[#4D869C] focus:ring-2 focus:ring-[#4D869C]/20 disabled:opacity-40 dark:border-[#616F39] dark:bg-[#3E432E] dark:text-white"
            />

            <span className="text-xs text-slate-400 dark:text-gray-500">
              meses
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
