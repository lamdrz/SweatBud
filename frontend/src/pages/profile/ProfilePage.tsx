import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage: React.FC = () => {
    const { auth } = useAuth();
    const user = auth?.user;

    if (!user) {
        return <div>Chargement du profil ou utilisateur non connecté...</div>;
    }

    return (
        <div>
            <h1>Username :</h1>
            <p>
                {user.username}
            </p>
            <h2>JSON :</h2>
            <p>
                {JSON.stringify(user, null, 2)}
            </p>
        </div>
    );
};

export default ProfilePage;