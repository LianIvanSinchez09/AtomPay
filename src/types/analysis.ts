import type { InvoiceStatus } from "./types";

export interface MonthlyExpense {
  month: string;
  amount: number;
  count?: number;
}

export interface CategoryExpense {
  name: string;
  value: number;
  count?: number;
  percentage?: number;
}

export interface ServiceExpense {
  service: string;
  amount: number;
  count?: number;
  category?: string;
  percentage?: number;
}

export interface Invoice {
  id: string;
  service: string;
  category: string;
  amount: number;
  currency?: string;
  date: string;
  status: InvoiceStatus;
}

/** Filtros de la tabla "Facturas recientes" del análisis. */
export interface AnalysisInvoiceFilters {
  from?: string;
  to?: string;
  status?: InvoiceStatus | "";
  search?: string;
  service?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface AnalysisInvoicePage {
  invoices: Invoice[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export type FinancialInsightType =
  | "up"
  | "down"
  | "stable"
  | "warning"
  | "positive";

/** Severidad de la observación: de más a menos urgente. */
export type FinancialInsightSeverity = "critical" | "warning" | "info";

/** Qué originó la observación. */
export type FinancialInsightKind =
  | "tariff_hike"
  | "consumption_spike"
  | "spike"
  | "consecutive_increase"
  | "savings"
  | "general";

export interface FinancialInsight {
  title: string;
  description: string;
  type: FinancialInsightType;
  severity?: FinancialInsightSeverity;
  kind?: FinancialInsightKind;
  service?: string;
  recommendation?: string;
}

/* ---------------------- Anomalías y tendencias --------------------- */

export type ServiceAnomalyType =
  | "spike"
  | "tariff_hike"
  | "consumption_spike"
  | "consecutive_increase"
  | "drop";

export type ServiceAnomalySeverity = "high" | "medium" | "low";

export interface ServiceAnomaly {
  service: string;
  category: string;
  type: ServiceAnomalyType;
  severity: ServiceAnomalySeverity;
  title: string;
  description: string;
  suggestion: string;
  amount: number;
  previousAmount: number;
  variationPercent: number;
  period: string;
  consumption?: {
    current: number;
    previous: number;
    unit: string;
    variationPercent: number;
  };
}

export type ServiceTrend =
  | "increasing"
  | "decreasing"
  | "stable"
  | "fluctuating"
  | "new";

export interface ServiceHistoryPoint {
  key: string;
  month: string;
  amount: number;
  count: number;
  consumption: number | null;
  unit: string | null;
  unitPrice: number | null;
}

export interface ServiceTrendAnalysis {
  service: string;
  category: string;
  trend: ServiceTrend;
  variationPercent: number | null;
  currentAmount: number;
  averageAmount: number;
  invoiceCount: number;
  lastPeriod: string | null;
  lastMonth: string | null;
  consumptionUnit: string | null;
  lastConsumption: number | null;
  consumptionVariationPercent: number | null;
  unitPrice: number | null;
  history: ServiceHistoryPoint[];
}

export interface ConsumptionServiceSummary {
  service: string;
  category: string;
  unit: string;
  current: number;
  previous: number | null;
  average: number;
  variationPercent: number | null;
  unitPrice: number | null;
  previousUnitPrice: number | null;
  unitPriceVariationPercent: number | null;
  amount: number;
  previousAmount: number | null;
  amountVariationPercent: number | null;
  lastPeriod: string;
  lastMonth: string;
}

export interface ConsumptionAnalysisSummary {
  hasConsumption: boolean;
  servicesWithConsumption: number;
  totalServices: number;
  services: ConsumptionServiceSummary[];
}

export interface PeriodComparisonData {
  current: number;
  previous: number;
}

export type AnalysisImpact = "positive" | "neutral" | "negative";

export interface AnalysisFactor {
  key: string;
  label: string;
  value: number;
  weight: number;
  detail: string;
  impact: AnalysisImpact;
}

export interface AnalysisScore {
  value: number;
  level: "Excelente" | "Saludable" | "Atención" | "Riesgo" | "Crítico";
  description: string;
  recommendation: string;
  factors: AnalysisFactor[];
}

export interface AnalysisSummary {
  currentMonth: number;
  previousMonth: number;
  variationPercent: number | null;
  windowTotal: number;
  invoiceCount: number;
  serviceCount: number;
  averageInvoice: number;
  paidAmount: number;
  paidCount: number;
  pendingAmount: number;
  pendingCount: number;
  overdueAmount: number;
  overdueCount: number;
  paymentRate: number;
}

export interface AnalysisPayload {
  generatedAt: string;
  currency: string;
  hasData: boolean;
  score: AnalysisScore | null;
  summary: AnalysisSummary;
  monthly: MonthlyExpense[];
  categories: CategoryExpense[];
  services: ServiceExpense[];
  recentInvoices: Invoice[];
  insights: FinancialInsight[];
  anomalies: ServiceAnomaly[];
  trends: ServiceTrendAnalysis[];
  consumption: ConsumptionAnalysisSummary;
  periodComparison: PeriodComparisonData;
  statusBreakdown: {
    status: InvoiceStatus;
    count: number;
    amount: number;
  }[];
  otherCurrencies: { currency: string; count: number }[];
}
