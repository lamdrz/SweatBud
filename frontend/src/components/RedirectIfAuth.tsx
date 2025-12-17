import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RedirectIfAuth = () => {
  const { auth } = useAuth();

  return auth?.accessToken ? <Navigate to="/profile" replace /> : <Outlet />;
};

export default RedirectIfAuth;
