import { Router } from "express";
import missionRoutes from "../modules/mission/mission.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.use("/missions", missionRoutes);
router.use("/auth", authRoutes);

export default router;
