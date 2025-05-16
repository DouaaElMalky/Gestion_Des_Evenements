import * as ParticipantService from "../services/participant_service.js"

export async function getAllParticipants(req, res) {
  try {
    const participants = await ParticipantService.getAllParticipants();
    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}
export async function getParticipantById(req, res) {
  try {
    const participant = await ParticipantService.getParticipantById(req.user.id);
    if (!participant) return res.status(404).json({ message: "Participant non trouvé." });
    res.status(200).json(participant);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}
export async function createParticipant(req, res) {
  try {
    const newParticipant = await ParticipantService.createParticipant(req.body);
    res.status(201).json(newParticipant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export async function updateParticipant(req, res) {
  try {
    const updatedParticipant = await ParticipantService.updateParticipant(req.params.id, req.body);
    if (!updatedParticipant) return res.status(404).json({ message: "Participant non trouvé." });
    res.status(200).json(updatedParticipant);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export async function deleteParticipant(req, res) {
  try {
    const deletedParticipant = await ParticipantService.deleteParticipant(req.params.id);
    if (!deletedParticipant) return res.status(404).json({ message: "Participant non trouvé." });
    res.status(200).json({ message: "Participant supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}


// Récupérer les événements d'un participant connecté
export async function getParticipantEvents(req, res) {
  try {
    const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token
    console.log("User ID décodé :", userId); // Ajoutez ce log

    const events = await ParticipantService.getParticipantEvents(userId);

    console.log("Événements récupérés :", events); // Vérifiez les événements récupérés
    res.status(200).json(events);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error.message); // Log des erreurs
    res.status(500).json({ message: "Erreur serveur." });
  }
}


export async function inscrireParticipant(req, res) {
  try {
    // Récupérer l'ID du participant depuis le token
    const userId = req.user.id; // L'ID est stocké dans req.user grâce au middleware JWT

    // Récupérer l'ID de l'événement depuis la requête
    const { eventId, modeParticipation } = req.body;

    // Appelle la méthode dans le service
    const result = await ParticipantService.inscrireParticipant(eventId, userId, modeParticipation);

    // Retourne un message de confirmation
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export async function deleteEvent(req, res) {
  try {
    const userId = req.user.id; // Récupérer l'ID du participant depuis le token
    const { eventId } = req.params; // Récupérer l'ID de l'événement depuis les paramètres

    console.log("ID du participant :", userId); // Debug
    console.log("ID de l'événement :", eventId); // Debug

    // Supprimer l'événement de la liste des événements du participant
    await ParticipantService.deleteEvent(eventId, userId);

    res.status(200).json({ message: "Événement supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement :", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
} 