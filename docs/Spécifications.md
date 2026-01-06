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
* ReactJS (Vite + TypeScript)

### 3.2 Backend
* Node.js avec Express.js

### 3.3 Database
* MongoDB (Mongoose ODM)

<br/>

## API endpoints

| Method | Endpoint | Description | Security |
| :--- | :--- | :--- | :--- |
| **Authentification** | | | |
| `POST` | `/api/auth/register` | Créer un nouveau compte | Public |
| `POST` | `/api/auth/login` | Se connecter | Public |
| `POST` | `/api/auth/refresh` | Rafraîchir un token d'accès | Public |
| `POST` | `/api/auth/logout` | Se déconnecter | Authenticated (User) |
| `POST` | `/api/auth/change-password` | Changer de mot de passe | Authenticated (User) |
| **Profil utilisateur** | | | |
| `GET` | `/api/users/:id` | Obtenir un profil utilisateur | Public |
| `GET` | `/api/users/me` | Obtenir son profil utilisateur (+ d'infos que /:id) | Authenticated (User) |
| `PUT` | `/api/users/:id` | Modifier son profil | Authenticated (Owner) |
| **Events** | | | |
| `GET` | `/api/events` | Lister les annonces (filtres possibles) | Public |
| `POST` | `/api/events` | Créer une annonce | Authenticated (User) |
| `GET` | `/api/events/:id` | Voir détails d'une annonce | Public |
| `PUT` | `/api/events/:id` | Modifier une annonce | Authenticated (Owner) |
| `DELETE` | `/api/events/:id` | Supprimer une annonce | Authenticated (Owner/Admin) |
| `POST` | `/api/events/:id/attend` | Rejoindre/Quitter une annonce | Authenticated (User) |
| **Sports** | | | |
| `GET` | `/api/sports` | Lister les sports disponibles | Public |
| `POST` | `/api/sports` | Ajouter un nouveau sport | Authenticated (Admin) |
| `GET` | `/api/sports/:id` | Obtenir détails d'un sport | Public |
| **Chat** | | | |
| `GET` | `/api/chat` | Lister ses conversations | Authenticated (User) |
| `GET` | `/api/chat/:id` | Obtenir détails d'une conversation | Authenticated (Participant) |
| `POST` | `/api/chat/:userId` | Créer une conversation avec un user | Authenticated (User) |
| `PUT` | `/api/chat/:id` | Modifier une conversation (ex: lu) | Authenticated (Participant) |
| `GET` | `/api/chat/:id/messages` | Lister les messages d'une conv. | Authenticated (Participant) |
| `POST` | `/api/chat/:id/messages` | Envoyer un message | Authenticated (Participant) |


<br/>

## Modèles MongoDB

User 
```js
{
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },

	firstName: { type: String },
	lastName: { type: String },
	city: { type: String },
	sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" } ],
	bio: { type: String },
	birthdate: { type: Date },
	gender: { type: String, enum: ['Male', 'Female', 'Other'] },
	profilePicture: { type: String },
	role: { type: String, enum: ['user', 'admin'], default: 'user' },

	refreshToken: { type: String },
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}
```

Event
```js
{
    user : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    max: { type: Number },
    medias: [{ type: String }],
    attendees: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now }
    }],
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}
```

Sport
```js
{
    name: { type: String, required: true, unique: true },
    icon: { type: String },
}
```

Conversation
```js
{
    type : { type: String, enum: ['private', 'group'], required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    title: { type: String },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}
```

Message
```js
{
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    medias: [{ type: String }],
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}
```
