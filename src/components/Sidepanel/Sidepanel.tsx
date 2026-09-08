import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link } from "react-router-dom";

import type {
  SidepanelProps,
  customWidth,
} from "../../types/types";

export default function Sidepanel({
  width,
  children,
  collapsed,
  onCollapsedChange,
}: SidepanelProps) {
  const widths: customWidth = {
    sm: "w-64",
    md: "w-80",
    lg: "w-96",
  };

  return (
    <div
      className={`
        h-screen
        ${collapsed ? "w-20" : widths[width]}

        shrink-0
        flex
        flex-col
        font-sans

        bg-[#4D869C]
        text-white

        border-r
        border-[#3D7183]

        dark:bg-black
        dark:border-[#222222]
        dark:text-white

        transition-all
        duration-300
        ease-in-out
      `}
    >
      {/* Header */}
      <div
        className={`
          flex
          items-center
          ${collapsed ? "justify-center" : "justify-between"}
          px-4
          pt-5
          pb-2
        `}
      >
        <Link
          to="/dashboard"
          className="
            font-bold
            transition-opacity
            hover:opacity-80
          "
        >
          {collapsed ? (
            <span className="text-xl">A</span>
          ) : (
            <span className="text-2xl">AtomPay</span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={
            collapsed
              ? "Abrir barra lateral"
              : "Cerrar barra lateral"
          }
          className="
            rounded-lg
            p-2
            transition-colors
            hover:bg-white/10
            focus:outline-none
            focus:ring-2
            focus:ring-white/30
          "
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      {/* Navegación */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {children}
      </div>
    </div>
  );
}