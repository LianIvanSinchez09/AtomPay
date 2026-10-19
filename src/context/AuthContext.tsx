import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import axios from "axios";

import type {
    AuthContextType,
    AuthProviderProps,
    GoogleUser,
} from "../types/AuthContext";

const API_URL = "http://localhost:3001/api";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {
    const [user, setUser] = useState<GoogleUser | null>(null);
    const [loading, setLoading] = useState(true);

    /*
    |--------------------------------------------------------------------------
    | Recuperar sesión
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const restoreSession = async () => {
            const sessionToken =
                localStorage.getItem("atompay_session");

            if (!sessionToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${API_URL}/auth/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    }
                );

                setUser(response.data.user);
            } catch (error) {
                console.error(
                    "La sesión ya no es válida:",
                    error
                );

                localStorage.removeItem("atompay_session");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    const login = (
        userData: GoogleUser,
        sessionToken: string
    ) => {
        setUser(userData);

        /*
        | Solamente guardamos el token de sesión.
        | NO guardamos email, nombre ni perfil de Google.
        */

        localStorage.setItem(
            "atompay_session",
            sessionToken
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Register
    |--------------------------------------------------------------------------
    */

    const register = (
        userData: GoogleUser,
        sessionToken: string
    ) => {
        setUser(userData);

        localStorage.setItem(
            "atompay_session",
            sessionToken
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const logout = async () => {
        const sessionToken =
            localStorage.getItem("atompay_session");

        try {
            if (sessionToken) {
                await axios.post(
                    `${API_URL}/auth/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    }
                );
            }
        } catch (error) {
            console.error(
                "Error al cerrar sesión:",
                error
            );
        } finally {
            setUser(null);
            localStorage.removeItem("atompay_session");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth debe utilizarse dentro de AuthProvider"
        );
    }

    return context;
};