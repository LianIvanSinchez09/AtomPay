
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeftRight,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  Clock,
  Droplets,
  FileText,
  Flame,
  Loader2,
  ShoppingBag,
  Tv,
  Wifi,
  Zap,
  CircleDollarSign,
  Mail,
  type LucideIcon,
} from "lucide-react";

import type {
  Invoice,
  InvoiceStatus,
  ServiceCategory,
} from "../../../types/types";

import GmailConnection from "../../../components/gmail/GmailConnection";
import { getBillingOverview } from "../../../services/billingService";
import { errorMessage } from "../../../services/apiError";

const categories: ServiceCategory[] = [
  {
    name: "Luz",
    description: "Facturas de electricidad y consumo energético",
    icon: Zap,
  },
  {
    name: "Gas",
    description: "Facturas de gas y consumo",
    icon: Flame,
  },
  {
    name: "Agua",
    description: "Facturas y consumo de agua",
    icon: Droplets,
  },
  {
    name: "Internet",
    description: "Internet, telefonía y conectividad",
    icon: Wifi,
  },
  {
    name: "Multimedia",
    description: "Streaming, plataformas y suscripciones",
    icon: Tv,
  },
  {
    name: "Compras",
    description: "Compras y pedidos online",
    icon: ShoppingBag,
  },
  {
    name: "Pagos",
    description: "Transferencias, débitos y pagos con cualquier medio",
    icon: ArrowLeftRight,
  },
  {
    name: "Otros",
    description: "Otros servicios y facturas detectados",
    icon: CircleDollarSign,
  },
];

const moneyFormat = (amount: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

const dateFormat = (date: string) =>
  new Intl.DateTimeFormat("es-AR").format(
    new Date(`${date}T12:00:00`)
  );

// De dónde salió el importe. El usuario no lo edita: se muestra la fuente.
const sourceLabels: Record<string, string> = {
  pdf: "PDF adjunto",
  image: "Factura escaneada (OCR)",
  email_body: "Cuerpo del mail",
};

const statusStyles: Record<InvoiceStatus, string> = {
  Pagado:
    "bg-[#CDE8E5] text-[#28665D] dark:bg-[#616F39] dark:text-[#D7F59A]",
  Pendiente:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Vencido:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const Icon =
    status === "Pagado"
      ? CheckCircle
      : status === "Vencido"
        ? AlertCircle
        : Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      <Icon size={14} />
      {status}
    </span>
  );
}

export default function Billing() {
  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    try {
      setError(null);
      setInvoices(await getBillingOverview());
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  // Categorías conocidas + las que aparezcan en los datos.
  const displayedCategories: ServiceCategory[] = Array.from(
    new Set([
      ...categories.map((category) => category.name),
      ...invoices.map((invoice) => invoice.category),
    ])
  ).map(
    (name) =>
      categories.find((category) => category.name === name) ?? {
        name,
        description: "Comprobantes detectados automáticamente",
        icon: FileText,
      }
  );

  const totalPending = invoices
    .filter((invoice) => invoice.status !== "Pagado")
    .reduce((total, invoice) => total + invoice.amount, 0);

  return (
    <div className="min-h-screen bg-[#EEF7FF] p-5 text-[#4D869C] dark:bg-black dark:text-white md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl"
      >
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider opacity-60">
            Gestión de servicios
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Facturación
          </h1>

          <p className="mt-3 max-w-2xl text-sm opacity-70 md:text-base">
            Consultá tus servicios, facturas, vencimientos y consumos
            en un solo lugar.
          </p>
        </header>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#CDE8E5] bg-white p-5 shadow-sm dark:border-[#616F39] dark:bg-[#3E432E]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#EEF7FF] p-3 dark:bg-[#616F39]">
                <FileText size={22} />
              </div>

              <div>
                <p className="text-sm opacity-70">
                  Facturas registradas
                </p>
                <p className="text-2xl font-bold">
                  {loading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    invoices.length
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#CDE8E5] bg-white p-5 shadow-sm dark:border-[#616F39] dark:bg-[#3E432E]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#EEF7FF] p-3 dark:bg-[#616F39]">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="text-sm opacity-70">
                  Importe pendiente o vencido
                </p>
                <p className="text-2xl font-bold">
                  {moneyFormat(totalPending, "ARS")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <GmailConnection onScanned={loadInvoices} />

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold md:text-2xl">
              Categorías de servicios
            </h2>
            <p className="mt-1 text-sm opacity-70">
              Seleccioná una categoría para consultar sus facturas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {displayedCategories.map((category, index) => {
              const Icon: LucideIcon = category.icon;
              const categoryInvoices = invoices.filter(
                (invoice) => invoice.category === category.name
              );
              const isSelected =
                selectedCategory === category.name;

              const categoryTotal = categoryInvoices.reduce(
                (total, invoice) => total + invoice.amount,
                0
              );

              return (
                <motion.button
                  key={category.name}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() =>
                    setSelectedCategory(
                      isSelected ? null : category.name
                    )
                  }
                  aria-expanded={isSelected}
                  className={`rounded-2xl border p-5 text-left shadow-sm transition-colors ${
                    isSelected
                      ? "border-[#4D869C] bg-[#CDE8E5] dark:border-[#A7D129] dark:bg-[#3E432E]"
                      : "border-[#CDE8E5] bg-white hover:bg-[#F7FCFF] dark:border-[#616F39] dark:bg-[#3E432E] dark:hover:bg-[#484D35]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[#EEF7FF] p-3 dark:bg-[#616F39]">
                        <Icon size={23} />
                      </div>

                      <div>
                        <h3 className="font-bold">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-xs opacity-65">
                          {categoryInvoices.length}{" "}
                          {categoryInvoices.length === 1
                            ? "factura"
                            : "facturas"}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 transition-transform ${
                        isSelected ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <p className="mt-4 text-sm opacity-70">
                    {category.description}
                  </p>

                  <div className="mt-4 border-t border-[#CDE8E5] pt-3 dark:border-[#616F39]">
                    <p className="text-xs opacity-65">
                      Total registrado
                    </p>
                    <p className="mt-1 font-bold">
                      {moneyFormat(categoryTotal, "ARS")}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.section
              key={selectedCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-8 overflow-hidden rounded-2xl border border-[#CDE8E5] bg-white shadow-sm dark:border-[#616F39] dark:bg-[#3E432E]"
            >
              <div className="border-b border-[#CDE8E5] p-5 dark:border-[#616F39] md:p-6">
                <h2 className="text-xl font-bold">
                  Facturas de {selectedCategory}
                </h2>
                <p className="mt-1 text-sm opacity-70">
                  Detalle de los comprobantes asociados a esta categoría.
                </p>
              </div>

              <div className="divide-y divide-[#CDE8E5] dark:divide-[#616F39]">
                {invoices
                  .filter(
                    (invoice) =>
                      invoice.category === selectedCategory
                  )
                  .map((invoice) => (
                    <article
                      key={invoice.id}
                      className="p-5 md:p-6"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div>
                          <h3 className="font-bold">
                            {invoice.service}
                          </h3>
                          <p className="mt-1 text-sm opacity-70">
                            {invoice.provider}
                          </p>
                          <p className="mt-2 text-xs opacity-60">
                            Período: {invoice.period}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <StatusBadge status={invoice.status} />

                          {invoice.emailUrl && (
                            <a
                              href={invoice.emailUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Abrir el mail original en Gmail"
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#4D869C] px-3 py-1 text-xs font-semibold transition-colors hover:bg-[#EEF7FF] dark:border-[#A7D129] dark:hover:bg-black/30"
                            >
                              <Mail size={14} />
                              Abrir correo
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 rounded-xl bg-[#EEF7FF] p-4 text-sm dark:bg-black/20 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="opacity-60">Importe</p>
                          <p className="mt-1 font-medium">
                            {invoice.amount > 0
                              ? moneyFormat(
                                  invoice.amount,
                                  invoice.currency
                                )
                              : "Sin importe"}
                          </p>
                        </div>

                        <div>
                          <p className="opacity-60">
                            Fecha de emisión
                          </p>
                          <p className="mt-1 font-medium">
                            {dateFormat(invoice.issueDate)}
                          </p>
                        </div>

                        <div>
                          <p className="opacity-60">Vencimiento</p>
                          <p className="mt-1 font-medium">
                            {invoice.dueDate
                              ? dateFormat(invoice.dueDate)
                              : "—"}
                          </p>
                        </div>

                        {invoice.consumption && (
                          <div>
                            <p className="opacity-60">Consumo</p>
                            <p className="mt-1 font-medium">
                              {invoice.consumption.value}{" "}
                              {invoice.consumption.unit}
                            </p>
                          </div>
                        )}

                        {invoice.invoiceNumber && (
                          <div>
                            <p className="opacity-60">
                              N° de comprobante
                            </p>
                            <p className="mt-1 break-all font-medium">
                              {invoice.invoiceNumber}
                            </p>
                          </div>
                        )}

                        {invoice.source && (
                          <div>
                            <p className="opacity-60">Origen del dato</p>
                            <p className="mt-1 font-medium">
                              {sourceLabels[invoice.source] ??
                                invoice.source}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}

                {invoices.filter(
                  (invoice) =>
                    invoice.category === selectedCategory
                ).length === 0 && (
                  <div className="p-8 text-center">
                    <FileText
                      size={32}
                      className="mx-auto mb-3 opacity-50"
                    />
                    <p className="font-semibold">
                      Todavía no hay facturas en esta categoría.
                    </p>
                    <p className="mt-1 text-sm opacity-65">
                      Cuando se detecten comprobantes, aparecerán aquí.
                    </p>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#CDE8E5] bg-white p-5 dark:border-[#616F39] dark:bg-[#3E432E]">
          <AlertCircle size={21} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              Datos detectados automáticamente
            </p>
            <p className="mt-1 text-sm opacity-70">
              Los comprobantes y pagos se extraen de los mails de tu
              casilla conectada. Si el comprobante viene adjunto como
              PDF o como foto, se lee el archivo para obtener el
              importe. Cuando no hay ningún importe disponible (por
              ejemplo, Temu envía el recibo por la app), queda como
              "Sin importe". En esos casos usá{" "}
              <strong>Abrir correo</strong> para ver el mail original y
              seguir desde ahí el link del proveedor.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
