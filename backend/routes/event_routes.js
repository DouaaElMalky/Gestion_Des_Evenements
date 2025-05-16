import express from "express";
import * as EventController from "../controllers/event_controller.js";
import { authMiddleware, isOrganisateur } from "../services/auth_service.js";

const router = express.Router();
router.get("/dashboard", authMiddleware, isOrganisateur, EventController.getDashboard);
router.get("/stats", authMiddleware, isOrganisateur, EventController.getEventStats);

// Routes protégées par authMiddleware
router.get("/", authMiddleware, EventController.getAllEvents); 
router.get("/:id", authMiddleware, EventController.getEventById); 
router.post("/", authMiddleware, isOrganisateur, EventController.createEvent); 
router.put("/:id", authMiddleware, isOrganisateur, EventController.updateEvent); 
router.delete("/:id", authMiddleware, isOrganisateur, EventController.deleteEvent); 
router.get("/:id/participants", authMiddleware, isOrganisateur, EventController.getEventParticipants); 
router.get("/:id/statistics", authMiddleware, isOrganisateur, EventController.getEventStatistics);

export default router;
