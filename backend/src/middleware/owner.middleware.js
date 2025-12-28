import Event from "../models/event.model.js";

// AI-ASSISTED : Copilot (modèle Gemini 3 Pro)
// Prompt : J'aimerais que seul le créateur d'un event puisse le modifier/supprimer, je ne comprends pas ce qui ne va pas avec mon middleware
// Output : lignes 13 à 17
// Modification : Adaptation pour POST
// Testé dans Postman et fonctionne correctement
export const isEventOwner = async (req, res, next) => {
    try {
        if (req.method === "POST") {
            // Pour la création, on vérifie que le user dans le body correspond à l'utilisateur connecté
            if (req.body.user !== req.user.id) {
                return res.status(403).json({ message: "You are not allowed to create an event for another user" });
            }
        }
        else {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            // On vérifie si l'utilisateur connecté (req.user.id) est bien le créateur (event.user)
            // Note: On utilise toString() car event.user est un ObjectId
            if (event.user.toString() !== req.user.id) {
                return res.status(403).json({ message: "You are not allowed to modify this event" });
            }
        }

        next();

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
