import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  Calculator,
  FileText,
  Loader2,
  Receipt,
  RefreshCw,
  TrendingUp,
  Wallet,
} from "lucide-react";

import AnalysisHeader from "../../../components/analysis/AnalysisHeader";
import StatCard from "../../../components/analysis/StatCard";
import ExpenseEvolutionChart from "../../../components/analysis/ExpenseEvolutionChart";
import AtomScore from "../../../components/analysis/AtomScore";
import CategoryExpenses from "../../../components/analysis/CategoryExpenses";
import TopServices from "../../../components/analysis/TopServices";
import ConsumptionBreakdown from "../../../components/analysis/ConsumptionBreakdown";
import ServiceTrendsExplorer from "../../../components/analysis/ServiceTrendsExplorer";
import FinancialInsights from "../../../components/analysis/FinancialInsights";
import RecentInvoices from "../../../components/analysis/RecentInvoices";
import PeriodComparison from "../../../components/analysis/PeriodComparison";
import { anomalyTypeLabel } from "../../../components/analysis/analysisMeta";

import { getAnalysis } from "../../../services/analysisService";
import { errorMessage } from "../../../services/apiError";
import type { AnalysisPayload } from "../../../types/analysis";
import { moneyFormat } from "../../../utils/billingFormat";

export default function Analysis() {
  const [data, setData] = useState<AnalysisPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      setData(await getAnalysis());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const variation = data?.summary.variationPercent ?? null;
  const anomalies = data?.anomalies ?? [];
  const trends = data?.trends ?? [];
  const highAnomalies = anomalies.filter(
    (anomaly) => anomaly.severity === "high"
  );

  return (
    <main className="min-h-screen bg-[#EEF7FF] px-4 py-6 dark:bg-[#000000] md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <AnalysisHeader
          updatedAt={data?.generatedAt}
          onRefresh={() => void load(true)}
          loading={refreshing}
        />

        {error && data && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            <AlertCircle size={18} />
            <span className="flex-1">{error}</span>

            <button
              type="button"
              onClick={() => void load(true)}
              className="flex items-center gap-1 font-semibold underline-offset-2 hover:underline"
            >
              <RefreshCw size={14} />
              Reintentar
            </button>
          </div>
        )}

        {loading && !data && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
            <Loader2
              size={36}
              className="animate-spin text-[#4D869C] dark:text-[#A7D129]"
            />

            <p className="text-sm text-slate-500 dark:text-gray-400">
              Calculando tu análisis...
            </p>
          </div>
        )}

        {!loading && error && !data && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-black">
            <AlertCircle size={40} className="text-red-500" />

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                No pudimos cargar el análisis
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void load()}
              className="flex items-center gap-2 rounded-xl bg-[#4D869C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d6f83] dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
            >
              <RefreshCw size={16} />
              Reintentar
            </button>
          </div>
        )}

        {!loading && data && !data.hasData && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-[#CDE8E5] bg-white p-8 text-center dark:border-[#3E432E] dark:bg-black">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF7FF] dark:bg-[#3E432E]">
              <FileText
                size={30}
                className="text-[#4D869C] dark:text-[#A7D129]"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Todavía no hay datos para analizar
              </h2>

              <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-gray-400">
                Conectá tu correo o cargá un comprobante para que AtomPay
                empiece a calcular tu AtomScore, tus estadísticas y tus
                recomendaciones.
              </p>
            </div>

            <Link
              to="/dashboard/billing"
              className="rounded-xl bg-[#4D869C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d6f83] dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
            >
              Ir a facturación
            </Link>
          </div>
        )}

        {data && data.hasData && (
          <>
            {/* BANNER DE ALERTA INMEDIATA */}
            {highAnomalies.length > 0 && (
              <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={20}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-red-800 dark:text-red-300">
                      {highAnomalies.length === 1
                        ? "Detectamos una anomalía de prioridad alta"
                        : `Detectamos ${highAnomalies.length} anomalías de prioridad alta`}
                    </h2>

                    <p className="mt-1 text-sm text-red-700/90 dark:text-red-300/90">
                      {highAnomalies[0].description}
                    </p>

                    <p className="mt-1 text-sm font-medium text-red-800 dark:text-red-200">
                      {highAnomalies[0].suggestion}
                    </p>

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-red-700/70 dark:text-red-300/70">
                      Simulá el impacto de cancelar o ajustar
                    </p>

                    <div className="mt-1 flex flex-wrap gap-2">
                      {highAnomalies.map((anomaly, index) => (
                        <Link
                          key={`${anomaly.service}-${anomaly.type}-${index}`}
                          to={`/dashboard/simulator?service=${encodeURIComponent(
                            anomaly.service
                          )}`}
                          title={`${anomalyTypeLabel[anomaly.type]}: ${anomaly.description}`}
                          className="flex items-center gap-1 rounded-full border border-red-200 bg-white/70 px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:border-red-400 hover:bg-white dark:border-red-900 dark:bg-black/30 dark:text-red-300 dark:hover:border-red-700"
                        >
                          <Calculator size={12} />
                          Simular {anomaly.service}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ESTADÍSTICAS */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Gastos del mes"
                value={moneyFormat(
                  data.summary.currentMonth,
                  data.currency
                )}
                description={`${data.summary.invoiceCount} facturas registradas`}
                icon={Wallet}
                trend={variation}
              />

              <StatCard
                title="Variación"
                value={
                  variation === null
                    ? "—"
                    : `${variation >= 0 ? "+" : ""}${variation.toFixed(1)}%`
                }
                description={
                  data.summary.previousMonth > 0
                    ? `Mes anterior: ${moneyFormat(
                        data.summary.previousMonth,
                        data.currency
                      )}`
                    : "Sin mes anterior para comparar"
                }
                icon={TrendingUp}
              />

              <StatCard
                title="Servicios activos"
                value={String(data.summary.serviceCount)}
                description="Servicios registrados"
                icon={Receipt}
              />

              <StatCard
                title="Promedio por factura"
                value={moneyFormat(
                  data.summary.averageInvoice,
                  data.currency
                )}
                description="Durante este mes"
                icon={Wallet}
              />
            </section>

            {/* EVOLUCIÓN DE GASTOS */}
            <section className="mt-6">
              <ExpenseEvolutionChart
                data={data.monthly}
                currency={data.currency}
              />
            </section>

            {/* CATEGORÍAS + SERVICIOS */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <CategoryExpenses
                data={data.categories}
                currency={data.currency}
              />

              <TopServices
                data={data.services}
                currency={data.currency}
                trends={trends}
                anomalies={anomalies}
              />
            </section>

            {/* CONSUMO VS. IMPORTE */}
            {data.consumption && (
              <section className="mt-6">
                <ConsumptionBreakdown
                  consumption={data.consumption}
                  currency={data.currency}
                />
              </section>
            )}

            {/* TENDENCIAS E HISTORIAL POR SERVICIO */}
            <section className="mt-6">
              <ServiceTrendsExplorer
                trends={trends}
                anomalies={anomalies}
                currency={data.currency}
              />
            </section>

            {/* ATOMSCORE + COMPARACIÓN */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              {data.score && <AtomScore score={data.score} />}

              <PeriodComparison
                current={data.periodComparison.current}
                previous={data.periodComparison.previous}
                currency={data.currency}
                statusBreakdown={data.statusBreakdown}
              />
            </section>

            {/* INSIGHTS */}
            <section className="mt-6">
              <FinancialInsights insights={data.insights} />
            </section>

            {/* FACTURAS RECIENTES */}
            <section className="mt-6">
              <RecentInvoices initialInvoices={data.recentInvoices} />
            </section>

            <p className="mt-6 text-center text-xs text-slate-400 dark:text-gray-500">
              Evolución de los últimos 6 meses · Análisis en {data.currency}.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
