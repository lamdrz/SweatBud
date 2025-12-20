import { Routes, Route } from 'react-router-dom';

import ErrorPage from './components/errors/ErrorPage';
import Error404Page from './components/errors/Error404Page';
import Root from './components/layout/Root';

import HomePage from './pages/home/HomePage';
import ChatPage from './pages/chat/ChatPage';
import AddPage from './pages/add/AddPage';
import MapPage from './pages/map/MapPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LogoutButton from './components/auth/LogoutButton';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
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
            <Route index element={<HomePage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="add" element={<AddPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="profile">
              <Route index element={<ProfilePage />} />
              <Route path="edit" element={<EditProfilePage />} />
            </Route>
            <Route path="logout" element={<LogoutButton />} />
          </Route>
        </Route>
        <Route path="*" element={<Error404Page />} />
      </Route>
    </Routes>
  );
}

export default App;
