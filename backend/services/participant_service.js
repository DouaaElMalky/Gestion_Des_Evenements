import ParticipantModel from "../models/Participant.js";
import EventModel from "../models/Event.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function getAllParticipants(){
  return await ParticipantModel.find();
}
export async function getParticipantById(id) {
  const objectId = new mongoose.Types.ObjectId(id); // Conversion en ObjectId
  return await ParticipantModel.findById(objectId);
}
export async function createParticipant(participant){
  return await ParticipantModel.create(participant);
}
export async function updateParticipant(id, participant) {
    // Hashage du mot de passe uniquement s'il est fourni
    if (participant.mdp) {
      participant.mdp = await bcrypt.hash(participant.mdp, 10);
    }

    // Mise à jour partielle avec retour de la nouvelle version
    return await ParticipantModel.findByIdAndUpdate(id, participant, {
      new: true, // Retourne la version mise à jour
      runValidators: true, // Vérifie les validations
    });

}
export async function deleteParticipant(id) {
  // Vérifie si le participant existe
  const participant = await ParticipantModel.findById(id);
  if (!participant) {
    throw new Error("Participant non trouvé.");
  }

  // Supprimer l'ID du participant de tous les événements
  await EventModel.updateMany(
    { listeParticipants: id }, // Cherche tous les événements contenant cet ID
    { $pull: { listeParticipants: id } } // Supprime l'ID de la liste
  );

  // Supprime le participant
  return await ParticipantModel.findByIdAndDelete(id);
}
export async function getParticipantEvents(id) {
  const objectId = new mongoose.Types.ObjectId(id);

  const participant = await ParticipantModel.findById(objectId).populate("evenements.evenementId");

  if (!participant) {
    throw new Error("Participant non trouvé.");
  }
  return participant.evenements;
}

export async function inscrireParticipant(eventId, userId, modeParticipation) {
  // Vérifie si l'événement existe
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new Error("Événement non trouvé.");
  }

  // Vérifie si le participant existe
  const participant = await ParticipantModel.findById(userId);
  if (!participant) {
    throw new Error("Participant non trouvé.");
  }
   // Validation du modeParticipation
   const validModes = ["présentiel", "en ligne"];
   if (!validModes.includes(modeParticipation)) {
     throw new Error("Mode de participation invalide.");
   }

  const isAlreadyRegistered = participant.evenements.some(
    (e) => e.evenementId.toString() === eventId // Comparaison des IDs sous forme de chaîne
  );
  if (isAlreadyRegistered) {
    throw new Error("Vous êtes déjà inscrit à cet événement.");
  }
  

  // Mise à jour du participant pour ajouter l'événement
  await ParticipantModel.findByIdAndUpdate(userId, {
    $push: {
      evenements: {
        evenementId: eventId,
        modeParticipation,
      },
    },
  });

  // Mise à jour de l'événement pour ajouter le participant
  await EventModel.findByIdAndUpdate(eventId, {
    $push: { listeParticipants: userId },
  });

  return { message: "Inscription réussie." };
}
export async function deleteEvent(eventId, userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId); // Conversion en ObjectId
  const eventObjectId = new mongoose.Types.ObjectId(eventId); // Conversion en ObjectId

  // Vérifie si le participant existe
  const participant = await ParticipantModel.findById(userObjectId);
  if (!participant) {
    throw new Error("Participant non trouvé.");
  }

  // Vérifie si l'événement existe
  const event = await EventModel.findById(eventObjectId);
  if (!event) {
    throw new Error("Événement non trouvé.");
  }

  // Retirer l'événement du participant
  await ParticipantModel.findByIdAndUpdate(userObjectId, {
    $pull: { evenements: { evenementId: eventId } },
  });

  // Retirer le participant de l'événement
  await EventModel.findByIdAndUpdate(eventObjectId, {
    $pull: { listeParticipants: userObjectId },
  });

  return { message: "Événement supprimé avec succès." };
}
