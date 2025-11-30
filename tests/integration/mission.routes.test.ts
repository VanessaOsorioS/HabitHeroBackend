import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { resetDB } from "../test-helpers";

describe("Mission Routes (Integration)", () => {

  beforeAll(async () => {
    await resetDB();
  });

  afterAll(async () => {
    await resetDB();
    // NO desconectamos para no afectar otros tests
  });

  // Helper local simple
  const createLocalUser = async () => {
    return await prisma.user.create({
      data: {
        name: "Mission Tester",
        // Email aleatorio para evitar colisiones P2002
        email: `mission_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`,
        passwordHash: "fakehash",
      },
    });
  };
  
  describe("GET /missions", () => {
    it("should return all missions with status 200", async () => {
      const response = await request(app).get("/api/missions");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("POST /missions", () => {
    it("should create a new mission and return 201", async () => {
      const localUser = await createLocalUser(); // Creamos usuario fresco AQUÍ

      const newMission = {
        title: "New test mission",
        description: "Test description",
        type: "STUDY",
        priority: 2,
        difficulty: 3,
        daily: true,
        userId: localUser.id, // Usamos el ID de este usuario fresco
      };

      const response = await request(app)
        .post("/api/missions")
        .send(newMission)
        .set("Accept", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toMatchObject({
        title: newMission.title,
        userId: localUser.id,
      });
    });

    it("should return 500 if mission creation fails", async () => {
      // Este test no necesita usuario porque falla antes de validar datos
      const invalidMission = { title: null };
      const response = await request(app)
        .post("/api/missions")
        .send(invalidMission);

      expect(response.status).toBe(500);
    });
  });
});