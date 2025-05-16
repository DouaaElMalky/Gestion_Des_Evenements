import mongoose from "mongoose";

const eventSchema= new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  lien: {
    type: String,
  },
  listeParticipants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Participant"
  }]
});
// Middleware pour vérifier le lien avant d'enregistrer
eventSchema.pre("save", function (next) {
  if (this.mode === "En ligne" && !this.lien) {
    const err = new Error("Un lien est requis pour les événements en ligne !");
    return next(err); // Bloque l'enregistrement si aucun lien n'est fourni
  } else if (this.mode === "Présentiel") {
    this.lien = ""; // Vide automatiquement le lien si l'événement est en présentiel
  }
  next();
});
const EventModel= mongoose.model("Event",eventSchema);
export default EventModel;