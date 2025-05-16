import EventModel from "../models/Event.js";
import ParticipantModel from "../models/Participant.js";

export async function getAllEvents(){
  return await EventModel.find();
}
export async function getEventById(id){
  return await EventModel.findById(id);
}
export async function createEvent(event){
  return await EventModel.create(event);
}
export async function updateEvent(id, event) {
  return await EventModel.findByIdAndUpdate(id, event, {
    new: true, 
    runValidators: true,
  });
}
export async function deleteEvent(id){
  return await EventModel.findByIdAndDelete(id);
}
export async function getEventParticipants(id){
  const event = await EventModel.findById(id).populate("listeParticipants");
  return event ? event.listeParticipants : [];
}
export async function getEventStatistics(eventId) {
  // Vérifie si l'événement existe
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new Error("Événement non trouvé.");
  }

  // Calculer les statistiques
  const totalParticipants = event.listeParticipants.length;

  return {
    evenement: event.nom,
    mode: event.mode, // "En ligne" ou "Présentiel"
    totalParticipants,
  };
}
export async function getDashboard() {
  // Récupérer tous les événements
  const events = await EventModel.find();

  // Construire les statistiques simplifiées pour chaque événement
  const stats = events.map(event => ({
    nom: event.nom,
    mode: event.mode,
    totalParticipants: event.listeParticipants.length
  }));

  return stats; // Retourne uniquement les informations demandées
}

export async function getAllEventStats() {
  const events = await EventModel.find().populate("listeParticipants");

  const stats = events.map((event) => {
    // Calcul des participants par mode
    const modeCounts = event.listeParticipants.reduce(
      (acc, participant) => {
        participant.evenements.forEach((e) => {
          if (e.evenementId.toString() === event._id.toString()) {
            if (e.modeParticipation === "présentiel") acc.presentiel += 1;
            if (e.modeParticipation === "en ligne") acc.enLigne += 1;
          }
        });
        return acc;
      },
      { presentiel: 0, enLigne: 0 }
    );

    return {
      id: event._id,
      name: event.nom,
      date: event.date,
      link: event.lien,
      totalParticipants: event.listeParticipants.length,
      presentiel: modeCounts.presentiel,
      enLigne: modeCounts.enLigne,
    };
  });

  return stats; // Retourne toutes les statistiques
}
