import { motion } from "motion/react";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type Service = {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
};

const initialServices: Service[] = [
  {
    id: 1,
    name: "Internet",
    amount: 18500,
    dueDate: "2026-09-10",
  },
  {
    id: 2,
    name: "Electricidad",
    amount: 24300,
    dueDate: "2026-09-15",
  },
  {
    id: 3,
    name: "Streaming",
    amount: 8500,
    dueDate: "2026-09-20",
  },
];

export default function EditService() {
  const [services, setServices] = useState(initialServices);

  const handleDelete = (id: number) => {
    setServices((currentServices) =>
      currentServices.filter((service) => service.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-[#EEF7FF] p-6 text-[#4D869C] dark:bg-[#000000] dark:text-white md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Modificar / Eliminar Servicio
          </h1>

          <p className="mt-2 opacity-70">
            Administrá los servicios que tenés registrados.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <motion.div
              key={service.id}
              layout
              className="rounded-2xl bg-white p-6 shadow-lg dark:bg-[#3E432E]"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold">{service.name}</h2>

                <p className="mt-2 text-2xl font-semibold">
                  ${service.amount.toLocaleString("es-AR")}
                </p>

                <p className="mt-2 text-sm opacity-70">
                  Vencimiento: {service.dueDate}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#CDE8E5] px-4 py-3 font-medium transition hover:bg-[#EEF7FF] dark:border-[#616F39] dark:hover:bg-[#000000]/30"
                  onClick={() => {
                    console.log("Editar servicio:", service.id);
                  }}
                >
                  <Pencil size={18} />
                  Editar
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center rounded-xl border border-red-200 px-4 py-3 text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                  onClick={() => handleDelete(service.id)}
                  aria-label={`Eliminar ${service.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg dark:bg-[#3E432E]">
            <p className="opacity-70">
              No tenés servicios registrados.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}