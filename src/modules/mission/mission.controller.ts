import { Request, Response } from 'express';
import { getAllMissions as getMissions } from './mission.service';

export const getAllMissions = async (req: Request, res: Response) => {
    try {
        const missions = await getMissions();
        return res.status(200).json(missions);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};