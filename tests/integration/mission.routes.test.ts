import request from "supertest";
import app from "../../src/app.ts";

describe("Mission Routes", () => {
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
        type: "STUDY", // must match your enum
        priority: 2,
        difficulty: 3,
        daily: true,
      };

      const response = await request(app)
        .post("/api/missions")
        .send(newMission)
        .set("Accept", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toMatchObject({
        title: newMission.title,
        description: newMission.description,
        type: newMission.type,
      });
    });

    it("should return 500 if mission creation fails", async () => {
      const invalidMission = { title: null }; // invalid for Prisma

      const response = await request(app)
        .post("/api/missions")
        .send(invalidMission)
        .set("Accept", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});
