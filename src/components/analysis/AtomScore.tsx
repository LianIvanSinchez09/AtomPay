import { motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import type {
  AnalysisFactor,
  AnalysisScore,
} from "../../types/analysis";

interface Props {
  score: AnalysisScore;
}

interface LevelStyle {
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

const LEVEL_STYLES: Record<AnalysisScore["level"], LevelStyle> = {
  Excelente: {
    icon: CheckCircle2,
    color: "text-[#4D869C] dark:text-[#A7D129]",
    bg: "bg-[#CDE8E5] dark:bg-[#3E432E]",
    border: "border-[#4D869C] dark:border-[#A7D129]",
  },
  Saludable: {
    icon: TrendingUp,
    color: "text-[#4D869C] dark:text-[#A7D129]",
    bg: "bg-[#CDE8E5] dark:bg-[#3E432E]",
    border: "border-[#4D869C] dark:border-[#A7D129]",
  },
  Atención: {
    icon: AlertTriangle,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950",
    border: "border-yellow-500",
  },
  Riesgo: {
    icon: TrendingDown,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950",
    border: "border-orange-500",
  },
  Crítico: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-500",
  },
};

const IMPACT_STYLES: Record<
  AnalysisFactor["impact"],
  { bar: string; text: string }
> = {
  positive: {
    bar: "bg-[#4D869C] dark:bg-[#A7D129]",
    text: "text-[#4D869C] dark:text-[#A7D129]",
  },
  neutral: {
    bar: "bg-yellow-400",
    text: "text-yellow-600 dark:text-yellow-400",
  },
  negative: {
    bar: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
  },
};

export default function AtomScore({ score }: Props) {
  const safeScore = Math.min(100, Math.max(0, score.value));
  const style = LEVEL_STYLES[score.level];
  const StatusIcon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                 dark:border-[#3E432E] dark:bg-black"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.bg}`}
          >
            <ShieldCheck size={23} className={style.color} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              AtomScore
            </h2>

            <p className="text-sm text-slate-500 dark:text-gray-400">
              Salud de tus gastos
            </p>
          </div>
        </div>

        {/* ESTADO */}
        <div
          className={`hidden items-center gap-2 rounded-full border px-3 py-1.5
                      text-sm font-semibold sm:flex
                      ${style.border} ${style.color}`}
        >
          <StatusIcon size={16} />
          {score.level}
        </div>
      </div>

      {/* SCORE */}
      <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row">
        {/* CÍRCULO */}
        <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-[#CDE8E5] dark:text-[#3E432E]"
            />

            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              className={style.color}
              strokeDasharray={314}
              initial={{ strokeDashoffset: 314 }}
              animate={{
                strokeDashoffset: 314 - (314 * safeScore) / 100,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>

          <div className="text-center">
            <motion.span
              className="block text-4xl font-bold text-slate-900 dark:text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {safeScore}
            </motion.span>

            <span className="text-xs text-slate-500 dark:text-gray-400">
              de 100
            </span>
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="flex-1 text-center sm:text-left">
          <div
            className={`mb-3 flex items-center justify-center gap-2 text-xl
                        font-bold sm:hidden ${style.color}`}
          >
            <StatusIcon size={21} />
            {score.level}
          </div>

          <h3 className={`text-2xl font-bold ${style.color}`}>
            {score.level}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-gray-400">
            {score.description}
          </p>

          <div
            className={`mt-4 rounded-xl border p-4 text-sm leading-6
                        ${style.border} ${style.bg}`}
          >
            <span className={`font-semibold ${style.color}`}>
              💡 Recomendación
            </span>

            <p className="mt-1 text-slate-600 dark:text-gray-300">
              {score.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* FACTORES */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Cómo se calcula
          </h3>

          <span className="text-xs text-slate-400 dark:text-gray-500">
            Ponderado sobre 100
          </span>
        </div>

        {score.factors.map((factor) => {
          const impact = IMPACT_STYLES[factor.impact];

          return (
            <div key={factor.key}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700 dark:text-gray-200">
                  {factor.label}
                  <span className="ml-2 text-xs font-normal text-slate-400 dark:text-gray-500">
                    {factor.weight}%
                  </span>
                </span>

                <span className={`font-semibold ${impact.text}`}>
                  {factor.value}/100
                </span>
              </div>

              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-[#3E432E]">
                <motion.div
                  className={`h-full rounded-full ${impact.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                {factor.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* ESCALA */}
      <div className="mt-8">
        <div className="mb-2 flex justify-between text-xs text-slate-400 dark:text-gray-500">
          <span>Crítico</span>
          <span>Riesgo</span>
          <span>Atención</span>
          <span>Saludable</span>
          <span>Excelente</span>
        </div>

        <div className="relative h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-[#3E432E]">
          <div className="absolute inset-0 flex">
            <div className="w-[30%] bg-red-400" />
            <div className="w-[20%] bg-orange-400" />
            <div className="w-[15%] bg-yellow-400" />
            <div className="w-[15%] bg-[#7AB2B2]" />
            <div className="w-[20%] bg-[#4D869C] dark:bg-[#A7D129]" />
          </div>

          <motion.div
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full
                       border-2 border-white bg-slate-900 shadow-md
                       dark:border-black dark:bg-white"
            initial={{ left: "0%" }}
            animate={{ left: `calc(${safeScore}% - 10px)` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs font-medium text-slate-500 dark:text-gray-400">
          <span>0</span>
          <span>30</span>
          <span>50</span>
          <span>65</span>
          <span>80</span>
          <span>100</span>
        </div>
      </div>
    </motion.div>
  );
}
