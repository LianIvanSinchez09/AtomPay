import { BarChart3, Receipt, Plus, Pencil, Sparkles } from "lucide-react";
import "./Sidebar.css";
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

export default function Toolbar() {

  const [active, setActive] = useState("Análisis");

  //en width usamos sm, md ,lg como en tailwnd
  return (
    <Sidepanel width={"lg"} mainTitle="AtomPay" serviceItems={serviceItems}>
      <NavGroup
        items={serviceItems}
        activeLabel={active}
        onSelect={setActive}
        layoutId="active-nav-pill"
      />
    </Sidepanel>
  );
}
