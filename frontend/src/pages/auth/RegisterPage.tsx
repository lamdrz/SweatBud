import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm, { AuthFormField } from '../../components/auth/AuthForm';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const fields: AuthFormField[] = [
    { name: 'username', type: 'text', placeholder: "Nom d'utilisateur", icon: faUser },
    { name: 'email', type: 'email', placeholder: 'Email', icon: faEnvelope },
    { name: 'password', type: 'password', placeholder: 'Mot de passe', icon: faLock },
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
    navigate('/login');
  };

  return (
    <AuthForm
      title="Inscription"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="S'inscrire"
      loadingText="Inscription en cours..."
      bottomLink={<>Déjà un compte ? <Link to="/login">Se connecter</Link></>}
      showForgotPassword={false}
    />
  );
};

export default RegisterPage;
