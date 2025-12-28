import { useNavigate } from 'react-router-dom';
import AuthForm, { type AuthFormField } from '../../components/auth/AuthForm';
import useApi from '../../hooks/useApi';
import BackArrow from '../../components/ui/BackArrow';
import React from 'react';

const ChangePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { execute } = useApi('/auth/change-password', { method: 'PUT', autoRun: false });

    const fields: AuthFormField[] = [
        { name: 'oldPassword', type: 'password', placeholder: 'Ancien mot de passe', icon: 'lock' },
        { name: 'newPassword', type: 'password', placeholder: 'Nouveau mot de passe', icon: 'lock' },
        { name: 'confirmNewPassword', type: 'password', placeholder: 'Confirmer le nouveau mot de passe', icon: 'lock' },
    ];

    const handleSubmit = async (formData: Record<string, string>) => {
        if (formData.newPassword !== formData.confirmNewPassword) {
            throw new Error("Les nouveaux mots de passe ne correspondent pas.");
        }

        await execute({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword
        });

        navigate('/me/edit');
    };

    return (<>
        <BackArrow destination="/me/edit" />
        <AuthForm
            title="Changer de mot de passe"
            fields={fields}
            onSubmit={handleSubmit}
            submitButtonText="Changer le mot de passe"
            loadingText="Modification en cours..."
            bottomLink={null}
        />
    </>);
};

export default ChangePasswordPage;