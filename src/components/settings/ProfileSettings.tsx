import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle, AlertCircle, Loader2, UserRound } from "lucide-react";

import SettingsCard from "./SettingsCard";
import { usePreferences } from "../../context/PreferencesContext";
import { errorMessage } from "../../services/apiError";
import { updateProfile } from "../../services/settingsService";
import { NAME_MAX_LENGTH, type SettingsFeedback } from "../../types/settings";
import type { ProfileSettingsProps } from "../../types/settingsComponents";

/**
 * "Cuenta": nombre visible y foto de perfil.
 * No permite cambiar el correo (es la identidad de la cuenta).
 */
export default function ProfileSettings({
  profile,
  onSaved,
}: ProfileSettingsProps) {
  const { t } = usePreferences();
  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<SettingsFeedback | null>(null);

  // Si la página recarga el perfil, los campos acompañan.
  useEffect(() => {
    setName(profile.name);
    setAvatarUrl(profile.avatarUrl ?? "");
  }, [profile]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setFeedback({ ok: false, text: t("profile.nameRequired") });
      return;
    }

    setSaving(true);

    try {
      const updated = await updateProfile({
        name: trimmedName,
        avatarUrl: avatarUrl.trim() === "" ? null : avatarUrl.trim(),
      });

      onSaved(updated);
      setFeedback({ ok: true, text: t("common.saved") });
    } catch (error) {
      setFeedback({ ok: false, text: errorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCard
      title={t("profile.title")}
      description={t("profile.description")}
      icon={UserRound}
    >
      <form onSubmit={submit} className="grid gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {avatarUrl.trim() ? (
            <img
              src={avatarUrl.trim()}
              alt={name}
              referrerPolicy="no-referrer"
              className="h-16 w-16 shrink-0 rounded-full border border-[#CDE8E5] object-cover dark:border-[#616F39]"
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EEF7FF] text-2xl font-bold text-[#4D869C] dark:bg-[#616F39]/40 dark:text-[#D7F59A]">
              {name.trim().charAt(0).toUpperCase() || "?"}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <label
              htmlFor="settings-avatar"
              className="text-sm font-semibold"
            >
              {t("profile.avatar")}
            </label>
            <input
              id="settings-avatar"
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://…"
              className="mt-1 w-full rounded-xl border border-[#CDE8E5] bg-[#F7FCFF] px-3 py-2 text-sm outline-none transition-colors focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#2E3324] dark:focus:border-[#D7F59A]"
            />
            <p className="mt-1 text-xs opacity-60">{t("profile.avatarHint")}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="settings-name"
              className="text-sm font-semibold"
            >
              {t("profile.name")}
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              maxLength={NAME_MAX_LENGTH}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("profile.namePlaceholder")}
              className="mt-1 w-full rounded-xl border border-[#CDE8E5] bg-[#F7FCFF] px-3 py-2 text-sm outline-none transition-colors focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#2E3324] dark:focus:border-[#D7F59A]"
            />
          </div>

          <div>
            <label
              htmlFor="settings-email"
              className="text-sm font-semibold"
            >
              {t("profile.email")}
            </label>
            <input
              id="settings-email"
              type="email"
              value={profile.email}
              readOnly
              disabled
              className="mt-1 w-full cursor-not-allowed rounded-xl border border-[#CDE8E5] bg-[#EEF7FF]/60 px-3 py-2 text-sm opacity-70 dark:border-[#616F39] dark:bg-[#2E3324]/60"
            />
            <p className="mt-1 text-xs opacity-60">{t("profile.emailHint")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4D869C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3E7285] disabled:opacity-60 dark:bg-[#616F39] dark:hover:bg-[#484D35]"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? t("profile.saving") : t("profile.save")}
          </button>

          {feedback && (
            <p
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                feedback.ok
                  ? "text-[#28665D] dark:text-[#D7F59A]"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {feedback.ok ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {feedback.text}
            </p>
          )}
        </div>
      </form>
    </SettingsCard>
  );
}
