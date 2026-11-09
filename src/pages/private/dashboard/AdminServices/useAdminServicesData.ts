import { useCallback, useEffect, useMemo, useState } from "react";
import { Folder } from "lucide-react";

import type {
  CategoryRecord,
  DisplayCategory,
  Invoice,
  ServiceSource,
} from "../types/types";
import {
  getBillingOverview,
  getCategories,
  getServiceSources,
} from "../../../../services/billingService";
import { serviceCategories as baseCategories } from "../../../../data/serviceCategories";
import { errorMessage } from "../../../../services/apiError";

/**
 * Carga y deriva todo lo que antes vivía en AdminServices, para que
 * cada página (agregar servicio, comprobantes, cargar factura) lo comparta.
 */
export function useAdminServicesData() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sources, setSources] = useState<ServiceSource[]>([]);
  const [categoryRows, setCategoryRows] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      setError(null);

      const [billingInvoices, billingSources, categories] = await Promise.all([
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

  const displayedCategories = useMemo<DisplayCategory[]>(() => {
    const categoryOrder = new Map(
      baseCategories.map((category, index) => [category.name, index]),
    );

    return Array.from(
      new Set([
        ...(categoryRows.length > 0
          ? categoryRows.map((category) => category.name)
          : baseCategories.map((category) => category.name)),
        ...invoices.map((invoice) => invoice.category),
      ]),
    )
      .sort(
        (a, b) =>
          (categoryOrder.get(a) ?? 99) - (categoryOrder.get(b) ?? 99) ||
          a.localeCompare(b),
      )
      .map((name) => {
        const known = baseCategories.find((category) => category.name === name);
        const stored = categoryRows.find((category) => category.name === name);

        return {
          id: stored?.id ?? null,
          name,
          description:
            stored?.description ??
            known?.description ??
            "Categoría personalizada",
          icon: known?.icon ?? Folder,
          invoiceCount: invoices.filter((invoice) => invoice.category === name)
            .length,
        };
      });
  }, [categoryRows, invoices]);

  const withoutAmount = useMemo(
    () => invoices.filter((invoice) => invoice.amount <= 0).length,
    [invoices],
  );

  const lastManual = useMemo(
    () => invoices.find((invoice) => invoice.source?.startsWith("manual")),
    [invoices],
  );

  return {
    invoices,
    sources,
    displayedCategories,
    withoutAmount,
    lastManual,
    loading,
    error,
    loadAll,
  };
}
