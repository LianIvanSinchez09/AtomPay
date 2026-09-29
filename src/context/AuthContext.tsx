import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Interfaz del usuario
export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

// 2. Interfaz del Contexto
interface AuthContextType {
  user: GoogleUser | null;
  login: (userData: GoogleUser) => void;
  register: (userData: GoogleUser) => void;
  logout: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage:", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // 3. DECLARAR LA FUNCIÓN LOGIN (esto es lo que faltaba)
  const login = (userData: GoogleUser) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 4. DECLARAR LA FUNCIÓN REGISTER
  const register = (userData: GoogleUser) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 5. DECLARAR LA FUNCIÓN LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    // Ahora 'user', 'login', 'register', 'logout' y 'loading' existen correctamente en el ámbito
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};