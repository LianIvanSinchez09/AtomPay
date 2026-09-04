import {
  BarChart3,
  Receipt,
  Plus,
  Pencil,
  Sparkles,
  FileText,
  Heart,
} from "lucide-react";
import NavGroup from "./Navgroup";
import { useState } from "react";

const serviceItems = [
  { label: "Análisis", icon: BarChart3 },
  { label: "Facturación", icon: Receipt },
  { label: "Agregar Servicio", icon: Plus },
  { label: "Modificar/Eliminar Servicio", icon: Pencil },
  { label: "Atomcito", icon: Sparkles },
  { label: "Documentación", icon: FileText },
  { label: "Donar <3", icon: Heart },
];

export default function Sidebar() {
  const [active, setActive] = useState("Análisis");

  return (
    <div className="h-screen w-64 bg-[#4D869C] border-r border-zinc-800 flex items-center justify-center flex-col font-sans gap-30">
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <div className="flex items-center gap-1">
          <span className="text-[#EEF7FF] text-2xl font-bold">
            AtomPay
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <NavGroup
          items={serviceItems}
          activeLabel={active}
          onSelect={setActive}
          layoutId="active-nav-pill"
        />
      </div>
    </div>
  );
}