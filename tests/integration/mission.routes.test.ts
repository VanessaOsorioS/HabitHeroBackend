import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";

describe("Mission Routes (Integration)", () => {

  let testUser: any;

  beforeAll(async () => {
    // Crear un usuario válido para asociar las misiones
    testUser = await prisma.user.create({
      data: {
        email: "testuser@example.com",
        passwordHash: "fakehash",  // si usas argon2 en producción, en test da igual
        name: "Test User",
      },
    });
  });

  afterAll(async () => {
    await prisma.mission.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  
  describe("GET /missions", () => {
    it("should return all missions with status 200", async () => {
      const response = await request(app).get("/api/missions");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });


  describe("POST /missions", () => {
    it("should create a new mission and return 201", async () => {

      const newMission = {
        title: "New test mission",
        description: "Test mission description",
        type: "STUDY",
        priority: 2,
        difficulty: 3,
        daily: true,
        userId: testUser.id,   // 🔥 NECESARIO
      };

      const response = await request(app)
        .post("/api/missions")
        .send(newMission)
        .set("Accept", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");

      // Comprobar datos esenciales
      expect(response.body.data).toMatchObject({
        title: newMission.title,
        description: newMission.description,
        type: newMission.type,
        userId: testUser.id,
      });
    });

    it("should return 500 if mission creation fails", async () => {
      const invalidMission = { title: null };

      const response = await request(app)
        .post("/api/missions")
        .send(invalidMission)
        .set("Accept", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});
