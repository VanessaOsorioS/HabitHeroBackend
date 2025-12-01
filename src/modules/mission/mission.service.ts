import { prisma } from "../../config/prisma";
import { MissionState } from "../../../generated/prisma";

export const createMission = async (data: any) => {
  return await prisma.mission.create({ data });
};

export const createMissionStatusHistory = async (data: any) => {
  return await prisma.missionStatusHistory.create({ data });
}

export const getAllMissions = async (userId: number) => {
  return await prisma.mission.findMany({
    where: { userId },
    include: {
      statusHistories: {
        orderBy: { date: "desc" }
      },
    },
    orderBy: { priority: 'asc' }
  });
}

export const getMissionById = async (id: number, userId: number) => {
  return await prisma.mission.findUnique({
    where: { id: id },
    include: { statusHistories: { orderBy: { date: "desc" } } },
  })
}

export const completeMission = async (id: number) => {
  return await prisma.mission.update({
    where: { id: id },
    data: {
      statusHistories: {
        create: {
          status: MissionState.COMPLETED,
          date: new Date()
        }
      }
    }
  });
}
