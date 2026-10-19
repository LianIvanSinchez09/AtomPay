import { api } from "./api";
import type { Invoice } from "../types/types";

/** Comprobantes y pagos detectados en la casilla conectada. */
export async function getBillingOverview(): Promise<Invoice[]> {
  const { data } = await api.get<{ invoices: Invoice[] }>(
    "/billing/overview"
  );

  return data.invoices;
}
