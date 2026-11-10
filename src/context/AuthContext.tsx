import { createContext, useContext, useState, useEffect } from "react";

// import { getNotifications } from "../services/notificationService";
import { updateLogout } from "../services/userService";
import type { User, AuthContextType, AuthProviderProps } from "../types/types";
import { api } from "../services/api";

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

  const login = (userData: User, token: string) => {
    setUser(userData);
    console.log(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    localStorage.setItem("token", token);
  };

  const register = (userData: User, token: string) => {
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));

    localStorage.setItem("token", token);
  };

  const logout = async () => {
    if (!user) return;

    try {
      await updateLogout(user.id);
    } catch (error) {
      console.error("Error al registrar el logout:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
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
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
};
