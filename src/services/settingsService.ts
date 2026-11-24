import { api } from "./api";
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  DeleteAccountResult,
  DeleteDataResult,
  UpdateProfileInput,
  UserFileList,
  UserFileRecord,
  UserPreferences,
  UserProfile,
} from "../types/settings";

/**
 * Llamadas a `/api/settings`.
 *
 * Las usan la página `pages/private/dashboard/Settings.tsx`, sus componentes
 * (`components/settings/*`) y `context/PreferencesContext.tsx`.
 */

/** Perfil del usuario autenticado. */
export async function getProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/settings/profile");
  return data;
}

/** Actualiza nombre y/o avatar. */
export async function updateProfile(
  input: UpdateProfileInput
): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>("/settings/profile", input);
  return data;
}

/** Cambia (o crea) la contraseña de la cuenta. */
export async function changePassword(
  input: ChangePasswordInput
): Promise<void> {
  await api.patch("/settings/password", input);
}

/** Guarda idioma y tema en la cuenta. */
export async function updatePreferences(
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> {
  const { data } = await api.patch<UserPreferences>(
    "/settings/preferences",
    preferences
  );
  return data;
}

/** Archivos guardados del usuario. */
export async function getFiles(): Promise<UserFileList> {
  const { data } = await api.get<UserFileList>("/settings/files");
  return data;
}

/** Elimina un archivo del disco y de la base. */
export async function deleteFile(id: string): Promise<void> {
  await api.delete(`/settings/files/${id}`);
}

/**
 * Descarga un archivo con el header de autorización y dispara la descarga
 * del navegador. No se puede usar un `<a href>` directo porque la ruta pide
 * el JWT en `Authorization`.
 */
export async function downloadFile(file: UserFileRecord): Promise<void> {
  const { data } = await api.get<Blob>(
    `/settings/files/${file.id}/download`,
    { responseType: "blob" }
  );

  const url = URL.createObjectURL(data);
  const link = document.createElement("a");

  link.href = url;
  link.download = file.originalName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

/** Borra los registros financieros y el historial escaneado. */
export async function deleteData(): Promise<DeleteDataResult> {
  const { data } = await api.delete<DeleteDataResult>("/settings/data");
  return data;
}

/** Elimina la cuenta y todos sus datos. */
export async function deleteAccount(
  input: DeleteAccountInput
): Promise<DeleteAccountResult> {
  const { data } = await api.delete<DeleteAccountResult>("/settings/account", {
    data: input,
  });
  return data;
}
