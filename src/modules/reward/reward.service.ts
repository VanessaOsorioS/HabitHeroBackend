import { prisma } from "../../config/prisma";

export const getAllRewards = async () => {
  return await prisma.reward.findMany();
}

export const getRewardsWithMission = async () => {
  return await prisma.reward.findMany({
    include: { mission: true }
  });
}