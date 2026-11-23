import type { Language } from "../types/settings";

/**
 * Formato de archivos para Ajustes > Archivos.
 * Lo usa `components/settings/FilesSettings.tsx`.
 */

const UNITS = ["B", "KB", "MB", "GB", "TB"];

/** Tamaño legible: 1536 → "1,5 KB" (o "1.5 KB" en inglés). */
export function formatBytes(bytes: number, language: Language): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";

  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }

  const fractionDigits = unit === 0 ? 0 : value < 10 ? 1 : 0;

  return `${new Intl.NumberFormat(language === "es" ? "es-AR" : "en-US", {
    maximumFractionDigits: fractionDigits,
  }).format(value)} ${UNITS[unit]}`;
}

/** Fecha corta en el idioma activo. */
export function formatFileDate(value: string, language: Language): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(language === "es" ? "es-AR" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
