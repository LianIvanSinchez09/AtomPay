import { api } from "./api";
import type { AnalysisPayload } from "../types/analysis";

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
