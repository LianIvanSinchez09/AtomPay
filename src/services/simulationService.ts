import { api } from "./api";
import type {
  SavedSimulation,
  SaveSimulationInput,
  SavingsGoalInput,
  SavingsGoalSuggestion,
  SimulationBase,
  SimulationInputItem,
  SimulationResult,
} from "../types/simulation";

/**
 * Punto de partida del simulador: servicios activos, gasto mensual estimado y
 * moneda. Lo usa la página `Simulator` al montar.
 *
 * Backend: GET /api/simulations/base → `simulation.controller.base`.
 */
export async function getSimulationBase(
  signal?: AbortSignal
): Promise<SimulationBase> {
  const { data } = await api.get<{ base: SimulationBase }>(
    "/simulations/base",
    { signal }
  );

  return data.base;
}

/**
 * Calcula un escenario sin guardarlo. La página lo llama con debounce cada vez
 * que el usuario toca un switch, un slider o cambia el horizonte.
 *
 * `horizonMonths` es la cantidad de meses que pide el usuario para proyectar
 * el ahorro (1..120); el backend lo acota y devuelve `horizonDifference`.
 *
 * Backend: POST /api/simulations/calculate → `simulation.controller.calculate`.
 */
export async function calculateSimulation(
  items: SimulationInputItem[],
  horizonMonths = 12,
  signal?: AbortSignal
): Promise<SimulationResult> {
  const { data } = await api.post<{ simulation: SimulationResult }>(
    "/simulations/calculate",
    { items, horizonMonths },
    { signal }
  );

  return data.simulation;
}

/**
 * Pide una combinación de recortes para llegar a una meta mensual.
 * Lo usa `SavingsGoalModal`.
 *
 * Backend: POST /api/simulations/goal → `simulation.controller.goal`.
 */
export async function suggestSavingsGoal(
  input: SavingsGoalInput
): Promise<SavingsGoalSuggestion> {
  const { data } = await api.post<{ goal: SavingsGoalSuggestion }>(
    "/simulations/goal",
    input
  );

  return data.goal;
}

/**
 * Escenarios guardados del usuario.
 * Backend: GET /api/simulations → `simulation.controller.list`.
 */
export async function getSavedSimulations(): Promise<SavedSimulation[]> {
  const { data } = await api.get<{ simulations: SavedSimulation[] }>(
    "/simulations"
  );

  return data.simulations;
}

/**
 * Guarda el escenario actual. El backend recalcula los totales.
 * Backend: POST /api/simulations → `simulation.controller.save`.
 */
export async function saveSimulation(
  input: SaveSimulationInput
): Promise<SavedSimulation> {
  const { data } = await api.post<{ simulation: SavedSimulation }>(
    "/simulations",
    input
  );

  return data.simulation;
}

/**
 * Elimina un escenario propio.
 * Backend: DELETE /api/simulations/:id → `simulation.controller.remove`.
 */
export async function deleteSimulation(id: string): Promise<void> {
  await api.delete(`/simulations/${id}`);
}
