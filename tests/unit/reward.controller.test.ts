import { Request, Response } from "express";
import { getAllRewards, getCoinAndXpRewards } from "../../src/modules/reward/reward.controller";
import * as rewardService from "../../src/modules/reward/reward.service";
import { RewardType } from "../../generated/prisma";

jest.mock("../../src/modules/reward/reward.service");

const mockReq = (body: any = {}, query: any = {}) =>
  ({ body, query } as Request);

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Reward Controller", () => {

  // ----------------------------------------------------
  // getAllRewards
  // ----------------------------------------------------
  describe("getAllRewards", () => {
    it("should return rewards with status 200", async () => {
      (rewardService.getRewardsWithMission as jest.Mock).mockResolvedValue([
        { id: 1, value: 10 }
      ]);

      const req = mockReq();
      const res = mockRes();

      await getAllRewards(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it("should return 404 if no rewards found", async () => {
      (rewardService.getRewardsWithMission as jest.Mock).mockResolvedValue([]);

      const req = mockReq();
      const res = mockRes();

      await getAllRewards(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ----------------------------------------------------
  // getCoinAndXpRewards
  // ----------------------------------------------------
  describe("getCoinAndXpRewards", () => {
    it("should return XP and COIN totals", async () => {
      (rewardService.getAllRewards as jest.Mock).mockResolvedValue([
        { rewardType: RewardType.XP, value: 10 },
        { rewardType: RewardType.COIN, value: 5 }
      ]);

      const req = mockReq();
      const res = mockRes();

      await getCoinAndXpRewards(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        coins: 5,
        xp: 10
      });
    });

    it("should return 404 if there are no coin/xp rewards", async () => {
      (rewardService.getAllRewards as jest.Mock).mockResolvedValue([]);

      const req = mockReq();
      const res = mockRes();

      await getCoinAndXpRewards(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

});
