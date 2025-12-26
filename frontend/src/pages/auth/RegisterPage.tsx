import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import type { AuthFormField } from '../../components/auth/AuthForm';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const fields: AuthFormField[] = [
    { name: 'username', type: 'text', placeholder: "Nom d'utilisateur", icon: 'user' },
    { name: 'email', type: 'email', placeholder: 'Email', icon: 'envelope' },
    { name: 'password', type: 'password', placeholder: 'Mot de passe', icon: 'lock' },
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    await register(formData.username, formData.email, formData.password);
    navigate('/');
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
