import express from "express";
import * as organisateurController from "../controllers/organisateur_controller.js";
import { authMiddleware } from "../services/auth_service.js";

const router = express.Router();

router.post("/", organisateurController.createOrganisateur); 
router.get("/", authMiddleware, organisateurController.getAllOrganisateurs); 
router.put("/:id", authMiddleware, organisateurController.updateOrganisateur);
router.get("/:id", authMiddleware, organisateurController.getOrganisateurById); 
router.delete("/:id", authMiddleware, organisateurController.deleteOrganisateur); 

export default router;
