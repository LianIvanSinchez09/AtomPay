import { api } from "./api";
import type {
  AnalysisInvoiceFilters,
  AnalysisInvoicePage,
  AnalysisPayload,
} from "../types/analysis";

/**
 * Análisis de gastos del usuario: AtomScore, evolución mensual, distribución
 * por categoría/servicio, recomendaciones y facturas recientes.
 *
 * Todo lo calcula el backend con las facturas y los servicios reales.
 */
export async function getAnalysis(): Promise<AnalysisPayload> {
  const { data } = await api.get<{ analysis: AnalysisPayload }>("/analysis");

  return data.analysis;
}

/**
 * Facturas del análisis con filtros de fecha, estado y texto. Se pagina para
 * que la tabla "Facturas recientes" no traiga todo de una.
 */
export async function getAnalysisInvoices(
  filters: AnalysisInvoiceFilters = {},
  signal?: AbortSignal
): Promise<AnalysisInvoicePage> {
  const { data } = await api.get<AnalysisInvoicePage>(
    "/analysis/invoices",
    { params: filters, signal }
  );

  return data;
}
