import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { RewardType } from "../../generated/prisma";
import { resetDB } from "../test-helpers";

describe("Reward Routes (Integration)", () => {
  let mission: any;
  const uniqueEmail = `reward_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;

  const setupData = async () => {
    // Verificar si la misión existe, si no, crear TODO de nuevo
    const existingMission = await prisma.mission.findUnique({ 
        where: { id: mission?.id || -1 },
        include: { rewards: true } 
    });

    if (existingMission && existingMission.rewards.length > 0) {
        mission = existingMission;
        return;
    }

    // Crear desde cero si no existe
    mission = await prisma.mission.create({
      data: {
        title: "Test Mission", priority: 1, difficulty: 1, daily: false, type: "STUDY",
        user: {
          create: { name: "User Test", email: uniqueEmail, passwordHash: "fakehash" }
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

  beforeAll(async () => {
    await resetDB();
    await setupData();
  });

  afterAll(async () => {
    await resetDB();
    await prisma.$disconnect();
  });

  describe("GET /api/rewards", () => {
    it("should return all rewards with mission", async () => {
      await setupData(); // Asegurar datos
      const response = await request(app).get("/api/rewards");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/rewards/coin-xp", () => {
    it("should return the sum of coins and XP", async () => {
      await setupData(); // Asegurar datos
      const response = await request(app).get("/api/rewards/coin-xp");
      expect(response.status).toBe(200);
      expect(response.body.coins).toBe(5);
      expect(response.body.xp).toBe(10);
    });
  });
});