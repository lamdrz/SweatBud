import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavMenu from './layout/NavMenu';
import styles from './layout/NavMenu.module.css';

const ProtectedRoute = () => {
  const { auth, logout } = useAuth();

  if (!auth) {
    logout();
  }

  return auth?.accessToken ? (
    <>
      <div className={styles.pageContent}>
        <Outlet />
      </div>
      <NavMenu />
    </>
  ) : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
