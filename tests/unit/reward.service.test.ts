import * as rewardService from "../../src/modules/reward/reward.service";
import { prisma } from "../../src/config/prisma";

jest.mock("../../src/config/prisma", () => ({
  prisma: {
    reward: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Reward Service", () => {
  describe("getAllRewards", () => {
    it("should return a list of rewards", async () => {
      const mockRewards = [
        { id: 1, rewardType: "XP", value: 10 },
        { id: 2, rewardType: "COIN", value: 5 }
      ];

      (prisma.reward.findMany as jest.Mock).mockResolvedValue(mockRewards);

      const result = await rewardService.getAllRewards();

      expect(prisma.reward.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRewards);
    });
  });

  describe("getRewardsWithMission", () => {
    it("should return rewards with mission relations", async () => {
      const mockRewards = [
        {
          id: 1,
          value: 10,
          mission: { id: 99, title: "Mission Test" }
        }
      ];

      (prisma.reward.findMany as jest.Mock).mockResolvedValue(mockRewards);

      const result = await rewardService.getRewardsWithMission();

      expect(prisma.reward.findMany).toHaveBeenCalledWith({
        include: { mission: true }
      });

      expect(result).toEqual(mockRewards);
    });
  });

  describe("createReward", () => {
    it("should create a new reward", async () => {
      const newReward = { rewardType: "XP", value: 20, missionId: 1 };
      const mockCreated = { id: 1, ...newReward };

      (prisma.reward.create as jest.Mock).mockResolvedValue(mockCreated);

      const result = await rewardService.createReward(newReward);

      expect(prisma.reward.create).toHaveBeenCalledWith({
        data: newReward
      });

      expect(result).toEqual(mockCreated);
    });
  });
});
