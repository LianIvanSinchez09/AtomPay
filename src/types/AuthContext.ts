import type { ReactNode } from "react";
import type { User } from "./types";

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export interface StoredAuth {
  sessionToken: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  register: (userData: User, token: string) => void;
  /** Refresca el usuario en memoria y en localStorage (p. ej. al editar el perfil). */
  updateUser: (userData: User) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}
