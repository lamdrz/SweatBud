import React, { useState } from 'react';
import styles from './EditProfilePage.module.css';
import profileStyles from './ProfilePage.module.css';
import backgroundImage from '../../assets/images/mountain-background.jpg';
import type { User } from '../../types/models';
import BackArrow from '../../components/ui/BackArrow';
import useApi from '../../hooks/useApi';
import Loading from '../../components/ui/Loading';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// AI-ASSISTED : Gemini 3 Pro
// Prompt : rend cette page fonctionnelle, appuyer sur modifier change le infoValue en input modifiable, le text modifier devient "enregistrer" et si ce texte est cliqué pointe sur PUT /me avec le champ et la nouvelle valeur (voir backend user controller)
// Modifications : Adaptation pour password (endpoint change password) + sports (multi select) + gender (select)
const EditProfilePage: React.FC = () => {
    // 1. Récupération des données (GET)
    const { data: user, loading, error, execute: refreshUser } = useApi<User>(`/users/me`);
    const { data: sportsList } = useApi<any[]>('/sports');

    // 2. Hook pour la mise à jour (PUT) - autoRun: false car déclenché manuellement
    const { execute: updateUser, loading: saving } = useApi(
        '/users/me', 
        { method: 'PUT', autoRun: false }
    );

    const navigate = useNavigate();

    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<any>(null);
    // On garde une erreur locale pour pouvoir la nettoyer facilement au changement de champ
    const [localSaveError, setLocalSaveError] = useState<string | null>(null);

    if (loading) return <Loading />;
    if (error) return <p>Erreur : {error.message}</p>;
    if (!user) return <p>Profil introuvable</p>;

    const defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

    const handleStartEditing = (field: string, value: any) => {
        setLocalSaveError(null);
        setEditingField(field);
        
        if (field === 'birthdate' && value) {
            setTempValue(new Date(value).toISOString().split('T')[0]);
        } else if (field === 'sports') {
            setTempValue(value ? value.map((s: any) => s._id) : []);
        } else {
            setTempValue(value || '');
        }
    };

    const handleCancelEditing = () => {
        setEditingField(null);
        setTempValue(null);
        setLocalSaveError(null);
    };

    const handleSave = async () => {
        if (!editingField) return;
        setLocalSaveError(null);

        try {
            // Appel via useApi
            await updateUser({
                field: editingField,
                value: tempValue
            });

            // Succès
            await refreshUser(); // Rafraîchir l'affichage
            setEditingField(null);
            setTempValue(null);
        } catch (err: any) {
            console.error("Erreur de sauvegarde:", err);
            setLocalSaveError(err.message || "Impossible de sauvegarder");
        }
    };

    const handleEditPassword = () => {
        navigate('/me/change-password');
    };

    const renderInfoItem = (label: string, fieldKey: string, valueDisplay: React.ReactNode, type: string = "text") => {
        const isEditing = editingField === fieldKey;

        return (
            <div className={styles.infoItem}>
                <div style={{ flex: 1 }}>
                    <div className={styles.infoLabel}>{label}</div>
                    
                    {isEditing ? (
                        <div className={styles.editContainer}>
                            {/* Gestion des types d'input */}
                            {fieldKey === 'bio' ? (
                                <textarea 
                                    className={`${styles.input} ${styles.editInput}`} 
                                    value={tempValue} 
                                    onChange={(e) => setTempValue(e.target.value)}
                                    rows={3}
                                />
                            ) : fieldKey === 'sports' ? (
                                <div className={`${styles.input} ${styles.sportsSelector}`}>
                                    {sportsList?.map(sport => (
                                        <label key={sport._id} className={styles.checkboxLabel}>
                                            <input 
                                                type="checkbox"
                                                className={styles.checkboxInput}
                                                checked={tempValue.includes(sport._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setTempValue([...tempValue, sport._id]);
                                                    } else {
                                                        setTempValue(tempValue.filter((id: string) => id !== sport._id));
                                                    }
                                                }}
                                            />
                                            <FontAwesomeIcon icon={sport.icon} /> {sport.name}
                                        </label>
                                    )) || <p>Chargement des sports...</p>}
                                </div>
                            ) : fieldKey === 'gender' ? (
                                <select
                                    className={`${styles.input} ${styles.editInput}`}
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                >
                                    <option value="">Sélectionner...</option>
                                    <option value="Male">Homme</option>
                                    <option value="Female">Femme</option>
                                    <option value="Other">Autre</option>
                                </select>
                            ) : (
                                <input 
                                    type={type} 
                                    className={`${styles.input} ${styles.editInput}`} 
                                    value={tempValue} 
                                    onChange={(e) => setTempValue(e.target.value)}
                                />
                            )}
                            
                            {localSaveError && <div className={styles.errorMessage}>{localSaveError}</div>}
                        </div>
                    ) : (
                        <div className={styles.infoValue}>{valueDisplay}</div>
                    )}
                </div>

                <div className={styles.actionBtns}>
                    {isEditing ? (
                        <>
                            <button className={`${styles.button} ${styles.saveBtn}`} onClick={(e) => { e.preventDefault(); handleSave(); }}>
                                {saving ? '...' : <FontAwesomeIcon icon="check" />}
                            </button>
                            <button className={`${styles.button} ${styles.cancelBtn}`} onClick={(e) => { e.preventDefault(); handleCancelEditing(); }}>
                                <FontAwesomeIcon icon="times" />
                            </button>
                        </>
                    ) : (
                        <button
                            className={`${styles.button} ${styles.editBtn}`} 
                            onClick={(e) => { 
                                e.preventDefault(); 
                                const val = fieldKey === 'sports' ? user.sports : (user as any)[fieldKey];
                                handleStartEditing(fieldKey, val); 
                            }}
                        >
                            modifier
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const genres = {
        'Male': 'Homme',
        'Female': 'Femme',
        'Other': 'Autre'
    }

    return (
        <div className={styles.editProfilePage}>
            <BackArrow />

            <div className={profileStyles.profileHeader}>
                <img src={backgroundImage} alt="background" className={profileStyles.backgroundImage} />
                <img 
                    src={user.profilePicture || defaultAvatar} 
                    alt="Profile" 
                    className={profileStyles.profilePicture} 
                />
            </div>

            <div className={`${profileStyles.profileContent} ${styles.editProfileContent}`}>
                <h1 className={profileStyles.username}>{user.username}</h1>

                <div className={styles.separator}></div>

                <div className={styles.infoSection}>
                    {renderInfoItem("Nom d'utilisateur", "username", user.username)}
                    {renderInfoItem("Email", "email", user.email, "email")}
                    
                    <div className={styles.infoItem}>
                        <div>
                            <div className={styles.infoLabel}>Mot de passe</div>
                            <div className={styles.infoValue}>************</div>
                        </div>
                        <button className={`${styles.button} ${styles.editBtn}`} onClick={handleEditPassword}>modifier</button>
                    </div>

                    {renderInfoItem("Prénom", "firstName", user.firstName || 'Non renseigné')}
                    {renderInfoItem("Nom", "lastName", user.lastName || 'Non renseigné')}
                    {renderInfoItem("Ville", "city", user.city || 'Non renseigné')}
                    {renderInfoItem("Bio", "bio", user.bio || 'Non renseigné')}
                    
                    {renderInfoItem(
                        "Date de naissance", 
                        "birthdate", 
                        user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'Non renseigné', 
                        "date"
                    )}
                    
                    { renderInfoItem("Genre", "gender", user.gender ? genres[user.gender] : 'Non renseigné')}

                    {renderInfoItem(
                        "Sports", 
                        "sports", 
                        user.sports && user.sports.length > 0 
                            ? user.sports.map(s => s.name).join(', ') 
                            : 'Aucun sport sélectionné'
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;