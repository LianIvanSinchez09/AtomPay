import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";

import type {
  BillableService,
  ManualInvoice,
  ServiceCategory,
} from "../../types/types";
import {
  getServices,
  uploadManualInvoice,
} from "../../services/billingService";
import { dateFormat, moneyFormat } from "../../utils/billingFormat";
import { errorMessage } from "../../services/apiError";

type Props = {
  categories: ServiceCategory[];
  onCreated: () => Promise<unknown> | void;
};

const MAX_MB = 10;
const NEW_SERVICE = "__new";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm text-[#4D869C] outline-none transition-colors focus:border-[#4D869C] disabled:cursor-wait disabled:opacity-60 dark:border-[#616F39] dark:bg-black/20 dark:text-white";

const labelClass = "block text-xs font-semibold opacity-70";

/**
 * Lee un PDF o una foto de un comprobante y guarda **solo los datos**, en el
 * servicio que elija el usuario. El archivo no se persiste.
 */
export default function ManualInvoicePanel({
  categories,
  onCreated,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [services, setServices] = useState<BillableService[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(
    null
  );
  const [serviceChoice, setServiceChoice] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Otros");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ManualInvoice | null>(null);

  const loadServices = async () => {
    try {
      setServices(await getServices());
      setServicesError(null);
    } catch (requestError) {
      setServicesError(errorMessage(requestError));
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  // Agrupados por categoría para el selector.
  const grouped = services.reduce<Record<string, BillableService[]>>(
    (accumulator, service) => {
      (accumulator[service.category] ??= []).push(service);
      return accumulator;
    },
    {}
  );

  const creating = serviceChoice === NEW_SERVICE;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Elegí un PDF o una foto del comprobante.");
      return;
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`El archivo no puede superar los ${MAX_MB} MB.`);
      return;
    }

    if (!serviceChoice) {
      setError("Elegí a qué servicio pertenece el comprobante.");
      return;
    }

    if (creating && !newName.trim()) {
      setError("Poné el nombre del servicio nuevo.");
      return;
    }

    setBusy(true);
    setResult(null);

    try {
      const invoice = await uploadManualInvoice(
        file,
        creating
          ? {
              serviceName: newName.trim(),
              category: newCategory,
            }
          : { serviceId: serviceChoice }
      );

      setResult(invoice);
      setFile(null);
      setServiceChoice("");
      setNewName("");
      await Promise.all([onCreated(), loadServices()]);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-8 overflow-hidden rounded-2xl border border-[#CDE8E5] bg-white shadow-sm dark:border-[#616F39] dark:bg-[#3E432E]"
    >
      <div className="border-b border-[#CDE8E5] p-5 dark:border-[#616F39] md:p-6">
        <h2 className="text-xl font-bold">Cargar factura manualmente</h2>
        <p className="mt-1 text-sm opacity-70">
          Subí el PDF o una foto del comprobante, elegí a qué servicio
          pertenece y lo leemos con OCR. El archivo se procesa al
          instante y <strong>no se guarda</strong>: solo quedan los
          datos extraídos.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 md:p-6">
        <label className={labelClass}>
          Comprobante (PDF, JPG, PNG o WEBP · hasta {MAX_MB} MB)
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setResult(null);
              setError(null);
            }}
            className="mt-2 block w-full cursor-pointer rounded-xl border border-dashed border-[#CDE8E5] bg-white p-3 text-sm text-[#4D869C] outline-none transition-colors file:mr-3 file:rounded-lg file:border-0 file:bg-[#4D869C] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-[#4D869C] disabled:cursor-wait disabled:opacity-60 dark:border-[#616F39] dark:bg-black/20 dark:text-white"
          />
        </label>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Servicio al que pertenece
            <select
              value={serviceChoice}
              onChange={(event) => {
                setServiceChoice(event.target.value);
                setError(null);
              }}
              disabled={busy}
              required
              className={inputClass}
            >
              <option value="" disabled>
                Elegí un servicio
              </option>

              {Object.entries(grouped).map(([category, list]) => (
                <optgroup key={category} label={category}>
                  {list.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                      {service.invoiceCount > 0
                        ? ` (${service.invoiceCount})`
                        : ""}
                    </option>
                  ))}
                </optgroup>
              ))}

              <option value={NEW_SERVICE}>
                Otro servicio (crear nuevo)…
              </option>
            </select>

            {servicesError && (
              <span className="mt-2 block text-xs font-normal text-red-600 dark:text-red-400">
                No pudimos cargar la lista de servicios. Podés crear
                uno nuevo igual.
              </span>
            )}
          </label>

          {creating && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Nombre del servicio nuevo
                <input
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="Edenor"
                  maxLength={60}
                  disabled={busy}
                  required
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                Categoría
                <select
                  value={newCategory}
                  onChange={(event) =>
                    setNewCategory(event.target.value)
                  }
                  disabled={busy}
                  className={inputClass}
                >
                  {categories.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={
              busy ||
              !file ||
              !serviceChoice ||
              (creating && !newName.trim())
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#4D869C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3F6F82] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {busy ? "Leyendo…" : "Leer comprobante"}
          </button>

          <p className="text-xs opacity-60">
            {busy
              ? "Estamos leyendo el archivo. Puede tardar unos segundos."
              : "El importe y las fechas los lee la app: no se editan a mano."}
          </p>
        </div>
      </form>

      {result && (
        <div className="border-t border-[#CDE8E5] p-5 dark:border-[#616F39] md:p-6">
          <div className="flex items-start gap-2">
            <CheckCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Comprobante cargado</p>
              <p className="mt-1 text-sm opacity-70">
                Los datos quedaron guardados en el servicio elegido.
                El archivo no se guardó.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 rounded-xl bg-[#EEF7FF] p-4 text-sm dark:bg-black/20 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="opacity-60">Servicio</p>
              <p className="mt-1 font-medium">{result.service}</p>
            </div>

            <div>
              <p className="opacity-60">Categoría</p>
              <p className="mt-1 font-medium">{result.category}</p>
            </div>

            <div>
              <p className="opacity-60">Importe</p>
              <p className="mt-1 font-medium">
                {result.amount > 0
                  ? moneyFormat(result.amount, result.currency)
                  : "Sin importe"}
              </p>
            </div>

            <div>
              <p className="opacity-60">Fecha de emisión</p>
              <p className="mt-1 font-medium">
                {dateFormat(result.issueDate)}
              </p>
            </div>

            <div>
              <p className="opacity-60">Vencimiento</p>
              <p className="mt-1 font-medium">
                {result.dueDate
                  ? dateFormat(result.dueDate)
                  : "—"}
              </p>
            </div>

            <div>
              <p className="opacity-60">N° de comprobante</p>
              <p className="mt-1 break-all font-medium">
                {result.invoiceNumber ?? "—"}
              </p>
            </div>
          </div>

          {result.requiresReview && (
            <p className="mt-3 flex items-start gap-2 text-xs opacity-70">
              <FileText size={14} className="mt-0.5 shrink-0" />
              No pudimos leer el importe con seguridad, así que quedó
              como "Sin importe". Podés moverlo de categoría desde
              Administrar comprobantes.
            </p>
          )}
        </div>
      )}
    </motion.section>
  );
}
