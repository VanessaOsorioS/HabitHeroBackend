import { AuthService } from "../../src/modules/auth/auth.service";
import { prisma } from "../../src/config/prisma";
import argon2 from "argon2";
import crypto from "node:crypto";

jest.mock("../../src/config/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    authToken: {
      create: jest.fn(),
    },
  },
}));

jest.mock("argon2", () => ({
  verify: jest.fn(),
}));

// Para que podamos mockear randomUUID()
jest.mock("node:crypto", () => ({
  randomUUID: jest.fn(),
}));

describe("AuthService", () => {
  const authService = new AuthService();

  // ----------------------------
  // validateUser
  // ----------------------------
  describe("validateUser", () => {
    it("should return null if user does not exist", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser("test@test.com", "123456");

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it("should return null if password is incorrect", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        passwordHash: "hash123",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false); // password incorrecta

      const result = await authService.validateUser("test@test.com", "wrongpass");

      expect(argon2.verify).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it("should return user if password is correct", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        passwordHash: "hash123",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true); // password correcta

      const result = await authService.validateUser("test@test.com", "password");

      expect(result).toEqual(mockUser);
    });
  });

  // ----------------------------
  // createToken
  // ----------------------------
  describe("createToken", () => {
    it("should create a token for a user", async () => {
      const userId = 1;

      const mockCreatedToken = {
        id: 10,
        userId,
        tokenString: "uuid-123",
        expiresAt: new Date(),
      };

      (crypto.randomUUID as jest.Mock).mockReturnValue("uuid-123");
      (prisma.authToken.create as jest.Mock).mockResolvedValue(mockCreatedToken);

      const result = await authService.createToken(userId);

      expect(crypto.randomUUID).toHaveBeenCalledTimes(1);

      expect(prisma.authToken.create).toHaveBeenCalledWith({
        data: {
          userId,
          tokenString: "uuid-123",
          expiresAt: expect.any(Date),
        },
      });

      expect(result).toEqual(mockCreatedToken);
    });

    it("should throw if prisma.create fails", async () => {
      (crypto.randomUUID as jest.Mock).mockReturnValue("uuid-123");
      (prisma.authToken.create as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await expect(authService.createToken(1)).rejects.toThrow("DB error");
    });
  });
});
