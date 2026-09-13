import { motion } from "motion/react";
import { Receipt } from "lucide-react";

import type { Invoice } from "../../types/analysis";

interface Props {
  invoices: Invoice[];
}

const statusStyles = {
  Pagada:
    "bg-[#CDE8E5] text-[#4D869C] dark:bg-[#3E432E] dark:text-[#A7D129]",

  Pendiente:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",

  Vencida:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default function RecentInvoices({ invoices }: Props) {
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
            Últimas facturas detectadas por AtomPay.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
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
                  {invoice.date}
                </td>

                <td className="py-4 text-right font-semibold text-slate-900 dark:text-white">
                  ${invoice.amount.toLocaleString("es-AR")}
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
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}