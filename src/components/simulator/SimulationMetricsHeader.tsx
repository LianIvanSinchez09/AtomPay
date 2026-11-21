import { motion } from "motion/react";
import {
  ArrowRight,
  BadgePercent,
  CalendarRange,
  Gauge,
  Loader2,
  TrendingDown,
} from "lucide-react";

import type {
  SimulationMetricProps,
  SimulationMetricsHeaderProps,
} from "../../types/simulatorComponents";
import {
  formatHorizonEnd,
  formatHorizonLabel,
  formatHorizonTitle,
  formatSimulationMoney,
  formatSimulationPercent,
} from "./simulatorMeta";

/**
 * Barra superior de impacto en tiempo real.
 *
 * Muestra el gasto mensual actual vs. simulado, el ahorro proyectado en el
 * plazo elegido, la estimación de puntos que ganaría el AtomScore y el gasto
 * acumulado del horizonte.
 *
 * Se usa en `pages/private/dashboard/Simulator.tsx`.
 */
export default function SimulationMetricsHeader({
  base,
  simulation,
  calculating = false,
}: SimulationMetricsHeaderProps) {
  const hasSavings = simulation.monthlyDifference > 0;
  const progress = Math.min(100, Math.max(0, simulation.savingsPercent));

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-5 shadow-sm dark:border-[#3E432E] dark:bg-black"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
            Impacto en tiempo real
          </p>

          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500">
              Hoy
            </span>

            <span className="text-sm font-medium text-slate-500 line-through dark:text-gray-400">
              {formatSimulationMoney(
                simulation.currentMonthlyExpense,
                base.currency
              )}
            </span>

            <ArrowRight
              size={14}
              className="text-slate-400 dark:text-gray-500"
            />

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {formatSimulationMoney(
                simulation.simulatedMonthlyExpense,
                base.currency
              )}
            </h2>

            <span className="text-sm text-slate-400 dark:text-gray-500">
              /mes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {calculating && (
            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500">
              <Loader2 size={13} className="animate-spin" />
              Calculando...
            </span>
          )}

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              hasSavings
                ? "bg-[#CDE8E5] text-[#2f6477] dark:bg-[#3E432E] dark:text-[#A7D129]"
                : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
            }`}
          >
            {hasSavings
              ? `Ahorrás ${formatSimulationMoney(
                  simulation.horizonDifference,
                  base.currency
                )} en ${formatHorizonLabel(simulation.horizonMonths)}`
              : "Todavía sin ahorro"}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<TrendingDown size={16} />}
          label="Ahorro mensual"
          value={formatSimulationMoney(
            simulation.monthlyDifference,
            base.currency
          )}
          hint={`${formatSimulationPercent(
            simulation.savingsPercent
          )} del gasto actual`}
        />

        <Metric
          icon={<CalendarRange size={16} />}
          label={formatHorizonTitle(simulation.horizonMonths)}
          value={formatSimulationMoney(
            simulation.horizonDifference,
            base.currency
          )}
          hint={`Hasta ${formatHorizonEnd(simulation.horizonMonths)}`}
          highlight
        />

        <Metric
          icon={<Gauge size={16} />}
          label="Impacto en AtomScore"
          value={
            simulation.scoreImpact > 0
              ? `+${simulation.scoreImpact} pts`
              : "0 pts"
          }
          hint="Estimado sobre estabilidad y diversificación"
        />

        <Metric
          icon={<BadgePercent size={16} />}
          label="Gasto del período"
          value={formatSimulationMoney(
            simulation.simulatedHorizonExpense,
            base.currency
          )}
          hint={`De ${formatSimulationMoney(
            simulation.currentHorizonExpense,
            base.currency
          )} en ${formatHorizonLabel(simulation.horizonMonths)}`}
        />
      </div>

      <div className="mt-5">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Porcentaje de ahorro sobre el gasto actual"
          className="h-2 overflow-hidden rounded-full bg-[#EEF7FF] dark:bg-[#3E432E]"
        >
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
            className="h-full rounded-full bg-[#4D869C] dark:bg-[#A7D129]"
          />
        </div>

        <p className="mt-2 text-xs text-slate-400 dark:text-gray-500">
          {hasSavings
            ? `Recortás el ${simulation.savingsPercent.toFixed(
                1
              )}% de tu gasto mensual estimado.`
            : "Activá un cambio en algún servicio para ver el impacto."}
        </p>
      </div>
    </motion.section>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
  highlight = false,
}: SimulationMetricProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight
          ? "border-[#4D869C]/40 bg-[#EEF7FF] dark:border-[#A7D129]/30 dark:bg-[#3E432E]"
          : "border-[#CDE8E5] bg-[#F7FCFF] dark:border-[#3E432E] dark:bg-[#111111]"
      }`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
        <span className="text-[#4D869C] dark:text-[#A7D129]">{icon}</span>
        {label}
      </div>

      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="text-[11px] text-slate-400 dark:text-gray-500">{hint}</p>
    </div>
  );
}
