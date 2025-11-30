import request from "supertest";
import argon2 from "argon2";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";
import { resetDB } from "../test-helpers";

describe("Auth Routes (Integration)", () => {
  let testUser: any;
  const testPassword = "supersecurepassword";
  let hashedPassword: string;
  const loginEmail = `login_${Date.now()}_${Math.floor(Math.random()*10000)}@test.com`;

  // === AGREGAR ESTE BLOQUE ===
  beforeAll(async () => {
    // Aseguramos que existe el secreto para que jwt.sign no falle con error 500
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_key_12345";
    
    await resetDB();
    hashedPassword = await argon2.hash(testPassword);

    testUser = await prisma.user.create({
      data: {
        name: "Auth User",
        email: loginEmail,
        passwordHash: hashedPassword,
      },
    });
  });
  // ===========================

  afterAll(async () => {
    await resetDB();
    await prisma.$disconnect();
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      // Re-verificar existencia
      const user = await prisma.user.findUnique({ where: { email: loginEmail } });
      if (!user) {
         await prisma.user.create({
          data: { name: "Auth User", email: loginEmail, passwordHash: hashedPassword },
        });
      }

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: loginEmail,
          password: testPassword,
        });

      // Si falla, imprimimos el error para depurar
      if (response.status === 500) {
        console.error("Login 500 Error Body:", response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe(loginEmail);
    });

    it("should return 400 if email or password is missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: loginEmail });
      expect(response.status).toBe(400);
    });

    it("should return 401 if user does not exist", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "nouser@test.com", password: "whatever" });
      expect(response.status).toBe(401);
    });

    it("should return 401 for wrong password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: loginEmail, password: "wrongpassword" });
      expect(response.status).toBe(401);
    });
  });
});