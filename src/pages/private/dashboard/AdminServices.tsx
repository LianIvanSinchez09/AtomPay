import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  Building2,
  ChevronDown,
  FileText,
  Folder,
  Loader2,
  Settings2,
  Upload,
  X,
} from "lucide-react";

import type {
  CategoryRecord,
  DisplayCategory,
  Invoice,
  ServiceSource,
} from "../../../types/types";

import AddServicePanel from "../../../components/billing/AddServicePanel";
import ManualInvoicePanel from "../../../components/billing/ManualInvoicePanel";
import ManageInvoicesPanel from "../../../components/billing/ManageInvoicesPanel";
import {
  getBillingOverview,
  getCategories,
  getServiceSources,
} from "../../../services/billingService";
import { serviceCategories as baseCategories } from "../../../data/serviceCategories";
import { dateFormat } from "../../../utils/billingFormat";
import { errorMessage } from "../../../services/apiError";

/** Solo puede haber un panel abierto a la vez. */
type PanelKind = "add-service" | "manager" | "upload";

export default function AdminServices() {
  const [panel, setPanel] = useState<PanelKind | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sources, setSources] = useState<ServiceSource[]>([]);
  const [categoryRows, setCategoryRows] = useState<CategoryRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      setError(null);

      const [billingInvoices, billingSources, categories] =
        await Promise.all([
          getBillingOverview(),
          getServiceSources(),
          getCategories(),
        ]);

      setInvoices(billingInvoices);
      setSources(billingSources);
      setCategoryRows(categories);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const togglePanel = (next: PanelKind) => {
    setPanel((current) => (current === next ? null : next));
  };

  // Categorías para el selector del administrador de comprobantes.
  const categoryOrder = new Map(
    baseCategories.map((category, index) => [
      category.name,
      index,
    ])
  );

  const displayedCategories: DisplayCategory[] = Array.from(
    new Set([
      ...(categoryRows.length > 0
        ? categoryRows.map((category) => category.name)
        : baseCategories.map((category) => category.name)),
      ...invoices.map((invoice) => invoice.category),
    ])
  )
    .sort(
      (a, b) =>
        (categoryOrder.get(a) ?? 99) - (categoryOrder.get(b) ?? 99) ||
        a.localeCompare(b)
    )
    .map((name) => {
      const known = baseCategories.find(
        (category) => category.name === name
      );
      const stored = categoryRows.find(
        (category) => category.name === name
      );

      return {
        id: stored?.id ?? null,
        name,
        description:
          stored?.description ??
          known?.description ??
          "Categoría personalizada",
        icon: known?.icon ?? Folder,
        invoiceCount: invoices.filter(
          (invoice) => invoice.category === name
        ).length,
      };
    });

  const withoutAmount = invoices.filter(
    (invoice) => invoice.amount <= 0
  ).length;

  const lastManual = invoices.find((invoice) =>
    invoice.source?.startsWith("manual")
  );

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
            Administrar Servicios
          </h1>

          <p className="mt-3 max-w-2xl text-sm opacity-70 md:text-base">
            Sumá proveedores, organizá tus comprobantes o cargá una
            factura a mano. Todo lo que detecta el escaneo cae acá.
          </p>
        </header>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold md:text-2xl">
              ¿Qué querés hacer?
            </h2>
            <p className="mt-1 text-sm opacity-70">
              Elegí una opción para abrirla acá abajo.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              onClick={() => togglePanel("add-service")}
              aria-expanded={panel === "add-service"}
              className={`rounded-2xl border p-5 text-left shadow-sm transition-colors ${
                panel === "add-service"
                  ? "border-[#4D869C] bg-[#CDE8E5] dark:border-[#A7D129] dark:bg-[#3E432E]"
                  : "border-[#CDE8E5] bg-white hover:bg-[#F7FCFF] dark:border-[#616F39] dark:bg-[#3E432E] dark:hover:bg-[#484D35]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#EEF7FF] p-3 dark:bg-[#616F39]">
                    <Building2 size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold">Agregar servicio</h3>
                    <p className="mt-1 text-xs opacity-65">
                      {sources.length}{" "}
                      {sources.length === 1
                        ? "servicio propio"
                        : "servicios propios"}
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform ${
                    panel === "add-service" ? "rotate-180" : ""
                  }`}
                />
              </div>

              <p className="mt-4 text-sm opacity-70">
                Sumá un proveedor por su mail o palabras clave para que
                el escaneo empiece a detectarlo.
              </p>

              <div className="mt-4 border-t border-[#CDE8E5] pt-3 dark:border-[#616F39]">
                <p className="text-xs opacity-65">Detección</p>
                <p className="mt-1 font-bold">
                  Mail o palabras clave
                </p>
              </div>
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              onClick={() => togglePanel("manager")}
              aria-expanded={panel === "manager"}
              className={`rounded-2xl border p-5 text-left shadow-sm transition-colors ${
                panel === "manager"
                  ? "border-[#4D869C] bg-[#CDE8E5] dark:border-[#A7D129] dark:bg-[#3E432E]"
                  : "border-[#CDE8E5] bg-white hover:bg-[#F7FCFF] dark:border-[#616F39] dark:bg-[#3E432E] dark:hover:bg-[#484D35]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#EEF7FF] p-3 dark:bg-[#616F39]">
                    <Settings2 size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Administrar comprobantes
                    </h3>
                    <p className="mt-1 text-xs opacity-65">
                      {loading ? (
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        <>
                          {invoices.length}{" "}
                          {invoices.length === 1
                            ? "comprobante"
                            : "comprobantes"}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform ${
                    panel === "manager" ? "rotate-180" : ""
                  }`}
                />
              </div>

              <p className="mt-4 text-sm opacity-70">
                Mové cada comprobante de categoría, abrí el mail
                original o eliminalo del listado.
              </p>

              <div className="mt-4 border-t border-[#CDE8E5] pt-3 dark:border-[#616F39]">
                <p className="text-xs opacity-65">Sin importe</p>
                <p className="mt-1 font-bold">{withoutAmount}</p>
              </div>
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              onClick={() => togglePanel("upload")}
              aria-expanded={panel === "upload"}
              className={`rounded-2xl border p-5 text-left shadow-sm transition-colors ${
                panel === "upload"
                  ? "border-[#4D869C] bg-[#CDE8E5] dark:border-[#A7D129] dark:bg-[#3E432E]"
                  : "border-[#CDE8E5] bg-white hover:bg-[#F7FCFF] dark:border-[#616F39] dark:bg-[#3E432E] dark:hover:bg-[#484D35]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#EEF7FF] p-3 dark:bg-[#616F39]">
                    <Upload size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold">Cargar factura</h3>
                    <p className="mt-1 text-xs opacity-65">
                      PDF o imagen
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform ${
                    panel === "upload" ? "rotate-180" : ""
                  }`}
                />
              </div>

              <p className="mt-4 text-sm opacity-70">
                Subí un comprobante, elegí a qué servicio pertenece y
                la app lee importe, fechas y número.
              </p>

              <div className="mt-4 border-t border-[#CDE8E5] pt-3 dark:border-[#616F39]">
                <p className="text-xs opacity-65">Última carga</p>
                <p className="mt-1 font-bold">
                  {lastManual
                    ? dateFormat(lastManual.issueDate)
                    : "—"}
                </p>
              </div>
            </motion.button>
          </div>
        </section>

        <div id="admin-services-panel">
          {panel && (
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setPanel(null)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#CDE8E5] bg-white px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#EEF7FF] dark:border-[#616F39] dark:bg-[#3E432E] dark:hover:bg-[#484D35]"
              >
                <X size={14} />
                Cerrar panel
              </button>
            </div>
          )}

          {panel === "add-service" && (
            <AddServicePanel
              categories={displayedCategories}
              sources={sources}
              onChanged={loadAll}
            />
          )}

          {panel === "manager" && (
            <ManageInvoicesPanel
              invoices={invoices}
              categories={displayedCategories}
              onChanged={loadAll}
            />
          )}

          {panel === "upload" && (
            <ManualInvoicePanel
              categories={displayedCategories}
              onCreated={loadAll}
            />
          )}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#CDE8E5] bg-white p-5 dark:border-[#616F39] dark:bg-[#3E432E]">
          <FileText size={21} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Cómo se organiza todo</p>
            <p className="mt-1 text-sm opacity-70">
              Los servicios propios se suman al escaneo de Gmail. Los
              comprobantes se guardan con la categoría del servicio, y
              podés moverlos a otra cuando haga falta (el remitente se
              recuerda para los próximos). La carga manual lee el
              archivo al instante: no se guarda, solo los datos
              extraídos.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
