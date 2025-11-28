import argon2 from "argon2";
import crypto from "node:crypto";
import { prisma } from "../../config/prisma";

export class AuthService {
  async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const isValid = await argon2.verify(user.passwordHash, password);
    if (!isValid) return null;

    return user;
  }

  async createToken(userId: number) {
    const tokenString = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    const token = await prisma.authToken.create({
      data: {
        userId,
        tokenString,
        expiresAt,
      }
    });

    return token;
  }
}
