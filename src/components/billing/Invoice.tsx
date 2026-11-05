import React from "react";
import {
  dateFormat,
  moneyFormat,
  sourceLabels,
} from "../../utils/billingFormat";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  Mail,
  Trash2,
} from "lucide-react";

type Props = {
  invoices: Invoice[];
  categories: DisplayCategory[];
  onChanged: () => Promise<unknown> | void;
};



const Invoice = ({ busyId, invoice, confirmDeleteId, sourceLabels, categories }) => {
  const isBusy = busyId === invoice.id;
  const isConfirming = confirmDeleteId === invoice.id;

  return (
    <li
      key={invoice.id}
      className="flex flex-col gap-4 p-4 md:p-5 xl:flex-row xl:items-center xl:justify-between"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{invoice.service}</h3>

          {invoice.source && (
            <span className="text-xs opacity-60">
              {sourceLabels[invoice.source] ?? invoice.source}
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-sm opacity-70">
          {invoice.provider || "Sin proveedor"}
        </p>

        <p className="mt-1 text-xs opacity-60">
          {dateFormat(invoice.issueDate)} ·{" "}
          {invoice.amount > 0
            ? moneyFormat(invoice.amount, invoice.currency)
            : "Sin importe"}
          {invoice.invoiceNumber ? ` · N° ${invoice.invoiceNumber}` : ""}
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
          <span className="whitespace-nowrap opacity-60">Categoría</span>

          <select
            value={invoice.category}
            disabled={isBusy}
            onChange={(event) => void handleMove(invoice, event.target.value)}
            aria-label={`Cambiar la categoría de ${invoice.service}`}
            className="max-w-56 rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm text-[#4D869C] outline-none transition-colors focus:border-[#4D869C] disabled:cursor-wait disabled:opacity-50 dark:border-[#616F39] dark:bg-black/20 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
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
                <Loader2 size={14} className="animate-spin" />
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
};

export default Invoice;
