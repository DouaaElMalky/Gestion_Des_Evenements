import OrganisateurModel from "../models/Organisateur.js";
import bcrypt from "bcrypt";
export async function createOrganisateur(organisateur) {
  return await OrganisateurModel.create(organisateur);
}

export async function getAllOrganisateurs() {
  return await OrganisateurModel.find();
}

export async function getOrganisateurById(id) {
  return await OrganisateurModel.findById(id);
}
export async function updateOrganisateur(id, organisateur) {
  try {
    if (organisateur.mdp) {
      console.log("Mot de passe avant hashage :", organisateur.mdp); // Log avant
      organisateur.mdp = await bcrypt.hash(organisateur.mdp, 10);
      console.log("Mot de passe après hashage :", organisateur.mdp); // Log après
    }

    return await OrganisateurModel.findByIdAndUpdate(id, organisateur, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.error("Erreur dans updateOrganisateur :", error.message);
    throw new Error(error.message);
  }
}
export async function deleteOrganisateur(id) {
  return await OrganisateurModel.findByIdAndDelete(id);
}
