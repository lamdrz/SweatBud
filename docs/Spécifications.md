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
* Guest (non connecté) : se connecter / s'inscrire (formulaire)
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
    * /api/auth/register POST
    * /api/auth/login POST
    * /api/auth/refresh !POST
    * /api/auth/logout POST

* Profil utilisateur
    * /api/users !!GET
    * /api/users/:id !GET, !PUT, !DELETE

* Annonces
    * /api/events GET, !POST 
    * /api/events/:id GET, !PUT, !DELETE
    * /api/events/:id/attend POST

* Sports
    * /api/sports/ GET, !!POST
    * /api/sports/:id GET

! Route protégée (ex: owner uniquement)<br/>
!! Role admin requis

<br/>

## Modèles MongoDB

User 
```
{
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },

	firstName: { type: String },
	lastName: { type: String },
	city: { type: String },
	sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],
	bio: { type: String },
	birthdate: { type: Date },
	gender: { type: String, enum: ['Male', 'Female', 'Other'] },
	profilePicture: { type: String },
	role: { type: String, enum: ['user', 'admin'], default: 'user' },

	refreshToken: { type: String },
	createdAt: { type: Date, default: Date.now },
}
```

Event
```
{
    user : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    max: { type: Number },
    medias: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
}
```

Sport
```
{
    name: { type: String, required: true, unique: true },
    icon: { type: String },
}
```