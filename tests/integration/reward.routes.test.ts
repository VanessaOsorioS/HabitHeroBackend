import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { RewardType } from "../../generated/prisma";

describe("Reward Routes (Integration)", () => {

  const setupScenario = async () => {
    const email = `reward_${Date.now()}_${Math.floor(Math.random() * 100000)}@test.com`;
    const token = `token_reward_${Date.now()}_${Math.random()}`;

    await prisma.mission.create({
      data: {
        title: "Reward Mission", type: "STUDY", priority: 1, difficulty: 1, daily: false,
        user: {
          create: {
            name: "Reward User",
            email: email,
            passwordHash: "fakehash",
            tokens: {
              create: {
                tokenString: token,
                expiresAt: new Date(Date.now() + 3600000)
              }
            }
          }
        },
        rewards: {
          create: [
            { rewardType: RewardType.XP, value: 50 },
            { rewardType: RewardType.COIN, value: 20 }
          ]
        }
      }
    });

    return { token };
  };

  describe("GET /api/reward", () => {
    it("should return rewards", async () => {
      const { token } = await setupScenario();

      const response = await request(app)
        .get("/api/reward") 
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/reward/coin-xp", () => {
    it("should return the sum of coins and XP", async () => {
      const { token } = await setupScenario();

      const response = await request(app)
        .get("/api/reward/coin-xp") 
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.coins).toBe(20);
      expect(response.body.xp).toBe(50);
    });
  });
});