import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { resetDB } from "../test-helpers";

describe("Mission Routes (Integration)", () => {
  let testUser: any;
  const uniqueEmail = `mission_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;

  // Función para garantizar usuario
  const ensureUserExists = async () => {
    let user = await prisma.user.findUnique({ where: { id: testUser?.id || -1 } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: "Mission Tester", email: uniqueEmail, passwordHash: "fakehash" },
      });
      testUser = user;
    }
    return user;
  };

  beforeAll(async () => {
    await resetDB();
    // Inicializamos testUser
    testUser = await prisma.user.create({
      data: {
        email: uniqueEmail,
        passwordHash: "fakehash", 
        name: "Mission Tester",
      },
    });
  });

  afterAll(async () => {
    await resetDB();
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
      await ensureUserExists(); // <--- ESTO ES CRUCIAL

      const newMission = {
        title: "New test mission",
        description: "Test mission description",
        type: "STUDY",
        priority: 2,
        difficulty: 3,
        daily: true,
        userId: testUser.id, 
      };

      const response = await request(app)
        .post("/api/missions")
        .send(newMission)
        .set("Accept", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toMatchObject({
        title: newMission.title,
        userId: testUser.id,
      });
    });

    it("should return 500 if mission creation fails", async () => {
      const invalidMission = { title: null };
      const response = await request(app)
        .post("/api/missions")
        .send(invalidMission);

      expect(response.status).toBe(500);
    });
  });
});