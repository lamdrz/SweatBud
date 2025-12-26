import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import styles from './ProfilePage.module.css';
import backgroundImage from '../../assets/images/mountain-background.jpg';
import type { Sport } from '../../types/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../../components/ui/Loading';

const ProfilePage: React.FC = () => {
    const { auth } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const currentUser = auth?.user; 
    const targetId = id || currentUser?.id;

    interface UserProfile {
        _id: string;
        username: string;
        city?: string;
        sports?: Sport[];
        bio?: string;
        age?: number;
        profilePicture?: string;
    }

    const { data: user, loading, error } = useApi<UserProfile>(targetId ? `/users/${targetId}` : '');

    if (loading) return <Loading />;
    if (error) { return <p>Erreur : {error.message}</p>}
    if (!user) {return <p>Utilisateur introuvable</p>}

    const isOwnProfile = currentUser?.id === user._id;
    const defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

    return (
        <div className={styles.profilePage}>

            <div className={styles.profileHeader}>
                <img src={backgroundImage} alt="background" className={styles.backgroundImage} />
                <img 
                    src={user.profilePicture || defaultAvatar} 
                    alt="Profile" 
                    className={styles.profilePicture} 
                />
            </div>
            
            <div className={styles.profileContent}>
                <h1 className={styles.username}>{user.username}</h1>

                <span className={styles.userInfos}>
                    { user.age && <span className={styles.value}>{user.age} ans</span> }

                    {user.age && user.city && <span className={styles.separator}>-</span>}

                    { user.city && 
                        <span className={styles.city}>
                            {/* <FontAwesomeIcon icon="map-pin" /> */}
                            {user.city}
                        </span> 
                    }
                </span>
                
                { user.sports && user.sports.length > 0 && 
                    <div className={styles.sports}>
                        {user.sports.map((sport: Sport) => (
                            sport.icon && <FontAwesomeIcon key={sport._id} icon={sport.icon} className={styles.sportIcon} />
                        ))}
                    </div>
                }

                { user.bio && <span className={styles.bio}>{user.bio}</span> }

                {isOwnProfile && (
                    <div className={styles.actions}>
                        <button className={`${styles.button} ${styles.editBtn}`} onClick={() => navigate('/me/edit')}>
                            <FontAwesomeIcon icon='pen' /> Modifier
                        </button>
                        <button className={`${styles.button} ${styles.logoutBtn}`} onClick={() => navigate('/logout')}>
                            <FontAwesomeIcon icon='sign-out-alt' /> Déconnexion
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
