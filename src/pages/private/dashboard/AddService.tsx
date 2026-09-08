import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AddService() {
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      serviceName,
      amount,
      dueDate,
    });
  };

  return (
    <div className="min-h-screen bg-[#EEF7FF] p-6 text-[#4D869C] dark:bg-[#000000] dark:text-white md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Agregar Servicio</h1>
          <p className="mt-2 opacity-70">
            Registrá un nuevo servicio en AtomPay.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-lg dark:bg-[#3E432E]"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Nombre del servicio
              </label>

              <input
                type="text"
                value={serviceName}
                onChange={(event) => setServiceName(event.target.value)}
                placeholder="Ej: Internet"
                className="w-full rounded-xl border border-[#CDE8E5] bg-white px-4 py-3 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#000000]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Monto
              </label>

              <input
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Ej: 18500"
                className="w-full rounded-xl border border-[#CDE8E5] bg-white px-4 py-3 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#000000]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Fecha de vencimiento
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-xl border border-[#CDE8E5] bg-white px-4 py-3 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#000000]"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4D869C] px-5 py-3 font-semibold text-white transition hover:bg-[#7AB2B2] dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#616F39]"
            >
              <Plus size={20} />
              Agregar servicio
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}