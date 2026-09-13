import { NavItemProps } from "../../types/types";
// import MotionButton from "../MotionButton";
import { motion } from "motion/react";
import "./NavItem.css"


export default function NavItem({
  label,
  icon: Icon,
  flexCol,
  active,
  onClick,
  layoutId,
}: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`
        relative
        flex
        ${flexCol ? "flex-col" : null}
        w-full
        items-center
        justify-center
        gap-3
        rounded-xl
        px-4
        py-3

        text-white

        transition-all
        duration-200

        hover:bg-white/10
        hover:text-[#A7D129]
      `}
    >
      {/* Indicador de opción activa */}
      {active && (
        <motion.div
          layoutId={layoutId}
          className="
            absolute
            inset-0
            rounded-xl
            bg-white/10
          "
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
          }}
        />
      )}

      {/* Icono */}
      <Icon
        size={22}
        className="relative z-10 shrink-0"
      />

      {/* Texto */}
      <motion.span
        initial={false}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={`
          relative
          z-10
          overflow-hidden
          whitespace-nowrap
        `}
      >
        {label}
      </motion.span>
    </button>
  );
}
