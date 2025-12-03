# INFO734 - Projet
# Spécifications

<br/>

## 1. Objectifs
### 1.1 Project idea and problem statement

Une application pour réunir des sportifs
Exemple : Une personne propose "Tour du lac en vélo demain à 14h", les autres personnes peuvent rejoindre l'activité.

### 1.2 Target user personas

Sportifs de tous niveaux, coachs sportifs, nouveaux dans une ville.

<br/>

## 2. List of functional requirements

### 2.1 Required Features
* User authentication with proper cryptography (password hashing with bcrypt or similar)
* Interactive data flow - data going from frontend to backend and back
* Database operations - Create, Read, Update, Delete (CRUD)
* Lightweight deployment - No gigabytes of data, should be easy for me to run

### 2.2 Utilisateurs
* Guest (non connecté) : consulter annonces publiques, s'inscrire (formulaire)
* User (connecté) : créer/éditer/supprimer ses propres annonces, s'inscrire/annuler inscription à des annonces, recevoir notifications, parcourir/filtrer/rechercher annonces existantes, envoyer des messages
* Admin (optionnel) : modération, suppression d'annonces, gestion utilisateurs 

### 2.3 Must-have features
* Création/édition/suppression d'annonces
* Inscription/désinscription à une annonce
* Recherche avancée
* Limiter nombre participants

### 2.4 Nice-to-have features
* Communication par message (style Leboncoin, Blablacar, ...)
* Adaptation mobile
* Charger tracé GPX
* Photos
* Refuser inscription (système de demande)
* Profil détaillé
* Notifications

<br/>

## 3. Technical requirements

### 3.1 Frontend
* ReactJS

### 3.1 Backend
* MongoDB
* Express.js

<br/>

## API endpoints

* Authentification
    * /api/auth/register
    * /api/auth/login
    * /api/auth/logout

* Profil utilisateur
    * /api/users
    * /api/users/:id

* Annonces
    * /api/events
    * /api/events/:id
    * /api/events/:id/attend
    * /api/events/:id/attendees

<br/>

## Modèles MongoDB

User 
```
{
    ...
}
```

Event
```
{
    ...
}
```