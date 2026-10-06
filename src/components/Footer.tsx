import { Atom } from "lucide-react";
import { NavLink } from "react-router-dom";
import { FooterLink } from "../types/types"
import { FooterSection } from "../types/types"
import { useScroll, useMotionValueEvent } from "motion/react";





const sections: FooterSection[] = [
  {
    title: "Mi cuenta",
    links: [
      { label: "Análisis", to: "/dashboard/analysis" },
      { label: "Facturación", to: "/dashboard/billing" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { label: "Agregar servicio", to: "/dashboard/services/add" },
      { label: "Modificar / Eliminar", to: "/dashboard/services/edit" },
    ],
  },
  {
    title: "Asistente",
    links: [{ label: "Atomcito", to: "/dashboard/atomcito" }],
  },
];

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-block rounded-sm py-1 text-[17px] transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950",
    isActive
      ? "font-semibold text-zinc-950 underline decoration-2 underline-offset-8"
      : "text-zinc-800/80 hover:text-zinc-950 hover:underline hover:decoration-2 hover:underline-offset-8",
  ].join(" ");

export default function Footer() {
  const { scrollY, scrollYProgress } = useScroll();

useMotionValueEvent(scrollY, "change", (latest) => {
  console.log(latest); // pixels
});
  return (
    <footer className="w-full bg-[#a7d129] px-6 pt-20 pb-12 text-zinc-950 sm:px-11">
      <div className="max-w-70.5">
        <div className="flex items-center gap-1.5">
          <Atom color="#FFFF" />
          <p className="text-base font-semibold tracking-tight">AtomPay</p>
        </div>
        <p className="mt-5 text-[17px] leading-6 text-zinc-800/80">
          Controlá tus servicios, tus facturas y tus gastos en un solo lugar.
        </p>
        <hr className="mt-10 border-t border-zinc-900/30" />
      </div>

      <nav
        aria-label="Footer"
        className="mt-13 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-10"
      >
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-base font-semibold tracking-tight">
              {section.title}
            </h3>

            <ul className="mt-4 flex flex-col gap-1.5">
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.end} className={linkClasses}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <hr className="mt-12 border-t border-zinc-900/30" />
      <div className="mt-11.5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wide text-zinc-800/80">
          © 2026 AtomInc, derechos reservados.
        </p>

        <ul className="flex items-center gap-6"></ul>
      </div>
    </footer>
  );
}