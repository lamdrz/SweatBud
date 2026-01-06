import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavMenu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../../public/logo.svg';

const NavMenu: React.FC = () => {
  return (
    <nav className={styles.navMenu}>
      <img className={styles.logo} src={logo} alt="SweatBud"/>
      <div className={styles.navItems}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon='home' size="lg" />
          <span className={styles.linkText}>Accueil</span>
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon='comments' size="lg" />
          <span className={styles.linkText}>Messages</span>
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon='plus-circle' size="lg" />
          <span className={styles.linkText}>Ajouter</span>
        </NavLink>
        <NavLink to="/map" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon='location-dot' size="lg" />
          <span className={styles.linkText}>Carte</span>
        </NavLink>
        <NavLink to="/me" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
          <FontAwesomeIcon icon='user' size="lg" />
          <span className={styles.linkText}>Profil</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default NavMenu;
