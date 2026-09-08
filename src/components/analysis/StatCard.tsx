import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: number;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  delay = 0,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-5 shadow-sm
                 dark:border-[#3E432E] dark:bg-[#000000]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </h3>

          {description && (
            <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF7FF] dark:bg-[#3E432E]">
          <Icon
            size={20}
            className="text-[#4D869C] dark:text-[#A7D129]"
          />
        </div>
      </div>

      {trend !== undefined && (
        <div
          className={`mt-4 text-sm font-medium ${
            isPositive
              ? "text-red-500"
              : "text-[#4D869C] dark:text-[#A7D129]"
          }`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(trend)}% vs. mes anterior
        </div>
      )}
    </motion.div>
  );
}