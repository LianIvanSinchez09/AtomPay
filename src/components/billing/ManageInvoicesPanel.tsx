import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  Mail,
  Trash2,
} from "lucide-react";

import type { DisplayCategory, Invoice } from "../../types/types";
import {
  deleteInvoice,
  moveInvoice,
} from "../../services/billingService";
import {
  dateFormat,
  moneyFormat,
  sourceLabels,
} from "../../utils/billingFormat";
import { errorMessage } from "../../services/apiError";

type Props = {
  invoices: Invoice[];
  categories: DisplayCategory[];
  onChanged: () => Promise<unknown> | void;
};

/**
 * Listado de comprobantes: cambiar de categoría, abrir el mail original o
 * eliminar el comprobante. Eliminar no borra el mail.
 */
export default function ManageInvoicesPanel({
  invoices,
  categories,
  onChanged,
}: Props) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<
    string | null
  >(null);
  const [actionError, setActionError] = useState<string | null>(
    null
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  // El mensaje de confirmación se va solo.
  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => setFeedback(null), 6000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleMove = async (invoice: Invoice, category: string) => {
    if (!category || category === invoice.category) return;

    setBusyId(invoice.id);
    setActionError(null);

    try {
      const rule = await moveInvoice(invoice.id, category);

      setFeedback(
        rule
          ? `El comprobante de ${invoice.service} ahora está en ${category}. Los próximos de ${rule.sender} van a ir directo a ${category}.`
          : `El comprobante de ${invoice.service} ahora está en ${category}.`
      );
      await onChanged();
    } catch (requestError) {
      setActionError(errorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    setBusyId(invoice.id);
    setActionError(null);

    try {
      await deleteInvoice(invoice.id);
      setConfirmDeleteId(null);
      setFeedback(
        `Se eliminó el comprobante de ${invoice.service} del ${dateFormat(
          invoice.issueDate
        )}.`
      );
      await onChanged();
    } catch (requestError) {
      setActionError(errorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-8 overflow-hidden rounded-2xl border border-[#CDE8E5] bg-white shadow-sm dark:border-[#616F39] dark:bg-[#3E432E]"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-[#CDE8E5] p-5 dark:border-[#616F39] md:flex-row md:items-center md:p-6">
        <div>
          <h2 className="text-xl font-bold">
            Administrar comprobantes
          </h2>
          <p className="mt-1 text-sm opacity-70">
            Cada comprobante está asociado a una categoría. Si quedó en
            la equivocada, cambiala; si no querés verlo más, eliminalo.
          </p>
          <p className="mt-2 text-xs opacity-60">
            Al cambiar la categoría se recuerda el remitente: los
            comprobantes nuevos de esa dirección van a ir directo a la
            categoría que elijas.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start md:self-auto">
          <span className="rounded-full bg-[#EEF7FF] px-3 py-1 text-xs font-semibold dark:bg-black/20">
            {invoices.length}{" "}
            {invoices.length === 1
              ? "comprobante"
              : "comprobantes"}
          </span>

          {invoices.filter((invoice) => invoice.amount <= 0).length >
            0 && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              {
                invoices.filter((invoice) => invoice.amount <= 0)
                  .length
              }{" "}
              sin importe
            </span>
          )}
        </div>
      </div>

      {actionError && (
        <div className="flex items-start gap-2 border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{actionError}</p>
        </div>
      )}

      {feedback && (
        <div className="flex items-start gap-2 border-b border-[#CDE8E5] bg-[#CDE8E5]/40 px-5 py-3 text-sm dark:border-[#616F39] dark:bg-[#616F39]/40">
          <CheckCircle size={16} className="mt-0.5 shrink-0" />
          <p>{feedback}</p>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="p-8 text-center">
          <FileText size={32} className="mx-auto mb-3 opacity-50" />
          <p className="font-semibold">
            Todavía no hay comprobantes para administrar.
          </p>
          <p className="mt-1 text-sm opacity-65">
            Cuando se detecten, vas a poder moverlos de categoría o
            eliminarlos desde acá.
          </p>
        </div>
      ) : (
        <ul className="max-h-[32rem] divide-y divide-[#CDE8E5] overflow-y-auto dark:divide-[#616F39]">
          {invoices.map((invoice) => {
            const isBusy = busyId === invoice.id;
            const isConfirming = confirmDeleteId === invoice.id;

            return (
              <li
                key={invoice.id}
                className="flex flex-col gap-4 p-4 md:p-5 xl:flex-row xl:items-center xl:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {invoice.service}
                    </h3>

                    {invoice.source && (
                      <span className="text-xs opacity-60">
                        {sourceLabels[invoice.source] ??
                          invoice.source}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 truncate text-sm opacity-70">
                    {invoice.provider || "Sin proveedor"}
                  </p>

                  <p className="mt-1 text-xs opacity-60">
                    {dateFormat(invoice.issueDate)} ·{" "}
                    {invoice.amount > 0
                      ? moneyFormat(
                          invoice.amount,
                          invoice.currency
                        )
                      : "Sin importe"}
                    {invoice.invoiceNumber
                      ? ` · N° ${invoice.invoiceNumber}`
                      : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {invoice.emailUrl && (
                    <a
                      href={invoice.emailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir el mail original en Gmail"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#4D869C] px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#EEF7FF] dark:border-[#A7D129] dark:hover:bg-black/30"
                    >
                      <Mail size={14} />
                      Abrir correo
                    </a>
                  )}

                  <label className="flex items-center gap-2 text-xs">
                    <span className="whitespace-nowrap opacity-60">
                      Categoría
                    </span>

                    <select
                      value={invoice.category}
                      disabled={isBusy}
                      onChange={(event) =>
                        void handleMove(
                          invoice,
                          event.target.value
                        )
                      }
                      aria-label={`Cambiar la categoría de ${invoice.service}`}
                      className="max-w-56 rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm text-[#4D869C] outline-none transition-colors focus:border-[#4D869C] disabled:cursor-wait disabled:opacity-50 dark:border-[#616F39] dark:bg-black/20 dark:text-white"
                    >
                      {categories.map((category) => (
                        <option
                          key={category.name}
                          value={category.name}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {isConfirming ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void handleDelete(invoice)}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                      >
                        {isBusy ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Confirmar
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={isBusy}
                        className="rounded-xl border border-[#CDE8E5] px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#EEF7FF] disabled:opacity-60 dark:border-[#616F39] dark:hover:bg-black/20"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(invoice.id)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#CDE8E5] px-3 py-2 text-xs font-semibold transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60 dark:border-[#616F39] dark:hover:border-red-900/40 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </motion.section>
  );
}
