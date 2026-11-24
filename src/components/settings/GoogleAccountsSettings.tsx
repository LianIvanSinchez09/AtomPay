import { Info } from "lucide-react";

import GmailConnection from "../gmail/GmailConnection";
import { usePreferences } from "../../context/PreferencesContext";

/**
 * "Cuentas de Google" dentro de Ajustes.
 *
 * Reutiliza `GmailConnection` (conectar, listar, sincronizar y desconectar) y
 * agrega la advertencia de que desconectar borra los datos asociados.
 * El backend aplica ese borrado en `gmail.service.disconnectGmailAccount`.
 */
export default function GoogleAccountsSettings() {
  const { t } = usePreferences();

  return (
    <div>
      <p className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
        <Info size={16} className="mt-0.5 shrink-0" />
        {t("google.note")}
      </p>

      <GmailConnection
        title={t("google.title")}
        description={t("google.description")}
      />
    </div>
  );
}
