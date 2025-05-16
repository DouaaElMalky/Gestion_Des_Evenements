import express from "express";
import * as AuthController from "../controllers/auth_controller.js";

const router = express.Router();

router.post("/login", AuthController.login); 

export default router;
