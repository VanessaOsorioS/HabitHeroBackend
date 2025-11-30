import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { resetDB } from "../test-helpers";

describe("Avatar Routes (Integration)", () => {
  
  beforeAll(async () => {
    await resetDB();
  });

  afterAll(async () => {
    await resetDB();
    await prisma.$disconnect();
  });

  // Helper para crear usuario local en cada test (ESTA ES LA CLAVE DEL ÉXITO)
  const createLocalUser = async () => {
    return await prisma.user.create({
      data: {
        name: "Avatar Tester",
        email: `avatar_local_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`,
        passwordHash: "fakehash",
      },
    });
  };

  describe("POST /api/avatar/init", () => {
    it("should create an avatar and return 201", async () => {
      const localUser = await createLocalUser(); 

      const response = await request(app)
        .post("/api/avatar/init")
        .send({ userId: localUser.id });

      expect(response.status).toBe(201);
      expect(response.body.data.userId).toBe(localUser.id);
    });
  });

  describe("GET /api/avatar", () => {
    it("should return the avatar", async () => {
      const localUser = await createLocalUser();
      await prisma.avatar.create({ data: { userId: localUser.id } });

      const response = await request(app)
        .get("/api/avatar")
        .send({ userId: localUser.id });

      expect(response.status).toBe(200);
      expect(response.body.data.userId).toBe(localUser.id);
    });

    it("should return 404 if no avatar exists", async () => {
      const response = await request(app)
        .get("/api/avatar")
        .send({ userId: 2147483647 });

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/avatar", () => {
    it("should update avatar successfully", async () => {
      const localUser = await createLocalUser();
      await prisma.avatar.create({ data: { userId: localUser.id } });

      const response = await request(app)
        .put("/api/avatar")
        .send({
          userId: localUser.id,
          hatId: 4,
          shirtId: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.hatId).toBe(4);
    });
  });
});