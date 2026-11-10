import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Invoice } from "../../types/types";
import type { SortByProps } from "../../types/types";

export default function SortBy({
  label,
  icon: Icon,
  items = [],
  setInvoiceState,
}: SortByProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const dateDescFilter = () => {
    const sorted = [...items].sort(
      (a, b) =>
        new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime(),
    );
    setInvoiceState(sorted);
  };

  const dateAscFilter = () => {
    const sorted = [...items].sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
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

  const options = [
    { key: "dateAsc", label: "Fecha (Asc)", sort: dateAscFilter },
    { key: "dateDesc", label: "Fecha (desc)", sort: dateDescFilter },
    { key: "importDesc", label: "Importe (desc)", sort: importDescFilter },
    { key: "importAsc", label: "Importe (asc)", sort: importAscFilter },
    { key: "providerDesc", label: "Proveedor (desc)", sort: providerDescFilter },
    { key: "providerAsc", label: "Proveedor (asc)", sort: providerAscFilter },
    { key: "categoryAsc", label: "Categoría (Asc)", sort: categoryAscFilter },
    { key: "categoryDesc", label: "Categoría (desc)", sort: categoryDescFilter },
  ];

  const handleToggle = (option: (typeof options)[number]) => {
    if (selected === option.key) {
      setSelected(null);
      return;
    }
    setSelected(option.key);
    option.sort();
  };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#CDE8E5]/60 dark:hover:bg-[#616F39]/40"
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
            className="absolute z-20 mt-1 flex max-h-64 min-w-52 flex-col space-y-1 overflow-y-auto rounded-xl border border-[#CDE8E5] bg-white p-2 dark:border-[#616F39] dark:bg-black"
          >
            {options.map((option) => (
              <li key={option.key}>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-[#CDE8E5]/60 dark:hover:bg-[#616F39]/40">
                  <input
                    type="checkbox"
                    checked={selected === option.key}
                    onChange={() => handleToggle(option)}
                  />
                  {option.label}
                </label>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}