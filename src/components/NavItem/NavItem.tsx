import { motion } from "motion/react";

import type { NavItemProps } from "../../types/types";

export default function NavItem({
  label,
  icon: Icon,
  active,
  onClick,
  layoutId,
  collapsed,
}: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        relative
        flex
        w-full
        items-center
        ${collapsed ? "justify-center" : "justify-start"}
        gap-3
        rounded-xl
        px-4
        py-3

        text-white

        transition-all
        duration-200

        hover:bg-white/10
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
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : "auto",
        }}
        transition={{
          duration: 0.2,
        }}
        className={`
          relative
          z-10
          overflow-hidden
          whitespace-nowrap
          ${collapsed ? "pointer-events-none" : ""}
        `}
      >
        {label}
      </motion.span>
    </button>
  );
}