import request from "supertest";
import argon2 from "argon2";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { resetDB } from "../test-helpers";

describe("Auth Routes (Integration)", () => {
  const testPassword = "supersecurepassword";

  beforeAll(async () => {
    // IMPORTANTE: Definir JWT_SECRET aquí
    process.env.JWT_SECRET = "secret_test_key";
    await resetDB();
  });

  afterAll(async () => {
    await resetDB();
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      const loginEmail = `login_${Date.now()}@test.com`;
      const hashedPassword = await argon2.hash(testPassword);

      await prisma.user.create({
        data: { name: "Auth User", email: loginEmail, passwordHash: hashedPassword },
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: loginEmail,
          password: testPassword,
        });

      // Si falla, imprime el error
      if (response.status !== 200) console.error("Login Error:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
    
    it("should return 400 if email or password is missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "incomplete@test.com" });
      expect(response.status).toBe(400);
    });

    it("should return 401 if user does not exist", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "ghost@test.com", password: "123" });
      expect(response.status).toBe(401);
    });

    it("should return 401 for wrong password", async () => {
      // Creamos usuario
      const loginEmail = `wrongpass_${Date.now()}@test.com`;
      const hashedPassword = await argon2.hash(testPassword);
      await prisma.user.create({
        data: { name: "Auth User", email: loginEmail, passwordHash: hashedPassword },
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: loginEmail, password: "badpassword" });
        
      expect(response.status).toBe(401);
    });
  });
});
    