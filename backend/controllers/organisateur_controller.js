import * as organisateurService from "../services/organisateur_service.js";

export async function createOrganisateur(req, res) {
  try {
    const newOrganisateur = await organisateurService.createOrganisateur(req.body);
    res.status(201).json(newOrganisateur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllOrganisateurs(req, res) {
  try {
    const organisateurs = await organisateurService.getAllOrganisateurs();
    res.status(200).json(organisateurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export async function getOrganisateurById(req, res) {
  try {
    const organisateur = await organisateurService.getOrganisateurById(req.params.id);
    if (!organisateur) return res.status(404).json({ message: "Organisateur non trouvé." });
    res.status(200).json(organisateur);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}
export async function updateOrganisateur(req, res) {
  try {
    const updatedOrganisateur = await organisateurService.updateOrganisateur(req.params.id, req.body);
    if (!updatedOrganisateur) return res.status(404).json({ message: "Organisateur non trouvé." });
    res.status(200).json(updatedOrganisateur);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}
export async function deleteOrganisateur(req, res) {
  try {
    const deletedOrganisateur = await organisateurService.deleteOrganisateur(req.params.id);
    if (!deletedOrganisateur) return res.status(404).json({ message: "Organisateur non trouvé." });
    res.status(200).json({ message: "Organisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}
