import type { LucideIcon } from "lucide-react";

import type {
  AnalysisScore,
  CategoryExpense,
  ConsumptionAnalysisSummary,
  FinancialInsight,
  Invoice,
  MonthlyExpense,
  ServiceAnomaly,
  ServiceExpense,
  ServiceTrendAnalysis,
} from "./analysis";
import type { InvoiceStatus } from "./types";

/**
 * Contratos de UI del módulo de análisis.
 *
 * Las interfaces de props y los tipos auxiliares de los componentes viven acá
 * (y no dentro de cada .tsx) para mantener los componentes enfocados en la
 * lógica y la presentación.
 */

/** Opción genérica para filtros y pestañas. */
export interface FilterOption<T extends string> {
  key: T;
  label: string;
}

/** Estilos y etiqueta de un estado de tendencia. */
export interface TrendMeta {
  label: string;
  badge: string;
  dot: string;
}

/** Estilos y etiqueta de una severidad. */
export interface SeverityBadgeMeta {
  label: string;
  badge: string;
}

/* ----------------------- ServiceHistoryChart ----------------------- */

export interface ServiceHistoryChartProps {
  trend: ServiceTrendAnalysis;
  currency: string;
  /** Altura del contenedor (clase de Tailwind). */
  heightClass?: string;
}

/* ---------------------- ServiceHistoryDrawer ----------------------- */

export interface ServiceHistoryDrawerProps {
  trend: ServiceTrendAnalysis;
  anomalies: ServiceAnomaly[];
  currency: string;
  onClose: () => void;
}

export interface DrawerStatProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "positive" | "negative";
}

/* --------------------------- TopServices --------------------------- */

export interface TopServicesProps {
  data: ServiceExpense[];
  currency: string;
  /** Historial por servicio para el drawer de detalle. */
  trends?: ServiceTrendAnalysis[];
  anomalies?: ServiceAnomaly[];
}

/** Datos que entrega Recharts al hacer clic en una barra. */
export interface TopServicesBarClickEntry {
  payload?: ServiceExpense;
  service?: string;
}

/* ---------------------- ServiceTrendsExplorer ---------------------- */

export type TrendFilter =
  | "all"
  | "anomaly"
  | "increasing"
  | "decreasing"
  | "stable";

export interface ServiceTrendsExplorerProps {
  trends: ServiceTrendAnalysis[];
  anomalies: ServiceAnomaly[];
  currency: string;
}

export interface MiniStatProps {
  label: string;
  value: string;
}

/* ---------------------- ConsumptionBreakdown ----------------------- */

export interface ConsumptionBreakdownProps {
  consumption: ConsumptionAnalysisSummary;
  currency: string;
}

export type ConsumptionVerdict = {
  label: string;
  badge: string;
};

export interface ConsumptionVerdictInput {
  consumptionVariation: number | null;
  priceVariation: number | null;
  amountVariation: number | null;
}

export interface ConsumptionCellProps {
  label: string;
  value: string;
  hint: string;
}

/* ------------------------ FinancialInsights ------------------------ */

export type InsightFilter = "all" | "anomalies" | "increases" | "savings";

export interface FinancialInsightsProps {
  insights: FinancialInsight[];
}

/* -------------------------- AnalysisHeader ------------------------- */

export interface AnalysisHeaderProps {
  updatedAt?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

/* ----------------------------- AtomScore --------------------------- */

export interface AtomScoreProps {
  score: AnalysisScore;
}

/** Estilos asociados a cada nivel del AtomScore. */
export interface AtomScoreLevelStyle {
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

/* -------------------------- CategoryExpenses ----------------------- */

export interface CategoryExpensesProps {
  data: CategoryExpense[];
  currency: string;
}

/* ----------------------- ExpenseEvolutionChart --------------------- */

export interface ExpenseEvolutionChartProps {
  data: MonthlyExpense[];
  currency?: string;
}

/* -------------------------- PeriodComparison ----------------------- */

export interface PeriodStatusBreakdownItem {
  status: InvoiceStatus;
  count: number;
  amount: number;
}

export interface PeriodComparisonProps {
  current: number;
  previous: number;
  currency: string;
  statusBreakdown?: PeriodStatusBreakdownItem[];
}

/* --------------------------- RecentInvoices ------------------------ */

export interface RecentInvoicesProps {
  /** Primeras facturas del análisis, para pintar algo mientras se filtra. */
  initialInvoices?: Invoice[];
}

/** Presets del filtro por fecha de la tabla de facturas. */
export type RangePreset = "all" | "month" | "quarter" | "year" | "custom";

/* ------------------------------ StatCard --------------------------- */

export interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  /** Variación porcentual. Para gastos, subir es negativo. */
  trend?: number | null;
  delay?: number;
}
