import { Router } from "express";
import { createMission, getAllMissions, getPendingMissions, completeMission } from "./mission.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createMission);
router.get("/", authMiddleware, getAllMissions);
router.get("/pending", authMiddleware, getPendingMissions);
router.post("/complete/:id", authMiddleware, completeMission);

export default router;
