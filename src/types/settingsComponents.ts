import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { UserProfile } from "./settings";

/**
 * Props de los componentes de Ajustes.
 *
 * Se usan en `components/settings/*` y en la página
 * `pages/private/dashboard/Settings.tsx`.
 */

export interface SettingsCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  /** "danger" pinta el borde y el icono en rojo. */
  tone?: "default" | "danger";
  /** Contenido opcional al pie de la tarjeta. */
  footer?: ReactNode;
}

export interface ProfileSettingsProps {
  profile: UserProfile;
  /** Se llama después de guardar para refrescar la tarjeta y el sidebar. */
  onSaved: (profile: UserProfile) => void;
}

export interface PasswordSettingsProps {
  hasPassword: boolean;
}

export interface DataSettingsProps {
  /** Se llama después de borrar para que la página recargue los archivos. */
  onDeleted: () => void;
}

export interface AccountDeletionSettingsProps {
  profile: UserProfile;
  /** Se llama después de eliminar la cuenta (cierra sesión y navega). */
  onDeleted: () => void;
}
