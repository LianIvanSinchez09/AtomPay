import { useMemo, useState } from "react";
import { ChevronDown, Settings2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Invoice, filterByProps } from "../../types/types";

export default function FilterBy({ label, items = [], setInvoiceState }: filterByProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const getServices = () => {
    const providers = items
      .map((invoice) => invoice.provider)
      .filter((provider): provider is string => Boolean(provider));

    return [...new Set(providers)].sort((a, b) => a.localeCompare(b, "es"));
  };

  const services = useMemo(getServices, [items]);

  const filterService = (checked: string[]) => {
    if (checked.length === 0) {
      setInvoiceState(items);
      return;
    }
    setInvoiceState(
      items.filter((invoice) => checked.includes(invoice.provider)),
    );
  };

  const handleToggle = (provider: string) => {
    const next = selected.includes(provider)
      ? selected.filter((p) => p !== provider)
      : [...selected, provider];

    setSelected(next);
    filterService(next);
  };

  const clearAll = () => {
    setSelected([]);
    filterService([]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#CDE8E5]/60 dark:hover:bg-[#616F39]/40"
      >
        <Settings2 size={20} className="shrink-0" />
        <span className="flex-1 truncate text-left">
          {label}
          {selected.length > 0 && ` (${selected.length})`}
        </span>
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
            {services.map((provider) => (
              <li key={provider}>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-[#CDE8E5]/60 dark:hover:bg-[#616F39]/40">
                  <input
                    type="checkbox"
                    checked={selected.includes(provider)}
                    onChange={() => handleToggle(provider)}
                  />
                  {provider}
                </label>
              </li>
            ))}

            {selected.length > 0 && (
              <li>
                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full rounded-lg px-2 py-1.5 text-left text-xs opacity-70 hover:opacity-100"
                >
                  Limpiar filtro
                </button>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}