import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Invoice } from "../../types/types";

type Props = {
  label: string;
  icon: LucideIcon;
  items: Invoice[];
  setInvoiceState: (invoices: Invoice[]) => void;
};

export default function SortBy({
  label,
  icon: Icon,
  items = [],
  setInvoiceState,
}: Props) {
  const [open, setOpen] = useState(false);

  const dateFilter = () => {
    const sorted = [...items].sort(
      (a, b) =>
        new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime(),
    );
    setInvoiceState(sorted);
  };

  const importDescFilter = () => {
    const sorted = [...items].sort((a, b) => a.amount - b.amount);
    setInvoiceState(sorted);
  };

  const importAscFilter = () => {
    const sorted = [...items].sort((a, b) => b.amount - a.amount);
    setInvoiceState(sorted);
  };

  const providerAscFilter = () => {
    const sorted = [...items].sort((a, b) =>
      (a.provider ?? "").localeCompare(b.provider ?? "", "es", {
        sensitivity: "base",
      }),
    );
    setInvoiceState(sorted);
  };

  const providerDescFilter = () => {
    const sorted = [...items].sort((a, b) =>
      (b.provider ?? "").localeCompare(a.provider ?? "", "es", {
        sensitivity: "base",
      }),
    );
    setInvoiceState(sorted);
  };

  const categoryAscFilter = () => {
    const sorted = [...items].sort((a, b) =>
      (a.category ?? "").localeCompare(b.category ?? "", "es", {
        sensitivity: "base",
      }),
    );
    setInvoiceState(sorted);
  };

  const categoryDescFilter = () => {
    const sorted = [...items].sort((a, b) =>
      (b.category ?? "").localeCompare(a.category ?? "", "es", {
        sensitivity: "base",
      }),
    );
    setInvoiceState(sorted);
  };

  console.log(items);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#CDE8E5]/60 dark:hover:bg-[#616F39]/40`}
      >
        <Icon size={20} className="shrink-0" />
        <span className="flex-1 truncate text-left">{label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className=" flex absolute flex-col mt-1 space-y-1 overflow-hidden border-l bg-[#000000] z-19 border-[#CDE8E5] pl-3 dark:border-[#616F39]"
          >
            <motion.button
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={dateFilter}
            >
              Fecha (desc)
            </motion.button>
            <motion.button
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={importDescFilter}
            >
              Importe (desc)
            </motion.button>
            <motion.button
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={importAscFilter}
            >
              Importe (asc)
            </motion.button>
            <motion.button
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={providerDescFilter}
            >
              Proveedor (desc)
            </motion.button>
            <motion.button
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={providerAscFilter}
            >
              Proveedor (asc)
            </motion.button>
            <motion.button
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={categoryAscFilter}
            >
              Categoría (Asc)
            </motion.button>
            <motion.button
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={categoryDescFilter}
            >
              Categoría (desc)
            </motion.button>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
