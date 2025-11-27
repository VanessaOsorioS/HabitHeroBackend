<<<<<<< HEAD
import { Request, Response } from "express";
import * as missionService from "./mission.service";

export const createMission = async (req: Request, res: Response) => {
  try {
    const mission = await missionService.createMission(req.body);
    res.status(201).json({ message: "Mission created successfully", data: mission });
  } catch (error) {
    console.error("Error creating mission:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllMissions = async (req: Request, res: Response) => {
  try {
    const missions = await missionService.getAllMissions();
    res.status(200).json({ data: missions });
  } catch (error) {
    console.error("Error fetching missions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
=======
import { Request, Response } from 'express';
import { getMissionById, getAllMissions as getMissions, completeMission as setMissionComplete } from './mission.service';
import { MissionState, RewardType } from '../../../generated/prisma';
import { calculateRewards } from './mission.helper';
import { createReward } from '../reward/reward.service';

export const getAllMissions = async (req: Request, res: Response) => {
    try {
        const missions = await getMissions();
        const result = missions.filter(mission => mission.statusHistories[0]?.status === MissionState.PENDING
            || mission.statusHistories[0]?.status === MissionState.IN_PROGRESS
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "No pending missions found." });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** Completa una misión y genera recompensas */
export const completeMission = async (req: Request, res: Response) => {

    const mission = await getMissionById(parseInt(req.params.id));

    if (!mission) {
        return res.status(404).json({ message: "No missions found." });
    };

    const isMissionCompleted = mission.statusHistories.find(x => x.status === MissionState.COMPLETED);

    if (isMissionCompleted) {
        return res.status(400).json({ message: "Mission already completed." });
    }

    // Generar recompensas
    const { xp, coin } = calculateRewards(mission, mission.statusHistories);

    const rewardXp = {
        missionId: mission.id,
        rewardType: RewardType.XP,
        value: xp
    }
    const rewardCoin = {
        missionId: mission.id,
        rewardType: RewardType.COIN,
        value: coin
    }

    const createdXpReward = await createReward(rewardXp);

    const createdCoinReward = await createReward(rewardCoin);

    if (!createdXpReward || !createdCoinReward) {
        return res.status(500).json({ message: "Error creating rewards." });
    }

    const changeToCompleted = await setMissionComplete(mission.id);

    if (!changeToCompleted) {
        return res.status(500).json({ message: "Error completing mission." });
    }

    const result = {
        coins: coin,
        xp: xp,
    };

    return res.status(200).json(result);
};
>>>>>>> origin/calculateReward
