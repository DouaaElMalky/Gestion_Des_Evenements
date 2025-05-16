import mongoose from "mongoose";
import bcrypt from "bcrypt";
const organisateurSchema= new mongoose.Schema({
  nom:{
    type:String,
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
  }
});
// Hashage du mot de passe avant l'enregistrement
organisateurSchema.pre("save", async function (next) {
  if (!this.isModified("mdp")) return next();
  this.mdp = await bcrypt.hash(this.mdp, 10);
  next();
});

const OrganisateurModel=mongoose.model("Organisateur",organisateurSchema);
export default OrganisateurModel;