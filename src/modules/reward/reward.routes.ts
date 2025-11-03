import express from "express";
import {
  getAllRewardsController,
  getCoinAndXpRewards,
  calculateAndSaveReward,
} from "./reward.controller.js";

const router = express.Router();

router.get("/", getAllRewardsController);
router.get("/coin-xp", getCoinAndXpRewards);
router.post("/calculate", calculateAndSaveReward);

export default router;