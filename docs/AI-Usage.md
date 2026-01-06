# AI Usage Statement - SweatBud

Team: AMOUDRUZ Louis Date: 07/01/2026

## Declaration

We acknowledge the use of generative AI tools in this project as detailed below. All AI-generated code was reviewed, tested, and understood before integration.

## AI Tools Used

### Tool 1: GitHub Copilot (Chat & Autocomplete)

Date(s): Tout au long du projet Purpose: Autocompletion, Migration JS vers TS, Boilerplate code, CSS foundation.

**Prompt 1 (Frontend Architecture):**

    "Salut, j'essaie de connecter mon frontend react à mon api, j'aimerais faire une hook useApi qui accède à l'api avec un système de refresh token et un hook useAuth, avec login, register, logout"

**AI Output:** Un squelette complet pour le contexte d'authentification et les hooks personnalisés.

**My Modifications:** Adaptation de la gestion des cookies (option secure rendue dépendante de l'environnement de prod/dev). Sécurisation du stockage des tokens. Intégration spécifique avec mes routes backend existantes.

**Verification:** Tests manuels des flux de connexion/déconnexion et vérification de la persistance de la session après rafraîchissement de la page.

**Prompt 2 (Migration & Refactoring):**

    "Salut, transforme ce code : [code js ancien projet] en typescript et adapte le à mon application"

**AI Output:** Conversion des types et interfaces TypeScript.

**My Modifications:** Correction des types any restants pour un typage strict. Ajustement des interfaces pour correspondre exactement aux modèles de données de SweatBud.

**Prompt 3 (CSS - Limitation):**

    "Salut, tu peux me faire le style de la page ... suivant la maquette ci-jointe stp"

**AI Output:** Un code CSS générique, visuellement éloigné de la maquette et peu responsive.

**My Modifications:** J'ai dû réécrire environ 80% du CSS pour coller à la maquette Figma (alignements, spacing, couleurs exactes). L'IA a seulement servi à poser la structure de base des flexbox.

**What I learned:** Copilot est excellent pour la logique (Hooks, TS) et la sécurité (proposer bcrypt en asynchrone), mais médiocre pour le design visuel précis. J'ai aussi appris à gérer les warnings ESLint plus rapidement grâce aux suggestions.

### Tool 2: Gemini 3 Pro

**Date(s):** Phase de débogage et Refactoring Backend Purpose: Compréhension d'erreurs complexes et architecture backend.

**Prompt:**

    "À la manière de auth, refactor tous les controllers en créant des fonctions dans un fichier service dédié"

**AI Output:** Une réécriture propre du code : séparation de la logique métier (Services) et de la gestion des requêtes HTTP (Controllers).

**My Modifications:** Très peu de modifications nécessaires sur le code généré, l'architecture proposée suivait parfaitement le pattern demandé. J'ai uniquement ajusté quelques noms de variables pour la cohérence.

**Verification:** Test de tous les endpoints via Postman pour s'assurer que le refactoring n'avait pas cassé la logique existante.

**What I learned:** J'ai tenté d'utiliser Gemini pour comprendre pourquoi une jointure SQL/Mongo ne marchait pas. L'IA n'a pas trouvé la solution car le problème ne venait pas du code (qui était correct), mais d'un ID orphelin dans la base de données. Leçon apprise : L'IA ne peut pas debugger l'état de mes données, seulement ma logique.

## Code Attribution

All AI-assisted code sections are marked in source with comments:

Example:
```js
// AI-ASSISTED: ChatGPT helped debug this authentication middleware
// Prompt: "Why is bcrypt.compare always returning false?"
// Modification: Implemented suggested async/await pattern
async function authenticateUser(req, res, next) {
    // ... code here
}
```

## Overall Assessment

**Percentage of project written by AI:** ~25% (Principalement du boilerplate, des types TS et des structures de base)

**Percentage of project written by team:** ~75% (Logique métier complexe, correction du CSS, intégration finale, débogage des données, architecture globale)

**How AI enhanced learning:** L'IA a agi comme un tuteur senior

1. **Sécurité :** Elle a suggéré des pratiques standards (comme l'utilisation asynchrone de bcrypt ou la gestion conditionnelle des cookies secure) que j'aurais pu oublier.

2. **TypeScript :** La conversion de mon ancien code JS en TS via l'IA m'a aidé à comprendre comment typer correctement des hooks React complexes.

3. **Productivité :** La génération de "Mock Data" m'a permis de tester l'application avec du contenu réaliste sans perdre 2 heures à remplir la BDD à la main.