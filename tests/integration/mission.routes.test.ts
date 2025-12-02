import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";

describe("Mission Routes (Integration)", () => {

  const createAuthUser = async () => {
    const user = await prisma.user.create({
      data: {
        name: "Mission User",
        email: `mission_${Date.now()}_${Math.floor(Math.random() * 100000)}@test.com`,
        passwordHash: "fakehash",
      },
    });

    const token = `token_${Date.now()}_${Math.random()}`;
    await prisma.authToken.create({
      data: {
        tokenString: token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    return { user, token };
  };
  
  describe("GET /api/mission", () => {
    it("should return all missions with status 200", async () => {
      const { token } = await createAuthUser();

      const response = await request(app)
        .get("/api/mission") // <--- Singular
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("POST /api/mission", () => {
    it("should create a new mission and return 201", async () => {
      const { user, token } = await createAuthUser();

      const newMission = {
        title: "New test mission",
        description: "Test description",
        type: "STUDY",
        priority: 2,
        difficulty: 3,
        daily: true,
      };

      const response = await request(app)
        .post("/api/mission") 
        .set("Authorization", `Bearer ${token}`)
        .send(newMission)
        .set("Accept", "application/json");

      expect(response.status).toBe(201);
      expect(response.body.data.userId).toBe(user.id);
    });
  });
});