import { Request, Response } from 'express';
import { getAllMissions as getMissions } from './mission.service';
import { MissionStatus } from '../../../generated/prisma';

export const getAllMissions = async (req: Request, res: Response) => {
    try {
        const missions = await getMissions();
        const result = missions.filter(mission => mission.status ===  MissionStatus.PENDING);

        if (result.length === 0) {
            return res.status(404).json({ message: "No pending missions found." });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};