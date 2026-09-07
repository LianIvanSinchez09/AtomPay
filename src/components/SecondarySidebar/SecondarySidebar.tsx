import { BarChart3, Receipt, Plus, Pencil, Sparkles } from "lucide-react";
import "../Sidebar/Sidebar.css";
import Sidepanel from "../Sidepanel/Sidepanel";
import type { serviceItems } from "../../types/types";
import NavGroup from "../Navgroup";
import { useState } from "react";


const serviceItems: serviceItems[] = [
  { label: "Análisis", icon: BarChart3 },
  { label: "Facturación", icon: Receipt },
  { label: "Agregar Servicio", icon: Plus },
  { label: "Modificar/Eliminar Servicio", icon: Pencil },
  { label: "Atomcito", icon: Sparkles },
];

export default function Sidebar() {

  const [active, setActive] = useState("Análisis");

  return (
    <Sidepanel width={"sm"} mainTitle="AtomPay" serviceItems={serviceItems}>
      <NavGroup
        items={serviceItems}
        activeLabel={active}
        onSelect={setActive}
        layoutId="active-nav-pill"
      />
    </Sidepanel>
  );
}
