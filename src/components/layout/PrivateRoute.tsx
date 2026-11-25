// Ruta protegida - solo accesible para administradores autenticados
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PaginaCargando } from '../ui/Spinner';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { usuario, esAdmin, cargando } = useAuth();

  if (cargando) return <PaginaCargando />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (!esAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};
