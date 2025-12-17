import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './EditProfilePage.module.css';
import backgroundImage from '../../assets/images/mountain-background.jpg';

const EditProfilePage: React.FC = () => {
    const { auth, login } = useAuth();
    const user = auth?.user;

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    // For password changes, you would typically have currentPassword, newPassword, confirmPassword fields
    // and a separate form/modal for security reasons.
    // This is a simplified example.

    const handleSave = async () => {
        if (!user) return;
        // Here you would call an API to update the user profile
        console.log("Saving profile:", { username, email });
        // For demonstration, we'll update the auth context locally
        const updatedUser = { ...user, username, email };
        // This is a mock login to update the context. 
        // In a real app, you'd get the updated user from the API response.
        // login(updatedUser.username, 'password'); // This would require re-authentication
    };

    if (!user) {
        return <div>Chargement du profil ou utilisateur non connecté...</div>;
    }

    return (
        <div className={styles.editProfilePage}>
            <div className={styles.profileHeader} style={{ backgroundImage: `url(${backgroundImage})` }}>
            </div>
            <div className={styles.profileContent}>
                <div className={styles.profilePicture} />
                <h1 className={styles.username}>{user.username}</h1>

                <div className={styles.infoSection}>
                    <div className={styles.infoItem}>
                        <div>
                            <div className={styles.infoLabel}>Nom d'utilisateur</div>
                            <div className={styles.infoValue}>{user.username}</div>
                        </div>
                        <a href="#" className={styles.editLink}>modifier</a>
                    </div>
                    <div className={styles.infoItem}>
                        <div>
                            <div className={styles.infoLabel}>Email</div>
                            <div className={styles.infoValue}>{user.email}</div>
                        </div>
                        <a href="#" className={styles.editLink}>modifier</a>
                    </div>
                    <div className={styles.infoItem}>
                        <div>
                            <div className={styles.infoLabel}>Mot de passe</div>
                            <div className={styles.infoValue}>**********</div>
                        </div>
                        <a href="#" className={styles.editLink}>modifier</a>
                    </div>
                </div>

                <button onClick={handleSave} className={styles.saveButton}>Enregistrer</button>
            </div>
        </div>
    );
};

export default EditProfilePage;
