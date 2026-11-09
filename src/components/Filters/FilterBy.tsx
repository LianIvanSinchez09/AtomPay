import { useState } from "react";
import { ChevronDown, Settings2, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Invoice } from "../../types/types";

type Props = {
  label: string;
  items: Invoice[];
  setInvoiceState: (invoices: Invoice[]) => void;
};

export default function FilterBy({
  label,
  items = [],
  setInvoiceState,
}: Props) {
  const [open, setOpen] = useState(false);

  const filterNoImport = () => {
    const noImport = [...items].filter((item) => item.amount === 0)
  }


  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#CDE8E5]/60 dark:hover:bg-[#616F39]/40`}
      >
        <Settings2 size={20} className="shrink-0" />
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
            className=" flex absolute flex-col mt-1 space-y-1 overflow-hidden border-l border-[#CDE8E5] pl-3 dark:border-[#616F39]"
          >
            <motion.button
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={resetFilter}
            >
              Reset
            </motion.button>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
