import express from "express";
import * as ParticipantController from "../controllers/participant_controller.js";
import { authMiddleware } from "../services/auth_service.js";
const router = express.Router();

//Pas besoin d'authentification
router.post("/", ParticipantController.createParticipant);

//Authentification nécessaire avec JWT
router.get("/", authMiddleware, ParticipantController.getAllParticipants); 
router.get("/me", authMiddleware, ParticipantController.getParticipantById); 
router.put("/:id", authMiddleware, ParticipantController.updateParticipant); 
router.delete("/:id", authMiddleware, ParticipantController.deleteParticipant); 
router.get("/events", authMiddleware, ParticipantController.getParticipantEvents); 
router.post("/inscrire", authMiddleware, ParticipantController.inscrireParticipant);
router.delete("/events/:eventId", authMiddleware, ParticipantController.deleteEvent);


export default router;