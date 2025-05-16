import OrganisateurModel from "../models/Organisateur.js";
import ParticipantModel from "../models/Participant.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function authenticateUser({email, mdp}){
  let user= await OrganisateurModel.findOne({email});
  let type = "organisateur";
  if (!user){
    user = await ParticipantModel.findOne({email});
    type = "participant";
  }
  if (!user){
    throw new Error("Utilisateur non trouvé");
  }
  const isMatch = await bcrypt.compare(mdp, user.mdp);
  if (!isMatch) {
    throw new Error("Mot de passe incorrect");
  }
  // 5. Générer un token JWT
  const token = jwt.sign(
    { id: user._id, email: user.email, type }, // Stocker le type dans le token
    process.env.JWT_SECRET, // Clé secrète dans .env
    { expiresIn: "2h" } // Expiration du token après 1 heure
  );

  // 6. Retourner le token, les informations utilisateur et le type
  return { token, user, type };
}

// Middleware d'authentification
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Format: Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded); // Vérification en console

    // Vérifiez si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(400).json({ message: "ID utilisateur invalide." });
    }

    req.user = decoded; // Ajouter l'utilisateur dans la requête
    next(); // Passe au middleware suivant
  } catch (err) {
    res.status(403).json({ message: "Token invalide." });
  }
}

export function isOrganisateur(req, res, next) {
  // Vérifie si l'utilisateur est authentifié
  if (!req.user) {
    return res.status(401).json({ message: "Accès non autorisé." });
  }

  // Vérifie le type d'utilisateur
  if (req.user.type !== "organisateur") {
    return res.status(403).json({ message: "Accès réservé aux organisateurs." });
  }

  // Passe au middleware suivant ou au contrôleur
  next();
}
