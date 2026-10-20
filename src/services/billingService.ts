import { api } from "./api";
import type {
  BillableService,
  CategoryRecord,
  Invoice,
  ManualInvoice,
  SenderRule,
  ServiceSource,
} from "../types/types";

/** Comprobantes y pagos detectados en la casilla conectada. */
export async function getBillingOverview(): Promise<Invoice[]> {
  const { data } = await api.get<{ invoices: Invoice[] }>(
    "/billing/overview"
  );

  return data.invoices;
}

/**
 * Mueve un comprobante a otra categoría (Luz, Gas, Compras, Pagos, ...).
 * El importe y el servicio no cambian: solo dónde se agrupa.
 *
 * Además queda guardada una regla por remitente: los comprobantes nuevos de
 * esa misma dirección van a caer directamente en la categoría elegida.
 */
export async function moveInvoice(
  id: string,
  category: string
): Promise<SenderRule | null> {
  const { data } = await api.patch<{
    senderRule: SenderRule | null;
  }>(`/billing/invoices/${id}`, { category });

  return data.senderRule ?? null;
}

/** Elimina un comprobante para que deje de aparecer en el listado. */
export async function deleteInvoice(id: string): Promise<void> {
  await api.delete(`/billing/invoices/${id}`);
}

/* ------------------------------------------------------------------ *
 * Categorías
 * ------------------------------------------------------------------ */

export async function getCategories(): Promise<CategoryRecord[]> {
  const { data } = await api.get<{ categories: CategoryRecord[] }>(
    "/billing/categories"
  );

  return data.categories;
}

/* ------------------------------------------------------------------ *
 * Servicios del usuario (para asignar una carga manual)
 * ------------------------------------------------------------------ */

export async function getServices(): Promise<BillableService[]> {
  const { data } = await api.get<{ services: BillableService[] }>(
    "/billing/services"
  );

  return data.services;
}

/* ------------------------------------------------------------------ *
 * Servicios propios
 * ------------------------------------------------------------------ */

export async function getServiceSources(): Promise<ServiceSource[]> {
  const { data } = await api.get<{ sources: ServiceSource[] }>(
    "/billing/sources"
  );

  return data.sources;
}

export async function addServiceSource(input: {
  name: string;
  sender?: string;
  keywords?: string;
  category: string;
}): Promise<ServiceSource> {
  const { data } = await api.post<{ source: ServiceSource }>(
    "/billing/sources",
    input
  );

  return data.source;
}

export async function removeServiceSource(id: string): Promise<void> {
  await api.delete(`/billing/sources/${id}`);
}

/* ------------------------------------------------------------------ *
 * Carga manual
 * ------------------------------------------------------------------ */

const mimeFromName = (name: string) =>
  /\.pdf$/i.test(name)
    ? "application/pdf"
    : /\.png$/i.test(name)
      ? "image/png"
      : /\.webp$/i.test(name)
        ? "image/webp"
        : "image/jpeg";

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.slice(result.indexOf(",") + 1));
    };

    reader.onerror = () =>
      reject(reader.error ?? new Error("No se pudo leer el archivo"));

    reader.readAsDataURL(file);
  });
}

/**
 * Sube un PDF o una foto para leer el comprobante. El archivo viaja en
 * memoria y no se guarda: solo quedan los datos extraídos, asignados al
 * servicio que eligió el usuario.
 */
export async function uploadManualInvoice(
  file: File,
  target: { serviceId?: string; serviceName?: string; category?: string }
): Promise<ManualInvoice> {
  const { data } = await api.post<{ data: ManualInvoice }>(
    "/billing/invoices/manual",
    {
      filename: file.name,
      mimeType: file.type || mimeFromName(file.name),
      data: await readFileAsBase64(file),
      ...target,
    },
    // El OCR y la IA local pueden tardar unos segundos.
    { timeout: 180_000 }
  );

  return data.data;
}
