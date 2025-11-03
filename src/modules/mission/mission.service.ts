import { prisma } from "../../config/prisma.js";

export const createMission = async (data: any) => {
  return await prisma.mission.create({ data });
};

export const getAllMissions = async () => {
  return await prisma.mission.findMany();
}