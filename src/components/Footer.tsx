import MotionButton from "./MotionButton.tsx";

const linkReset =
  "justify-start! grow-0! p-0! text-shadow-none! text-zinc-950! hover:text-black! whitespace-nowrap";

interface FooterProps {
  /** Se ejecuta al pulsar cualquier enlace. Por defecto navega con window.location. */
  onNavigate?: (href: string) => void;
}

export default function Footer({
  onNavigate = (href) => window.location.assign(href),
}: FooterProps) {
  return (
    <footer className="w-full bg-[#a7d129] px-11 pt-20 pb-12 text-zinc-950">
      {/* Marca + descripción */}
      <div className="max-w-70.5">
        <p className="text-base font-semibold tracking-tight">AtomPay</p>
        <p className="mt-5 text-[17px] leading-6 text-zinc-800/80">

        </p>
        <hr className="mt-10 border-t border-zinc-900/30" />
      </div>

      {/* Columnas de navegación */}
      <nav
        aria-label="Footer"
        className="mt-13 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-10"
      >
        
      </nav>

      <hr className="mt-12 border-t border-zinc-900/30" />

      {/* Barra inferior */}
      <div className="mt-11.5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wide text-zinc-800/80">
          © 2026 AtomInc, derechos reservados.
        </p>

        <ul className="flex items-center gap-6">
        </ul>
      </div>
    </footer>
  );
}