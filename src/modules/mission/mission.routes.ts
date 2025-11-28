import { Router } from "express";
import { createMission, getAllMissions, getPendingMissions, completeMission } from "./mission.controller";

const router = Router();

router.post("/", createMission);
router.get("/", getAllMissions);
router.get("/pending", getPendingMissions);
router.post("/complete/:id", completeMission);

export default router;
