import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2, Trash2 } from "lucide-react";

import SettingsCard from "./SettingsCard";
import { usePreferences } from "../../context/PreferencesContext";
import { errorMessage } from "../../services/apiError";
import { deleteData } from "../../services/settingsService";
import type { SettingsFeedback } from "../../types/settings";
import type { DataSettingsProps } from "../../types/settingsComponents";

/**
 * "Eliminar datos": borra facturas, gastos, servicios, simulaciones,
 * notificaciones, análisis, historial escaneado y archivos.
 * Conserva la cuenta y las casillas de Google (regla confirmada con el usuario).
 *
 * Llama a `DELETE /api/settings/data`.
 */
export default function DataSettings({ onDeleted }: DataSettingsProps) {
  const { t } = usePreferences();
  const [confirming, setConfirming] = useState(false);
  const [word, setWord] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<SettingsFeedback | null>(null);

  const expected = t("data.confirmWord");

  const confirm = async () => {
    if (word.trim().toUpperCase() !== expected.toUpperCase()) return;

    setDeleting(true);
    setFeedback(null);

    try {
      await deleteData();
      setFeedback({ ok: true, text: t("data.deleted") });
      setConfirming(false);
      setWord("");
      onDeleted();
    } catch (error) {
      setFeedback({ ok: false, text: errorMessage(error) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SettingsCard
      title={t("data.title")}
      description={t("data.description")}
      icon={Trash2}
    >
      <p className="mb-4 text-xs opacity-65">{t("data.keepsGoogle")}</p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => {
            setConfirming(true);
            setFeedback(null);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
        >
          <Trash2 size={16} />
          {t("data.button")}
        </button>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 dark:border-red-900/60 dark:bg-red-950/20">
          <p className="text-sm font-semibold">{t("data.confirmTitle")}</p>
          <p className="mt-1 text-xs opacity-75">{t("data.confirmHint")}</p>

          <input
            type="text"
            value={word}
            onChange={(event) => setWord(event.target.value)}
            placeholder={expected}
            className="mt-3 w-full max-w-xs rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 dark:border-red-900 dark:bg-[#2E3324]"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void confirm()}
              disabled={
                deleting ||
                word.trim().toUpperCase() !== expected.toUpperCase()
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting && <Loader2 size={15} className="animate-spin" />}
              {deleting ? t("data.deleting") : t("data.button")}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setWord("");
              }}
              disabled={deleting}
              className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/60 disabled:opacity-60 dark:hover:bg-black/20"
            >
              {t("data.cancel")}
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <p
          className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${
            feedback.ok
              ? "text-[#28665D] dark:text-[#D7F59A]"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {feedback.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {feedback.text}
        </p>
      )}
    </SettingsCard>
  );
}
