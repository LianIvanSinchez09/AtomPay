import { NavItemProps } from "../../types/types";
import MotionButton from "../MotionButton";
import { motion } from "motion/react";
import "./NavItem.css"


export default function NavItem({
  label,
  icon: Icon,
  active,
  onClick,
  layoutId,
}: NavItemProps) {
  return (
    <div>
      <MotionButton onClick={onClick}>
        {active && (
          <motion.div
            layoutId={layoutId}
            className="navitemAnimation flex flex-1 absolute inset-0"
            transition={{ type: "spring", stiffness: 1000, damping: 110 }}
          />
        )}
        <Icon
          size={17}
          strokeWidth={1.8}
          className={`relative  z-10  ${
            active ?  "border-2 rounded-25 text-white bg-zinc-400" : "text-white"
          }`}
        />
        <span
          className={`relative z-10 ${
            active ? "text-zinc-400 " : "text-white"
          }`}
        >
          {label}
        </span>
      </MotionButton>
    </div>
  );
}
