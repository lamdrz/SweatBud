import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.model.js";
import Sport from "./models/sport.model.js";
import Event from "./models/event.model.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";

// AI-ASSISTED : Gemini 3 Pro
// Prompt : Génère moi des données de mockup basées sur mes models pour que je puisse tester l'appli
export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(
        "⚠️ La base de données contient déjà des données. Seeding ignoré."
      );
      return;
    }

    console.log("🌱 Démarrage du seeding MASSIF...");

    // ---------------------------------------------------------
    // 1. SPORTS (10 sports)
    // ---------------------------------------------------------
    const sportsData = [
      { name: "Course à pied", icon: "person-running" },
      { name: "Football", icon: "soccer-ball" },
      { name: "Tennis", icon: "table-tennis-paddle-ball" },
      { name: "Yoga", icon: "yin-yang" },
      { name: "Escalade", icon: "mountain" },
      { name: "Basketball", icon: "basketball-ball" },
      { name: "Natation", icon: "swimmer" },
      { name: "Cyclisme", icon: "bicycle" },
      { name: "Musculation", icon: "dumbbell" },
      { name: "Randonnée", icon: "hiking" },
    ];
    const createdSports = await Sport.insertMany(sportsData);
    console.log(`✅ ${createdSports.length} Sports créés`);

    // Helper pour trouver un sport
    const getSportId = (name) => createdSports.find((s) => s.name === name)._id;

    // ---------------------------------------------------------
    // 2. UTILISATEURS (8 users + 1 admin)
    // ---------------------------------------------------------
    const password = await bcrypt.hash("password123", 10);

    const usersData = [
      {
        username: "alice",
        email: "alice@test.com",
        password,
        firstName: "Alice",
        lastName: "Dubois",
        city: "Paris",
        sports: [
          getSportId("Course à pied"),
          getSportId("Yoga"),
          getSportId("Tennis"),
        ],
        gender: "Female",
        bio: "J'adore courir le matin !",
        birthdate: new Date("1995-05-20"),
      },
      {
        username: "bob",
        email: "bob@test.com",
        password,
        firstName: "Bob",
        lastName: "Martin",
        city: "Lyon",
        sports: [getSportId("Football"), getSportId("Musculation")],
        gender: "Male",
        bio: "Toujours chaud pour un foot.",
        birthdate: new Date("1992-08-15"),
      },
      {
        username: "charlie",
        email: "charlie@test.com",
        password,
        firstName: "Charlie",
        lastName: "Chaplin",
        city: "Marseille",
        sports: [getSportId("Natation"), getSportId("Randonnée")],
        gender: "Male",
        bio: "Amoureux de la nature et des calanques.",
        birthdate: new Date("1988-12-01"),
      },
      {
        username: "diane",
        email: "diane@test.com",
        password,
        firstName: "Diane",
        lastName: "Prince",
        city: "Paris",
        sports: [getSportId("Musculation"), getSportId("Escalade")],
        gender: "Female",
        bio: "Wonder Woman incognito.",
        birthdate: new Date("1990-03-30"),
      },
      {
        username: "enzo",
        email: "enzo@test.com",
        password,
        firstName: "Enzo",
        lastName: "Ferrari",
        city: "Lyon",
        sports: [getSportId("Cyclisme"), getSportId("Football")],
        gender: "Male",
        bio: "Rapide comme l'éclair.",
        birthdate: new Date("1998-07-22"),
      },
      {
        username: "fanny",
        email: "fanny@test.com",
        password,
        firstName: "Fanny",
        lastName: "Ardant",
        city: "Bordeaux",
        sports: [getSportId("Yoga"), getSportId("Natation")],
        gender: "Female",
        bio: "Zen attitude.",
        birthdate: new Date("1985-11-10"),
      },
      {
        username: "greg",
        email: "greg@test.com",
        password,
        firstName: "Greg",
        lastName: "Lemond",
        city: "Nice",
        sports: [getSportId("Cyclisme"), getSportId("Randonnée")],
        gender: "Male",
        bio: "Le vélo c'est la vie.",
        birthdate: new Date("1993-02-14"),
      },
      {
        username: "heidi",
        email: "heidi@test.com",
        password,
        firstName: "Heidi",
        lastName: "Klum",
        city: "Paris",
        sports: [getSportId("Musculation"), getSportId("Basketball")],
        gender: "Female",
        bio: "Sportive et motivée.",
        birthdate: new Date("1996-06-06"),
      },
      {
        username: "admin",
        email: "admin@sweatbud.com",
        password,
        firstName: "Super",
        lastName: "Admin",
        city: "Cloud",
        role: "admin",
        bio: "Je gère tout ici.",
      },
    ];

    const createdUsers = await User.insertMany(usersData);
    console.log(`✅ ${createdUsers.length} Utilisateurs créés`);

    // Map des users pour accès facile : users.alice._id
    const users = {};
    createdUsers.forEach((u) => (users[u.username] = u));

    // ---------------------------------------------------------
    // 3. ÉVÉNEMENTS (Mixte Passé/Futur/Complet)
    // ---------------------------------------------------------
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);

    const eventsData = [
      // --- PARIS ---
      {
        user: users.alice._id,
        title: "Running aux Tuileries",
        sport: getSportId("Course à pied"),
        location: "Jardin des Tuileries, Paris",
        date: tomorrow,
        description: "Petit footing de 45min avant le boulot.",
        max: 5,
        attendees: [
          { user: users.alice._id },
          { user: users.diane._id },
          { user: users.heidi._id },
        ],
      },
      {
        user: users.diane._id,
        title: "Session Escalade Bloc",
        sport: getSportId("Escalade"),
        location: "Arkose Nation, Paris",
        date: nextWeek,
        description: "Niveau intermédiaire, on va grimper du rouge !",
        max: 4,
        attendees: [{ user: users.diane._id }, { user: users.alice._id }],
      },
      // Event Passé (Paris)
      {
        user: users.heidi._id,
        title: "Basket 3vs3 (Terminé)",
        sport: getSportId("Basketball"),
        location: "Terrain Stalingrad, Paris",
        date: lastWeek,
        description: "C'était sympa !",
        max: 6,
        attendees: [
          { user: users.heidi._id },
          { user: users.alice._id },
          { user: users.diane._id },
        ],
      },

      // --- LYON ---
      {
        user: users.bob._id,
        title: "Foot 5 - Urban Soccer",
        sport: getSportId("Football"),
        location: "Urban Soccer, Lyon Parilly",
        date: nextWeek,
        description: "Gros match en perspective. Niveau moyen/bon.",
        max: 10,
        // Event presque complet
        attendees: [
          { user: users.bob._id },
          { user: users.enzo._id },
          { user: users.charlie._id },
          { user: users.greg._id },
          { user: users.alice._id }, // Alice est venue à Lyon pour le week-end !
        ],
      },
      {
        user: users.enzo._id,
        title: "Sortie Vélo Monts d'Or",
        sport: getSportId("Cyclisme"),
        location: "Lyon Centre",
        date: nextMonth,
        description: "60km, 800m D+. Faut des jambes !",
        max: 10,
        attendees: [{ user: users.enzo._id }, { user: users.greg._id }],
      },

      // --- MARSEILLE & AUTRES ---
      {
        user: users.charlie._id,
        title: "Nage en eau libre",
        sport: getSportId("Natation"),
        location: "Plage du Prado, Marseille",
        date: tomorrow,
        description: "L'eau est un peu fraîche mais ça réveille.",
        max: 5,
        attendees: [{ user: users.charlie._id }],
      },
      {
        user: users.fanny._id,
        title: "Yoga au coucher du soleil",
        sport: getSportId("Yoga"),
        location: "Miroir d'eau, Bordeaux",
        date: nextWeek,
        description: "Apportez votre tapis.",
        max: 20,
        attendees: [{ user: users.fanny._id }],
      },
    ];

    const createdEvents = await Event.insertMany(eventsData);
    console.log(`✅ ${createdEvents.length} Événements créés`);

    // ---------------------------------------------------------
    // 4. CONVERSATIONS & MESSAGES
    // ---------------------------------------------------------

    // -- Conv 1: Privée Alice & Bob --
    const convPrivate = await Conversation.create({
      type: "private",
      members: [users.alice._id, users.bob._id],
    });
    const msgsPrivate = await Message.insertMany([
      {
        conversation: convPrivate._id,
        sender: users.bob._id,
        text: "Salut Alice, tu descends à Lyon bientôt ?",
      },
      {
        conversation: convPrivate._id,
        sender: users.alice._id,
        text: "Oui ! Je viens pour le foot la semaine pro !",
      },
    ]);
    convPrivate.lastMessage = msgsPrivate[1]._id;
    await convPrivate.save();

    // -- Conv 2: Groupe "Team Foot Lyon" --
    const convGroup = await Conversation.create({
      type: "group",
      title: "Team Foot Lyon ⚽",
      groupAdmin: users.bob._id,
      members: [
        users.bob._id,
        users.enzo._id,
        users.greg._id,
        users.charlie._id,
      ],
    });
    const msgsGroup = await Message.insertMany([
      {
        conversation: convGroup._id,
        sender: users.bob._id,
        text: "Les gars, il manque un joueur pour mardi !",
      },
      {
        conversation: convGroup._id,
        sender: users.enzo._id,
        text: "Je demande à mon frère.",
      },
      {
        conversation: convGroup._id,
        sender: users.greg._id,
        text: "Moi je suis opé.",
      },
    ]);
    convGroup.lastMessage = msgsGroup[2]._id;
    await convGroup.save();

    console.log("🚀 Seeding terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error);
  }
};
