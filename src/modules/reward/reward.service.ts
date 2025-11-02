import { prisma } from "../../config/prisma";

export const getAllRewards = async () => {
  return await prisma.reward.findMany();
}