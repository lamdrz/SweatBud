import './App.css';

import { Routes, Route } from 'react-router-dom';

import ErrorPage from './errors/ErrorPage';
import Root from './components/Root/Root';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutButton from './components/LogoutButton';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="logout" element={<LogoutButton />} />
      </Route>
    </Routes>
  );
}

export default App;
