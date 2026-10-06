import {
  BarChart3,
  Receipt,
  Plus,
  Pencil,
  Sparkles,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";
import Sidepanel from "../Sidepanel/Sidepanel";
import NavGroup from "../Navgroup";
import { useAuth } from "../../context/AuthContext";
import type { serviceItems } from "../../types/types";
import { useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

interface ToolBarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const serviceItems: serviceItems[] = [
  {
    label: "Análisis",
    icon: BarChart3,
    path: "/dashboard/analysis",
  },
  {
    label: "Facturación",
    icon: Receipt,
    path: "/dashboard/billing",
  },
  {
    label: "Agregar Servicio",
    icon: Plus,
    path: "/dashboard/services/add",
  },
  {
    label: "Modificar/Eliminar Servicio",
    icon: Pencil,
    path: "/dashboard/services/edit",
  },
];

const serviceItemsSecondary: serviceItems[] = [
  {
    label: "Notificaciones",
    icon: Bell,
    path: "/dashboard/atomcito",
  },
  {
    label: "Atomcito",
    icon: Sparkles,
    path: "/dashboard/atomcito",
  },
  {
    label: "Ajustes",
    icon: Settings,
    path: "/dashboard/atomcito",
  },
];

export default function ToolBar({ collapsed }: ToolBarProps) {
  const { user, logout } = useAuth();
  const footer = document.querySelector("footer")
  const { scrollY } = useScroll();
  const stopAt = scrollY <= 1790 ? scrollY : 1790;
  const [stopped, setStopped] = useState(() => scrollY.get() >= stopAt);
  const distanceFooterFromTop = footer.getBoundingClientRect().top + window.scrollY;
  const toolBarHeightRef = useRef<HTMLDivElement>(null);
  console.log(toolBarHeightRef);
  
  const toolBarHeight = toolBarHeightRef.current
  const next = footerTop - el.offsetHeight;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setStopped(latest >= stopAt);
  });

  return (
    <div
      className={`left-0 
        flex 
        h-screen
        ${stopped ? "absolute" : "fixed top-0"}
        `}
      style={stopped ? { top: stopAt } : undefined}
    >
      <Sidepanel width="sm" hoverExpand={true}>
        <NavGroup items={serviceItemsSecondary} layoutId="active-nav-pill" />
      </Sidepanel>

      <Sidepanel mainTitle={true} width="sm">
        <div className="flex flex-col justify-between h-full">
          <NavGroup items={serviceItems} layoutId="active-nav-pill" />

          {user && (
            <div className="mt-auto border-t border-[#CDE8E5] p-4 dark:border-[#616F39]">
              <div className="flex items-center gap-3">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Oculta los textos si collapsed es true */}
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user.name}
                    </p>
                    <p className="text-xs opacity-70 truncate">{user.email}</p>
                  </div>
                )}

                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="rounded-lg p-2 text-red-500 hover:bg-red-100/50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Sidepanel>
    </div>
  );
}
