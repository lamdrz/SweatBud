import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconName } from '@fortawesome/fontawesome-svg-core';
import logo from '../../../public/logo.svg';

export interface AuthFormField {
  name: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  icon: IconName;
}

interface AuthFormProps {
  title: string;
  fields: AuthFormField[];
  onSubmit: (formData: Record<string, string>) => Promise<void>;
  submitButtonText: string;
  loadingText: string;
  bottomLink: React.ReactNode;
  showForgotPassword?: boolean;
}

// AI-ASSISTED
// Prompt : Refactor login and register pages to a common AuthForm
const AuthForm: React.FC<AuthFormProps> = ({
  title,
  fields,
  onSubmit,
  submitButtonText,
  loadingText,
  bottomLink,
  showForgotPassword,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <img className={styles.logo} src={logo} alt="SweatBud"/>
        <h2 className={styles.title}>{title}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {fields.map((field) => (
            <div className={styles.inputGroup} key={field.name}>
              <FontAwesomeIcon icon={field.icon} className={styles.icon} />
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                placeholder={field.placeholder}
                className={styles.input}
              />
            </div>
          ))}

          {showForgotPassword && <Link to="/forgot-password" className={styles.forgotPassword}>Mot de passe oublié</Link>}

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? loadingText : submitButtonText}
          </button>
        </form>
        <p className={styles.bottomLink}>
          {bottomLink}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
