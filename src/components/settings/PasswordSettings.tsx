import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, CheckCircle, KeyRound, Loader2 } from "lucide-react";

import SettingsCard from "./SettingsCard";
import { usePreferences } from "../../context/PreferencesContext";
import { errorMessage } from "../../services/apiError";
import { changePassword } from "../../services/settingsService";
import {
  PASSWORD_MIN_LENGTH,
  type SettingsFeedback,
} from "../../types/settings";
import type { PasswordSettingsProps } from "../../types/settingsComponents";

/**
 * "Contraseña": cambio de clave para el login por correo.
 * Si la cuenta es solo de Google, permite crear la primera contraseña.
 */
export default function PasswordSettings({
  hasPassword,
}: PasswordSettingsProps) {
  const { t } = usePreferences();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<SettingsFeedback | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback(null);

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      setFeedback({ ok: false, text: t("password.tooShort") });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ ok: false, text: t("password.mismatch") });
      return;
    }

    setSaving(true);

    try {
      await changePassword({
        currentPassword: hasPassword ? currentPassword : undefined,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFeedback({ ok: true, text: t("password.saved") });
    } catch (error) {
      setFeedback({ ok: false, text: errorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-[#CDE8E5] bg-[#F7FCFF] px-3 py-2 text-sm outline-none transition-colors focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#2E3324] dark:focus:border-[#D7F59A]";

  return (
    <SettingsCard
      title={t("password.title")}
      description={t("password.description")}
      icon={KeyRound}
    >
      {!hasPassword && (
        <p className="mb-4 rounded-xl border border-[#CDE8E5] bg-[#EEF7FF]/70 p-3 text-sm dark:border-[#616F39] dark:bg-[#616F39]/20">
          {t("password.googleOnly")}
        </p>
      )}

      <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
        {hasPassword && (
          <div>
            <label
              htmlFor="settings-current-password"
              className="text-sm font-semibold"
            >
              {t("password.current")}
            </label>
            <input
              id="settings-current-password"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="settings-new-password"
            className="text-sm font-semibold"
          >
            {t("password.new")}
          </label>
          <input
            id="settings-new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="settings-confirm-password"
            className="text-sm font-semibold"
          >
            {t("password.confirm")}
          </label>
          <input
            id="settings-confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 md:col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl border border-[#CDE8E5] px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F7FCFF] disabled:opacity-60 dark:border-[#616F39] dark:hover:bg-[#484D35]"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? t("password.saving") : t("password.submit")}
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
