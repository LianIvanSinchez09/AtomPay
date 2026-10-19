import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  RefreshCw,
  Unplug,
} from "lucide-react";

import {
  API_ORIGIN,
  disconnectGmailAccount,
  errorMessage,
  getGmailConnectUrl,
  listGmailAccounts,
  syncGmailAccount,
  type GmailAccount,
} from "../../services/gmailService";

type Feedback = { ok: boolean; text: string };

/**
 * Panel de conexión con Gmail.
 *
 * Flujo: el botón abre un popup con el consentimiento de Google. Google
 * redirige al backend (/api/gmail/callback), el backend guarda los tokens
 * cifrados y avisa por postMessage. Acá escuchamos ese mensaje y recargamos
 * la lista de casillas conectadas.
 */
export default function GmailConnection({
  onScanned,
}: {
  /** Se llama después de un escaneo exitoso, para recargar facturas. */
  onScanned?: () => void;
}) {
  const [accounts, setAccounts] = useState<GmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setAccounts(await listGmailAccounts());
    } catch (error) {
      setFeedback({ ok: false, text: errorMessage(error) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  // Mensaje que emite la página de callback del backend.
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== API_ORIGIN) return;

      const data = event.data as
        | { type?: string; ok?: boolean; email?: string; message?: string }
        | undefined;

      if (data?.type !== "gmail-oauth") return;

      setConnecting(false);

      if (data.ok) {
        setFeedback({ ok: true, text: `Gmail conectado: ${data.email}` });
        void loadAccounts();
      } else {
        setFeedback({
          ok: false,
          text: data.message ?? "No se pudo conectar Gmail",
        });
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [loadAccounts]);

  const connect = useCallback(async () => {
    setFeedback(null);
    setConnecting(true);

    // Abrimos el popup ANTES del await para que el navegador no lo bloquee.
    const popup = window.open(
      "",
      "gmail-oauth",
      "width=520,height=680,menubar=no,toolbar=no"
    );

    if (!popup) {
      setConnecting(false);
      setFeedback({
        ok: false,
        text: "Permití las ventanas emergentes (popups) para conectar Gmail.",
      });
      return;
    }

    popup.document.write(
      "<p style='font-family:system-ui;padding:2rem'>Conectando con Google…</p>"
    );

    try {
      popup.location.href = await getGmailConnectUrl();
    } catch (error) {
      popup.close();
      setConnecting(false);
      setFeedback({ ok: false, text: errorMessage(error) });
    }
  }, []);

  const sync = useCallback(
    async (account: GmailAccount) => {
      setSyncingId(account.id);
      setFeedback(null);

      try {
        const result = await syncGmailAccount(account.id);
        setFeedback({
          ok: true,
          text: `Revisados ${result.queued} correos: ${result.created} nuevos, ${result.merged} duplicados, ${result.ignored} ignorados${
            result.failed > 0 ? `, ${result.failed} con error` : ""
          }.`,
        });
        await listGmailAccounts().then(setAccounts);
        onScanned?.();
      } catch (error) {
        setFeedback({ ok: false, text: errorMessage(error) });
      } finally {
        setSyncingId(null);
      }
    },
    [onScanned]
  );

  const disconnect = useCallback(async (account: GmailAccount) => {
    setFeedback(null);

    try {
      await disconnectGmailAccount(account.id);
      setAccounts((current) => current.filter((item) => item.id !== account.id));
      setFeedback({ ok: true, text: `Se desconectó ${account.email}` });
    } catch (error) {
      setFeedback({ ok: false, text: errorMessage(error) });
    }
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-8 rounded-2xl border border-[#CDE8E5] bg-white p-5 shadow-sm dark:border-[#616F39] dark:bg-[#3E432E] md:p-6"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold md:text-2xl">
            Conexión con Gmail
          </h2>
          <p className="mt-1 max-w-2xl text-sm opacity-70">
            Conectá tu casilla para que AtomPay detecte automáticamente
            facturas y comprobantes con adjuntos.
          </p>
        </div>

        <button
          type="button"
          onClick={connect}
          disabled={connecting}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#CDE8E5] bg-[#EEF7FF] px-5 py-3 font-semibold shadow-sm transition-colors hover:bg-[#CDE8E5] disabled:opacity-60 dark:border-[#616F39] dark:bg-[#616F39] dark:hover:bg-[#484D35]"
        >
          {connecting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Mail size={18} />
          )}
          {connecting ? "Conectando…" : "Conectar Gmail"}
        </button>
      </div>

      {loading ? (
        <p className="mt-5 flex items-center gap-2 text-sm opacity-70">
          <Loader2 size={16} className="animate-spin" />
          Cargando casillas…
        </p>
      ) : accounts.length > 0 ? (
        <ul className="mt-5 divide-y divide-[#CDE8E5] dark:divide-[#616F39]">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="flex flex-col justify-between gap-3 py-4 md:flex-row md:items-center"
            >
              <div>
                <p className="font-semibold">{account.email}</p>
                <p className="mt-1 text-xs opacity-65">
                  {account.status === "active"
                    ? "Activa"
                    : "Requiere reconectar"}
                  {account.lastSyncAt
                    ? ` · Última sincronización: ${new Intl.DateTimeFormat(
                        "es-AR",
                        { dateStyle: "short", timeStyle: "short" }
                      ).format(new Date(account.lastSyncAt))}`
                    : " · Todavía sin sincronizar"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void sync(account)}
                  disabled={syncingId === account.id}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#CDE8E5] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#F7FCFF] disabled:opacity-60 dark:border-[#616F39] dark:hover:bg-[#484D35]"
                >
                  <RefreshCw
                    size={15}
                    className={syncingId === account.id ? "animate-spin" : ""}
                  />
                  {syncingId === account.id ? "Buscando…" : "Buscar facturas"}
                </button>

                <button
                  type="button"
                  onClick={() => void disconnect(account)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#CDE8E5] px-4 py-2 text-sm font-semibold transition-colors hover:bg-red-50 hover:text-red-700 dark:border-[#616F39] dark:hover:bg-red-900/20"
                >
                  <Unplug size={15} />
                  Desconectar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm opacity-70">
          Todavía no hay ninguna casilla conectada.
        </p>
      )}

      {feedback && (
        <p
          className={`mt-4 inline-flex items-start gap-1.5 text-sm font-medium ${
            feedback.ok
              ? "text-[#28665D] dark:text-[#D7F59A]"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {feedback.ok ? (
            <CheckCircle size={16} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
          )}
          {feedback.text}
        </p>
      )}
    </motion.section>
  );
}
