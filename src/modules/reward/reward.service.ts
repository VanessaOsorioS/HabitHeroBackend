import { prisma } from "../../config/prisma";

export const getAllRewards = async (userId: number) => {
  return await prisma.reward.findMany({
    where: {
      mission: {
        userId: userId,
      },
    },
  });
}

export const getRewardsWithMission = async (userId: number) => {
  return await prisma.reward.findMany({
    where: {
      mission: {
        userId: userId,
      },
    },
    include: {
      mission: true,
    },
  });
};

export const createReward = async (data: any) => {
  return await prisma.reward.create({ data });
}