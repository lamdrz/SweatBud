import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import styles from './ProfilePage.module.css';
import actionStyles from '../../components/ui/UI.module.css';
import backgroundImage from '../../assets/images/mountain-background.jpg';
import type { Sport, UserProfile } from '../../types/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../../components/ui/Loading';
import ActionMenu from '../../components/ui/ActionMenu';
import EventsList from '../../components/events/EventsList';
import BackArrow from '../../components/ui/BackArrow';

const ProfilePage: React.FC = () => {
    const { auth } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [byUser, setByUser] = useState<boolean>(true);

    const { logout } = useAuth();
      const [logoutLoading, setLogoutLoading] = useState(false);
    
      const handleLogout = async () => {
        setLogoutLoading(true);
        try {
          await logout();
        } catch  {
          console.error("Failed to logout");
        } finally {
          setLogoutLoading(false);
        }
      }
    
    const currentUser = auth?.user; 
    const targetId = id || currentUser?.id;

    const { data: user, loading, error } = useApi<UserProfile>(targetId ? `/users/${targetId}` : '');

    if (loading) return <Loading />;
    if (error) { return <p>Erreur : {error.message}</p>}
    if (!user) {return <p>Utilisateur introuvable</p>}

    const isOwnProfile = currentUser?.id === user._id;
    const defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

    return (
        <div className={styles.profilePage}>

            <BackArrow destination={-1} />

            <ActionMenu>
            {isOwnProfile ? <>
                <button className={`${actionStyles.button}`} 
                    onClick={() => navigate('/me/edit')}>
                    <FontAwesomeIcon icon='pen' /> Modifier
                </button>
                <button className={`${actionStyles.button} ${actionStyles.redBtn}`} 
                    onClick={handleLogout} disabled={logoutLoading}>
                    <FontAwesomeIcon icon='sign-out-alt' /> { logoutLoading ? 'Déconnexion...' : 'Déconnexion' }
                </button></>
            :
                <button className={`${actionStyles.button} ${actionStyles.redBtn}`} 
                    onClick={() => console.log('Report user')}>
                    <FontAwesomeIcon icon='flag' /> Signaler
                </button>
            }
            </ActionMenu>

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

                <div className={styles.eventsToggle}>
                    <div 
                        className={`${styles.toggleBtn} ${byUser ? styles.toggleBtnActive : ''}`} 
                        onClick={() => setByUser(true)}>
                        Événements créés
                    </div>
                    <div 
                        className={`${styles.toggleBtn} ${!byUser ? styles.toggleBtnActive : ''}`} 
                        onClick={() => setByUser(false)}>
                        Événements participés
                    </div>
                </div>

                <div className={styles.eventsList}>
                    {byUser ? <EventsList filters={{ creator: user._id }} /> :
                        <EventsList filters={{ attendee: user._id }} />
                    }
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
