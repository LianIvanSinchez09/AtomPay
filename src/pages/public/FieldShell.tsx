import React from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";

type FieldShellProps = {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  children: ReactNode;
};

const FieldShell = ({ id, label, icon, error, children }: FieldShellProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <label
      htmlFor={id}
      className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white"
    >
      {label}
    </label>

    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
        {icon}
      </span>

      {children}
    </div>

    {error && (
      <p
        id={`${id}-error`}
        role="alert"
        className="mt-1.5 text-sm text-red-600 dark:text-red-400"
      >
        {error}
      </p>
    )}
  </motion.div>
);

export default FieldShell;
