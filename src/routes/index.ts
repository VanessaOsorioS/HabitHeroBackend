import { Router } from "express";
import missionRoutes from "../modules/mission/mission.routes";

const router = Router();

router.use("/missions", missionRoutes);

export default router;
