import { prisma } from "../../config/prisma";

export const createMission = async (data: any) => {
  return await prisma.mission.create({ data });
};