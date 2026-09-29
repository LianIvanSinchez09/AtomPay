import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Esperar a verificar localStorage antes de redireccionar
  if (loading) {
    return null; // O un Spinner/Loader
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};