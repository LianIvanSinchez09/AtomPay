import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

import ProfileSettings from "../../../components/settings/ProfileSettings";
import PasswordSettings from "../../../components/settings/PasswordSettings";
import AppearanceSettings from "../../../components/settings/AppearanceSettings";
import GoogleAccountsSettings from "../../../components/settings/GoogleAccountsSettings";
import FilesSettings from "../../../components/settings/FilesSettings";
import DataSettings from "../../../components/settings/DataSettings";
import AccountDeletionSettings from "../../../components/settings/AccountDeletionSettings";
import { useAuth } from "../../../context/AuthContext";
import { usePreferences } from "../../../context/PreferencesContext";
import { errorMessage } from "../../../services/apiError";
import { getProfile } from "../../../services/settingsService";
import type { UserProfile } from "../../../types/settings";

/**
 * Sección Ajustes (`/dashboard/settings`).
 *
 * Orquesta:
 * - `GET /api/settings/profile` para el perfil.
 * - `ProfileSettings`, `PasswordSettings`, `AppearanceSettings`.
 * - `GoogleAccountsSettings` (reutiliza el flujo de Gmail).
 * - `FilesSettings` (listar/descargar/eliminar archivos).
 * - `DataSettings` y `AccountDeletionSettings` (borrados destructivos).
 */
export default function Settings() {
  const { updateUser, logout } = useAuth();
  const { t } = usePreferences();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fuerza recargar la lista de archivos después de borrar datos.
  const [filesVersion, setFilesVersion] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProfile();
      setProfile(data);
      updateUser({
        id: data.id,
        googleId: data.googleId ?? "",
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        language: data.language,
        theme: data.theme,
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSaved = (updated: UserProfile) => {
    setProfile(updated);
    updateUser({
      id: updated.id,
      googleId: updated.googleId ?? "",
      email: updated.email,
      name: updated.name,
      avatarUrl: updated.avatarUrl,
      language: updated.language,
      theme: updated.theme,
    });
  };

  const handleAccountDeleted = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm opacity-70">
        <Loader2 size={18} className="animate-spin" />
        {t("settings.loading")}
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        <p className="flex items-center gap-2 font-semibold">
          <AlertCircle size={18} />
          {t("settings.loadError")}
        </p>
        {error && <p className="mt-2 text-sm opacity-80">{error}</p>}
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/30"
        >
          <RefreshCw size={15} />
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">{t("settings.title")}</h1>
        <p className="mt-1 max-w-3xl text-sm opacity-70">
          {t("settings.subtitle")}
        </p>
      </header>

      <div className="space-y-6">
        <ProfileSettings profile={profile} onSaved={handleSaved} />
        <PasswordSettings hasPassword={profile.hasPassword} />
        <AppearanceSettings />
        <GoogleAccountsSettings />
        <FilesSettings key={filesVersion} />
        <DataSettings
          onDeleted={() => setFilesVersion((version) => version + 1)}
        />
        <AccountDeletionSettings
          profile={profile}
          onDeleted={() => void handleAccountDeleted()}
        />
      </div>
    </div>
  );
}
