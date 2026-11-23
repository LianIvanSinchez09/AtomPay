import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { translations } from "../i18n/translations";
import { setRuntimeLanguage } from "../i18n/translate";
import { getProfile, updatePreferences } from "../services/settingsService";
import {
  PREFERENCES_STORAGE_KEY,
  type Language,
  type Theme,
  type UserPreferences,
} from "../types/settings";
import type {
  PreferencesContextValue,
  PreferencesProviderProps,
  TranslationKey,
} from "../types/i18n";

/**
 * Preferencias de la interfaz: idioma y tema.
 *
 * Lo usa `src/main.jsx` para envolver la app, y de ahí lo consumen
 * `components/Sidebar/Toolbar.tsx` y la página de Ajustes.
 *
 * Estrategia:
 * 1. Al cargar, se leen las preferencias cacheadas en `localStorage` para
 *    aplicar el tema sin parpadeo (además hay un script inline en index.html).
 * 2. Cuando hay sesión, se sincronizan con el backend, así valen en cualquier
 *    dispositivo donde el usuario entre con la misma cuenta.
 * 3. Cada cambio se aplica al documento y se guarda en ambos lugares.
 */

const DEFAULT_PREFERENCES: UserPreferences = {
  language: "es",
  theme: "dark",
};

function isLanguage(value: unknown): value is Language {
  return value === "es" || value === "en";
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** Lee las preferencias del dispositivo, con valores válidos. */
function readCachedPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(raw) as Partial<UserPreferences>;

    return {
      language: isLanguage(parsed.language)
        ? parsed.language
        : DEFAULT_PREFERENCES.language,
      theme: isTheme(parsed.theme) ? parsed.theme : DEFAULT_PREFERENCES.theme,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/** Aplica el tema al documento (Tailwind usa la clase `.dark`). */
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function applyLanguage(language: Language) {
  document.documentElement.lang = language;
  setRuntimeLanguage(language);
}

function cachePreferences(preferences: UserPreferences) {
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const { user } = useAuth();
  const [preferences, setPreferences] =
    useState<UserPreferences>(readCachedPreferences);
  const preferencesRef = useRef(preferences);

  // Se aplica antes del paint para que no se vea el cambio de tema.
  useLayoutEffect(() => {
    preferencesRef.current = preferences;
    applyTheme(preferences.theme);
    applyLanguage(preferences.language);
    cachePreferences(preferences);
  }, [preferences]);

  // Al iniciar sesión el backend ya devuelve las preferencias guardadas.
  useEffect(() => {
    if (!user) return;

    const language = isLanguage(user.language) ? user.language : null;
    const theme = isTheme(user.theme) ? user.theme : null;

    if (!language && !theme) return;

    setPreferences((current) => ({
      language: language ?? current.language,
      theme: theme ?? current.theme,
    }));
  }, [user]);

  // Si el usuario cacheado es viejo, se refresca desde el backend.
  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    let cancelled = false;

    getProfile()
      .then((profile) => {
        if (cancelled) return;

        setPreferences({
          language: profile.language,
          theme: profile.theme,
        });
      })
      .catch(() => {
        // Sin conexión o token vencido: seguimos con el cache local.
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const setLanguage = useCallback((language: Language) => {
    if (preferencesRef.current.language === language) return;

    const next = { ...preferencesRef.current, language };

    preferencesRef.current = next;
    cachePreferences(next);
    applyLanguage(language);
    setPreferences(next);

    // Se recarga para que TODA la app vuelva a renderizar en el nuevo idioma
    // (incluidos textos de módulos y componentes que no consumen el contexto).
    const sync = localStorage.getItem("token")
      ? updatePreferences({ language }).catch(() => {})
      : Promise.resolve();

    void sync.finally(() => window.location.reload());
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    const next = { ...preferencesRef.current, theme };

    preferencesRef.current = next;
    setPreferences(next);

    if (localStorage.getItem("token")) {
      void updatePreferences({ theme }).catch(() => {});
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[preferences.language][key] ?? key,
    [preferences.language]
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({
      language: preferences.language,
      theme: preferences.theme,
      t,
      setLanguage,
      setTheme,
    }),
    [preferences.language, preferences.theme, t, setLanguage, setTheme]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error(
      "usePreferences debe usarse dentro de un PreferencesProvider"
    );
  }

  return context;
}
