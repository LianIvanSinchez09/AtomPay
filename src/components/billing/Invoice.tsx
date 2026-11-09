import React from "react";
import { Loader2, Mail, Trash2 } from "lucide-react";
import { dateFormat, moneyFormat, sourceLabels } from "../../utils/billingFormat";
import ProviderImg from "./ProviderImg";
import type { Invoice } from "../../types/types";

const Invoice = ({
  invoice,
  categories,
  busyId,
  confirmDeleteId,
  onMove,
  onDelete,
  onAskDelete,
  onCancelDelete,
}: Invoice) => {
  const isBusy = busyId === invoice.id;
  const isConfirming = confirmDeleteId === invoice.id;
  return (
    <tr className="align-middle transition-colors hover:bg-black/5 dark:hover:bg-black/20">
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{invoice.service}</span>
          {invoice.source && (
            <span className="text-xs opacity-60">
              {sourceLabels[invoice.source] ?? invoice.source}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs opacity-60">
          {dateFormat(invoice.issueDate)}
          {invoice.invoiceNumber ? ` · N° ${invoice.invoiceNumber}` : ""}
        </p>
      </td>

      <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums">
        {invoice.amount > 0 ? (
          moneyFormat(invoice.amount, invoice.currency)
        ) : (
          <span className="opacity-60">Sin importe</span>
        )}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            <ProviderImg provider={invoice.provider}/>
          </span>
          <span className="truncate text-sm opacity-80">
            {invoice.provider || "Sin proveedor"}
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <select
          value={invoice.category}
          disabled={isBusy}
          onChange={(e) => onMove(invoice, e.target.value)}
          aria-label={`Cambiar la categoría de ${invoice.service}`}
          className="max-w-44 rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm text-[#4D869C] outline-none transition-colors focus:border-[#4D869C] disabled:cursor-wait disabled:opacity-50 dark:border-[#616F39] dark:bg-black/20 dark:text-white"
        >
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
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

          {isConfirming ? (
            <>
              <button
                type="button"
                onClick={() => onDelete(invoice)}
                disabled={isBusy}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
              >
                {isBusy ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Confirmar
              </button>
              <button
                type="button"
                onClick={onCancelDelete}
                disabled={isBusy}
                className="rounded-xl border border-[#CDE8E5] px-3 py-2 text-xs font-semibold transition-colors hover:bg-[#EEF7FF] disabled:opacity-60 dark:border-[#616F39] dark:hover:bg-black/20"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onAskDelete(invoice.id)}
              disabled={isBusy}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#CDE8E5] px-3 py-2 text-xs font-semibold transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60 dark:border-[#616F39] dark:hover:border-red-900/40 dark:hover:bg-red-900/20 dark:hover:text-red-300"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default Invoice;