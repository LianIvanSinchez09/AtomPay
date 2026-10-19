import type { ReactNode } from "react";

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
    user: GoogleUser | null;
    login: (
        userData: GoogleUser,
        sessionToken: string
    ) => void;
    register: (
        userData: GoogleUser,
        sessionToken: string
    ) => void;
    logout: () => Promise<void>;
    loading: boolean;
}

export interface AuthProviderProps {
    children: ReactNode;
}