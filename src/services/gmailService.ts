import { api } from "./api";

const BASE_URL = api.defaults.baseURL ?? "http://localhost:3001/api";

/**
 * Origen del backend (sin el /api). Lo usamos para validar el `postMessage`
 * que emite la página de callback de OAuth, que la sirve el backend.
 */
export const API_ORIGIN = new URL(BASE_URL).origin;

/** Lo que devuelve GET /api/gmail/accounts (nunca incluye los tokens). */
export interface GmailAccount {
  id: string;
  provider: string;
  email: string;
  status: string;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncResult {
  discovered: number;
  created: number;
  merged: number;
  ignored: number;
  failed: number;
  queued: number;
}

/** Devuelve la URL de consentimiento de Google para abrir en un popup. */
export async function getGmailConnectUrl(): Promise<string> {
  const { data } = await api.get<{ url: string }>("/gmail/connect/url");
  return data.url;
}

export async function listGmailAccounts(): Promise<GmailAccount[]> {
  const { data } = await api.get<GmailAccount[]>("/gmail/accounts");
  return data;
}

export async function disconnectGmailAccount(id: string): Promise<void> {
  await api.delete(`/gmail/accounts/${id}`);
}

export async function syncGmailAccount(
  id: string,
  maxResults = 25
): Promise<SyncResult> {
  const { data } = await api.post<{ status: string; data: SyncResult }>(
    `/gmail/accounts/${id}/sync`,
    { maxResults }
  );

  return data.data;
}

/** Saca el mensaje del backend de un error de axios, si está. */
export { errorMessage } from "./apiError";
