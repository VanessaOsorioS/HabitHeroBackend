import { Request, Response } from "express";
import { calculateRewards, createRewardForMission, getAllRewards } from "./reward.service.js";
import { RewardType } from "../../../generated/client/index.js";

/**
 * Obtener todas las recompensas
 */
export const getAllRewardsController = async (req: Request, res: Response) => {
  try {
    const rewards = await getAllRewards();
    return res.status(200).json(rewards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Obtener solo XP y COIN totales
 */
export const getCoinAndXpRewards = async (req: Request, res: Response) => {
  try {
    const rewards = await getAllRewards();

    const coinReward = rewards
      .filter((r: any) => r.rewardType === RewardType.COIN)
      .reduce((sum: number, r: any) => sum + r.value, 0);

    const xpReward = rewards
      .filter((r: any) => r.rewardType === RewardType.XP)
      .reduce((sum: number, r: any) => sum + r.value, 0);

    if (!coinReward && !xpReward) {
      return res.status(404).json({ message: "No XP or coin rewards found." });
    }

    return res.status(200).json({ coins: coinReward, xp: xpReward });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Calcular y guardar recompensa para una misión
 */
export const calculateAndSaveReward = async (req: Request, res: Response) => {
  try {
    const { missionId, ...missionData } = req.body;
    const rewards = calculateRewards(missionData);
    await createRewardForMission(missionId, rewards);
    res.status(201).json({
      message: "Recompensa calculada y guardada",
      data: rewards,
    });
  } catch (error) {
    console.error("Error calculando recompensa:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};