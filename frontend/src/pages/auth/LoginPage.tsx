import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import type { AuthFormField } from '../../components/auth/AuthForm';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const fields: AuthFormField[] = [
    { name: 'username', type: 'text', placeholder: "Nom d'utilisateur", icon: faUser },
    { name: 'password', type: 'password', placeholder: 'Mot de passe', icon: faLock },
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    await login(formData.username, formData.password);
    navigate('/profile');
  };

  return (
    <AuthForm
      title="Connexion"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Se connecter"
      loadingText="Connexion en cours..."
      bottomLink={<>Pas de compte ? <Link to="/register">S'inscrire</Link></>}
      showForgotPassword={true}
    />
  );
};

export default LoginPage;