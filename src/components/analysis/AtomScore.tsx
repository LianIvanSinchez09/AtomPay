import { motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface Props {
  score: number;
}

interface ScoreInfo {
  label: string;
  description: string;
  recommendation: string;
  icon: typeof ShieldCheck;
  color: string;
  bg: string;
  border: string;
}

const getScoreInfo = (score: number): ScoreInfo => {
  if (score >= 80) {
    return {
      label: "Excelente",
      description:
        "Tus gastos están bien controlados y mantenés una buena estabilidad financiera.",
      recommendation:
        "Seguí manteniendo este nivel de control y evitando aumentos innecesarios.",
      icon: CheckCircle2,
      color: "text-[#4D869C] dark:text-[#A7D129]",
      bg: "bg-[#CDE8E5] dark:bg-[#3E432E]",
      border: "border-[#4D869C] dark:border-[#A7D129]",
    };
  }

  if (score >= 65) {
    return {
      label: "Saludable",
      description:
        "Tu economía se encuentra en un estado saludable, aunque hay algunos gastos que podés optimizar.",
      recommendation:
        "Revisá tus gastos variables para mantener o mejorar tu score.",
      icon: TrendingUp,
      color: "text-[#4D869C] dark:text-[#A7D129]",
      bg: "bg-[#CDE8E5] dark:bg-[#3E432E]",
      border: "border-[#4D869C] dark:border-[#A7D129]",
    };
  }

  if (score >= 50) {
    return {
      label: "Atención",
      description:
        "Tus gastos empiezan a mostrar algunas señales que conviene revisar.",
      recommendation:
        "Prestá atención a los aumentos y a los gastos que se repiten todos los meses.",
      icon: AlertTriangle,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-950",
      border: "border-yellow-500",
    };
  }

  if (score >= 30) {
    return {
      label: "Riesgo",
      description:
        "Tus gastos están aumentando o presentan un nivel de descontrol que requiere atención.",
      recommendation:
        "Revisá tus principales gastos y priorizá aquellos que podés reducir.",
      icon: TrendingDown,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950",
      border: "border-orange-500",
    };
  }

  return {
    label: "Crítico",
    description:
      "Tu nivel de gastos requiere una revisión importante para recuperar estabilidad.",
    recommendation:
      "Analizá tus gastos prioritarios y buscá reducir los consumos innecesarios.",
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-500",
  };
};

export default function AtomScore({ score }: Props) {
  const safeScore = Math.min(100, Math.max(0, score));
  const scoreInfo = getScoreInfo(safeScore);
  const StatusIcon = scoreInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        rounded-2xl
        border
        border-[#CDE8E5]
        bg-white
        p-6
        shadow-sm

        dark:border-[#3E432E]
        dark:bg-black
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              ${scoreInfo.bg}
            `}
          >
            <ShieldCheck
              size={23}
              className={scoreInfo.color}
            />
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
          className={`
            hidden
            items-center
            gap-2
            rounded-full
            border
            px-3
            py-1.5
            text-sm
            font-semibold
            sm:flex

            ${scoreInfo.border}
            ${scoreInfo.color}
          `}
        >
          <StatusIcon size={16} />
          {scoreInfo.label}
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
            {/* Fondo */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-[#CDE8E5] dark:text-[#3E432E]"
            />

            {/* Progreso */}
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              className={scoreInfo.color}
              strokeDasharray={314}
              initial={{ strokeDashoffset: 314 }}
              animate={{
                strokeDashoffset:
                  314 - (314 * safeScore) / 100,
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
            />
          </svg>

          {/* Número */}
          <div className="text-center">
            <motion.span
              className="
                block
                text-4xl
                font-bold
                text-slate-900
                dark:text-white
              "
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.3,
                duration: 0.4,
              }}
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
          {/* Estado mobile */}
          <div
            className={`
              mb-3
              flex
              items-center
              justify-center
              gap-2
              text-xl
              font-bold
              sm:hidden

              ${scoreInfo.color}
            `}
          >
            <StatusIcon size={21} />
            {scoreInfo.label}
          </div>

          <h3
            className={`
              text-2xl
              font-bold
              ${scoreInfo.color}
            `}
          >
            {scoreInfo.label}
          </h3>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
              dark:text-gray-400
            "
          >
            {scoreInfo.description}
          </p>

          {/* Recomendación */}
          <div
            className={`
              mt-4
              rounded-xl
              border
              p-4
              text-sm
              leading-6

              ${scoreInfo.border}
              ${scoreInfo.bg}
            `}
          >
            <span
              className={`
                font-semibold
                ${scoreInfo.color}
              `}
            >
              💡 Recomendación
            </span>

            <p className="mt-1 text-slate-600 dark:text-gray-300">
              {scoreInfo.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* ESCALA */}
      <div className="mt-8">
        <div
          className="
            mb-2
            flex
            justify-between
            text-xs
            text-slate-400
            dark:text-gray-500
          "
        >
          <span>Crítico</span>
          <span>Riesgo</span>
          <span>Atención</span>
          <span>Saludable</span>
          <span>Excelente</span>
        </div>

        <div
          className="
            relative
            h-2
            overflow-hidden
            rounded-full
            bg-slate-200
            dark:bg-[#3E432E]
          "
        >
          {/* Barra de colores */}
          <div className="absolute inset-0 flex">
            <div className="w-[30%] bg-red-400" />
            <div className="w-[20%] bg-orange-400" />
            <div className="w-[15%] bg-yellow-400" />
            <div className="w-[15%] bg-[#7AB2B2]" />
            <div className="w-[20%] bg-[#4D869C] dark:bg-[#A7D129]" />
          </div>

          {/* Indicador */}
          <motion.div
            className="
              absolute
              top-1/2
              h-5
              w-5
              -translate-y-1/2
              rounded-full
              border-2
              border-white
              bg-slate-900
              shadow-md

              dark:border-black
              dark:bg-white
            "
            initial={{ left: "0%" }}
            animate={{
              left: `calc(${safeScore}% - 10px)`,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
          />
        </div>

        <div
          className="
            mt-2
            flex
            justify-between
            text-xs
            font-medium
            text-slate-500
            dark:text-gray-400
          "
        >
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