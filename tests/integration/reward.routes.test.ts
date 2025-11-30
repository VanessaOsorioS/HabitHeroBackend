import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { RewardType } from "../../generated/prisma";
import { resetDB } from "../test-helpers";

describe("Reward Routes (Integration)", () => {

  beforeAll(async () => {
    await resetDB();
  });

  afterAll(async () => {
    await resetDB();
  });

  const createScenario = async () => {
    const email = `reward_${Date.now()}_${Math.floor(Math.random() * 100000)}@test.com`;
    return await prisma.mission.create({
      data: {
        title: "Test Mission", priority: 1, difficulty: 1, daily: false, type: "STUDY",
        user: {
          create: { name: "User Test", email: email, passwordHash: "fakehash" }
        },
        rewards: {
          create: [
            { rewardType: RewardType.XP, value: 10 },
            { rewardType: RewardType.COIN, value: 5 }
          ]
        }
      }
    });
  };

  describe("GET /api/rewards", () => {
    it("should return all rewards with mission", async () => {
      // Limpiamos antes para asegurar estado limpio
      await resetDB();
      await createScenario(); 

      const response = await request(app).get("/api/rewards");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/rewards/coin-xp", () => {
    it("should return the sum of coins and XP", async () => {
      // Limpiamos y recreamos
      await resetDB(); 
      await createScenario();

      const response = await request(app).get("/api/rewards/coin-xp");
      expect(response.status).toBe(200);
      expect(response.body.coins).toBe(5);
      expect(response.body.xp).toBe(10);
    });
  });
});