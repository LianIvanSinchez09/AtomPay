import type { SimulationAction } from "../../types/simulation";
import type { SimulationActionMeta } from "../../types/simulatorComponents";
import { tr, getLocale } from "../../i18n/translate";

/** Etiquetas y estilos de cada acción del simulador. */
export const simulationActionMeta: Record<SimulationAction, SimulationActionMeta> =
  {
    KEEP: {
      label: tr("Mantener"),
      shortLabel: tr("Sin cambios"),
      badge:
        "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
      dot: "bg-slate-400",
    },
    CANCEL: {
      label: tr("Cancelar / pausar"),
      shortLabel: tr("Cancelado"),
      badge:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
      dot: "bg-red-500",
    },
    DOWNGRADE: {
      label: tr("Cambiar de plan"),
      shortLabel: tr("Plan más barato"),
      badge:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
      dot: "bg-amber-500",
    },
    MODIFY_AMOUNT: {
      label: tr("Ajustar importe"),
      shortLabel: tr("Importe ajustado"),
      badge:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
      dot: "bg-sky-500",
    },
  };

/** Acciones que se ofrecen en la tarjeta de cada servicio. */
export const simulationActionOptions: SimulationAction[] = [
  "KEEP",
  "CANCEL",
  "DOWNGRADE",
];

/** Importe con dos decimales, en la moneda del usuario. */
export function formatSimulationMoney(
  amount: number,
  currency: string
): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: amount >= 1000 ? 0 : 2,
  }).format(amount);
}

/** Porcentaje con un decimal y signo. */
export function formatSimulationPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

/** Fecha corta de un escenario guardado. */
export function formatSimulationDate(value: string): string {
  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

/** Redondeo a dos decimales, igual que el backend. */
export function roundSimulationAmount(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Deja el importe dentro del rango 0..máximo. */
export function clampSimulationAmount(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;

  return roundSimulationAmount(Math.min(max, Math.max(0, value)));
}

/** Importe sugerido al elegir "cambiar de plan" (20% menos). */
export function defaultDowngradeAmount(currentAmount: number): number {
  return clampSimulationAmount(currentAmount * 0.8, currentAmount);
}

/** Umbrales rápidos que ofrecen las tarjetas y el modal de meta. */
export const savingsPresets = [5000, 10000, 20000, 30000];

/** Descuentos rápidos del slider de cada servicio. */
export const discountPresets = [10, 25, 50];

/* --------------------------- Horizonte ---------------------------- */

/** Horizontes ofrecidos como atajo (en meses). */
export const horizonPresets = [3, 6, 12, 24, 60];

/** Límites del horizonte personalizado. Deben coincidir con el backend. */
export const MIN_HORIZON_MONTHS = 1;
export const MAX_HORIZON_MONTHS = 120;
export const DEFAULT_HORIZON_MONTHS = 12;

/** Deja el horizonte dentro de 1..120 meses y entero. */
export function clampHorizonMonths(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_HORIZON_MONTHS;

  return Math.round(
    Math.min(MAX_HORIZON_MONTHS, Math.max(MIN_HORIZON_MONTHS, value))
  );
}

/** Etiqueta legible del horizonte: "6 meses", "un año", "2 años". */
export function formatHorizonLabel(months: number): string {
  if (months === 1) return tr("un mes");
  if (months === 12) return tr("un año");
  if (months === 24) return tr("2 años");

  return tr("{months} meses", { months });
}

/** Mes y año en que termina la proyección (ej. "nov 2026"). */
export function formatHorizonEnd(months: number): string {
  const end = new Date();
  end.setMonth(end.getMonth() + months);

  return new Intl.DateTimeFormat("es-AR", {
    month: "short",
    year: "numeric",
  }).format(end);
}

/** Nombre corto del horizonte para títulos de métricas. */
export function formatHorizonTitle(months: number): string {
  return months === 12 ? tr("Ahorro anual") : tr("Ahorro en {months} meses", { months });
}
