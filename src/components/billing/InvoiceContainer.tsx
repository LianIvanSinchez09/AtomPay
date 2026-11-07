import React from "react";
import Invoice from "./Invoice";
import type { Invoice as InvoiceType, DisplayCategory } from "../../types/billing"; // ajustá la ruta

type Props = {
  invoices: InvoiceType[];
  categories: DisplayCategory[];
  busyId: string | null;
  confirmDeleteId: string | null;
  onMove: (invoice: InvoiceType, category: string) => void;
  onDelete: (invoice: InvoiceType) => void;
  onAskDelete: (id: string) => void;
  onCancelDelete: () => void;
};

const InvoiceContainer = ({ invoices, categories, ...rest }: Props) => {
  return (
    <div className="max-h-128 overflow-auto">
      <table className="w-full min-w-208 border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-[#EEF7FF] text-xs uppercase tracking-wide dark:bg-[#2f3320]">
          <tr className="border-b border-[#CDE8E5] dark:border-[#616F39]">
            <th className="px-4 py-3 font-semibold opacity-70">Servicio</th>
            <th className="px-4 py-3 text-right font-semibold opacity-70">Importe</th>
            <th className="px-4 py-3 font-semibold opacity-70">Proveedor</th>
            <th className="px-4 py-3 font-semibold opacity-70">Categoría</th>
            <th className="px-4 py-3 text-right font-semibold opacity-70">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#CDE8E5] dark:divide-[#f3f5f0]">
          {invoices.map((invoice) => (
            <Invoice
              key={invoice.id}
              invoice={invoice}
              categories={categories}
              {...rest}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceContainer;