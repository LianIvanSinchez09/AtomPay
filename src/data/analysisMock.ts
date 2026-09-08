import type {
  CategoryExpense,
  FinancialInsight,
  Invoice,
  MonthlyExpense,
  ServiceExpense,
} from "../types/analysis";

export const monthlyExpenses: MonthlyExpense[] = [
  { month: "Abr", amount: 78500 },
  { month: "May", amount: 82300 },
  { month: "Jun", amount: 76800 },
  { month: "Jul", amount: 91200 },
  { month: "Ago", amount: 87400 },
  { month: "Sep", amount: 96500 },
];

export const categoryExpenses: CategoryExpense[] = [
  {
    name: "Servicios",
    value: 48200,
  },
  {
    name: "Streaming",
    value: 18600,
  },
  {
    name: "Internet",
    value: 12500,
  },
  {
    name: "Telefonía",
    value: 9200,
  },
  {
    name: "Otros",
    value: 8000,
  },
];

export const serviceExpenses: ServiceExpense[] = [
  {
    service: "Electricidad",
    amount: 21800,
  },
  {
    service: "Internet",
    amount: 12500,
  },
  {
    service: "Gas",
    amount: 11400,
  },
  {
    service: "Netflix",
    amount: 8900,
  },
  {
    service: "Telefonía",
    amount: 9200,
  },
];

export const recentInvoices: Invoice[] = [
  {
    id: 1,
    service: "Electricidad",
    category: "Servicios",
    amount: 21800,
    date: "05/09/2026",
    status: "Pagada",
  },
  {
    id: 2,
    service: "Internet",
    category: "Internet",
    amount: 12500,
    date: "03/09/2026",
    status: "Pagada",
  },
  {
    id: 3,
    service: "Gas",
    category: "Servicios",
    amount: 11400,
    date: "01/09/2026",
    status: "Pendiente",
  },
  {
    id: 4,
    service: "Netflix",
    category: "Streaming",
    amount: 8900,
    date: "28/08/2026",
    status: "Pagada",
  },
  {
    id: 5,
    service: "Telefonía",
    category: "Telefonía",
    amount: 9200,
    date: "25/08/2026",
    status: "Vencida",
  },
];

export const financialInsights: FinancialInsight[] = [
  {
    title: "Aumento en electricidad",
    description:
      "Tu gasto en electricidad aumentó un 14% respecto al mes anterior.",
    type: "up",
  },
  {
    title: "Menor gasto en streaming",
    description:
      "Tus suscripciones digitales disminuyeron un 8% durante este período.",
    type: "down",
  },
  {
    title: "Gastos estables",
    description:
      "Internet y telefonía mantienen valores similares a los últimos meses.",
    type: "stable",
  },
];

export const atomScore = 65;

export const comparisonData = {
  current: 96500,
  previous: 87400,
};