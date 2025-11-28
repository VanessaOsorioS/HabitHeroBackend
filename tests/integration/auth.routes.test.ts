import request from "supertest";
import argon2 from "argon2";
import app from "../../src/app";
import { prisma } from "../../src/config/prisma";

describe("Auth Routes (Integration)", () => {
  let testUser: any;
  const testPassword = "supersecurepassword";
  let hashedPassword: string;

  beforeAll(async () => {
    hashedPassword = await argon2.hash(testPassword);

    testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "login@test.com",
        passwordHash: hashedPassword,
      },
    });
  });

  afterAll(async () => {
    await prisma.authToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });


  describe("POST /auth/login", () => {
    it("should login successfully and return token + user info", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@test.com",
          password: testPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("expiresAt");
      expect(response.body.user.email).toBe("login@test.com");

      // Token debe existir en BD
      const dbToken = await prisma.authToken.findFirst({
        where: { tokenString: response.body.token }
      });

      expect(dbToken).not.toBeNull();
      expect(dbToken!.userId).toBe(testUser.id);
    });

    it("should return 400 if email or password is missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "login@test.com" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email and password are required");
    });

    it("should return 401 if user does not exist", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nouser@test.com",
          password: "whatever",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return 401 for wrong password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@test.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});
