import express from "express";
import { getAvatar, updateAvatar, initAvatar } from "./avatar.controller";

const router = express.Router();

router.get("/:userId", getAvatar);
router.put("/:userId", updateAvatar);
router.post("/init/:userId", initAvatar);

export default router;
