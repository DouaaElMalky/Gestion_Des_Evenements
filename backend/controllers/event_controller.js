import * as EventService from "../services/event_service.js";
import mongoose from "mongoose";

export async function getAllEvents(req,res){
  try{
    const events = await EventService.getAllEvents();
    res.status(200).json(events);
  }catch(error){
    res.status(500).json({message : "Erreur serveur."});
  }
}

export async function getEventById(req, res) {
  try {
    console.log("ID reçu :", req.params.id); // Debug pour vérifier l'ID reçu

    // 1. Vérifie si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("ID invalide détecté."); // Debug
      return res.status(400).json({ message: "ID invalide." });
    }

    // 2. Appelle le service pour récupérer l'événement
    const event = await EventService.getEventById(req.params.id);

    console.log("Résultat de la recherche :", event); // Debug

    // 3. Vérifie si l'événement existe
    if (!event) {
      console.log("Événement non trouvé."); // Debug
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    // 4. Retourne l'événement trouvé
    res.status(200).json(event);

  } catch (error) {
    console.error("Erreur serveur :", error.message); // Debug des erreurs
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export async function createEvent(req,res){
  try {
    const newEvent= await EventService.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export async function updateEvent(req,res){
  try {
    const updatedEvent = await EventService.updateEvent(req.params.id, req.body);
    if (!updatedEvent) return res.status(404).json({ message: "Événement non trouvé." });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}
import EventModel from "../models/Event.js";
import ParticipantModel from "../models/Participant.js";

export async function deleteEvent(req, res) {
  try {
    const eventId = req.params.id; // ID de l'événement à supprimer

    // Vérifie si l'événement existe
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    // Supprimer l'événement de la liste des participants inscrits
    await ParticipantModel.updateMany(
      { evenementId: eventId }, // Filtrer les participants inscrits à cet événement
      { $pull: { evenementId: eventId } } // Supprimer l'événement de leur liste
    );

    // Supprimer l'événement de la base de données
    await EventModel.findByIdAndDelete(eventId);

    // Envoyer une confirmation
    res.status(200).json({ message: "Événement supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export async function getEventParticipants(req, res) {
  try {
    const participants = await EventService.getEventParticipants(req.params.id);
    res.status(200).json(participants);
    
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
  
}
export async function getEventStatistics(req, res) {
  try {
    const stats = await EventService.getEventStatistics(req.params.id);
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export async function getDashboard(req, res) {
  try {
    const dashboard = await EventService.getDashboard();
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export async function getEventStats(req, res) {
  try {
    const stats = await EventService.getAllEventStats(); // Récupère toutes les stats
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erreur serveur :", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
}
