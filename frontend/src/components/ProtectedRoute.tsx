import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { auth, logout } = useAuth();

  if (!auth) {
    logout();
  }

  return auth?.accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
