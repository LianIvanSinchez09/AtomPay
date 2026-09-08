import {
  BarChart3,
  Receipt,
  Plus,
  Pencil,
  Sparkles,
} from "lucide-react";

import "./Sidebar.css";
import Sidepanel from "../Sidepanel/Sidepanel";
import NavGroup from "../Navgroup";

import type { serviceItems } from "../../types/types";

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
  {
    label: "Atomcito",
    icon: Sparkles,
    path: "/dashboard/atomcito",
  },
];

type ToolbarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

export default function Toolbar({
  collapsed,
  onCollapsedChange,
}: ToolbarProps) {
  return (
    <Sidepanel
      width="lg"
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
    >
      <NavGroup
        items={serviceItems}
        layoutId="active-nav-pill"
        collapsed={collapsed}
      />
    </Sidepanel>
  );
}