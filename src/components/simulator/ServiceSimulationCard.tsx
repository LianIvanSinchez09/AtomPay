import { motion } from "motion/react";
import { Ban, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";

import type {
  ServiceSimulationCardProps,
  SimulationActionButtonProps,
} from "../../types/simulatorComponents";
import {
  clampSimulationAmount,
  defaultDowngradeAmount,
  discountPresets,
  formatSimulationMoney,
  simulationActionMeta,
} from "./simulatorMeta";

/**
 * Tarjeta de un servicio dentro del modo manual.
 *
 * Permite mantenerlo, cancelarlo o bajar el plan con un slider. El cambio se
 * informa al padre (`Simulator`) con `onChange`; la tarjeta no calcula totales.
 *
 * Se usa en `SimulationServiceList.tsx`.
 */
export default function ServiceSimulationCard({
  service,
  draft,
  currency,
  highlighted = false,
  onChange,
}: ServiceSimulationCardProps) {
  const current = service.monthlyAmount;
  const action = draft?.action ?? "KEEP";
  const adjusting = action === "DOWNGRADE" || action === "MODIFY_AMOUNT";
  const simulated =
    action === "CANCEL" ? 0 : adjusting ? (draft?.simulatedAmount ?? current) : current;
  const saving = Math.round((current - simulated) * 100) / 100;
  const canSimulate = current > 0;
  const step = Math.max(1, Math.round(current / 100));

  const selectAction = (next: "KEEP" | "CANCEL" | "DOWNGRADE") => {
    if (!canSimulate) return;

    if (next === "KEEP") {
      onChange(service.id, null);
      return;
    }

    if (next === "CANCEL") {
      onChange(service.id, { action: "CANCEL", simulatedAmount: 0 });
      return;
    }

    onChange(service.id, {
      action: "DOWNGRADE",
      simulatedAmount: defaultDowngradeAmount(current),
    });
  };

  const setAmount = (value: number) => {
    if (value >= current) {
      onChange(service.id, null);
      return;
    }

    onChange(service.id, {
      action: "DOWNGRADE",
      simulatedAmount: clampSimulationAmount(value, current),
    });
  };

  return (
    <motion.article
      layout
      className={`rounded-2xl border bg-white p-4 shadow-sm transition dark:bg-black ${
        highlighted
          ? "border-[#4D869C] ring-2 ring-[#4D869C]/25 dark:border-[#A7D129] dark:ring-[#A7D129]/25"
          : "border-[#CDE8E5] dark:border-[#3E432E]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900 dark:text-white">
              {service.name}
            </h3>

            <span className="rounded-full border border-[#CDE8E5] bg-[#F7FCFF] px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:border-[#616F39] dark:bg-[#3E432E] dark:text-gray-300">
              {service.category}
            </span>

            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                service.essential
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
              }`}
            >
              {service.essential ? "Esencial" : "Flexible"}
            </span>

            {highlighted && (
              <span className="flex items-center gap-1 rounded-full bg-[#EEF7FF] px-2 py-0.5 text-[11px] font-semibold text-[#4D869C] dark:bg-[#3E432E] dark:text-[#A7D129]">
                <Sparkles size={11} />
                Desde el análisis
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
            {service.invoiceCount > 0
              ? `Promedio de ${service.invoiceCount} factura${
                  service.invoiceCount === 1 ? "" : "s"
                }${service.lastPeriod ? ` · última ${service.lastPeriod}` : ""}`
              : service.lastAmount
                ? "Precio cargado en el servicio"
                : "Sin gasto registrado"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${simulationActionMeta[action].badge}`}
        >
          {simulationActionMeta[action].shortLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
            Gasto mensual actual
          </p>

          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatSimulationMoney(current, currency)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
            Quedaría en
          </p>

          <p
            className={`text-xl font-bold ${
              saving > 0
                ? "text-[#4D869C] dark:text-[#A7D129]"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {formatSimulationMoney(simulated, currency)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <ActionButton
          active={action === "KEEP"}
          disabled={!canSimulate}
          label="Mantener"
          icon={<RotateCcw size={14} />}
          onClick={() => selectAction("KEEP")}
        />

        <ActionButton
          active={action === "CANCEL"}
          disabled={!canSimulate}
          label="Cancelar"
          icon={<Ban size={14} />}
          onClick={() => selectAction("CANCEL")}
          tone="danger"
        />

        <ActionButton
          active={adjusting}
          disabled={!canSimulate}
          label="Ajustar"
          icon={<SlidersHorizontal size={14} />}
          onClick={() => selectAction("DOWNGRADE")}
        />
      </div>

      {adjusting && (
        <div className="mt-4 rounded-xl border border-[#CDE8E5] bg-[#F7FCFF] p-3 dark:border-[#616F39] dark:bg-[#3E432E]/40">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor={`simulated-${service.id}`}
              className="text-xs font-semibold text-slate-600 dark:text-gray-300"
            >
              Nuevo importe mensual
            </label>

            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 dark:text-gray-500">
                {currency}
              </span>

              <input
                id={`simulated-${service.id}`}
                type="number"
                min={0}
                max={current}
                step="any"
                value={simulated}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="w-28 rounded-lg border border-[#CDE8E5] bg-white px-2 py-1 text-right text-sm font-semibold text-slate-900 outline-none focus:border-[#4D869C] dark:border-[#616F39] dark:bg-black dark:text-white"
              />
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={current}
            step={step}
            value={simulated}
            onChange={(event) => setAmount(Number(event.target.value))}
            aria-label={`Ajustar el gasto mensual de ${service.name}`}
            className="mt-3 w-full accent-[#4D869C] dark:accent-[#A7D129]"
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1.5">
              {discountPresets.map((percent) => (
                <button
                  key={percent}
                  type="button"
                  onClick={() =>
                    setAmount(current * (1 - percent / 100))
                  }
                  className="rounded-full border border-[#CDE8E5] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-[#4D869C] hover:text-[#4D869C] dark:border-[#616F39] dark:bg-black dark:text-gray-300 dark:hover:border-[#A7D129] dark:hover:text-[#A7D129]"
                >
                  -{percent}%
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-[#4D869C] dark:text-[#A7D129]">
              Ahorrás {formatSimulationMoney(saving, currency)}/mes
            </p>
          </div>
        </div>
      )}

      {!adjusting && saving > 0 && (
        <p className="mt-3 text-xs font-semibold text-[#4D869C] dark:text-[#A7D129]">
          Ahorrás {formatSimulationMoney(saving, currency)} por mes.
        </p>
      )}

      {!adjusting && saving === 0 && !canSimulate && (
        <p className="mt-3 text-xs text-slate-400 dark:text-gray-500">
          Este servicio todavía no tiene facturas ni precio cargado, así que no
          afecta la simulación.
        </p>
      )}
    </motion.article>
  );
}

function ActionButton({
  active,
  disabled,
  label,
  icon,
  onClick,
  tone = "default",
}: SimulationActionButtonProps) {
  const activeClass =
    tone === "danger"
      ? "border-red-300 bg-red-500 text-white dark:border-red-800 dark:bg-red-600"
      : "border-[#4D869C] bg-[#4D869C] text-white dark:border-[#A7D129] dark:bg-[#A7D129] dark:text-black";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? activeClass
          : "border-[#CDE8E5] bg-white text-slate-600 hover:border-[#4D869C] hover:text-[#4D869C] dark:border-[#616F39] dark:bg-black dark:text-gray-300 dark:hover:border-[#A7D129] dark:hover:text-[#A7D129]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
