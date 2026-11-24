/**
 * Tipos de la sección Ajustes (frontend).
 *
 * Los usan:
 * - `services/settingsService.ts` (llamadas a /api/settings).
 * - `context/PreferencesContext.tsx` (idioma y tema).
 * - `pages/private/dashboard/Settings.tsx` y `components/settings/*`.
 */

/** Idioma de la interfaz. Espejo de `User.language` en el backend. */
export type Language = "es" | "en";

/** Apariencia de la interfaz. Espejo de `User.theme` en el backend. */
export type Theme = "light" | "dark";

/** Preferencias que se aplican al instante y se guardan por usuario. */
export interface UserPreferences {
  language: Language;
  theme: Theme;
}

/** Perfil que devuelve `GET /api/settings/profile`. */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  googleId: string | null;
  hasPassword: boolean;
  language: Language;
  theme: Theme;
  createdAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string | null;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword: string;
}

/** Tipos de archivo que administra "Archivos". */
export type UserFileKind = "manual" | "email_attachment" | "report";

export interface UserFileRecord {
  id: string;
  kind: UserFileKind;
  originalName: string;
  mimeType: string | null;
  size: number;
  invoiceId: string | null;
  source: "upload" | "gmail" | "system" | null;
  createdAt: string;
  downloadUrl: string;
}

export interface UserFileList {
  files: UserFileRecord[];
  totalSize: number;
}

export interface DeletedDataCounts {
  invoices: number;
  services: number;
  simulations: number;
  notifications: number;
  insights: number;
  snapshots: number;
  scores: number;
  messages: number;
  reports: number;
  files: number;
}

export interface DeleteDataResult {
  deleted: DeletedDataCounts;
}

export interface DeleteAccountInput {
  confirmEmail: string;
  password?: string;
}

export interface DeleteAccountResult {
  deleted: true;
  email: string;
}

/** Estado de un formulario de Ajustes. */
export interface SettingsFeedback {
  ok: boolean;
  text: string;
}

/** Rangos válidos que también valida el backend. */
export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MAX_LENGTH = 80;

/** Clave de localStorage donde se cachean las preferencias del dispositivo. */
export const PREFERENCES_STORAGE_KEY = "atompay.preferences";
