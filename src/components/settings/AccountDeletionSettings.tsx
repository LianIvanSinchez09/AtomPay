import { useState } from "react";
import { AlertCircle, Loader2, ShieldAlert } from "lucide-react";

import SettingsCard from "./SettingsCard";
import { usePreferences } from "../../context/PreferencesContext";
import { errorMessage } from "../../services/apiError";
import { deleteAccount } from "../../services/settingsService";
import type { SettingsFeedback } from "../../types/settings";
import type { AccountDeletionSettingsProps } from "../../types/settingsComponents";

/**
 * "Eliminar cuenta": borrado permanente.
 *
 * Llama a `DELETE /api/settings/account`, que vacía los datos financieros,
 * revoca los permisos de Google y elimina el usuario. Después la página cierra
 * la sesión y navega al inicio.
 */
export default function AccountDeletionSettings({
  profile,
  onDeleted,
}: AccountDeletionSettingsProps) {
  const { t } = usePreferences();
  const [confirming, setConfirming] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<SettingsFeedback | null>(null);

  const emailMatches =
    confirmEmail.trim().toLowerCase() === profile.email.toLowerCase();

  const confirm = async () => {
    if (!emailMatches) return;

    setDeleting(true);
    setFeedback(null);

    try {
      await deleteAccount({
        confirmEmail: confirmEmail.trim(),
        password: profile.hasPassword ? password : undefined,
      });

      onDeleted();
    } catch (error) {
      setFeedback({ ok: false, text: errorMessage(error) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SettingsCard
      title={t("account.title")}
      description={t("account.description")}
      icon={ShieldAlert}
      tone="danger"
    >
      <p className="mb-4 text-sm text-red-700 dark:text-red-300">
        {t("account.warning")}
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => {
            setConfirming(true);
            setFeedback(null);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <ShieldAlert size={16} />
          {t("account.button")}
        </button>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 dark:border-red-900/60 dark:bg-red-950/20">
          <p className="text-sm font-semibold">{t("account.confirmTitle")}</p>
          <p className="mt-1 text-xs opacity-75">{t("account.confirmHint")}</p>

          <div className="mt-3 grid max-w-lg gap-3">
            <div>
              <label
                htmlFor="delete-account-email"
                className="text-xs font-semibold"
              >
                {t("account.emailLabel")}
              </label>
              <input
                id="delete-account-email"
                type="email"
                autoComplete="off"
                value={confirmEmail}
                onChange={(event) => setConfirmEmail(event.target.value)}
                placeholder={profile.email}
                className="mt-1 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 dark:border-red-900 dark:bg-[#2E3324]"
              />
            </div>

            {profile.hasPassword && (
              <div>
                <label
                  htmlFor="delete-account-password"
                  className="text-xs font-semibold"
                >
                  {t("account.passwordLabel")}
                </label>
                <input
                  id="delete-account-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 dark:border-red-900 dark:bg-[#2E3324]"
                />
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void confirm()}
              disabled={
                deleting || !emailMatches || (profile.hasPassword && !password)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting && <Loader2 size={15} className="animate-spin" />}
              {deleting ? t("account.deleting") : t("account.button")}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setConfirmEmail("");
                setPassword("");
              }}
              disabled={deleting}
              className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/60 disabled:opacity-60 dark:hover:bg-black/20"
            >
              {t("account.cancel")}
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
          <AlertCircle size={16} />
          {feedback.text}
        </p>
      )}
    </SettingsCard>
  );
}
