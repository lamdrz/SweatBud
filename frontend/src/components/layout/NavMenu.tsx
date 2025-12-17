import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavMenu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faPlusCircle, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';

const NavMenu: React.FC = () => {
  return (
    <nav className={styles.navMenu}>
      <div className={styles.navItems}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon={faHome} size="lg" />
          <span className={styles.linkText}>Accueil</span>
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon={faComments} size="lg" />
          <span className={styles.linkText}>Messages</span>
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon={faPlusCircle} size="lg" />
          <span className={styles.linkText}>Ajouter</span>
        </NavLink>
        <NavLink to="/map" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon={faLocationDot} size="lg" />
          <span className={styles.linkText}>Carte</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon={faUser} size="lg" />
          <span className={styles.linkText}>Profil</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default NavMenu;
