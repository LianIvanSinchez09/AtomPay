import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";

import SettingsCard from "./SettingsCard";
import { usePreferences } from "../../context/PreferencesContext";
import { errorMessage } from "../../services/apiError";
import {
  deleteFile,
  downloadFile,
  getFiles,
} from "../../services/settingsService";
import type { TranslationKey } from "../../types/i18n";
import type {
  UserFileKind,
  UserFileList,
  UserFileRecord,
} from "../../types/settings";
import { formatBytes, formatFileDate } from "../../utils/fileFormat";

/**
 * "Archivos": lista los comprobantes y adjuntos guardados en disco.
 * Usa `/api/settings/files` (listar, descargar y eliminar).
 */

const KIND_LABEL: Record<UserFileKind, TranslationKey> = {
  manual: "files.kind.manual",
  email_attachment: "files.kind.email_attachment",
  report: "files.kind.report",
};

export default function FilesSettings() {
  const { t, language } = usePreferences();
  const [data, setData] = useState<UserFileList | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      setData(await getFiles());
    } catch (error) {
      setFeedback({ ok: false, text: errorMessage(error) });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const download = async (file: UserFileRecord) => {
    setBusyId(file.id);
    setFeedback(null);

    try {
      await downloadFile(file);
    } catch (error) {
      setFeedback({ ok: false, text: errorMessage(error) });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (file: UserFileRecord) => {
    setBusyId(file.id);
    setFeedback(null);

    try {
      await deleteFile(file.id);
      setConfirmId(null);
      await load(true);
      setFeedback({ ok: true, text: t("files.deleted") });
    } catch (error) {
      setFeedback({ ok: false, text: errorMessage(error) });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <SettingsCard
      title={t("files.title")}
      description={t("files.description")}
      icon={FolderOpen}
      footer={
        feedback ? (
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
        ) : null
      }
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm opacity-70">
          {t("files.total")}:{" "}
          <span className="font-semibold opacity-100">
            {formatBytes(data?.totalSize ?? 0, language)}
          </span>{" "}
          · {data?.files.length ?? 0} {t("files.count")}
        </p>

        <button
          type="button"
          onClick={() => void load(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-[#CDE8E5] px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#F7FCFF] disabled:opacity-60 dark:border-[#616F39] dark:hover:bg-[#484D35]"
        >
          <RefreshCw
            size={15}
            className={refreshing ? "animate-spin" : ""}
          />
          {t("common.retry")}
        </button>
      </div>

      {loading ? (
        <p className="flex items-center gap-2 text-sm opacity-70">
          <Loader2 size={16} className="animate-spin" />
          {t("files.loading")}
        </p>
      ) : !data || data.files.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#CDE8E5] p-6 text-center text-sm opacity-70 dark:border-[#616F39]">
          {t("files.empty")}
        </p>
      ) : (
        <ul className="divide-y divide-[#CDE8E5] dark:divide-[#616F39]">
          {data.files.map((file) => {
            const isImage = file.mimeType?.startsWith("image/");
            const Icon = isImage ? ImageIcon : FileText;

            return (
              <li
                key={file.id}
                className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF7FF] text-[#4D869C] dark:bg-[#616F39]/40 dark:text-[#D7F59A]">
                    <Icon size={17} />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {file.originalName}
                    </p>
                    <p className="mt-0.5 text-xs opacity-65">
                      {t(KIND_LABEL[file.kind] ?? "files.kind.manual")} ·{" "}
                      {formatBytes(file.size, language)} ·{" "}
                      {formatFileDate(file.createdAt, language)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {confirmId === file.id ? (
                    <>
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                        {t("files.deleteConfirm")}
                      </span>
                      <button
                        type="button"
                        onClick={() => void remove(file)}
                        disabled={busyId === file.id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        {busyId === file.id && (
                          <Loader2 size={13} className="animate-spin" />
                        )}
                        {busyId === file.id
                          ? t("files.deleting")
                          : t("common.delete")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-[#EEF7FF] dark:hover:bg-[#484D35]"
                      >
                        {t("common.cancel")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => void download(file)}
                        disabled={busyId === file.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#CDE8E5] px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#F7FCFF] disabled:opacity-60 dark:border-[#616F39] dark:hover:bg-[#484D35]"
                      >
                        {busyId === file.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Download size={13} />
                        )}
                        {busyId === file.id
                          ? t("files.downloading")
                          : t("files.download")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(file.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#CDE8E5] px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-red-50 hover:text-red-700 dark:border-[#616F39] dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={13} />
                        {t("files.delete")}
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SettingsCard>
  );
}
