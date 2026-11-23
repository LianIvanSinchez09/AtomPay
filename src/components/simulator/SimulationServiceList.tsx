import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";

import type {
  SimulationServiceFilters,
  SimulationServiceListProps,
} from "../../types/simulatorComponents";
import ServiceSimulationCard from "./ServiceSimulationCard";
import { tr } from "../../i18n/translate";

const INITIAL_FILTERS: SimulationServiceFilters = {
  search: "",
  category: "",
  onlyChanged: false,
  onlyFlexible: false,
};

/**
 * Lista filtrable de servicios activos del modo manual.
 *
 * Filtros: texto, categoría, "solo con cambios" y "solo flexibles". Cada
 * tarjeta delega el cambio en `onChange`, que administra `Simulator.tsx`.
 */
export default function SimulationServiceList({
  services,
  drafts,
  currency,
  highlightServiceId,
  onChange,
}: SimulationServiceListProps) {
  const [filters, setFilters] = useState<SimulationServiceFilters>(
    INITIAL_FILTERS
  );

  const categories = useMemo(
    () =>
      [...new Set(services.map((service) => service.category))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [services]
  );

  const changedCount = useMemo(
    () =>
      services.filter((service) => {
        const action = drafts[service.id]?.action;

        return action !== undefined && action !== "KEEP";
      }).length,
    [services, drafts]
  );

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    return services.filter((service) => {
      const action = drafts[service.id]?.action;

      if (filters.onlyChanged && (!action || action === "KEEP")) {
        return false;
      }

      if (filters.onlyFlexible && service.essential) return false;
      if (filters.category && service.category !== filters.category) {
        return false;
      }

      if (!term) return true;

      return (
        service.name.toLowerCase().includes(term) ||
        service.category.toLowerCase().includes(term) ||
        (service.provider ?? "").toLowerCase().includes(term)
      );
    });
  }, [services, drafts, filters]);

  const hasFilters =
    filters.search !== "" ||
    filters.category !== "" ||
    filters.onlyChanged ||
    filters.onlyFlexible;

  const patch = (value: Partial<SimulationServiceFilters>) =>
    setFilters((current) => ({ ...current, ...value }));

  return (
    <section className="rounded-2xl border border-[#CDE8E5] bg-white p-4 shadow-sm dark:border-[#3E432E] dark:bg-black">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <SlidersHorizontal
              size={17}
              className="text-[#4D869C] dark:text-[#A7D129]"
            />{" "}{tr("Ajuste por servicio")}{" "}</h2>

          <p className="text-xs text-slate-500 dark:text-gray-400">
            {services.length}{" "}{tr("servicios activos ·")}{" "}{changedCount}{" "}{tr("con cambios")}{" "}</p>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:bg-[#EEF7FF] hover:text-[#4D869C] dark:text-gray-400 dark:hover:bg-[#3E432E] dark:hover:text-[#A7D129]"
          >
            <X size={13} />{" "}{tr("Limpiar filtros")}{" "}</button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500"
          />

          <input
            type="search"
            value={filters.search}
            onChange={(event) => patch({ search: event.target.value })}
            placeholder={tr("Buscar servicio, categoría o proveedor")}
            aria-label={tr("Buscar servicios")}
            className="w-full rounded-xl border border-[#CDE8E5] bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#4D869C] focus:ring-2 focus:ring-[#4D869C]/20 dark:border-[#616F39] dark:bg-[#3E432E] dark:text-white"
          />
        </div>

        <select
          value={filters.category}
          onChange={(event) => patch({ category: event.target.value })}
          aria-label={tr("Filtrar por categoría")}
          className="rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#3E432E] dark:text-white lg:w-52"
        >
          <option value="">{tr("Todas las categorías")}</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => patch({ onlyChanged: !filters.onlyChanged })}
          aria-pressed={filters.onlyChanged}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            filters.onlyChanged
              ? "border-[#4D869C] bg-[#EEF7FF] text-[#4D869C] dark:border-[#A7D129] dark:bg-[#3E432E] dark:text-[#A7D129]"
              : "border-[#CDE8E5] bg-white text-slate-600 hover:border-[#4D869C] dark:border-[#616F39] dark:bg-black dark:text-gray-300"
          }`}
        >
          <Filter size={13} />{" "}{tr("Solo con cambios (")}{changedCount})
        </button>

        <button
          type="button"
          onClick={() => patch({ onlyFlexible: !filters.onlyFlexible })}
          aria-pressed={filters.onlyFlexible}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            filters.onlyFlexible
              ? "border-[#4D869C] bg-[#EEF7FF] text-[#4D869C] dark:border-[#A7D129] dark:bg-[#3E432E] dark:text-[#A7D129]"
              : "border-[#CDE8E5] bg-white text-slate-600 hover:border-[#4D869C] dark:border-[#616F39] dark:bg-black dark:text-gray-300"
          }`}
        >{" "}{tr("Solo no esenciales")}{" "}</button>
      </div>

      <div className="mt-4 grid gap-3">
        {services.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#CDE8E5] p-8 text-center dark:border-[#616F39]">
            <p className="text-sm text-slate-500 dark:text-gray-400">{" "}{tr("Todavía no tenés servicios activos para simular.")}{" "}</p>

            <Link
              to="/dashboard/billing"
              className="mt-2 inline-block text-xs font-semibold text-[#4D869C] underline-offset-2 hover:underline dark:text-[#A7D129]"
            >{" "}{tr("Cargar o conectar comprobantes")}{" "}</Link>
          </div>
        )}

        {filtered.map((service) => (
          <ServiceSimulationCard
            key={service.id}
            service={service}
            draft={drafts[service.id]}
            currency={currency}
            highlighted={highlightServiceId === service.id}
            onChange={onChange}
          />
        ))}

        {services.length > 0 && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#CDE8E5] p-8 text-center dark:border-[#616F39]">
            <p className="text-sm text-slate-500 dark:text-gray-400">{" "}{tr("No hay servicios que coincidan con los filtros.")}{" "}</p>

            {hasFilters && (
              <button
                type="button"
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="mt-2 text-xs font-semibold text-[#4D869C] underline-offset-2 hover:underline dark:text-[#A7D129]"
              >{" "}{tr("Ver todos los servicios")}{" "}</button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
