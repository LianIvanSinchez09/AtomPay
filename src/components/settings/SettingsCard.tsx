import type { SettingsCardProps } from "../../types/settingsComponents";

/**
 * Tarjeta base de Ajustes.
 *
 * La usan todos los componentes de `components/settings/*` para mantener el
 * mismo borde, fondo y jerarquía de títulos.
 */
export default function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
  tone = "default",
  footer,
}: SettingsCardProps) {
  const danger = tone === "danger";

  return (
    <section
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-colors dark:bg-[#3E432E] md:p-6 ${
        danger
          ? "border-red-200 dark:border-red-900/60"
          : "border-[#CDE8E5] dark:border-[#616F39]"
      }`}
    >
      <header className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300"
              : "bg-[#EEF7FF] text-[#4D869C] dark:bg-[#616F39]/40 dark:text-[#D7F59A]"
          }`}
        >
          <Icon size={20} />
        </span>

        <div className="min-w-0">
          <h2 className="text-lg font-bold md:text-xl">{title}</h2>
          {description && (
            <p className="mt-1 max-w-3xl text-sm opacity-70">{description}</p>
          )}
        </div>
      </header>

      <div className="mt-5">{children}</div>

      {footer && <div className="mt-5">{footer}</div>}
    </section>
  );
}
