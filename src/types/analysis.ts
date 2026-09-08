export interface MonthlyExpense {
  month: string;
  amount: number;
}

export interface CategoryExpense {
  name: string;
  value: number;
}

export interface ServiceExpense {
  service: string;
  amount: number;
}

export interface Invoice {
  id: number;
  service: string;
  category: string;
  amount: number;
  date: string;
  status: "Pagada" | "Pendiente" | "Vencida";
}

export interface FinancialInsight {
  title: string;
  description: string;
  type: "up" | "down" | "stable";
}

export interface PeriodComparisonData {
  current: number;
  previous: number;
}

{/*después <ExpenseEvolutionChart data={monthlyExpenses} /> */}
{/*interface Props {
  data: MonthlyExpense[];
}

export default function ExpenseEvolutionChart({ data }: Props) {
  // ...*/}