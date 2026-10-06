import { motion } from "motion/react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const invoices = [
  {
    service: "Internet",
    date: "05/09/2026",
    amount: "$18.500",
    status: "Pagado",
  },
  {
    service: "Electricidad",
    date: "03/09/2026",
    amount: "$24.300",
    status: "Pendiente",
  },
  {
    service: "Streaming",
    date: "01/09/2026",
    amount: "$8.500",
    status: "Pagado",
  },
];

export default function Billing() {
  return (
    <div className="min-h-screen bg-[#EEF7FF] p-6 text-[#4D869C] dark:bg-[#000000] dark:text-white md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Facturación</h1>
          <p className="mt-2 opacity-70">
            Consultá tus facturas y el estado de tus pagos.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-[#3E432E]">
          <div className="border-b border-[#CDE8E5] p-6 dark:border-[#616F39]">
            <h2 className="text-xl font-bold">Facturas recientes</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-150">
              <thead>
                <tr className="border-b border-[#CDE8E5] text-left dark:border-[#616F39]">
                  <th className="px-6 py-4">Servicio</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Monto</th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={`${invoice.service}-${invoice.date}`}
                    className="border-b border-[#CDE8E5] last:border-0 dark:border-[#616F39]"
                  >
                    <td className="px-6 py-4 font-medium">
                      {invoice.service}
                    </td>

                    <td className="px-6 py-4 opacity-70">
                      {invoice.date}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {invoice.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
                          invoice.status === "Pagado"
                            ? "bg-[#CDE8E5] text-[#4D869C] dark:bg-[#616F39] dark:text-[#A7D129]"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {invoice.status === "Pagado" ? (
                          <CheckCircle size={15} />
                        ) : (
                          <Clock size={15} />
                        )}

                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-5 shadow-lg dark:bg-[#3E432E]">
          <AlertCircle size={22} />
          <p className="text-sm opacity-70">
            Los datos mostrados actualmente son de ejemplo.
          </p>
        </div>
      </motion.div>
    </div>
  );
}