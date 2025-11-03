import request from "supertest";
import app from "../../src/app.ts";
import { prisma } from "../../src/config/prisma.ts";

describe("GET /api/rewards", () => {
  let testMission; // guardaremos la misión creada

  beforeAll(async () => {
    // 1️⃣ Limpia posibles datos anteriores
    await prisma.reward.deleteMany();
    await prisma.mission.deleteMany();

    // 2️⃣ Crea una misión de prueba para asociar recompensas
    testMission = await prisma.mission.create({
      data: {
        title: "Dummy Mission",
        description: "Used for reward tests",
        type: "STUDY", // asegúrate que exista este enum en tu schema.prisma
        priority: 1,
        difficulty: 1,
        daily: false,
      },
    });

    // 3️⃣ Crea recompensas asociadas a esa misión
    await prisma.reward.createMany({
      data: [
        { rewardType: "COIN", value: 10, description: "Coin test", missionId: testMission.id },
        { rewardType: "XP", value: 50, description: "XP test", missionId: testMission.id },
      ],
    });
  });

  afterAll(async () => {
    // 4️⃣ Limpieza final para no dejar residuos
    await prisma.reward.deleteMany();
    await prisma.mission.deleteMany();
    await prisma.$disconnect();
  });

  it("debería devolver todas las recompensas", async () => {
    const response = await request(app).get("/api/rewards");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it("debería devolver suma de monedas y XP", async () => {
    const response = await request(app).get("/api/rewards/coin-xp");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("coins");
    expect(response.body).toHaveProperty("xp");
  });
});