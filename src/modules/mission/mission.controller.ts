import { Request, Response } from "express";
import * as missionService from "./mission.service";
import { MissionState, RewardType } from "../../../generated/prisma";
import { calculateRewards } from "./mission.helper";
import { createReward } from "../reward/reward.service";

export const createMission = async (req: Request, res: Response) => {
  const {
    title,
    description,
    type, dueDate,
    durationMinutes,
    category,
    priority,
    difficulty,
    daily,
    reminderEnabled,
    userId } = req.body;

    const userIdFromToken = (req as any).userId;

  try {
    const mission = await missionService.createMission({
      title,
      description,
      type,
      dueDate,
      durationMinutes,
      category,
      priority,
      difficulty,
      daily,
      reminderEnabled,
      userId: userIdFromToken
    });

    if (!mission) {
      return res.status(500).json({ message: "Error creating mission." });
    }

    await missionService.createMissionStatusHistory({
      missionId: mission.id,
      status: MissionState.PENDING,
      date: new Date()
    });

    return res.status(201).json({
      message: "Mission created successfully",
      data: mission,
    });
  } catch (error) {
    console.error("Error creating mission:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllMissions = async (_req: Request, res: Response) => {
  try {
    const userId = (_req as any).userId;
    const missions = await missionService.getAllMissions(userId);
    return res.status(200).json({ data: missions });
  } catch (error) {
    console.error("Error fetching missions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPendingMissions = async (_req: Request, res: Response) => {
  try {
    const userId = (_req as any).userId;
    const missions = await missionService.getAllMissions(userId);

    const pending = missions.filter(
      mission =>
        mission.statusHistories[0]?.status === MissionState.PENDING ||
        mission.statusHistories[0]?.status === MissionState.IN_PROGRESS
    );

    return res.status(200).json({ data: pending, message: pending.length === 0
          ? "No pending missions found.": undefined, });

  } catch (error) {
    console.error("Error fetching pending missions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const completeMission = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const missionId = Number.parseInt(req.params.id);

  const mission = await missionService.getMissionById(missionId, userId);

  if (!mission) {
    return res.status(404).json({ message: "Mission not found." });
  }

  const alreadyCompleted = mission.statusHistories.some(
    s => s.status === MissionState.COMPLETED
  );

  if (alreadyCompleted) {
    return res.status(400).json({ message: "Mission already completed." });
  }

  // Calcular recompensas
  const { xp, coin } = calculateRewards(mission, mission.statusHistories);

  const rewardXp = {
    missionId: mission.id,
    rewardType: RewardType.XP,
    value: xp,
  };

  const rewardCoin = {
    missionId: mission.id,
    rewardType: RewardType.COIN,
    value: coin,
  };

  const createdXpReward = await createReward(rewardXp);
  const createdCoinReward = await createReward(rewardCoin);

  if (!createdXpReward || !createdCoinReward) {
    return res.status(500).json({ message: "Error creating rewards." });
  }

  const completed = await missionService.completeMission(mission.id);

  if (!completed) {
    return res.status(500).json({ message: "Error completing mission." });
  }

  return res.status(200).json({
    xp: xp,
    coins: coin,
  });
};
