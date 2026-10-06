import {
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

import AnalysisHeader from "../../../components/analysis/AnalysisHeader";
import StatCard from "../../../components/analysis/StatCard";
import ExpenseEvolutionChart from "../../../components/analysis/ExpenseEvolutionChart";
import AtomScore from "../../../components/analysis/AtomScore";
import CategoryExpenses from "../../../components/analysis/CategoryExpenses";
import TopServices from "../../../components/analysis/TopServices";
import FinancialInsights from "../../../components/analysis/FinancialInsights";
import RecentInvoices from "../../../components/analysis/RecentInvoices";
import PeriodComparison from "../../../components/analysis/PeriodComparison";


import {
  monthlyExpenses,
  categoryExpenses,
  serviceExpenses,
  financialInsights,
  recentInvoices,
  comparisonData,
  atomScore,
} from "../../../data/analysisMock";

export default function Analysis() {
  return (
    <main className="min-h-screen bg-[#EEF7FF] px-4 py-6 dark:bg-[#000000] md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <AnalysisHeader />

        {/* ESTADÍSTICAS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Gastos del mes"
            value="$96.500"
            description="Total de gastos"
            icon={Wallet}
            trend={10.4}
          />

          <StatCard
            title="Variación"
            value="+10,4%"
            description="Respecto al mes anterior"
            icon={TrendingUp}
            trend={10.4}
          />

          <StatCard
            title="Servicios activos"
            value="8"
            description="Servicios registrados"
            icon={Receipt}
          />

          <StatCard
            title="Promedio por factura"
            value="$12.062"
            description="Durante este mes"
            icon={Wallet}
          />
        </section>

        {/* EVOLUCIÓN DE GASTOS */}
        <section className="mt-6">
          <ExpenseEvolutionChart
            data={monthlyExpenses}
          />
        </section>

        {/* CATEGORÍAS + SERVICIOS */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <CategoryExpenses
            data={categoryExpenses}
          />
 
          <TopServices
            data={serviceExpenses}
          /> 
        </section>

        {/* ATOMSCORE + COMPARACIÓN */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <AtomScore
            score={atomScore}
          />

           <PeriodComparison
            current={comparisonData.current}
            previous={comparisonData.previous}
          /> 
        </section>

        {/* INSIGHTS */}
        <section className="mt-6">
           <FinancialInsights
            insights={financialInsights}
          /> 
        </section>

        {/* FACTURAS RECIENTES */}
        <section className="mt-6">
           <RecentInvoices
            invoices={recentInvoices}
          /> 
        </section>

      </div>
    </main>
  );
}