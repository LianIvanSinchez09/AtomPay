import { Languages, Moon, Sun } from "lucide-react";

import SettingsCard from "./SettingsCard";
import { usePreferences } from "../../context/PreferencesContext";
import type { Language, Theme } from "../../types/settings";

/**
 * "Apariencia e idioma": selector de idioma y tema.
 * Guarda en el backend vía `PreferencesContext` para que valga en todos los
 * dispositivos del usuario.
 */
export default function AppearanceSettings() {
  const { t, language, theme, setLanguage, setTheme } = usePreferences();

  const languages: { value: Language; label: string; hint: string }[] = [
    { value: "es", label: t("appearance.spanish"), hint: "ES" },
    { value: "en", label: t("appearance.english"), hint: "EN" },
  ];

  const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: t("appearance.light"), icon: Sun },
    { value: "dark", label: t("appearance.dark"), icon: Moon },
  ];

  return (
    <SettingsCard
      title={t("appearance.title")}
      description={t("appearance.description")}
      icon={Languages}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold">{t("appearance.language")}</p>
          <p className="mt-1 text-xs opacity-60">
            {t("appearance.languageHint")}
          </p>

          <div className="mt-3 inline-flex rounded-xl border border-[#CDE8E5] p-1 dark:border-[#616F39]">
            {languages.map(({ value, label, hint }) => (
              <button
                key={value}
                type="button"
                onClick={() => setLanguage(value)}
                aria-pressed={language === value}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  language === value
                    ? "bg-[#4D869C] text-white dark:bg-[#616F39]"
                    : "hover:bg-[#EEF7FF] dark:hover:bg-[#484D35]"
                }`}
              >
                <span className="mr-1.5 text-xs opacity-70">{hint}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">{t("appearance.theme")}</p>
          <p className="mt-1 text-xs opacity-60">{t("appearance.themeHint")}</p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm font-semibold transition-colors ${
                  theme === value
                    ? "border-[#4D869C] bg-[#EEF7FF] dark:border-[#D7F59A] dark:bg-[#616F39]/30"
                    : "border-[#CDE8E5] hover:bg-[#F7FCFF] dark:border-[#616F39] dark:hover:bg-[#484D35]"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/70 dark:bg-black/20">
                  <Icon size={18} />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
