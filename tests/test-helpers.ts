import { prisma } from "../src/config/prisma";

jest.unmock("../src/config/prisma");

export const resetDB = async () => {
  try {
    await prisma.reward.deleteMany();
    await prisma.missionStatusHistory.deleteMany();
    await prisma.mission.deleteMany();
    await prisma.authToken.deleteMany();
    await prisma.avatar.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error("Error resetting database:", error);
  }
};