import mongoose from "mongoose";
import bcrypt from "bcrypt";
const participantSchema= new mongoose.Schema({
  nom:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Adresse email invalide."],
  },
  mdp:{
    type: String,
    required: true
  },
  evenements: [
    {
      evenementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // Référence au modèle Event
      },
      modeParticipation: {
        type: String,
        enum: ["présentiel", "en ligne"], // Valeurs autorisées
        required: true,
      },
    },
  ],
});
// Hashage du mot de passe avant l'enregistrement
participantSchema.pre("save", async function (next) {
  if (!this.isModified("mdp")) return next();
  this.mdp = await bcrypt.hash(this.mdp, 10);
  next();
});

const ParticipantModel=mongoose.model("Participant",participantSchema);
export default ParticipantModel;