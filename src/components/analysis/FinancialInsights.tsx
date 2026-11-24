import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  Info,
  Lightbulb,
  Minus,
  Zap,
} from "lucide-react";

import type {
  FinancialInsight,
  FinancialInsightKind,
  FinancialInsightSeverity,
} from "../../types/analysis";
import type {
  FilterOption,
  FinancialInsightsProps,
  InsightFilter,
} from "../../types/analysisComponents";
import {
  insightKind,
  insightKindLabel,
  insightSeverity,
  insightSeverityMeta,
} from "./analysisMeta";
import { tr } from "../../i18n/translate";

const anomalyKinds: FinancialInsightKind[] = [
  "tariff_hike",
  "consumption_spike",
  "spike",
  "consecutive_increase",
];

const severityWeight: Record<FinancialInsightSeverity, number> = {
  critical: 3,
  warning: 2,
  info: 1,
};

const tabs: FilterOption<InsightFilter>[] = [
  { key: "all", label: tr("Todos") },
  { key: "anomalies", label: tr("Anomalías") },
  { key: "increases", label: tr("Aumentos") },
  { key: "savings", label: tr("Ahorros") },
];

function iconFor(
  kind: FinancialInsightKind,
  severity: FinancialInsightSeverity,
  type: FinancialInsight["type"]
) {
  if (kind === "tariff_hike") {
    return <ArrowUpRight size={18} className="text-red-500" />;
  }

  if (kind === "consumption_spike") {
    return <Zap size={18} className="text-amber-500" />;
  }

  if (kind === "spike" || kind === "consecutive_increase") {
    return <AlertTriangle size={18} className="text-orange-500" />;
  }

  if (kind === "savings") {
    return (
      <ArrowDown
        size={18}
        className="text-[#4D869C] dark:text-[#A7D129]"
      />
    );
  }

  switch (type) {
    case "up":
      return <ArrowUp size={18} className="text-red-500" />;
    case "down":
      return (
        <ArrowDown
          size={18}
          className="text-[#4D869C] dark:text-[#A7D129]"
        />
      );
    case "warning":
      return <AlertTriangle size={18} className="text-orange-500" />;
    case "positive":
      return (
        <CheckCircle2
          size={18}
          className="text-[#4D869C] dark:text-[#A7D129]"
        />
      );
    case "stable":
      return <Minus size={18} className="text-slate-500" />;
    default:
      return severity === "critical" ? (
        <AlertTriangle size={18} className="text-red-500" />
      ) : (
        <Info size={18} className="text-slate-500" />
      );
  }
}

export default function FinancialInsights({
  insights,
}: FinancialInsightsProps) {
  const [filter, setFilter] = useState<InsightFilter>("all");

  const normalized = useMemo(
    () =>
      insights.map((insight) => ({
        insight,
        severity: insightSeverity(insight),
        kind: insightKind(insight),
      })),
    [insights]
  );

  const counts = useMemo(
    () => ({
      all: normalized.length,
      anomalies: normalized.filter(({ kind }) =>
        anomalyKinds.includes(kind)
      ).length,
      increases: normalized.filter(
        ({ insight, kind }) =>
          insight.type === "up" || anomalyKinds.includes(kind)
      ).length,
      savings: normalized.filter(
        ({ insight, kind }) => kind === "savings" || insight.type === "down"
      ).length,
    }),
    [normalized]
  );

  const filtered = useMemo(() => {
    const list = normalized.filter(({ insight, kind }) => {
      switch (filter) {
        case "anomalies":
          return anomalyKinds.includes(kind);
        case "increases":
          return insight.type === "up" || anomalyKinds.includes(kind);
        case "savings":
          return kind === "savings" || insight.type === "down";
        default:
          return true;
      }
    });

    return [...list].sort(
      (a, b) => severityWeight[b.severity] - severityWeight[a.severity]
    );
  }, [normalized, filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                 dark:border-[#3E432E] dark:bg-[#000000]"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF7FF] dark:bg-[#3E432E]">
            <AlertTriangle
              size={20}
              className="text-[#4D869C] dark:text-[#A7D129]"
            />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">{" "}{tr("Detección de anomalías y tendencias")}{" "}</h2>

            <p className="text-sm text-slate-500 dark:text-gray-400">{" "}{tr("Observaciones priorizadas según su impacto en tu presupuesto.")}{" "}</p>
          </div>
        </div>

        <span className="rounded-full border border-[#CDE8E5] px-3 py-1 text-xs font-semibold text-slate-600 dark:border-[#3E432E] dark:text-gray-300">
          {counts.all}{" "}{tr("observación(es)")}{" "}</span>
      </div>

      {/* PESTAÑAS */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = filter === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-[#4D869C] bg-[#4D869C] text-white dark:border-[#A7D129] dark:bg-[#A7D129] dark:text-black"
                  : "border-[#CDE8E5] text-slate-600 hover:border-[#4D869C] hover:text-[#4D869C] dark:border-[#3E432E] dark:text-gray-300 dark:hover:border-[#A7D129] dark:hover:text-[#A7D129]"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 ${active ? "opacity-80" : "text-slate-400"}`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(({ insight, severity, kind }, index) => {
            const severityMeta = insightSeverityMeta[severity];

            return (
              <motion.div
                key={`${insight.title}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="flex gap-4 rounded-xl bg-[#EEF7FF] p-4 dark:bg-[#3E432E]"
              >
                <div className="mt-0.5">
                  {iconFor(kind, severity, insight.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {insight.title}
                    </h3>

                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${severityMeta.badge}`}
                    >
                      {severityMeta.label}
                    </span>

                    {kind !== "general" && (
                      <span className="rounded-full border border-[#CDE8E5] bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:border-[#3E432E] dark:bg-black/30 dark:text-gray-300">
                        {insightKindLabel[kind]}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                    {insight.description}
                  </p>

                  {insight.recommendation && (
                    <p className="mt-2 flex items-start gap-2 text-sm font-medium text-[#4D869C] dark:text-[#A7D129]">
                      <Lightbulb size={15} className="mt-0.5 shrink-0" />
                      {insight.recommendation}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-gray-400">
          {filter === "anomalies"
            ? tr("No detectamos anomalías en el período.")
            : filter === "increases"
              ? tr("No hay aumentos relevantes para mostrar.")
              : filter === "savings"
                ? tr("Todavía no hay ahorros detectados.")
                : tr("No hay observaciones por ahora.")}
        </p>
      )}
    </motion.div>
  );
}
