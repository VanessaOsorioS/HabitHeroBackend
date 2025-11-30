import express from "express";
import { getAvatar, updateAvatar, initAvatar } from "./avatar.controller";

const router = express.Router();

router.get("/", getAvatar);
router.put("/", updateAvatar);
router.post("/init", initAvatar);

export default router;