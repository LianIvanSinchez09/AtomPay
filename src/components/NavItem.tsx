import { NavItemProps } from "../types/types";
import MotionButton from "./MotionButton";
import { motion } from "motion/react";

export default function NavItem({
  label,
  icon: Icon,
  active,
  onClick,
  layoutId,
}: NavItemProps) {
  return (
    <div className="flex gap-2">
        <MotionButton
            onClick={onClick}
        >
            {active && (
                    <motion.div
                    layoutId={layoutId}
                    className="absolute inset-0 bg-zinc-800 rounded-lg"
                    transition={{ type: "spring", stiffness: 500, damping: 100 }}
                    />
                )}
                <Icon
                    size={17}
                    strokeWidth={1.8}
                    className={`relative z-10 shrink-0 ${
                    active ? "text-zinc-400" : "text-white"
                    }`}
                />
                <span
                    className={`relative z-10 ${
                    active ? "text-zinc-400 font-medium" : "text-white"
                    }`}
                >
                    {label}
                </span>
        </MotionButton>
    </div>
  );
}
