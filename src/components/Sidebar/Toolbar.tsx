import {
  BarChart3,
  Receipt,
  Plus,
  Pencil,
  Sparkles,
  Bell,
  Settings,
} from "lucide-react";

import "./Sidebar.css";
import Sidepanel from "../Sidepanel/Sidepanel";
import type { serviceItems } from "../../types/types";
import NavGroup from "../Navgroup";
// import { useState } from "react";

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

export default function Toolbar() {
  return (
    <div className="flex sticky top-0 left-0">
      <Sidepanel width="sm" hoverExpand={true}>
        <NavGroup items={serviceItemsSecondary} layoutId="active-nav-pill" />
      </Sidepanel>
      <Sidepanel mainTitle={true} width="sm">
        <NavGroup
          items={serviceItems}
          layoutId="active-nav-pill"
        />
      </Sidepanel>
    </div>
  );
}
