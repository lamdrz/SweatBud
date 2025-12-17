import { Routes, Route } from 'react-router-dom';

import ErrorPage from './components/errors/ErrorPage';
import Root from './components/layout/Root';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LogoutButton from './components/auth/LogoutButton';
import ProfilePage from './pages/profile/ProfilePage';
// import EditProfilePage from './pages/profile/EditProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import PersistLogin from './components/PersistLogin';
import RedirectIfAuth from './components/RedirectIfAuth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route element={<PersistLogin />}>
          {/* public routes */}
          <Route element={<RedirectIfAuth />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="logout" element={<LogoutButton />} />
            <Route path="profile" element={<ProfilePage />}>
              {/* <Route path="edit" element={<EditProfilePage />} /> */}
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
