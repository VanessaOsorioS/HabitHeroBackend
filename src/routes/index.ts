import express from "express";
import missionRoutes from "../modules/mission/mission.routes.js";
import rewardRoutes from "../modules/reward/reward.routes.js";

const router = express.Router();

router.use("/missions", missionRoutes);
router.use("/rewards", rewardRoutes);

export default router;