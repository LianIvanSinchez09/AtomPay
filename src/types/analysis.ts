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

export interface FinancialInsight {
  title: string;
  description: string;
  type: FinancialInsightType;
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
  periodComparison: PeriodComparisonData;
  statusBreakdown: {
    status: InvoiceStatus;
    count: number;
    amount: number;
  }[];
  otherCurrencies: { currency: string; count: number }[];
}
