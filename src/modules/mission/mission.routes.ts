import { Router } from "express";
import { createMission, getAllMissions } from "./mission.controller.js";

const router = Router();

router.post("/", createMission);
router.get("/", getAllMissions);

export default router;
