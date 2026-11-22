import type { ReactNode } from "react";

import type {
  SavedSimulation,
  SavingsGoalSuggestion,
  SimulationAction,
  SimulationBase,
  SimulationResult,
  SimulatorService,
} from "./simulation";

/**
 * Contratos de UI del simulador.
 *
 * Igual que en el resto del proyecto, las props y los tipos auxiliares de los
 * componentes viven acá y no dentro de cada `.tsx`.
 */

/** Pestañas del simulador. */
export type SimulationMode = "manual" | "goal";

/** Cambio en edición para un servicio (estado local del simulador). */
export interface SimulationDraft {
  action: SimulationAction;
  simulatedAmount: number;
}

/** Cambios en edición indexados por id de servicio. */
export type SimulationDraftMap = Record<string, SimulationDraft>;

/** Filtros de la lista de servicios. */
export interface SimulationServiceFilters {
  search: string;
  category: string;
  onlyChanged: boolean;
  onlyFlexible: boolean;
}

/** Estilos y etiqueta de cada acción del simulador. */
export interface SimulationActionMeta {
  label: string;
  shortLabel: string;
  badge: string;
  dot: string;
}

/* --------------------------- Horizon Picker ------------------------- */

/** Selector del plazo de proyección (1..120 meses). */
export interface SimulationHorizonPickerProps {
  months: number;
  /** Se deshabilita mientras se recalculan los datos iniciales. */
  disabled?: boolean;
  onChange: (months: number) => void;
}

/* ---------------------- SimulationMetricsHeader --------------------- */

export interface SimulationMetricsHeaderProps {
  base: SimulationBase;
  simulation: SimulationResult;
  /** Se muestra un indicador discreto mientras se recalcula. */
  calculating?: boolean;
}

/** Celda de KPI dentro de la barra de impacto. */
export interface SimulationMetricProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}

/* ----------------------- ServiceSimulationCard ---------------------- */

export interface ServiceSimulationCardProps {
  service: SimulatorService;
  draft?: SimulationDraft;
  currency: string;
  /** Servicio preseleccionado desde el análisis. */
  highlighted?: boolean;
  onChange: (serviceId: string, draft: SimulationDraft | null) => void;
}

/** Botón de acción de una tarjeta de servicio. */
export interface SimulationActionButtonProps {
  active: boolean;
  disabled: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  tone?: "default" | "danger";
}

/* ----------------------- SimulationServiceList ---------------------- */

export interface SimulationServiceListProps {
  services: SimulatorService[];
  drafts: SimulationDraftMap;
  currency: string;
  highlightServiceId?: string | null;
  onChange: (serviceId: string, draft: SimulationDraft | null) => void;
}

/* ---------------------------- ModalShell ---------------------------- */

/** Contenedor común de los modales del simulador. */
export interface SimulatorModalShellProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}

/* ------------------------- SavingsGoalModal ------------------------- */

export interface SavingsGoalModalProps {
  open: boolean;
  currency: string;
  loading: boolean;
  suggestion: SavingsGoalSuggestion | null;
  error?: string | null;
  onClose: () => void;
  onCalculate: (target: number, includeEssential: boolean) => void;
  onApply: () => void;
}

/* ------------------------ SaveSimulationModal ----------------------- */

export interface SaveSimulationModalProps {
  open: boolean;
  saving: boolean;
  error?: string | null;
  /** Nombre propuesto según el ahorro del escenario. */
  defaultName: string;
  simulation: SimulationResult;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

/* ------------------------ SavedSimulationsList ---------------------- */

export interface SimulationCompareRowProps {
  label: string;
  values: string[];
}

export interface SavedSimulationsListProps {
  simulations: SavedSimulation[];
  currency: string;
  loading: boolean;
  deletingId?: string | null;
  onLoad: (simulation: SavedSimulation) => void;
  onDelete: (simulation: SavedSimulation) => void;
}
