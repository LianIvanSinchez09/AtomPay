import type {
  FinancialInsight,
  FinancialInsightKind,
  FinancialInsightSeverity,
  ServiceAnomalySeverity,
  ServiceAnomalyType,
  ServiceTrend,
} from "../../types/analysis";
import type {
  SeverityBadgeMeta,
  TrendMeta,
} from "../../types/analysisComponents";

/** Etiquetas y estilos de cada estado de tendencia. */
export const trendMeta: Record<ServiceTrend, TrendMeta> = {
  increasing: {
    label: "En aumento",
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    dot: "bg-red-500",
  },
  decreasing: {
    label: "En baja",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  stable: {
    label: "Estable",
    badge:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  fluctuating: {
    label: "Variable",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  new: {
    label: "Reciente",
    badge:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
    dot: "bg-sky-500",
  },
};

export const anomalyTypeLabel: Record<ServiceAnomalyType, string> = {
  spike: "Pico inusual",
  tariff_hike: "Aumento tarifario",
  consumption_spike: "Pico de consumo",
  consecutive_increase: "Tendencia alcista",
  drop: "Ahorro",
};

export const anomalySeverityMeta: Record<
  ServiceAnomalySeverity,
  SeverityBadgeMeta
> = {
  high: {
    label: "Prioridad alta",
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
  medium: {
    label: "Atención",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  low: {
    label: "Optimización",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  },
};

export const insightSeverityMeta: Record<
  FinancialInsightSeverity,
  SeverityBadgeMeta
> = {
  critical: {
    label: "Prioridad alta",
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
  warning: {
    label: "Atención",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  info: {
    label: "Informativa",
    badge:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  },
};

export const insightKindLabel: Record<FinancialInsightKind, string> = {
  tariff_hike: "Aumento tarifario",
  consumption_spike: "Pico de consumo",
  spike: "Pico inusual",
  consecutive_increase: "Tendencia alcista",
  savings: "Ahorro",
  general: "General",
};

/** Normaliza la severidad de insights viejos que no traen el campo. */
export function insightSeverity(
  insight: FinancialInsight
): FinancialInsightSeverity {
  if (insight.severity) return insight.severity;
  if (insight.type === "warning" || insight.type === "up") return "warning";
  if (insight.type === "down" || insight.type === "positive") return "info";

  return "info";
}

/** Normaliza el tipo de un insight viejo. */
export function insightKind(insight: FinancialInsight): FinancialInsightKind {
  if (insight.kind) return insight.kind;
  if (insight.type === "down") return "savings";

  return "general";
}

export const formatMoney = (value: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

/** Importe por unidad de consumo: conserva decimales. */
export const formatUnitPrice = (value: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export const formatCompactMoney = (value: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function formatSignedPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  const formatted = Math.abs(value).toLocaleString("es-AR", {
    maximumFractionDigits: 1,
  });

  return `${value >= 0 ? "+" : "-"}${formatted}%`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  return value.toLocaleString("es-AR", { maximumFractionDigits: 2 });
}
