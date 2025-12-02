import request from "supertest";
import argon2 from "argon2";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";

describe("Auth Routes (Integration)", () => {
  const testPassword = "supersecurepassword";

  beforeAll(() => {
    process.env.JWT_SECRET = "secret_test_key";
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      const email = `login_${Date.now()}_${Math.floor(Math.random()*10000)}@test.com`;
      const hashedPassword = await argon2.hash(testPassword);

      await prisma.user.create({
        data: { name: "Login User", email, passwordHash: hashedPassword },
      });
      await new Promise(r => setTimeout(r, 200));

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email, password: testPassword });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return 401 for wrong password", async () => {
      const email = `wrong_${Date.now()}@test.com`;
      const hashedPassword = await argon2.hash("correct-pass");

      await prisma.user.create({
        data: { name: "Wrong Pass User", email, passwordHash: hashedPassword },
      });
      
      await new Promise(r => setTimeout(r, 100));

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email, password: "wrong-pass" });

      expect(response.status).toBe(401);
    });
  });
});