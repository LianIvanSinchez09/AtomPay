import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { updateLogout } from "../services/userService";
import type { User, AuthContextType, AuthProviderProps } from "../types/types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage:", error);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback((userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  }, []);

  const register = useCallback((userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  }, []);

  const updateUser = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    const currentUserId = user?.id;

    try {
      if (currentUserId) {
        await updateLogout(currentUserId);
      }
    } catch (error) {
      console.error("Error al registrar el logout:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateUser,
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
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
};
