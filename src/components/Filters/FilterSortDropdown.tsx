import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export type NavDropdownChild = {
  label: string;
  icon: LucideIcon;
  path: string;
};

type Props = {
  label: string;
  icon: LucideIcon;
  items: NavDropdownChild[];
  mode: string;
};

export default function FilterDropdown({
  label,
  icon: Icon,
  items,
  mode
}: Props) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

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
            className="ml-5 mt-1 space-y-1 overflow-hidden border-l border-[#CDE8E5] pl-3 dark:border-[#616F39]"
          >
            {items.map(({ label: childLabel, icon: ChildIcon, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-[#4D869C] font-semibold text-white dark:bg-[#616F39]"
                        : "hover:bg-[#CDE8E5]/60 dark:hover:bg-[#616F39]/40"
                    }`
                  }
                >
                  <ChildIcon size={16} className="shrink-0" />
                  <span className="truncate">{childLabel}</span>
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
