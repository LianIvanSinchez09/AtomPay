import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Receipt,
  Search,
  X,
} from "lucide-react";

import type { Invoice } from "../../types/analysis";
import type { InvoiceStatus } from "../../types/types";
import { getAnalysisInvoices } from "../../services/analysisService";
import { errorMessage } from "../../services/apiError";
import { dateFormat, moneyFormat } from "../../utils/billingFormat";

interface Props {
  /** Primeras facturas del análisis, para pintar algo mientras se filtra. */
  initialInvoices?: Invoice[];
}

const PAGE_SIZE = 10;

type RangePreset = "all" | "month" | "quarter" | "year" | "custom";

const RANGE_OPTIONS: { value: RangePreset; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "month", label: "Este mes" },
  { value: "quarter", label: "Últimos 3 meses" },
  { value: "year", label: "Este año" },
  { value: "custom", label: "Personalizado" },
];

const statusStyles: Record<InvoiceStatus, string> = {
  Pagado:
    "bg-[#CDE8E5] text-[#4D869C] dark:bg-[#3E432E] dark:text-[#A7D129]",
  Pendiente:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  Vencido:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function monthBounds(offset: number): { from: string; to: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);

  return { from: toInputDate(start), to: toInputDate(end) };
}

function presetRange(range: RangePreset): { from?: string; to?: string } {
  const now = new Date();

  switch (range) {
    case "month":
      return monthBounds(0);
    case "quarter":
      return { from: monthBounds(-2).from, to: monthBounds(0).to };
    case "year":
      return {
        from: `${now.getFullYear()}-01-01`,
        to: `${now.getFullYear()}-12-31`,
      };
    default:
      return {};
  }
}

const inputStyles =
  "rounded-xl border border-[#CDE8E5] bg-white text-sm text-slate-900 outline-none transition focus:border-[#4D869C] focus:ring-2 focus:ring-[#4D869C]/20 dark:border-[#616F39] dark:bg-[#3E432E] dark:text-white";

export default function RecentInvoices({ initialInvoices = [] }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [total, setTotal] = useState(initialInvoices.length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "">("");
  const [range, setRange] = useState<RangePreset>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [page, setPage] = useState(0);

  // Espera un poco antes de buscar para no pedir en cada tecla.
  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      350
    );

    return () => window.clearTimeout(timer);
  }, [search]);

  const dateRange = useMemo(() => {
    if (range === "custom") {
      return {
        from: customFrom || undefined,
        to: customTo || undefined,
      };
    }

    return presetRange(range);
  }, [range, customFrom, customTo]);

  // Al cambiar un filtro se vuelve a la primera página.
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, status, range, customFrom, customTo]);

  // Si se borraron facturas y la página actual quedó vacía, se retrocede.
  useEffect(() => {
    if (page > 0 && page * PAGE_SIZE >= total) {
      setPage(0);
    }
  }, [page, total]);

  const load = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAnalysisInvoices(
          {
            search: debouncedSearch || undefined,
            status: status || undefined,
            from: dateRange.from,
            to: dateRange.to,
            limit: PAGE_SIZE,
            offset: page * PAGE_SIZE,
          },
          signal
        );

        setInvoices(result.invoices);
        setTotal(result.total);
      } catch (err) {
        if ((err as { code?: string }).code === "ERR_CANCELED") return;

        setError(errorMessage(err));
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [debouncedSearch, status, dateRange.from, dateRange.to, page]
  );

  useEffect(() => {
    const controller = new AbortController();

    void load(controller.signal);

    return () => controller.abort();
  }, [load]);

  const hasFilters =
    Boolean(search) ||
    Boolean(status) ||
    range !== "all" ||
    Boolean(customFrom) ||
    Boolean(customTo);

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setRange("all");
    setCustomFrom("");
    setCustomTo("");
    setPage(0);
  };

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page + 1, pageCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm
                 dark:border-[#3E432E] dark:bg-[#000000]"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF7FF] dark:bg-[#3E432E]">
          <Receipt
            size={20}
            className="text-[#4D869C] dark:text-[#A7D129]"
          />
        </div>

        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">
            Facturas recientes
          </h2>

          <p className="text-sm text-slate-500 dark:text-gray-400">
            Buscá y filtrá tus comprobantes por fecha, estado o servicio.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por servicio, categoría o N° de comprobante"
              aria-label="Buscar facturas"
              className={`${inputStyles} w-full py-2.5 pl-10 pr-9`}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:text-gray-500 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as InvoiceStatus | "")
            }
            aria-label="Filtrar por estado"
            className={`${inputStyles} px-3 py-2.5 lg:w-48`}
          >
            <option value="">Todos los estados</option>
            <option value="Pagado">Pagado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-gray-400">
            <CalendarDays size={14} />
            Fecha
          </span>

          {RANGE_OPTIONS.map((option) => {
            const active = range === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-[#4D869C] bg-[#4D869C] text-white dark:border-[#A7D129] dark:bg-[#A7D129] dark:text-black"
                    : "border-[#CDE8E5] bg-white text-slate-600 hover:bg-[#F7FCFF] dark:border-[#616F39] dark:bg-[#3E432E] dark:text-gray-300 dark:hover:bg-[#484D35]"
                }`}
              >
                {option.label}
              </button>
            );
          })}

          {range === "custom" && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(event) => setCustomFrom(event.target.value)}
                aria-label="Desde"
                className={`${inputStyles} px-3 py-1.5`}
              />

              <span className="text-xs text-slate-400 dark:text-gray-500">
                a
              </span>

              <input
                type="date"
                value={customTo}
                onChange={(event) => setCustomTo(event.target.value)}
                aria-label="Hasta"
                className={`${inputStyles} px-3 py-1.5`}
              />
            </div>
          )}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-[#EEF7FF] hover:text-[#4D869C] dark:text-gray-400 dark:hover:bg-[#3E432E] dark:hover:text-[#A7D129]"
            >
              <X size={14} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
          {loading
            ? "Buscando..."
            : `${total} factura${total === 1 ? "" : "s"}`}
        </p>

        {loading && (
          <Loader2
            size={16}
            className="animate-spin text-[#4D869C] dark:text-[#A7D129]"
          />
        )}
      </div>

      <div
        className={`mt-2 overflow-x-auto transition-opacity ${
          loading ? "opacity-60" : ""
        }`}
      >
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left dark:border-[#3E432E]">
              <th className="pb-3 font-medium text-slate-500 dark:text-gray-400">
                Servicio
              </th>

              <th className="pb-3 font-medium text-slate-500 dark:text-gray-400">
                Categoría
              </th>

              <th className="pb-3 font-medium text-slate-500 dark:text-gray-400">
                Fecha
              </th>

              <th className="pb-3 text-right font-medium text-slate-500 dark:text-gray-400">
                Importe
              </th>

              <th className="pb-3 text-right font-medium text-slate-500 dark:text-gray-400">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-gray-100 last:border-0 dark:border-[#3E432E]"
              >
                <td className="py-4 font-medium text-slate-900 dark:text-white">
                  {invoice.service}
                </td>

                <td className="py-4 text-slate-500 dark:text-gray-400">
                  {invoice.category}
                </td>

                <td className="py-4 text-slate-500 dark:text-gray-400">
                  {dateFormat(invoice.date)}
                </td>

                <td className="py-4 text-right font-semibold text-slate-900 dark:text-white">
                  {moneyFormat(invoice.amount, invoice.currency ?? "ARS")}
                </td>

                <td className="py-4 text-right">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[invoice.status]
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-sm text-slate-500 dark:text-gray-400"
                >
                  {loading
                    ? "Buscando facturas..."
                    : "No hay facturas con esos filtros."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {total > PAGE_SIZE && (
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-[#3E432E]">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 rounded-xl border border-[#CDE8E5] px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-[#F7FCFF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#616F39] dark:text-gray-300 dark:hover:bg-[#3E432E]"
          >
            <ChevronLeft size={15} />
            Anterior
          </button>

          <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
            Página {currentPage} de {pageCount}
          </span>

          <button
            type="button"
            onClick={() => setPage((value) => value + 1)}
            disabled={!canGoNext(page, total)}
            className="flex items-center gap-1 rounded-xl border border-[#CDE8E5] px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-[#F7FCFF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#616F39] dark:text-gray-300 dark:hover:bg-[#3E432E]"
          >
            Siguiente
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

function canGoNext(page: number, total: number): boolean {
  return (page + 1) * PAGE_SIZE < total;
}
