import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Gauge,
  Lightbulb,
  Search,
  TrendingDown,
  TrendingUp,
  Waves,
} from "lucide-react";

import type {
  ServiceAnomaly,
  ServiceAnomalySeverity,
} from "../../types/analysis";
import type {
  FilterOption,
  MiniStatProps,
  ServiceTrendsExplorerProps,
  TrendFilter,
} from "../../types/analysisComponents";
import ServiceHistoryChart from "./ServiceHistoryChart";
import {
  anomalySeverityMeta,
  anomalyTypeLabel,
  formatMoney,
  formatNumber,
  formatSignedPercent,
  formatUnitPrice,
  trendMeta,
} from "./analysisMeta";

const severityWeight: Record<ServiceAnomalySeverity, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const filters: FilterOption<TrendFilter>[] = [
  { key: "all", label: "Todos" },
  { key: "anomaly", label: "Con anomalía" },
  { key: "increasing", label: "En aumento" },
  { key: "decreasing", label: "En baja" },
  { key: "stable", label: "Estables" },
];

export default function ServiceTrendsExplorer({
  trends,
  anomalies,
  currency,
}: ServiceTrendsExplorerProps) {
  const [filter, setFilter] = useState<TrendFilter>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const anomaliesByService = useMemo(() => {
    const map = new Map<string, ServiceAnomaly[]>();

    for (const anomaly of anomalies) {
      const list = map.get(anomaly.service) ?? [];
      list.push(anomaly);
      map.set(anomaly.service, list);
    }

    return map;
  }, [anomalies]);

  const counts = useMemo(
    () => ({
      all: trends.length,
      anomaly: trends.filter((trend) =>
        anomaliesByService.has(trend.service)
      ).length,
      increasing: trends.filter((trend) => trend.trend === "increasing")
        .length,
      decreasing: trends.filter((trend) => trend.trend === "decreasing")
        .length,
      stable: trends.filter((trend) => trend.trend === "stable").length,
    }),
    [trends, anomaliesByService]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return trends.filter((trend) => {
      const matchesSearch =
        !term ||
        trend.service.toLowerCase().includes(term) ||
        trend.category.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      switch (filter) {
        case "anomaly":
          return anomaliesByService.has(trend.service);
        case "increasing":
          return trend.trend === "increasing";
        case "decreasing":
          return trend.trend === "decreasing";
        case "stable":
          return trend.trend === "stable";
        default:
          return true;
      }
    });
  }, [trends, search, filter, anomaliesByService]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                 dark:border-[#3E432E] dark:bg-[#000000]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF7FF] dark:bg-[#3E432E]">
            <Activity
              size={20}
              className="text-[#4D869C] dark:text-[#A7D129]"
            />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Tendencias e historial por servicio
            </h2>

            <p className="text-sm text-slate-500 dark:text-gray-400">
              Evolución de importes y consumo de los últimos 6 meses.
            </p>
          </div>
        </div>

        <span className="rounded-full border border-[#CDE8E5] px-3 py-1 text-xs font-semibold text-slate-600 dark:border-[#3E432E] dark:text-gray-300">
          {counts.all} servicio(s)
        </span>
      </div>

      {/* BUSCADOR Y FILTROS */}
      <div className="mt-5 flex flex-col gap-3">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar servicio o categoría…"
            className="w-full rounded-xl border border-[#CDE8E5] bg-[#EEF7FF]/60 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4D869C] dark:border-[#3E432E] dark:bg-[#3E432E]/40 dark:text-white dark:focus:border-[#A7D129]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = filter === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-[#4D869C] bg-[#4D869C] text-white dark:border-[#A7D129] dark:bg-[#A7D129] dark:text-black"
                    : "border-[#CDE8E5] text-slate-600 hover:border-[#4D869C] hover:text-[#4D869C] dark:border-[#3E432E] dark:text-gray-300 dark:hover:border-[#A7D129] dark:hover:text-[#A7D129]"
                }`}
              >
                {item.label}
                <span
                  className={`ml-1.5 ${
                    active ? "opacity-80" : "text-slate-400"
                  }`}
                >
                  {counts[item.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LISTA */}
      {filtered.length > 0 ? (
        <div className="mt-5 space-y-3">
          {filtered.map((trend) => {
            const meta = trendMeta[trend.trend];
            const serviceAnomalies =
              anomaliesByService.get(trend.service) ?? [];
            const worstSeverity = serviceAnomalies.reduce<
              ServiceAnomalySeverity | null
            >((worst, anomaly) => {
              if (!worst) return anomaly.severity;

              return severityWeight[anomaly.severity] >
                severityWeight[worst]
                ? anomaly.severity
                : worst;
            }, null);

            const isOpen = expanded === trend.service;
            const TrendIcon =
              trend.trend === "increasing"
                ? TrendingUp
                : trend.trend === "decreasing"
                  ? TrendingDown
                  : trend.trend === "fluctuating"
                    ? Waves
                    : Activity;

            return (
              <div
                key={trend.service}
                className="overflow-hidden rounded-xl border border-[#CDE8E5] dark:border-[#3E432E]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(isOpen ? null : trend.service)
                  }
                  aria-expanded={isOpen}
                  className="flex w-full flex-wrap items-center gap-3 bg-[#EEF7FF]/60 px-4 py-3 text-left transition hover:bg-[#EEF7FF] dark:bg-[#3E432E]/40 dark:hover:bg-[#3E432E]"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.badge}`}
                  >
                    <TrendIcon size={18} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {trend.service}
                      </span>

                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.badge}`}
                      >
                        {meta.label}
                      </span>

                      {worstSeverity && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                            anomalySeverityMeta[worstSeverity].badge
                          }`}
                        >
                          <AlertTriangle size={11} />
                          {serviceAnomalies.length} anomalía(s)
                        </span>
                      )}
                    </span>

                    <span className="mt-1 block text-xs text-slate-500 dark:text-gray-400">
                      {trend.category} · {trend.invoiceCount} factura(s)
                      {trend.lastConsumption !== null &&
                        ` · ${formatNumber(trend.lastConsumption)} ${
                          trend.consumptionUnit ?? ""
                        }`}
                    </span>
                  </span>

                  <span className="text-right">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">
                      {formatMoney(trend.currentAmount, currency)}
                    </span>

                    <span
                      className={`block text-xs font-semibold ${
                        trend.variationPercent === null
                          ? "text-slate-400"
                          : trend.variationPercent > 0
                            ? "text-red-500"
                            : trend.variationPercent < 0
                              ? "text-emerald-500"
                              : "text-slate-400"
                      }`}
                    >
                      {formatSignedPercent(trend.variationPercent)} vs. anterior
                    </span>
                  </span>

                  <span className="text-slate-400">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-[#CDE8E5] bg-white p-4 dark:border-[#3E432E] dark:bg-black">
                    <ServiceHistoryChart
                      trend={trend}
                      currency={currency}
                      heightClass="h-64"
                    />

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <MiniStat
                        label="Promedio histórico"
                        value={formatMoney(trend.averageAmount, currency)}
                      />

                      <MiniStat
                        label="Precio unitario"
                        value={
                          trend.unitPrice === null
                            ? "—"
                            : `${formatUnitPrice(trend.unitPrice, currency)}/${
                                trend.consumptionUnit ?? "u"
                              }`
                        }
                      />

                      <MiniStat
                        label="Variación de consumo"
                        value={formatSignedPercent(
                          trend.consumptionVariationPercent
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                        <Gauge
                          size={16}
                          className="text-[#4D869C] dark:text-[#A7D129]"
                        />
                        Diagnóstico
                      </h4>

                      {serviceAnomalies.length > 0 ? (
                        <div className="space-y-2">
                          {serviceAnomalies.map((anomaly, index) => {
                            const severity =
                              anomalySeverityMeta[anomaly.severity];

                            return (
                              <div
                                key={`${anomaly.type}-${index}`}
                                className="rounded-lg border border-[#CDE8E5] bg-[#EEF7FF]/60 p-3 dark:border-[#3E432E] dark:bg-[#3E432E]/40"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {anomalyTypeLabel[anomaly.type]}
                                  </span>

                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${severity.badge}`}
                                  >
                                    {severity.label}
                                  </span>
                                </div>

                                <p className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                                  {anomaly.description}
                                </p>

                                <p className="mt-1.5 flex items-start gap-1.5 text-sm text-[#4D869C] dark:text-[#A7D129]">
                                  <Lightbulb
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                  />
                                  {anomaly.suggestion}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                          Sin anomalías: el servicio se mantiene en línea con
                          su historial.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CDE8E5] py-10 text-center dark:border-[#3E432E]">
          <Activity size={28} className="text-slate-300 dark:text-gray-600" />

          <p className="text-sm text-slate-500 dark:text-gray-400">
            No hay servicios que coincidan con el filtro.
          </p>
        </div>
      )}
    </motion.section>
  );
}

function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="rounded-lg border border-[#CDE8E5] bg-[#EEF7FF]/60 p-3 dark:border-[#3E432E] dark:bg-[#3E432E]/40">
      <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
