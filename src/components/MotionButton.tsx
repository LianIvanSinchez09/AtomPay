import { motion } from "motion/react";
import { MotionButtonProps } from "../types/types";

export default function MotionButton({
  children,
  onClick,
  className = "",
  ariaLabel,
}: MotionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.00 }}
      whileTap={{ scale: 0.92 }}
      className={`relative text-zinc-400 hover:text-white transition-colors ${className} flex justify-center items-center gap-2 p-2 grow-2`}
    >
      {children}
    </motion.button>
  );
}