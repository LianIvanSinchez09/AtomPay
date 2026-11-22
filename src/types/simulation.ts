/**
 * Contratos del simulador de escenarios de gastos.
 *
 * Espejo de `AtomPay-Backend/src/types/simulation.ts`: si cambia un DTO en el
 * backend, se actualiza acá. Los tipos exclusivos de la UI (borradores, props)
 * viven en `simulatorComponents.ts`.
 */

/** Qué se hace con un servicio dentro de un escenario. */
export type SimulationAction =
  | "KEEP"
  | "CANCEL"
  | "DOWNGRADE"
  | "MODIFY_AMOUNT";

/** Servicio activo con su gasto mensual estimado. */
export interface SimulatorService {
  id: string;
  name: string;
  provider: string | null;
  category: string;
  /** Promedio mensual de las últimas facturas. */
  monthlyAmount: number;
  lastAmount: number | null;
  /** Período de la última factura (YYYY-MM). */
  lastPeriod: string | null;
  invoiceCount: number;
  /** Los esenciales no se proponen recortar por defecto. */
  essential: boolean;
}

/** Punto de partida del simulador. */
export interface SimulationBase {
  currency: string;
  generatedAt: string;
  currentMonthlyExpense: number;
  currentYearlyExpense: number;
  services: SimulatorService[];
}

/** Cambio propuesto para un servicio. */
export interface SimulationInputItem {
  serviceId: string;
  action: SimulationAction;
  /** Importe mensual que quedaría pagando. */
  simulatedAmount?: number | null;
}

/** Resultado del escenario para un servicio. */
export interface SimulationServiceResult {
  serviceId: string;
  service: string;
  category: string;
  action: SimulationAction;
  currentAmount: number;
  simulatedAmount: number;
  monthlySaving: number;
  yearlySaving: number;
  essential: boolean;
}

/** Cálculo completo del escenario (no persistido). */
export interface SimulationResult {
  currency: string;
  currentMonthlyExpense: number;
  simulatedMonthlyExpense: number;
  currentYearlyExpense: number;
  simulatedYearlyExpense: number;
  /** Ahorro mensual: positivo cuando el escenario gasta menos. */
  monthlyDifference: number;
  yearlyDifference: number;
  /** Meses elegidos por el usuario para la proyección (1..120). */
  horizonMonths: number;
  /** Gasto actual y simulado a lo largo del horizonte elegido. */
  currentHorizonExpense: number;
  simulatedHorizonExpense: number;
  /** Ahorro acumulado dentro del horizonte elegido. */
  horizonDifference: number;
  savingsPercent: number;
  /** Puntos estimados que subiría el AtomScore. */
  scoreImpact: number;
  services: SimulationServiceResult[];
}

/** Pedido del modo "quiero ahorrar $X por mes". */
export interface SavingsGoalInput {
  targetMonthlySaving: number;
  includeEssential?: boolean;
  /** Horizonte con el que se proyecta el plan (1..120). */
  horizonMonths?: number;
}

/** Combinación sugerida para alcanzar la meta. */
export interface SavingsGoalSuggestion {
  targetMonthlySaving: number;
  achievableMonthlySaving: number;
  feasible: boolean;
  message: string;
  items: SimulationInputItem[];
  simulation: SimulationResult;
}

/** Cambio persistido dentro de un escenario guardado. */
export interface SavedSimulationItem {
  id: string;
  serviceId: string;
  service: string;
  category: string;
  action: SimulationAction;
  currentAmount: number | null;
  simulatedAmount: number | null;
  monthlySaving: number;
}

/** Escenario guardado. */
export interface SavedSimulation {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  currentMonthlyExpense: number;
  simulatedMonthlyExpense: number;
  currentYearlyExpense: number;
  simulatedYearlyExpense: number;
  monthlyDifference: number;
  yearlyDifference: number;
  savingsPercent: number;
  createdAt: string;
  updatedAt: string;
  items: SavedSimulationItem[];
}

/** Datos para guardar un escenario (los totales los recalcula el backend). */
export interface SaveSimulationInput {
  name: string;
  description?: string | null;
  items: SimulationInputItem[];
}
