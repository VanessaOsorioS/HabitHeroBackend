import { Request, Response } from 'express';
import { getAllRewards as getRewards, getRewardsWithMission } from './reward.service';
import { RewardType } from '../../../generated/prisma';

export const getAllRewards = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const reward = await getRewardsWithMission(userId);
        if (reward.length === 0) {
            return res.status(404).json({ message: "No rewards found." });
        }
        return res.status(200).json(reward);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCoinAndXpRewards = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const rewards = await getRewards(userId);

        const coinReward = rewards
            .filter(r => r.rewardType === RewardType.COIN)
            .reduce((sum, r) => sum + r.value, 0);

        const xpReward = rewards
            .filter(r => r.rewardType === RewardType.XP)
            .reduce((sum, r) => sum + r.value, 0);

        if (!coinReward && !xpReward) {
            return res.status(404).json({ message: "No XP or coin rewards found." });
        }

        const result = {
            coins: coinReward ?? 0,
            xp: xpReward ?? 0,
        };

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};