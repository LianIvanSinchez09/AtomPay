import { PREFERENCES_STORAGE_KEY, type Language } from "../types/settings";
import type { PhraseParams } from "../types/i18n";
import { phrases } from "./phrases";

/**
 * Traducción de textos visibles de toda la aplicación.
 *
 * La sección Ajustes y la navegación usan claves tipadas con
 * `usePreferences().t`. El resto de la app usa `tr("texto en español")`,
 * que busca la frase en `src/i18n/phrases.ts`.
 *
 * Como el idioma se aplica recargando la página (ver `PreferencesContext`),
 * `tr` puede usarse tanto en componentes como en módulos de datos sin hooks.
 */

let cachedLanguage: Language | null = null;

/** Lee el idioma activo de la caché local, con "es" por defecto. */
export function getCurrentLanguage(): Language {
  if (cachedLanguage) return cachedLanguage;

  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as { language?: unknown }) : null;

    cachedLanguage = parsed?.language === "en" ? "en" : "es";
  } catch {
    cachedLanguage = "es";
  }

  return cachedLanguage;
}

/** Mantiene sincronizado el idioma en memoria (lo llama PreferencesContext). */
export function setRuntimeLanguage(language: Language): void {
  cachedLanguage = language;
}

/** Locale BCP-47 para `Intl.NumberFormat` y `Intl.DateTimeFormat`. */
export function getLocale(): string {
  return getCurrentLanguage() === "en" ? "en-US" : "es-AR";
}

/** Reemplaza `{clave}` por los valores recibidos. */
function interpolate(template: string, params?: PhraseParams): string {
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match
  );
}

/**
 * Traduce un texto en español al idioma activo.
 *
 * - Si el idioma es español, devuelve el texto tal cual.
 * - Si no hay traducción exacta, intenta traducir fragmentos conocidos
 *   (útil para mensajes con variables interpoladas).
 * - `params` permite usar plantillas como `tr("Hola {nombre}", { nombre })`.
 */
export function tr(text: string, params?: PhraseParams): string {
  if (getCurrentLanguage() === "es") return interpolate(text, params);

  const exact = phrases[text];

  if (exact) return interpolate(exact, params);

  return interpolate(translateFragments(text), params);
}

/**
 * Traduce frases dinámicas reemplazando los fragmentos en español que sí
 * están en el diccionario. Se usa como respaldo para textos construidos con
 * variables, por ejemplo `Se desconectó {email}`.
 */
function translateFragments(text: string): string {
  let result = text;

  for (const [source, target] of fragmentEntries) {
    if (result.includes(source)) {
      result = result.split(source).join(target);
    }
  }

  return result;
}

/**
 * Fragmentos largos ordenados de mayor a menor para evitar que una frase
 * corta pise una más específica.
 */
const fragmentEntries = Object.entries(phrases)
  .filter(([source]) => source.length >= 12)
  .sort((a, b) => b[0].length - a[0].length);
