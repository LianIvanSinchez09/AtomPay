import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Save,
  SlidersHorizontal,
  Sparkles,
  Target,
} from "lucide-react";

import SimulationMetricsHeader from "../../../components/simulator/SimulationMetricsHeader";
import SimulationHorizonPicker from "../../../components/simulator/SimulationHorizonPicker";
import SimulationServiceList from "../../../components/simulator/SimulationServiceList";
import SavedSimulationsList from "../../../components/simulator/SavedSimulationsList";
import SavingsGoalModal from "../../../components/simulator/SavingsGoalModal";
import SaveSimulationModal from "../../../components/simulator/SaveSimulationModal";
import {
  clampHorizonMonths,
  DEFAULT_HORIZON_MONTHS,
  defaultDowngradeAmount,
  formatSimulationMoney,
} from "../../../components/simulator/simulatorMeta";

import {
  calculateSimulation,
  deleteSimulation,
  getSavedSimulations,
  getSimulationBase,
  saveSimulation,
  suggestSavingsGoal,
} from "../../../services/simulationService";
import { errorMessage } from "../../../services/apiError";
import type {
  SavedSimulation,
  SavingsGoalSuggestion,
  SimulationBase,
  SimulationInputItem,
  SimulationResult,
} from "../../../types/simulation";
import type {
  SimulationDraft,
  SimulationDraftMap,
  SimulationMode,
} from "../../../types/simulatorComponents";

/**
 * Simulador de escenarios de gastos.
 *
 * Flujo:
 *   1. `getSimulationBase` trae servicios y gasto mensual estimado.
 *   2. Cada cambio del usuario se envía a `calculateSimulation` (con debounce)
 *      para que los totales siempre los calcule el backend.
 *   3. El escenario se puede guardar (`saveSimulation`) y volver a cargar.
 *
 * Ruta: `/dashboard/simulator` (ver `routes/AppRoutes.tsx`).
 */
export default function Simulator() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [base, setBase] = useState<SimulationBase | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [drafts, setDrafts] = useState<SimulationDraftMap>({});
  const [mode, setMode] = useState<SimulationMode>("manual");

  /** Meses que el usuario quiere proyectar (1..120). */
  const [horizonMonths, setHorizonMonths] = useState(() =>
    clampHorizonMonths(
      Number(searchParams.get("months") ?? DEFAULT_HORIZON_MONTHS)
    )
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [saved, setSaved] = useState<SavedSimulation[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [highlightServiceId, setHighlightServiceId] = useState<string | null>(
    null
  );

  const [saveOpen, setSaveOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [goalOpen, setGoalOpen] = useState(false);
  const [goalLoading, setGoalLoading] = useState(false);
  const [goalError, setGoalError] = useState<string | null>(null);
  const [goalSuggestion, setGoalSuggestion] =
    useState<SavingsGoalSuggestion | null>(null);

  const preselectName = searchParams.get("service");

  /** Carga el punto de partida y los escenarios guardados. */
  const load = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const [baseResult, savedResult] = await Promise.allSettled([
        getSimulationBase(),
        getSavedSimulations(),
      ]);

      if (baseResult.status === "rejected") throw baseResult.reason;

      setBase(baseResult.value);

      // El listado de escenarios no bloquea al simulador.
      if (savedResult.status === "fulfilled") {
        setSaved(savedResult.value);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
      setSavedLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * Mantiene el horizonte sincronizado con `?months=` para que un enlace
   * (por ejemplo desde el análisis) pueda abrir el simulador con un plazo ya
   * elegido.
   */
  useEffect(() => {
    const param = searchParams.get("months");

    if (param === null) return;

    const next = clampHorizonMonths(Number(param));

    setHorizonMonths((current) => (current === next ? current : next));
  }, [searchParams]);

  /** Cambia el plazo y lo refleja en la URL (sin recargar la página). */
  const handleHorizonChange = useCallback(
    (months: number) => {
      const next = clampHorizonMonths(months);

      setHorizonMonths(next);
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current);

          if (next === DEFAULT_HORIZON_MONTHS) {
            params.delete("months");
          } else {
            params.set("months", String(next));
          }

          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  /** Cambios que se envían al backend (solo servicios modificados). */
  const items = useMemo<SimulationInputItem[]>(
    () =>
      Object.entries(drafts)
        .filter(([, draft]) => draft.action !== "KEEP")
        .map(([serviceId, draft]) => ({
          serviceId,
          action: draft.action,
          simulatedAmount:
            draft.action === "CANCEL" ? 0 : draft.simulatedAmount,
        })),
    [drafts]
  );

  /**
   * Recalcula el escenario con un debounce corto. El backend es la fuente de
   * verdad de los totales, así el frontend no duplica reglas de negocio.
   */
  useEffect(() => {
    if (!base) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setCalculating(true);

      try {
        setSimulation(
          await calculateSimulation(items, horizonMonths, controller.signal)
        );
        setError(null);
      } catch (err) {
        if (!controller.signal.aborted) setError(errorMessage(err));
      } finally {
        if (!controller.signal.aborted) setCalculating(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [base, items, horizonMonths]);

  /** Preselección desde el análisis: `/dashboard/simulator?service=Netflix`. */
  useEffect(() => {
    if (!base || !preselectName) return;

    const match = base.services.find(
      (service) =>
        service.name.toLowerCase() === preselectName.trim().toLowerCase()
    );

    if (!match) return;

    setHighlightServiceId(match.id);

    if (match.monthlyAmount <= 0) return;

    // Se precarga un recorte del 20%: el usuario puede cancelar o ajustar
    // el porcentaje desde la tarjeta.
    setDrafts((current) =>
      current[match.id]
        ? current
        : {
            ...current,
            [match.id]: {
              action: "DOWNGRADE",
              simulatedAmount: defaultDowngradeAmount(match.monthlyAmount),
            },
          }
    );
  }, [base, preselectName]);

  const clearPreselect = useCallback(() => {
    setHighlightServiceId(null);

    if (searchParams.has("service")) {
      const next = new URLSearchParams(searchParams);
      next.delete("service");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleChange = useCallback(
    (serviceId: string, draft: SimulationDraft | null) => {
      setDrafts((current) => {
        const next = { ...current };

        if (draft) {
          next[serviceId] = draft;
        } else {
          delete next[serviceId];
        }

        return next;
      });
    },
    []
  );

  const handleGoal = async (target: number, includeEssential: boolean) => {
    setGoalLoading(true);
    setGoalError(null);

    try {
      setGoalSuggestion(
        await suggestSavingsGoal({
          targetMonthlySaving: target,
          includeEssential,
          horizonMonths,
        })
      );
    } catch (err) {
      setGoalError(errorMessage(err));
    } finally {
      setGoalLoading(false);
    }
  };

  /** Vuelca el plan sugerido al modo manual para revisarlo servicio a servicio. */
  const applyGoal = () => {
    if (!goalSuggestion || !base) return;

    const serviceIds = new Set(base.services.map((service) => service.id));
    const next: SimulationDraftMap = {};

    for (const item of goalSuggestion.items) {
      if (!serviceIds.has(item.serviceId)) continue;

      next[item.serviceId] = {
        action: item.action,
        simulatedAmount: item.simulatedAmount ?? 0,
      };
    }

    setDrafts(next);
    setGoalOpen(false);
    setGoalSuggestion(null);
    setMode("manual");
  };

  /** Carga un escenario guardado en el editor. */
  const loadSavedSimulation = (value: SavedSimulation) => {
    if (!base) return;

    const serviceIds = new Set(base.services.map((service) => service.id));
    const next: SimulationDraftMap = {};

    for (const item of value.items) {
      if (!serviceIds.has(item.serviceId)) continue;

      next[item.serviceId] = {
        action: item.action,
        simulatedAmount: item.simulatedAmount ?? 0,
      };
    }

    setDrafts(next);
    setMode("manual");
    clearPreselect();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (name: string, description: string) => {
    setSaving(true);
    setSaveError(null);

    try {
      const created = await saveSimulation({ name, description, items });

      setSaved((current) => [created, ...current]);
      setSaveOpen(false);
    } catch (err) {
      setSaveError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (value: SavedSimulation) => {
    if (
      !window.confirm(
        `¿Eliminar el escenario "${value.name}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setDeletingId(value.id);

    try {
      await deleteSimulation(value.id);
      setSaved((current) => current.filter((item) => item.id !== value.id));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const changedCount = items.length;
  const hasSavings = (simulation?.monthlyDifference ?? 0) > 0;
  const defaultName =
    hasSavings && simulation
      ? `Ahorro de ${formatSimulationMoney(
          simulation.monthlyDifference,
          simulation.currency
        )}`
      : "Mi escenario";

  return (
    <main className="min-h-screen bg-[#EEF7FF] px-4 py-6 dark:bg-black md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              to="/dashboard/analysis"
              className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-[#4D869C] dark:text-gray-400 dark:hover:text-[#A7D129]"
            >
              <ArrowLeft size={13} />
              Volver al análisis
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Simulador de gastos
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-gray-400">
              Probá cancelar o achicar servicios y mirá el impacto antes de
              decidir. No se modifica ninguna factura ni servicio real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={refreshing}
              title="Actualizar datos"
              className="flex items-center gap-1.5 rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[#F7FCFF] disabled:opacity-40 dark:border-[#616F39] dark:bg-black dark:text-gray-300 dark:hover:bg-[#3E432E]"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Actualizar
            </button>

            <button
              type="button"
              onClick={() => {
                setSaveError(null);
                setSaveOpen(true);
              }}
              disabled={!hasSavings || changedCount === 0}
              title={
                hasSavings
                  ? "Guardar este escenario"
                  : "Ajustá algún servicio para guardar el escenario"
              }
              className="flex items-center gap-1.5 rounded-xl bg-[#4D869C] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#3d6f83] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
            >
              <Save size={15} />
              Guardar escenario
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            <AlertCircle size={17} />
            <span className="flex-1">{error}</span>

            <button
              type="button"
              onClick={() => void load(true)}
              className="font-semibold underline-offset-2 hover:underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading && !base && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
            <Loader2
              size={34}
              className="animate-spin text-[#4D869C] dark:text-[#A7D129]"
            />

            <p className="text-sm text-slate-500 dark:text-gray-400">
              Preparando tus servicios...
            </p>
          </div>
        )}

        {!loading && !base && (
          <div className="mt-6 flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-[#CDE8E5] bg-white p-8 text-center dark:border-[#3E432E] dark:bg-black">
            <Calculator
              size={36}
              className="text-[#4D869C] dark:text-[#A7D129]"
            />

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No pudimos cargar tus servicios
            </h2>

            <p className="max-w-md text-sm text-slate-500 dark:text-gray-400">
              Cargá o conectá comprobantes para que el simulador estime tu gasto
              mensual.
            </p>

            <Link
              to="/dashboard/billing"
              className="rounded-xl bg-[#4D869C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d6f83] dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
            >
              Ir a facturación
            </Link>
          </div>
        )}

        {base && (
          <>
            <div className="mt-6">
              <SimulationHorizonPicker
                months={horizonMonths}
                onChange={handleHorizonChange}
              />
            </div>

            <div className="mt-3">
              {simulation ? (
                <SimulationMetricsHeader
                  base={base}
                  simulation={simulation}
                  calculating={calculating}
                />
              ) : (
                <div className="h-44 animate-pulse rounded-2xl border border-[#CDE8E5] bg-white dark:border-[#3E432E] dark:bg-black" />
              )}
            </div>

            {highlightServiceId && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#4D869C]/40 bg-[#EEF7FF] px-4 py-3 text-sm dark:border-[#A7D129]/30 dark:bg-[#3E432E]">
                <p className="flex items-center gap-2 text-[#2f6477] dark:text-[#A7D129]">
                  <Sparkles size={16} />
                  Servicio precargado desde el análisis. Revisá el recorte antes
                  de guardar.
                </p>

                <button
                  type="button"
                  onClick={clearPreselect}
                  className="text-xs font-semibold text-[#4D869C] underline-offset-2 hover:underline dark:text-[#A7D129]"
                >
                  Quitar selección
                </button>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setMode("manual")}
                aria-pressed={mode === "manual"}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "manual"
                    ? "bg-[#4D869C] text-white dark:bg-[#A7D129] dark:text-black"
                    : "border border-[#CDE8E5] bg-white text-slate-600 hover:border-[#4D869C] dark:border-[#616F39] dark:bg-black dark:text-gray-300"
                }`}
              >
                <SlidersHorizontal size={15} />
                Ajuste manual
                {changedCount > 0 && (
                  <span className="rounded-full bg-white/20 px-1.5 text-[11px] dark:bg-black/20">
                    {changedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode("goal")}
                aria-pressed={mode === "goal"}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "goal"
                    ? "bg-[#4D869C] text-white dark:bg-[#A7D129] dark:text-black"
                    : "border border-[#CDE8E5] bg-white text-slate-600 hover:border-[#4D869C] dark:border-[#616F39] dark:bg-black dark:text-gray-300"
                }`}
              >
                <Target size={15} />
                Meta de ahorro
              </button>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-5">
                {mode === "manual" ? (
                  <SimulationServiceList
                    services={base.services}
                    drafts={drafts}
                    currency={base.currency}
                    highlightServiceId={highlightServiceId}
                    onChange={handleChange}
                  />
                ) : (
                  <section className="rounded-2xl border border-[#CDE8E5] bg-white p-6 shadow-sm dark:border-[#3E432E] dark:bg-black">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF7FF] dark:bg-[#3E432E]">
                      <Target
                        size={20}
                        className="text-[#4D869C] dark:text-[#A7D129]"
                      />
                    </div>

                    <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                      Quiero ahorrar X por mes
                    </h2>

                    <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-gray-400">
                      Analizamos tus servicios flexibles (streaming,
                      suscripciones, compras) y armamos la combinación más
                      eficiente para llegar a la meta.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setGoalError(null);
                        setGoalOpen(true);
                      }}
                      className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#4D869C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d6f83] dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
                    >
                      <Calculator size={15} />
                      Definir meta de ahorro
                    </button>

                    {goalSuggestion && (
                      <div className="mt-5 rounded-xl border border-[#CDE8E5] bg-[#F7FCFF] p-4 dark:border-[#616F39] dark:bg-[#3E432E]/40">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-[#4D869C] dark:text-[#A7D129]">
                          <CheckCircle2 size={15} />
                          Última propuesta
                        </p>

                        <p className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                          {goalSuggestion.message}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setGoalOpen(true)}
                            className="rounded-lg border border-[#CDE8E5] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#4D869C] dark:border-[#616F39] dark:bg-black dark:text-gray-300"
                          >
                            Ver propuesta
                          </button>

                          <button
                            type="button"
                            onClick={applyGoal}
                            className="rounded-lg bg-[#4D869C] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3d6f83] dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#8fb320]"
                          >
                            Aplicar al simulador
                          </button>
                        </div>
                      </div>
                    )}

                    <ul className="mt-5 space-y-1.5 text-xs text-slate-500 dark:text-gray-400">
                      <li>• Los servicios esenciales quedan afuera por defecto.</li>
                      <li>• El plan se puede revisar y ajustar antes de guardar.</li>
                      <li>• Podés compararlo con otros escenarios guardados.</li>
                    </ul>
                  </section>
                )}
              </div>

              <aside className="space-y-5">
                <SavedSimulationsList
                  simulations={saved}
                  currency={base.currency}
                  loading={savedLoading}
                  deletingId={deletingId}
                  onLoad={loadSavedSimulation}
                  onDelete={(value) => void handleDelete(value)}
                />

                <section className="rounded-2xl border border-[#CDE8E5] bg-white p-4 text-xs text-slate-500 shadow-sm dark:border-[#3E432E] dark:bg-black dark:text-gray-400">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Cómo se calcula
                  </h2>

                  <ul className="mt-2 space-y-1.5">
                    <li>
                      • Gasto mensual: promedio de las últimas facturas de cada
                      servicio (o su precio cargado).
                    </li>
                    <li>
                      • Proyección: el ahorro mensual se multiplica por los
                      meses que elegís (1 a 120).
                    </li>
                    <li>
                      • Impacto en AtomScore: estimación sobre estabilidad y
                      diversificación (máximo 10 puntos).
                    </li>
                  </ul>
                </section>
              </aside>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400 dark:text-gray-500">
              Simulación estimada con tus datos actuales · Moneda:{" "}
              {base.currency} · Proyección: {horizonMonths} mes
              {horizonMonths === 1 ? "" : "es"}.
            </p>
          </>
        )}
      </div>

      <SavingsGoalModal
        open={goalOpen}
        currency={base?.currency ?? "ARS"}
        loading={goalLoading}
        suggestion={goalSuggestion}
        error={goalError}
        onClose={() => setGoalOpen(false)}
        onCalculate={(target, includeEssential) =>
          void handleGoal(target, includeEssential)
        }
        onApply={applyGoal}
      />

      <SaveSimulationModal
        open={saveOpen}
        saving={saving}
        error={saveError}
        defaultName={defaultName}
        simulation={
          simulation ?? {
            currency: base?.currency ?? "ARS",
            currentMonthlyExpense: 0,
            simulatedMonthlyExpense: 0,
            currentYearlyExpense: 0,
            simulatedYearlyExpense: 0,
            monthlyDifference: 0,
            yearlyDifference: 0,
            horizonMonths,
            currentHorizonExpense: 0,
            simulatedHorizonExpense: 0,
            horizonDifference: 0,
            savingsPercent: 0,
            scoreImpact: 0,
            services: [],
          }
        }
        onClose={() => setSaveOpen(false)}
        onSave={(name, description) => void handleSave(name, description)}
      />
    </main>
  );
}
