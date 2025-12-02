import { Router } from "express";
import missionRoutes from "../modules/mission/mission.routes";
import authRoutes from "../modules/auth/auth.routes";
import avatarRoutes from "../modules/avatar/avatar.routes";
import rewardRoutes from "../modules/reward/reward.route";

const router = Router();

router.use("/mission", missionRoutes);
router.use("/auth", authRoutes);
router.use("/avatar", avatarRoutes);
router.use("/reward", rewardRoutes);

export default router;
