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
