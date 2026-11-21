import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Save } from "lucide-react";

import type { SaveSimulationModalProps } from "../../types/simulatorComponents";
import ModalShell from "./ModalShell";
import { formatSimulationMoney, formatSimulationPercent } from "./simulatorMeta";

/**
 * Modal para ponerle nombre al escenario y guardarlo.
 *
 * El guardado real lo hace `onSave` en `Simulator.tsx`, que llama a
 * `saveSimulation` (`POST /api/simulations`).
 */
export default function SaveSimulationModal({
  open,
  saving,
  error,
  defaultName,
  simulation,
  onClose,
  onSave,
}: SaveSimulationModalProps) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(defaultName);
    setDescription("");
  }, [open, defaultName]);

  const changes = simulation.services.filter(
    (item) => item.action !== "KEEP"
  ).length;
  const canSave = name.trim().length > 0 && !saving;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Guardar escenario"
      description="Podés volver a cargarlo o compararlo con otros escenarios."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-[#CDE8E5] px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[#F7FCFF] disabled:opacity-40 dark:border-[#616F39] dark:text-gray-300 dark:hover:bg-[#3E432E]"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="save-simulation-form"
            disabled={!canSave}
            className="flex items-center gap-1.5 rounded-xl bg-[#4D869C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d6f83] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Guardar escenario
          </button>
        </>
      }
    >
      <div className="rounded-xl border border-[#CDE8E5] bg-[#F7FCFF] p-3 text-sm dark:border-[#616F39] dark:bg-[#3E432E]/40">
        <p className="font-semibold text-slate-800 dark:text-gray-100">
          {changes} cambio{changes === 1 ? "" : "s"} · Ahorro mensual{" "}
          <span className="text-[#4D869C] dark:text-[#A7D129]">
            {formatSimulationMoney(
              simulation.monthlyDifference,
              simulation.currency
            )}
          </span>
        </p>

        <p className="text-xs text-slate-500 dark:text-gray-400">
          {formatSimulationPercent(simulation.savingsPercent)} del gasto actual
          · {formatSimulationMoney(simulation.yearlyDifference, simulation.currency)}{" "}
          al año.
        </p>
      </div>

      <form
        id="save-simulation-form"
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();

          if (canSave) onSave(name.trim(), description.trim());
        }}
      >
        <div>
          <label
            htmlFor="simulation-name"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400"
          >
            Nombre
          </label>

          <input
            id="simulation-name"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Plan austero, Sin streaming…"
            className="mt-1 w-full rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#4D869C] focus:ring-2 focus:ring-[#4D869C]/20 dark:border-[#616F39] dark:bg-[#3E432E] dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="simulation-description"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400"
          >
            Descripción (opcional)
          </label>

          <textarea
            id="simulation-description"
            rows={2}
            maxLength={240}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Qué incluiste y por qué"
            className="mt-1 w-full resize-none rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#4D869C] focus:ring-2 focus:ring-[#4D869C]/20 dark:border-[#616F39] dark:bg-[#3E432E] dark:text-white"
          />
        </div>
      </form>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}
    </ModalShell>
  );
}
